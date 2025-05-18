/**
 * Map Extensions
 * This file contains additional functionality for the map:
 * - Ping markers and distance lines
 * - Image markers with editor
 * - Drag and drop functionality
 */

// Function to add placeholder styles for contenteditable elements
// This function is now empty since these styles have been moved to styles.css
const addPlaceholderStyles = () => {
    // Placeholder styles for contenteditable elements are now defined in styles.css
    // The CSS rule is: [contenteditable=true]:empty:before
};

// Initialize all map extensions
const initMapExtensions = (mapCore) => {
    const { map, keyboardControls } = mapCore;
    
    // Setup ping functionality
    setupPingMarkers(map, keyboardControls);
    
    // Setup image drag and drop
    setupImageDragAndDrop(map);
    
    // Add CSS for placeholder text in contenteditable
    addPlaceholderStyles();
};

// Setup ping markers and distance lines
const setupPingMarkers = (map, keyboardControls) => {
    // Create ping icon
    const pingIcon = L.icon({
        iconUrl: 'assets/ui/pointers/hand.png',
        iconSize: [100, 50],
        iconAnchor: [0, 55]
    });
    
    // Track the last placed marker and lines
    let lastMarker = null;
    const lines = [];
    
    // Handle map click to add ping
    map.on('click', function(e) {
        // Create marker at clicked position
        const ping = L.marker(e.latlng, { 
            icon: pingIcon
        }).addTo(map);
        
        // Check if shift key is pressed and there's a previous marker
        if (e.originalEvent.shiftKey && lastMarker) {
            // Create a line between previous marker and new marker
            const line = L.polyline([lastMarker.getLatLng(), e.latlng], {
                color: '#924C32',
                weight: 3,
                opacity: 0.7
            }).addTo(map);
            
            // Calculate distance in meters
            //dirty distance hack because world map is not aligned leaflet coords
            const distanceLatLng = {lat: lastMarker.getLatLng().lat > e.latlng.lat ? lastMarker.getLatLng().lat - e.latlng.lat : e.latlng.lat - lastMarker.getLatLng().lat, lng: lastMarker.getLatLng().lng > e.latlng.lng ? lastMarker.getLatLng().lng - e.latlng.lng : e.latlng.lng - lastMarker.getLatLng().lng}
            
            const distanceInMeters = Math.sqrt(Math.pow(distanceLatLng.lat, 2) + Math.pow(distanceLatLng.lng, 2)) * 90000;
            console.log(distanceInMeters);
            
            
            // Convert to kilometers if distance is large
            let distanceText;
            if (distanceInMeters >= 1000) {
                distanceText = `${(distanceInMeters / 1000).toFixed(2)} km`;
            } else {
                distanceText = `${Math.round(distanceInMeters)} m`;
            }
            
            // Add distance label
            const midpoint = L.latLng(
                (lastMarker.getLatLng().lat + e.latlng.lat) / 2,
                (lastMarker.getLatLng().lng + e.latlng.lng) / 2
            );
            
            const distanceLabel = L.marker(midpoint, {
                icon: L.divIcon({
                    className: 'distance-label',
                    html: distanceText,
                    iconSize: [110, 20],
                    iconAnchor: [50, 10]
                })
            }).addTo(map);
            
            // Store line and label to remove them when markers are removed
            lines.push({
                line: line,
                label: distanceLabel,
                markers: [lastMarker, ping]
            });
            
            // Add click handler to the line for color picker
            line.on('click', function(e) {
                // Stop the event from propagating to the map
                L.DomEvent.stopPropagation(e);
                
                // Create a popup with just the color input
                const colorPickerHtml = `
                    <input type="color" id="routeColor" value="#924C32" style="width: 40px; height: 40px; padding: 0; border: none;">
                `;
                
                const popup = L.popup({
                    closeButton: false,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'color-picker-popup'
                })
                .setLatLng(e.latlng)
                .setContent(colorPickerHtml)
                .openOn(map);
                
                // Add event listeners to apply color on change or close
                setTimeout(() => {
                    const colorInput = document.getElementById('routeColor');
                    
                    // Set focus to the input to open the color picker immediately
                    colorInput.focus();
                    colorInput.click();
                    
                    // Find all line segments connected to this route
                    const currentLine = e.target;
                    const connectedLines = [];
                    
                    // Find all lines connected to the same markers
                    lines.forEach(lineInfo => {
                        if (lineInfo.line === currentLine || 
                            lineInfo.markers.some(marker => 
                                currentLine._latlngs.some(latlng => 
                                    latlng.equals(marker.getLatLng())
                                )
                            )) {
                            connectedLines.push(lineInfo.line);
                        }
                    });
                    
                    // Apply color when input changes
                    colorInput.addEventListener('input', function() {
                        const newColor = colorInput.value;
                        connectedLines.forEach(line => {
                            line.setStyle({ color: newColor });
                        });
                    });
                    
                    // Apply color and close popup when input loses focus
                    colorInput.addEventListener('change', function() {
                        const newColor = colorInput.value;
                        connectedLines.forEach(line => {
                            line.setStyle({ color: newColor });
                        });
                        map.closePopup();
                    });
                    
                    // Close popup when clicked outside
                    document.addEventListener('click', function closePopup(event) {
                        if (!event.target.closest('.color-picker-popup')) {
                            map.closePopup();
                            document.removeEventListener('click', closePopup);
                        }
                    });
                }, 10);
            });
        }
        
        // Update last marker
        lastMarker = ping;
        
        // Add right-click event to remove marker
        ping.on('contextmenu', function() {
            // Remove related lines and labels
            for (let i = lines.length - 1; i >= 0; i--) {
                const lineInfo = lines[i];
                if (lineInfo.markers.includes(ping)) {
                    map.removeLayer(lineInfo.line);
                    map.removeLayer(lineInfo.label);
                    lines.splice(i, 1);
                }
            }
            
            // If this was the last marker, update lastMarker
            if (lastMarker === ping) {
                lastMarker = null;
            }
            
            map.removeLayer(ping);
        });
    });
};

