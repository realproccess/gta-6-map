import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add this to your main script
document.addEventListener('click', (e) => {
    const target = e.target as Element;
    // Check if the click was inside ANY modal, panel, or menu
    const isClickInsideMenu = target.closest('.ui-panel') || 
                              target.closest('.tool-btn') || 
                              target.closest('.close-btn') ||
                              target.closest('.left-sidebar') ||
                              target.closest('.ko-fi-modal') ||
                              target.closest('.character-card') ||
                              target.closest('.settings-modal-card') ||
                              target.closest('.stay-updated-modal');
    
    // Check if the click was on the map background
    const isMap = target.closest('#map') || target.closest('.leaflet-container') || target.closest('.map-container');

    // If the user clicks the map (and not inside a menu), close all modals
    if (isMap && !isClickInsideMenu) {
        // Find all active panels and modals
        const activeModals = document.querySelectorAll('.ui-panel, .character-card, .stay-updated-modal, .ko-fi-modal, .settings-modal-card');
        activeModals.forEach(modal => {
            const closeBtn = modal.querySelector('.close-btn, .close-modal-btn, .close-icon-btn, .legal-back-btn') as HTMLButtonElement | null;
            if (closeBtn) {
                closeBtn.click();
            } else {
                // Vanilla fallback if no react close button is found
                (modal as HTMLElement).style.display = 'none';
            }
        });
    }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
