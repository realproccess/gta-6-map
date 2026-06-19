export const Haptics = {
    // Check if the device actually supports vibration
    isSupported: () => typeof window !== 'undefined' && 'vibrate' in navigator,

    // Light tap: Perfect for side-menu buttons, closing modals, toggling settings
    light: () => {
        if (Haptics.isSupported()) navigator.vibrate(10);
    },

    // Medium tap: Good for dropping a pin on the map or selecting a drawing tool
    medium: () => {
        if (Haptics.isSupported()) navigator.vibrate(25);
    },

    // Heavy thud: Opening a Character Card or hitting "Play Guesser Mode"
    heavy: () => {
        if (Haptics.isSupported()) navigator.vibrate(40);
    },

    // Success double-tap: When a Ko-fi payment goes through or a setting saves
    success: () => {
        if (Haptics.isSupported()) navigator.vibrate([15, 50, 15]);
    },

    // Error/Warning buzz: Trying to draw out of bounds, or form errors
    error: () => {
        if (Haptics.isSupported()) navigator.vibrate([50, 30, 50, 30, 50]);
    }
};