// Setup drag and drop for images
const setupImageDragAndDrop = (map) => {
    const mapElement = document.getElementById('map');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        mapElement.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        // Check if the event originated from GrapeJS or if editor is open
        if (e.isFromGrapeJS || window.isMarkerEditorOpen) {
            return; // Do nothing if it's from GrapeJS or editor is open
        }
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        mapElement.addEventListener(eventName, (e) => {
            // Only highlight if not from GrapeJS and editor is not open
            if (!e.isFromGrapeJS && !window.isMarkerEditorOpen) {
                highlight();
            }
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        mapElement.addEventListener(eventName, (e) => {
            // Only unhighlight if not from GrapeJS and editor is not open
            if (!e.isFromGrapeJS && !window.isMarkerEditorOpen) {
                unhighlight();
            }
        }, false);
    });
    
    function highlight() {
        mapElement.classList.add('drag-highlight');
    }
    
    function unhighlight() {
        mapElement.classList.remove('drag-highlight');
    }
    
    // Handle dropped files
    mapElement.addEventListener('drop', function(e) {
        // Skip if the event is from GrapeJS or editor is open
        if (e.isFromGrapeJS || window.isMarkerEditorOpen) {
            return;
        }
        
        const dt = e.dataTransfer;
        const files = dt.files;
        
        // Get mouse position relative to map
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert pixel coordinates to Leaflet latlng
        const point = L.point(x, y);
        const latlng = map.containerPointToLatLng(point);
        
        // Handle dropped files
        handleFiles(files, latlng);
    }, false);
    
    function handleFiles(files, latlng) {
        [...files].forEach(file => {
            // Only process image files
            if (!file.type.match('image.*')) return;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgDataUrl = e.target.result;
                
                // Create a custom icon with the dropped image
                const imgIcon = L.icon({
                    iconUrl: imgDataUrl,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor: [0, -25]
                });
                
                // Create marker with the image icon
                const imgMarker = L.marker(latlng, {
                    icon: imgIcon,
                    draggable: true
                }).addTo(map);
                
                // Store marker data
                const markerData = {
                    name: file.name || "Honk honk MFer. Where's my name?",
                    description: "",
                    imgUrl: imgDataUrl
                };
                
                // Add normal click for editor
                imgMarker.on('click', function(event) {
                    if (event.originalEvent.shiftKey) openMarkerEditor(imgMarker, markerData, map);
                });
                
                // Add right-click to remove marker
                imgMarker.on('contextmenu', function() {
                    map.removeLayer(imgMarker);
                });
                
                // Initial popup with name
                imgMarker.bindPopup(`<div><strong>${markerData.name}</strong></div>`);
            };
            
            reader.readAsDataURL(file);
        });
    }
};


