/**
 * Core Map Functionality
 * This file contains the basic map initialization and configuration
 */

// Initialize map with configuration
const initMap = () => {
    const map = L.map('map', {
        minZoom: 3,
        maxZoom: 9,
        zoomControl: false,
        attributionControl: false,
        maxBoundsViscosity: 0.75,
        center: [0, 0], // Center of the map (default)
        zoom: 3,        // Initial zoom level
        doubleClickZoom: false // Disable double-click zoom
    });
    
    // Add custom tile layer
    L.tileLayer('https://toril{z}.sesja.co/tiles/{y}/{x}.png', {
        minZoom: 3,
        maxZoom: 9
    }).addTo(map);
    
    // Set reasonable bounds
    const bounds = L.latLngBounds(
        L.latLng(-90, -180),
        L.latLng(90, 180)
    );
    map.setMaxBounds(bounds);
    
    return map;
};

// Handle keyboard events for map controls
const setupKeyboardControls = (map) => {
    let isShiftPressed = false;
    
    // Disable zooming when shift is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Shift') {
            isShiftPressed = true;
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable(); // Disable double-click zoom when shift is pressed
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            isShiftPressed = false;
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.enable(); // Re-enable double-click zoom when shift is released
        }
    });
    
    return { isShiftPressed: () => isShiftPressed };
};

// Initialize the map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    const map = initMap();
    
    // Setup keyboard controls
    const keyboardControls = setupKeyboardControls(map);
    
    // Make map and controls available globally
    window.mapCore = {
        map,
        keyboardControls
    };
    
    // Initialize extensions if they exist
    if (typeof initMapExtensions === 'function') {
        initMapExtensions(window.mapCore);
    }
}); 