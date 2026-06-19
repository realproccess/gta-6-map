import React, { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

interface CoordinateDisplayProps {
  onCoordsChange?: (coords: [number, number]) => void;
}

export function CoordinateDisplay({ onCoordsChange }: CoordinateDisplayProps) {
  useMapEvents({
    mousemove(e) {
      const lat = Math.round(e.latlng.lat);
      const lng = Math.round(e.latlng.lng);
      if (onCoordsChange) {
        onCoordsChange([lat, lng]);
      }
    }
  });

  return null; // pure headless component for tracking logic
}
