/**
 * Map Extensions
 * This file contains additional functionality for the map:
 * - Ping markers and distance lines
 * - Image markers with editor
 * - Drag and drop functionality
 */

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
            const distanceInMeters = lastMarker.getLatLng().distanceTo(e.latlng);
            
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
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        mapElement.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        mapElement.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        mapElement.classList.add('drag-highlight');
    }
    
    function unhighlight() {
        mapElement.classList.remove('drag-highlight');
    }
    
    // Handle dropped files
    mapElement.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
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
    }
    
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
    // Create editor panel with streamlined styling
    const editorHtml = `
        <div class="marker-editor" style="min-width: 300px; max-width: 400px;">
            <div style="margin-bottom: 15px;">
                <input type="text" id="marker-name" placeholder="Enter name" value="${markerData.name}" style="width: 100%; padding: 7px; box-sizing: border-box; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="border-radius: 4px; padding: 7px; margin-bottom: 5px;" class="editor-toolbar">
                    <button type="button" onclick="document.execCommand('bold', false, null)" style="margin: 2px; border-radius: 4px; padding: 3px 7px; cursor: pointer;">B</button>
                    <button type="button" onclick="document.execCommand('italic', false, null)" style="margin: 2px; border-radius: 4px; padding: 3px 7px; cursor: pointer;"><i>I</i></button>
                    <button type="button" onclick="document.execCommand('underline', false, null)" style="margin: 2px; border-radius: 4px; padding: 3px 7px; cursor: pointer;"><u>U</u></button>
                    <select onchange="document.execCommand('fontSize', false, this.value); this.selectedIndex = 0;" style="margin: 2px; border-radius: 4px; padding: 3px;">
                        <option value="">Size</option>
                        <option value="1">Small</option>
                        <option value="3">Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Extra Large</option>
                    </select>
                    <input type="color" onchange="document.execCommand('foreColor', false, this.value)" style="margin: 2px; border-radius: 4px; padding: 0; vertical-align: middle;">
                </div>
                <div id="marker-description" contenteditable="true" style="min-height: 100px; max-height: 200px; overflow-y: auto; padding: 10px; border-radius: 4px;" class="editor-content" placeholder="Add description here">${markerData.description}</div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div id="marker-img-preview" style="width: 100%; height: 120px; background-size: contain; background-repeat: no-repeat; background-position: center; background-image: url('${markerData.imgUrl}'); border-style: dashed; border-width: 2px; margin-bottom: 5px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;" class="image-dropzone">
                    <div style="background: rgba(0,0,0,0.5); color: white; padding: 8px 12px; border-radius: 4px; text-align: center; opacity: 0; transition: opacity 0.2s ease;">
                        Click or drop to change image
                    </div>
                </div>
                <input type="file" id="marker-img-input" accept="image/*" style="display: none;">
            </div>
            
            <div class="close-editor-btn">
                <button id="close-editor-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Create and open popup
    const popup = L.popup({
        closeButton: false, // Remove top close button
        closeOnClick: false,
        autoClose: false,
        minWidth: 300,
        maxWidth: 400,
        className: 'fantasy-popup',
        offset: L.point(215, 270)

    })
    .setLatLng(marker.getLatLng())
    .setContent(editorHtml)
    .openOn(map);
    
    // Store the popup reference with the marker for later access
    marker._editorPopup = popup;
    
    // Function to update marker popup content
    function updateMarkerPopup() {
        const popupContent = `
            <div>
                <strong>${markerData.name}</strong>
                ${markerData.description ? '<hr style="margin: 5px 0;">' : ''}
                <div>${markerData.description}</div>
            </div>
        `;
        marker.setPopupContent(popupContent);
    }
    
    // Setup event handlers after popup is added to DOM
    setTimeout(() => {
        // Image handling
        const imgPreview = document.getElementById('marker-img-preview');
        const imgInput = document.getElementById('marker-img-input');
        const previewOverlay = imgPreview.querySelector('div'); // Get the overlay text div
        
        // Get text fields for auto-save
        const nameInput = document.getElementById('marker-name');
        const descriptionEditor = document.getElementById('marker-description');
        
        // Auto-save for name field
        nameInput.addEventListener('input', () => {
            markerData.name = nameInput.value || "Unnamed Marker";
            updateMarkerPopup();
        });
        
        // Auto-save for description field
        descriptionEditor.addEventListener('input', () => {
            markerData.description = descriptionEditor.innerHTML;
            updateMarkerPopup();
        });
        
        // Show overlay on hover
        imgPreview.addEventListener('mouseenter', () => {
            previewOverlay.style.opacity = '1';
        });
        
        imgPreview.addEventListener('mouseleave', () => {
            previewOverlay.style.opacity = '0';
        });
        
        // Setup drag and drop for the image preview
        imgPreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            imgPreview.classList.add('drag-over');
        });
        
        imgPreview.addEventListener('dragleave', () => {
            imgPreview.classList.remove('drag-over');
        });
        
        imgPreview.addEventListener('drop', (e) => {
            e.preventDefault();
            imgPreview.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                const file = e.dataTransfer.files[0];
                if (file.type.match('image.*')) {
                    readAndPreviewImage(file);
                }
            }
        });
        
        // Allow click to select image
        imgPreview.addEventListener('click', () => {
            imgInput.click();
        });
        
        imgInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                readAndPreviewImage(e.target.files[0]);
            }
        });
        
        function readAndPreviewImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgUrl = e.target.result;
                imgPreview.style.backgroundImage = `url('${imgUrl}')`;
                markerData.imgUrl = imgUrl;
                
                // Auto-save: Immediately update the marker icon
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
        
        // Ensure the close button works - fixed to close the editor popup
        document.getElementById('close-editor-btn').addEventListener('click', () => {
            // Close the editor popup specifically
        map.closePopup(marker._editorPopup);
        });
    }, 100);
};

// Add CSS for placeholder text in contenteditable
const addPlaceholderStyles = () => {
    const extraStyles = document.createElement('style');
    extraStyles.textContent = `
        [contenteditable=true]:empty:before {
            content: attr(placeholder);
            color: var(--fantasy-highlight);
            font-style: italic;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(extraStyles);
}; 