// Function to open marker editor
const openMarkerEditor = (marker, markerData, map) => {
    // Store marker reference for updating popup content later
    markerData.marker = marker;
    
    // Create full-screen overlay for GrapeJS editor
    const overlayHtml = `
        <div id="editor-overlay" class="editor-fullscreen-overlay">
            <div class="editor-header">
                <button id="save-close-btn" class="save-close-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Close
                </button>
            </div>
            <div class="editor-container">
                <!-- Metadata section (outside GrapeJS control) -->
                <div class="metadata-section">
                    <div class="metadata-container">
                        <div class="form-group">
                            <label for="marker-name-input">Marker Name</label>
                            <input id="marker-name-input" type="text" placeholder="Enter name" value="${markerData.name}" class="marker-name-input">
                        </div>
                        <div class="form-group">
                            <div class="image-container" id="image-drop-zone">
                                <img id="marker-img" src="${markerData.imgUrl}" class="marker-image">
                                <div class="image-upload-overlay">
                                    <input type="file" id="image-upload" accept="image/*" style="display:none">
                                    <div class="image-drop-message">Drop image or click to change</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <!-- GrapeJS Editor section -->
                <div class="description-section">
                    <!-- GrapeJS Toolbar -->
                    <div id="gjs-toolbar" class="gjs-toolbar"></div>
                    
                    <!-- Main Editor Area -->
                    <div class="gjs-editor-area">
                        <!-- Canvas for editing -->
                        <div id="gjs" data-description="${markerData.description || ''}"></div>
                        
                        <!-- Right sidebar for blocks and styles -->
                        <div class="editor-sidebar">
                            <div class="panel-tabs">
                                <button id="blocks-tab" class="panel-tab active">Blocks</button>
                                <button id="styles-tab" class="panel-tab">Styles</button>
                            </div>
                            <div id="blocks-panel" class="sidebar-panel"></div>
                            <div id="styles-panel" class="sidebar-panel" style="display: none;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add the overlay to the body
    const overlayElement = document.createElement('div');
    overlayElement.innerHTML = overlayHtml;
    document.body.appendChild(overlayElement.firstElementChild);
    
    // Initialize the GrapeJS editor using the new implementation
    if (typeof initGrapeJSEditor === 'function') {
        initGrapeJSEditor(markerData);
    } else {
        console.error('GrapeJS editor implementation not found!');
    }
    
    // Wait for DOM to update
    setTimeout(() => {
        // Setup image change functionality
        const imageDropZone = document.getElementById('image-drop-zone');
        const imageUploadInput = document.getElementById('image-upload');
        const markerImage = document.getElementById('marker-img');
        
        // Handle click on image container
        imageDropZone.addEventListener('click', () => {
            imageUploadInput.click();
        });
        
        // Handle file selection
        imageUploadInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                processImageFile(e.target.files[0]);
            }
        });
        
        // Setup drag and drop for image
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Highlight drop area
        ['dragenter', 'dragover'].forEach(eventName => {
            imageDropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            imageDropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            imageDropZone.classList.add('drag-over');
        }
        
        function unhighlight() {
            imageDropZone.classList.remove('drag-over');
        }
        
        // Handle dropped files
        imageDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files.length) {
                const file = files[0];
                if (file.type.match('image.*')) {
                    processImageFile(file);
                }
            }
        });
        
        // Process image file (used for both drop and file input)
        function processImageFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgUrl = e.target.result;
                markerImage.src = imgUrl;
                markerData.imgUrl = imgUrl;
                
                // Update the marker icon
                const newIcon = L.icon({
                    iconUrl: imgUrl,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor: [0, -25]
                });
                marker.setIcon(newIcon);
            };
            
            reader.readAsDataURL(file);
        }
        
        // Setup name input functionality
        const nameInput = document.getElementById('marker-name-input');
        nameInput.addEventListener('input', () => {
            markerData.name = nameInput.value || "Unnamed Marker";
        });
    });
}; 