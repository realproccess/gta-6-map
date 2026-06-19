import fs from 'fs';

const cssCode = fs.readFileSync('src/index.css', 'utf-8');
const lines = cssCode.split('\n');

const newLines = lines.slice(0, 349);

const additionalCss = `
/* ============================================
   GLOBAL BASE STYLES & RESPONSIVE FOUNDATION
   ============================================ */

:root {
  --header-height-mobile-v: 80px;
  --header-height-mobile-h: 65px;
  --header-height-tablet-v: 90px;
  --header-height-tablet-h: 70px;
  --toolbar-width-mobile: 70px;
  --toolbar-width-tablet: 80px;
  --z-map: 10;
  --z-toolbar: 40;
  --z-modals: 50;
  --z-header: 45;
}

* {
  -webkit-tap-highlight-color: transparent;
}

html, body, #root {
  width: 100%;
  height: 100dvh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* ============================================
   TOP HEADER BUBBLE - RESPONSIVE
   ============================================ */

.top-header-bubble {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-header);
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.85), rgba(236, 72, 153, 0.85));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  font-family: Arial, sans-serif;
  flex-wrap: wrap;
  max-width: calc(100vw - 40px);
  white-space: nowrap;
  transition: all 0.3s ease;
}

/* Mobile vertical - full header */
@media (max-width: 768px) {
  .top-header-bubble {
    top: 8px;
    padding: 8px 12px;
    gap: 6px;
    font-size: 12px;
  }
  
  .top-header-bubble .gta-3d-title {
    font-size: 0.75rem !important;
  }
}

/* Mobile horizontal - COMPACT & PINNED */
@media (max-width: 768px) and (orientation: landscape) {
  .top-header-bubble {
    top: 6px;
    padding: 6px 10px;
    gap: 4px;
    font-size: 10px;
    max-height: 48px;
    overflow: hidden;
  }
  
  .top-header-bubble .gta-3d-title {
    font-size: 0.65rem !important;
  }
  
  .top-header-bubble > div:first-child {
    display: none; /* Hide VI logo */
  }
}

/* Tablet landscape */
@media (min-width: 769px) and (max-width: 1024px) and (orientation: landscape) {
  .top-header-bubble {
    padding: 8px 14px;
    gap: 6px;
    font-size: 13px;
  }
}

/* Hide header when modals are open */
.modal-open .top-header-bubble {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

/* ============================================
   LEFT SIDEBAR TOOLBAR - RESPONSIVE
   ============================================ */

.left-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: var(--toolbar-width-mobile);
  z-index: var(--z-toolbar);
  
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.98));
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* CRITICAL: Extend to bottom */
  bottom: 0;
}

/* Tablet vertical - add scrolling container */
@media (min-width: 769px) and (max-width: 1024px) and (orientation: portrait) {
  .left-sidebar {
    width: var(--toolbar-width-tablet);
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
  
  .left-sidebar::-webkit-scrollbar {
    width: 4px;
  }
  
  .left-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .left-sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

/* Mobile horizontal - CRITICAL: full height to bottom */
@media (max-width: 768px) and (orientation: landscape) {
  .left-sidebar {
    height: 100dvh;
    width: var(--toolbar-width-mobile);
    padding: 6px 4px;
    gap: 3px;
    bottom: 0;
  }
}

/* Hide scrollbar but keep functionality */
.left-sidebar::-webkit-scrollbar {
  width: 3px;
}

.left-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.left-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

/* ============================================
   MAP CONTAINER
   ============================================ */

.map-container {
  position: absolute;
  top: 0;
  left: var(--toolbar-width-mobile);
  width: calc(100% - var(--toolbar-width-mobile));
  height: 100dvh;
  z-index: var(--z-map);
}

/* Adjust for tablet toolbar width */
@media (min-width: 769px) and (max-width: 1024px) {
  .map-container {
    left: var(--toolbar-width-tablet);
    width: calc(100% - var(--toolbar-width-tablet));
  }
}

/* ============================================
   MODALS & OVERLAYS - PROPER Z-INDEXING
   ============================================ */

.ui-panel,
.character-card,
.stay-updated-modal,
.ko-fi-modal,
.settings-modal-card,
.auth-modal,
.donate-modal,
.news-modal,
.coming-soon-modal,
.newsletter-modal {
  position: fixed;
  z-index: var(--z-modals);
  
  /* Responsive sizing */
  max-width: 90vw;
  max-height: 90vh;
}

/* Mobile modal - fullscreen-ish */
@media (max-width: 768px) {
  .ui-panel,
  .character-card,
  .settings-modal-card {
    width: 95vw !important;
    height: auto;
    max-height: 85vh;
  }
}

/* Tablet modal - larger but not fullscreen */
@media (min-width: 769px) and (max-width: 1024px) {
  .ui-panel,
  .character-card,
  .settings-modal-card {
    width: 85vw !important;
    height: auto;
    max-height: 80vh;
  }
}

/* Modal backdrop - hide top header */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-modals) - 1);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* ============================================
   RIGHT SIDE BUTTONS - RESPONSIVE
   ============================================ */

.right-side-buttons {
  position: fixed;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Mobile horizontal - adjust positioning */
@media (max-width: 768px) and (orientation: landscape) {
  .right-side-buttons {
    right: 8px;
    gap: 8px;
    top: 50%;
  }
}

/* ============================================
   BOTTOM TOOLBAR / DRAWING CONTROLS
   ============================================ */

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: var(--toolbar-width-mobile);
  width: calc(100% - var(--toolbar-width-mobile));
  height: auto;
  z-index: 35;
  
  background: linear-gradient(180deg, transparent, rgba(10, 10, 10, 0.9));
  padding: 12px 8px 8px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mobile horizontal - CRITICAL: full width at bottom */
@media (max-width: 768px) and (orientation: landscape) {
  .bottom-toolbar {
    left: 0;
    width: 100%;
    padding: 6px 8px 4px;
    gap: 4px;
    height: auto;
    bottom: 0;
  }
}

/* ============================================
   COUNTDOWN TIMER - RESPONSIVE
   ============================================ */

.launch-countdown {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  color: #ec4899;
}

@media (max-width: 768px) {
  .launch-countdown {
    font-size: 10px;
    padding: 3px 6px;
  }
}

@media (max-width: 768px) and (orientation: landscape) {
  .launch-countdown {
    font-size: 9px;
    padding: 2px 4px;
  }
}

/* ============================================
   GAME WIDGET - RESPONSIVE
   ============================================ */

.mini-game-widget {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 30;
  
  max-width: 320px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .mini-game-widget {
    bottom: 100px;
    right: 10px;
    max-width: calc(100vw - 60px);
  }
}

/* Mobile horizontal - position above bottom toolbar */
@media (max-width: 768px) and (orientation: landscape) {
  .mini-game-widget {
    bottom: 70px;
    right: 8px;
    max-width: calc(100vw - 40px);
  }
}

/* ============================================
   BUTTON SIZING & SPACING
   ============================================ */

/* Toolbar buttons */
.tool-btn {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

@media (max-width: 768px) and (orientation: landscape) {
  .tool-btn {
    padding: 8px;
    font-size: 12px;
  }
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* ============================================
   SIGN OUT BUTTON - RESPONSIVE
   ============================================ */

.sign-out-button {
  position: fixed;
  right: 12px;
  top: 12px;
  z-index: 48;
  
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sign-out-button {
    padding: 6px 10px;
    font-size: 11px;
    gap: 6px;
  }
}

/* ============================================
   LEAFLET OVERRIDES
   ============================================ */

.leaflet-container {
  font-family: Arial, sans-serif;
}

.leaflet-control {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(0, 0, 0, 0.7) !important;
  border-radius: 8px !important;
}

.leaflet-control-attribution {
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(8px);
  border-radius: 8px !important;
  padding: 4px 8px !important;
}

.leaflet-popup-content-wrapper {
  background: rgba(0, 0, 0, 0.9) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-open {
  overflow: hidden;
}

/* ============================================
   RESPONSIVE UTILITY CLASSES
   ============================================ */

/* Hide on mobile horizontal */
@media (max-width: 768px) and (orientation: landscape) {
  .hide-on-mobile-h {
    display: none !important;
  }
}

/* Show scrollbar hint on tablet */
@media (min-width: 769px) and (max-width: 1024px) and (orientation: portrait) {
  .show-scroll-hint {
    font-size: 8px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }
}

/* ============================================
   TEXT TRUNCATION & OVERFLOW
   ============================================ */

.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ============================================
   MOBILE-SPECIFIC FIXES
   ============================================ */

@media (max-width: 768px) {
  /* Prevent double-tap zoom delays */
  input, button, a {
    touch-action: manipulation;
  }
  
  /* Better mobile input */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  textarea {
    font-size: 16px; /* Prevent zoom on iOS */
    border-radius: 8px;
  }
}

/* ============================================
   LANDSCAPE ORIENTATION FIXES
   ============================================ */

@media (orientation: landscape) {
  body {
    height: 100vh;
    max-height: 100vh;
  }
  
  #root {
    height: 100vh;
  }
}

/* ============================================
   PRINT STYLES
   ============================================ */

@media print {
  .top-header-bubble,
  .left-sidebar,
  .right-side-buttons,
  .bottom-toolbar {
    display: none !important;
  }
}
`;

fs.writeFileSync('src/index.css', newLines.join('\n') + '\n' + additionalCss);
console.log('Successfully updated index.css');
