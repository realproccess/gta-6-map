import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, Circle, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { LatLngExpression } from 'leaflet';
import { Pin, GameState } from '../types';
import { CoordinateDisplay } from './CoordinateDisplay';
import { AdvancedMapTooltip } from './AdvancedMapTooltip';
// @ts-ignore
import mapImg from './map.jpg';

// Fix icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom neon icon
const createNeonIcon = (color: string) => {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div class="w-4 h-4 rounded-full" style="background-color: ${color}; box-shadow: 0 0 10px ${color}, 0 0 20px ${color}; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const defaultIcon = createNeonIcon('#9B59B6'); // Purple
const guessIcon = createNeonIcon('#FF6B9D'); // Pink
const targetIcon = createNeonIcon('#00FF00'); // Green

// Custom Cluster Icon
const createCustomClusterIcon = (cluster: any) => {
  return L.divIcon({
    html: `<div class="w-10 h-10 rounded-full bg-[#090a0a]/90 backdrop-blur-sm border-2 border-brand-purple flex items-center justify-center shadow-[0_0_15px_rgba(155,89,182,0.5)] text-white font-bold font-mono text-sm">${cluster.getChildCount()}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

function MapFitter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

interface MapEventsHandlerProps {
  gameState: GameState;
  activeTool?: string;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
  handleMouseMove: (e: L.LeafletMouseEvent) => void;
  handleMouseDown?: (e: L.LeafletMouseEvent) => void;
  handleMouseUp?: (e: L.LeafletMouseEvent) => void;
  setZoomLevel?: (zoom: number) => void;
}

function MapEventsHandler({ gameState, activeTool, handleMapClick, handleMouseMove, handleMouseDown, handleMouseUp, setZoomLevel }: MapEventsHandlerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (setZoomLevel) {
      setZoomLevel(map.getZoom());
    }
  }, [map, setZoomLevel]);
  
  useEffect(() => {
    if (activeTool && activeTool !== 'select') {
      map.dragging.disable();       // Stops map sliding
      map.touchZoom.disable();      // Stops accidental zooming on mobile
      map.doubleClickZoom.disable();
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.getContainer().style.cursor = 'grab';
    }
  }, [activeTool, map]);

  useMapEvents({
    click(e) {
      if (gameState.isPlaying && !gameState.userGuess) {
        handleMapClick(e);
        return;
      }
      if (activeTool && activeTool !== 'select') {
        handleMapClick(e);
      }
    },
    mousemove(e) {
      handleMouseMove(e);
    },
    mousedown(e) {
      if (handleMouseDown) handleMouseDown(e);
    },
    mouseup(e) {
      if (handleMouseUp) handleMouseUp(e);
    },
    zoomend() {
      if (setZoomLevel) setZoomLevel(map.getZoom());
    }
  });
  return null;
}

interface MapCanvasProps {
  pins: Pin[];
  activeFilters: string[];
  gameState: GameState;
  handleGuess: (lat: number, lng: number) => void;
  onCoordsChange: (coords: [number, number]) => void;
  activeTool?: string;
  setActiveTool?: (tool: string) => void;
  activeColor: string;
  drawingsRefresher?: number;
}

const crs = L.CRS.Simple;
const imageBounds: L.LatLngBoundsExpression = [[0, 0], [2048, 1488]];
const movementBounds: L.LatLngBoundsExpression = [[-2000, -2000], [4000, 3488]];
const mapWidth = 1488;
const mapHeight = 2048;
const gridSize = 500;
const gridLinesWidth = Math.floor(mapWidth / gridSize);
const gridLinesHeight = Math.floor(mapHeight / gridSize);

export function MapCanvas({ pins, activeFilters, gameState, handleGuess, onCoordsChange, activeTool, setActiveTool, activeColor, drawingsRefresher }: MapCanvasProps) {
  const filteredPins = pins.filter(pin => activeFilters.includes(pin.type));

  // Drawing state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [routes, setRoutes] = useState<{ points: L.LatLngExpression[], color: string, tool?: string }[]>([]);
  const [currentRoute, setCurrentRoute] = useState<L.LatLngExpression[]>([]);
  
  const [circles, setCircles] = useState<{ id: string, center: [number, number], radius: number, color: string, name?: string }[]>([]);
  const [currentCircleObj, setCurrentCircleObj] = useState<{ id: string, center: [number, number], radius: number, color: string, name?: string } | null>(null);
  
  const [isPendingCircleNaming, setIsPendingCircleNaming] = useState(false);
  const [useMiles, setUseMiles] = useState(false);

  useEffect(() => {
    // Check initial preference
    setUseMiles(localStorage.getItem('leonida_pref_units_miles') === 'true');

    // Listen for custom settings change events for same-window updates
    const handleSettingsChange = () => {
      setUseMiles(localStorage.getItem('leonida_pref_units_miles') === 'true');
    };

    window.addEventListener('leonida_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('leonida_settings_changed', handleSettingsChange);
  }, []);

  const onNameChange = (id: string, name: string) => {
    setCircles(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  // Clear drawings when drawingsRefresher changes
  useEffect(() => {
    setRoutes([]);
    setCurrentRoute([]);
    setCircles([]);
    setCurrentCircleObj(null);
  }, [drawingsRefresher]);

  // When active tool changes, commit any in-progress drawings
  useEffect(() => {
    if (activeTool !== 'draw' && activeTool !== 'measure' && currentRoute.length > 0) {
      setRoutes(prev => [...prev, { points: currentRoute, color: activeColor, tool: 'measure' }]);
      setCurrentRoute([]);
    }
    if (activeTool !== 'circle' && currentCircleObj) {
      setCircles(prev => [...prev, currentCircleObj]);
      setCurrentCircleObj(null);
    }
  }, [activeTool]);

  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e: L.LeafletMouseEvent) => {
    if (activeTool === 'draw') {
      setIsDrawing(true);
      setCurrentRoute([[e.latlng.lat, e.latlng.lng]]);
    }
  };

  const handleMouseUp = (e: L.LeafletMouseEvent) => {
    if (activeTool === 'draw' && isDrawing) {
      setIsDrawing(false);
      setCurrentRoute(prev => {
        setRoutes(r => [...r, { points: prev, color: activeColor, tool: 'draw' }]);
        return [];
      });
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    // If playing the mini-game
    if (gameState.isPlaying && !gameState.userGuess) {
      handleGuess(Math.round(e.latlng.lat), Math.round(e.latlng.lng));
      return;
    }

    if (activeTool === 'measure') {
      setCurrentRoute(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
    } else if (activeTool === 'circle') {
      if (isPendingCircleNaming) {
        console.warn("Complete or move away from your current circle configuration before dropping a new one.");
        return;
      }
      if (!currentCircleObj) {
        setCurrentCircleObj({ id: Date.now().toString(), center: [e.latlng.lat, e.latlng.lng], radius: 0, color: activeColor, name: 'EDIT NAME' });
      } else {
        setCircles(prev => [...prev, currentCircleObj]);
        setCurrentCircleObj(null);
        setIsPendingCircleNaming(true);
      }
    }
  };

  const calculateDistance = (coord1: L.LatLng, coord2: L.LatLng) => {
    // Fallback flat-grid calculation if using non-standard projection coordinates
    const dx = coord2.lng - coord1.lng;
    const dy = coord2.lat - coord1.lat;
    const totalMeters = Math.sqrt(dx * dx + dy * dy) * 1000; // Adjusted baseline multiplier
    
    // Calculate based on unit
    if (useMiles) {
        return (totalMeters / 1609.34); 
    } else {
        return (totalMeters / 1000); 
    }
  };

  const handleMouseMove = (e: L.LeafletMouseEvent) => {
    if (activeTool === 'draw' && isDrawing) {
      setCurrentRoute(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
    }
    if (activeTool === 'circle' && currentCircleObj) {
      const latLng = L.latLng(currentCircleObj.center[0], currentCircleObj.center[1]);
      // Simple distance calc for flat earth (CRS.Simple)
      const dist = Math.sqrt(
        Math.pow(e.latlng.lat - latLng.lat, 2) + 
        Math.pow(e.latlng.lng - latLng.lng, 2)
      );
      setCurrentCircleObj({ ...currentCircleObj, radius: dist });
    }
  };

  return (
    <div id="map" className="absolute inset-0 z-0 bg-transparent app-theme-dimmer map-container">
      <MapContainer 
        center={[1024, 744]}
        zoom={-1}
        crs={crs}
        bounds={imageBounds}
        maxBounds={movementBounds}
        maxZoom={4}
        minZoom={-3}
        zoomSnap={0.1}
        wheelPxPerZoomLevel={120}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <MapFitter bounds={imageBounds} />
        <CoordinateDisplay onCoordsChange={onCoordsChange} />
        
        <ImageOverlay
          url={mapImg}
          bounds={imageBounds}
          zIndex={10}
        />
        
        {Array.from({ length: gridLinesWidth + 1 }).map((_, i) => (
          <React.Fragment key={`grid-v-${i}`}>
            <Polyline positions={[[0, i * gridSize], [mapHeight, i * gridSize]]} color="white" opacity={0.08} weight={1} dashArray="5, 5" interactive={false} />
          </React.Fragment>
        ))}
        {Array.from({ length: gridLinesHeight + 1 }).map((_, i) => (
          <React.Fragment key={`grid-h-${i}`}>
            <Polyline positions={[[i * gridSize, 0], [i * gridSize, mapWidth]]} color="white" opacity={0.08} weight={1} dashArray="5, 5" interactive={false} />
          </React.Fragment>
        ))}
        
        <MapEventsHandler 
          gameState={gameState} 
          activeTool={activeTool} 
          handleMapClick={handleMapClick} 
          handleMouseMove={handleMouseMove}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          setZoomLevel={setZoomLevel}
        />

        {/* COMPLETED DRAWINGS */}
        {routes.map((route, i) => (
          <React.Fragment key={`route-${i}`}>
            <Polyline 
              positions={route.points} 
              color={route.color} 
              weight={4} 
              smoothFactor={window.innerWidth <= 1024 ? 2 : 1}
              className={activeTool === 'delete' ? 'eraser-target-hover' : ''}
              dashArray={route.tool === 'measure' ? '8, 8' : undefined} 
              eventHandlers={{
                click: (e) => {
                  if (activeTool === 'delete') {
                    L.DomEvent.stopPropagation(e as any);
                    setRoutes(prev => prev.filter((_, idx) => idx !== i));
                  }
                }
              }}
            />
            {route.tool === 'measure' && route.points.length > 1 && route.points.map((pt, ptIndex) => {
              let totalDistance = 0;
              for (let d = 1; d <= ptIndex; d++) {
                totalDistance += calculateDistance(L.latLng(route.points[d-1] as L.LatLngTuple), L.latLng(route.points[d] as L.LatLngTuple));
              }
              return (
                <Marker 
                  key={`route-${i}-pt-${ptIndex}`} 
                  position={pt as L.LatLngTuple}
                  icon={L.divIcon({
                    className: '',
                    html: `<div class="measure-marker-dot" style="border: 3px solid ${route.color}; background-color: #ffffff; color: #000000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${ptIndex + 1}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  {ptIndex > 0 && (
                    <Tooltip permanent direction="top" className="measure-distance-tooltip">
                      {totalDistance.toFixed(2)} {useMiles ? 'mi' : 'km'}
                    </Tooltip>
                  )}
                </Marker>
              );
            })}
          </React.Fragment>
        ))}
        {circles.map((C, i) => (
          <Circle 
            key={`circle-${i}`} 
            center={C.center} 
            radius={C.radius} 
            pathOptions={{ color: C.color, weight: 2, fillOpacity: 0.1, className: activeTool === 'delete' ? 'eraser-target-hover' : '' }}
            eventHandlers={{
              click: (e) => {
                if (activeTool === 'delete') {
                  L.DomEvent.stopPropagation(e as any);
                  setCircles(prev => prev.filter(c => c.id !== C.id));
                }
              }
            }}
          >
            <Tooltip permanent interactive direction="center" className="bg-transparent border-0 shadow-none p-0 flex items-center justify-center pointer-events-auto">
              <div 
                className="map-editable-bubble"
                style={{ borderColor: C.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTool === 'select' || !activeTool) {
                    // allows click focus when not using map tools
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTool === 'circle' && document.activeElement instanceof HTMLInputElement) {
                    document.activeElement.blur();
                    if (setActiveTool) setActiveTool('select');
                  }
                  setIsPendingCircleNaming(false);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <input 
                  type="text"
                  defaultValue={C.name || 'EDIT NAME'}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    onNameChange(C.id, val === '' ? 'EDIT NAME' : val);
                  }}
                  onFocus={(e) => {
                    if (e.target.value === 'EDIT NAME') {
                      e.target.value = '';
                    }
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  onKeyUp={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.stopPropagation()}
                />
              </div>
            </Tooltip>
          </Circle>
        ))}

        {/* IN-PROGRESS DRAWINGS */}
        {currentRoute.length > 0 && (
          <React.Fragment>
            <Polyline positions={currentRoute} color={activeColor} weight={4} smoothFactor={window.innerWidth <= 1024 ? 2 : 1} dashArray={activeTool === 'measure' ? "8, 8" : undefined} />
            {activeTool === 'measure' && currentRoute.length > 0 && currentRoute.map((pt, ptIndex) => {
              let totalDistance = 0;
              for (let d = 1; d <= ptIndex; d++) {
                totalDistance += calculateDistance(L.latLng(currentRoute[d-1] as L.LatLngTuple), L.latLng(currentRoute[d] as L.LatLngTuple));
              }
              return (
                <Marker 
                  key={`current-pt-${ptIndex}`} 
                  position={pt as L.LatLngTuple}
                  icon={L.divIcon({
                    className: '',
                    html: `<div class="measure-marker-dot" style="border: 3px solid ${activeColor}; background-color: #ffffff; color: #000000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${ptIndex + 1}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  {ptIndex > 0 && (
                    <Tooltip permanent direction="top" className="measure-distance-tooltip">
                      {totalDistance.toFixed(2)} {useMiles ? 'mi' : 'km'}
                    </Tooltip>
                  )}
                </Marker>
              );
            })}
          </React.Fragment>
        )}
        {currentCircleObj && (
          <Circle center={currentCircleObj.center} radius={currentCircleObj.radius} pathOptions={{ color: currentCircleObj.color, weight: 2, fillOpacity: 0.1 }} />
        )}

        {/* 
        <MarkerClusterGroup 
          chunkedLoading 
          maxClusterRadius={50}
          iconCreateFunction={createCustomClusterIcon}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
        >
          {filteredPins.map(pin => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={defaultIcon}>
              <Popup className="custom-popup p-0 border-0 bg-transparent shadow-none" closeButton={false}>
                <AdvancedMapTooltip 
                  title={pin.info} 
                  imageUrl={pin.imageUrl} 
                  coordinates={`${pin.lat.toFixed(0)}, ${pin.lng.toFixed(0)}`}
                  isConfirmed={pin.type !== 'leak'} 
                  source={pin.type === 'mission' ? 'Trailer' : 'Community'} 
                />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        */}

        {/* Game Mode Elements */}
        {gameState.isPlaying && gameState.userGuess && gameState.actualCoords && (
          <>
            <Marker position={gameState.userGuess as LatLngExpression} icon={guessIcon}>
              <Popup><div className="font-bold bg-black/90 text-white px-3 py-1 rounded border border-brand-pink">Your Guess</div></Popup>
            </Marker>
            <Marker position={gameState.actualCoords as LatLngExpression} icon={targetIcon}>
              <Popup><div className="font-bold bg-black/90 text-white px-3 py-1 rounded border border-green-500">Actual Location</div></Popup>
            </Marker>
            <Polyline 
              positions={[gameState.userGuess as LatLngExpression, gameState.actualCoords as LatLngExpression]} 
              color="#FF6B9D" 
              dashArray="8, 8" 
              weight={3} 
              className="game-distance-line"
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
