/**
 * Core Map Functionality
 * This file contains the basic map initialization and configuration
 */

const Toril = L.extend({}, L.CRS.EPSG3857, {
    // Custom projection for distorted earth map
    projection: L.extend({}, L.CRS.EPSG3857.projection, {
        bounds: L.bounds([-20037508.34, -20037508.34], [20037508.34, 20037508.34]), // Add bounds property
        
        project(latlng) {
            // Convert lat/lng to radians
            const d = Math.PI / 180;
            const lat = latlng.lat * d;
            const lng = latlng.lng * d;
            
            // Project using modified Mercator
            let point = L.point(
                6378137 * lng, // Earth's radius * longitude
                6378137 * Math.log(Math.tan(Math.PI/4 + lat/2))
            );
            
            // Apply custom distortion - keep horizontal as is, increase vertical by 25%
            point.y *= 0.8; // Expand vertically to match real distance
            
            return point;
        },
        
        unproject(point) {
            // Reverse the distortion
            const adjustedPoint = L.point(
                point.x,
                point.y / 0.8
            );
            
            // Reverse Mercator projection
            const lng = adjustedPoint.x / 6378137;
            const lat = 2 * Math.atan(Math.exp(adjustedPoint.y / 6378137)) - Math.PI/2;
            
            // Convert back to degrees
            return L.latLng(
                lat * 180 / Math.PI,
                lng * 180 / Math.PI
            );
        }
    }),
    
    // Scale factor for proper distance calculations
    scale(zoom) {
        return 256 * Math.pow(2, zoom);
    },
    
    // Adjust distance calculation for distorted projection
    distance(latlng1, latlng2) {
        const d = Math.PI / 180;
        const lat1 = latlng1.lat * d;
        const lat2 = latlng2.lat * d;
        const lng1 = latlng1.lng * d;
        const lng2 = latlng2.lng * d;
        
        // Haversine formula adjusted for distortion
        const R = 6378137; // Earth's radius in meters
        const x = (lng2 - lng1) * Math.cos((lat1 + lat2) / 2);
        const y = lat2 - lat1;
        return Math.sqrt(x * x + y * y) * R;
    },
    
    // Set map bounds
    infinite: false,
    wrapLng: [-180, 180],
    wrapLat: [-85, 85]
});

// Initialize map with configuration
const initMap = () => {
    const map = L.map('map', {
        minZoom: 4,
        maxZoom: 9,
        zoomControl: false,
        center: [0, 0],
        attributionControl: false,
        maxBoundsViscosity: 0.98,
        zoom: 3,
        doubleClickZoom: false,
        crs: Toril,
        maxBounds: [[-69, -180], [69, 180]] // Restrict panning
    });
    
    // Add custom tile layer
    L.tileLayer('https://toril{z}.sesja.co/tiles/{y}/{x}.png', {
        minZoom: 4,
        maxZoom: 9,
        tileSize: 256,
        zoomOffset: 0
    }).addTo(map);

    L.control.scale({
        metric: true,
        imperial: true,
        position: 'bottomleft'
    }).addTo(map);
    
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