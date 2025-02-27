// Refactored MapManager class to encapsulate state, storage, URL hash handling, and map events
class MapManager {
  constructor(mapContainerId) {
    this.mapContainerId = mapContainerId;
    this.map = null;
    this.tileLayer = null;
    this.marker = null;
    this.markerIcon = null;
    this.params = {};
    this.toolbox = null;
    this.init();
  }

  // Safely get/set localStorage items (gracefully handling errors)
  safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // fail silently
    }
  }

  init() {
    // Default location and zoom values
    const defaultLoc = [31.18460913574325, -72.38891601562501];
    this.params.loc = this.safeGetItem("mapLoc") ? JSON.parse(this.safeGetItem("mapLoc")) : defaultLoc;
    this.params.marker = this.safeGetItem("markerLoc") ? JSON.parse(this.safeGetItem("markerLoc")) : defaultLoc;
    this.params.zoom = this.safeGetItem("mapZoom") ? parseInt(this.safeGetItem("mapZoom")) : 7;

    // Override with URL hash if available
    this.parseHash();

    // Create the map and add base layer
    this.loadMap();

    // Add the toolbox control for additional functionality
    this.addToolbox();
  }

  // Parse URL hash parameters and update our internal state
  parseHash() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const commands = hash.substring(1).split(";");
      commands.forEach((cmdStr) => {
        if (!cmdStr) return;
        const [key, value] = cmdStr.split("=");
        if (key === "loc") {
          this.params.loc = value.split(",").map(Number);
        } else if (key === "zoom") {
          this.params.zoom = parseInt(value);
        } else if (key === "marker") {
          this.params.marker = value.split(",").map(Number);
        }
      });
    }
  }

  // Update the URL hash based on the current params
  updateHash() {
    let hashstring = "#";
    for (const key in this.params) {
      hashstring += `${key}=${Array.isArray(this.params[key]) ? this.params[key].join(",") : this.params[key]};`;
    }
    window.location.hash = hashstring;
  }

  loadMap() {
    // Initialize Leaflet map with defined options
    this.map = L.map(this.mapContainerId, {
      minZoom: 3,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: false,
      maxBoundsViscosity: 0.75
    });

    // Add a tile layer (replace with your tile URL if needed)
    this.tileLayer = L.tileLayer("https://toril{z}.sesja.co/tiles/{y}/{x}.png").addTo(this.map);

    // Set the initial view using parameters (from storage or URL hash)
    this.map.setView(this.params.loc, this.params.zoom);

    // Update storage and hash when map view changes
    this.map.on("moveend", () => this.handleMoveEnd());
    // Set marker on map click
    this.map.on("click", (e) => this.handleMapClick(e));

    // Define a custom marker icon
    this.markerIcon = L.icon({
      iconUrl: 'assets/ui/pointers/hand.png',
      iconSize: [100, 50],
      iconAnchor: [0, 55],
      popupAnchor: [50, -70]
    });

    // If a marker position is defined, add it
    if (this.params.marker && this.params.marker.length === 2) {
      this.addMarker(this.params.marker);
    }
  }

  handleMoveEnd() {
    const center = this.map.getCenter();
    this.params.loc = [center.lat, center.lng];
    this.safeSetItem("mapLoc", JSON.stringify(this.params.loc));

    this.params.zoom = this.map.getZoom();
    this.safeSetItem("mapZoom", this.params.zoom);
    this.updateHash();
  }

  handleMapClick(e) {
    const coords = [e.latlng.lat, e.latlng.lng];
    this.params.marker = coords;
    this.safeSetItem("markerLoc", JSON.stringify(coords));
    this.addMarker(coords);
    this.updateHash();
  }

  // Add or update the primary marker
  addMarker(coords) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker(coords, { icon: this.markerIcon })
      .bindPopup("You are here.")
      .addTo(this.map);
  }

  // Public API for adding custom markers (via toolbox)
  addCustomMarker(coords, popupText = "Custom Marker") {
    const customMarker = L.marker(coords, { icon: this.markerIcon })
      .bindPopup(popupText)
      .addTo(this.map);
    return customMarker;
  }

  // Public API for adding any additional layer to the map
  addLayer(layer) {
    this.map.addLayer(layer);
  }

  // Public API for adding image overlays
  addImageOverlay(imageUrl, bounds) {
    const imageLayer = L.imageOverlay(imageUrl, bounds).addTo(this.map);
    return imageLayer;
  }

  addToolbox() {
    this.toolbox = new ToolboxControl(this);
    this.toolbox.addTo(this.map);
  }
}

// Custom Leaflet Control to serve as our toolbox
class ToolboxControl extends L.Control {
  constructor(mapManager, options = {}) {
    super(options);
    this.mapManager = mapManager;
    this.options.position = options.position || 'topright';
  }

  onAdd(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar toolbox-control');
    container.style.background = 'white';
    container.style.padding = '5px';
    container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.65)';
    L.DomEvent.disableClickPropagation(container);

    // Create three buttons for marker, layer, and image overlay
    container.innerHTML = `
      <button id="addMarkerBtn" title="Add Marker">📍</button>
      <button id="addLayerBtn" title="Add Layer">🗺️</button>
      <button id="addImageBtn" title="Add Image Overlay">🖼️</button>
    `;

    // Set up event handlers for each button
    container.querySelector('#addMarkerBtn').addEventListener('click', () => this.onAddMarker());
    container.querySelector('#addLayerBtn').addEventListener('click', () => this.onAddLayer());
    container.querySelector('#addImageBtn').addEventListener('click', () => this.onAddImage());

    return container;
  }

  onAddMarker() {
    // Prompt the user for marker details
    const lat = parseFloat(prompt("Enter latitude for marker:", this.mapManager.params.loc[0]));
    const lng = parseFloat(prompt("Enter longitude for marker:", this.mapManager.params.loc[1]));
    const text = prompt("Enter popup text:", "Custom Marker");
    if (!isNaN(lat) && !isNaN(lng)) {
      this.mapManager.addCustomMarker([lat, lng], text);
    }
  }

  onAddLayer() {
    // Example: add a circle layer at the map center
    const center = this.mapManager.map.getCenter();
    const circle = L.circle(center, { radius: 50000, color: 'blue', fillOpacity: 0.2 });
    this.mapManager.addLayer(circle);
  }

  onAddImage() {
    // Prompt for an image URL and the bounds where it should appear
    const imageUrl = prompt("Enter image URL:");
    if (!imageUrl) return;
    const swLat = parseFloat(prompt("Enter south-west latitude:", this.mapManager.params.loc[0] - 0.5));
    const swLng = parseFloat(prompt("Enter south-west longitude:", this.mapManager.params.loc[1] - 0.5));
    const neLat = parseFloat(prompt("Enter north-east latitude:", this.mapManager.params.loc[0] + 0.5));
    const neLng = parseFloat(prompt("Enter north-east longitude:", this.mapManager.params.loc[1] + 0.5));
    if ([swLat, swLng, neLat, neLng].some(isNaN)) return;
    const bounds = [[swLat, swLng], [neLat, neLng]];
    this.mapManager.addImageOverlay(imageUrl, bounds);
  }
}

// Initialize the map once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const mapManager = new MapManager('mapContainer');
});

