const fr =
{
    minZoom: 3,
    maxZoom: 9,
    click: true,
    attributionControl: false,
    radioButtons: true,
    nowPlaying: true,
    zoomControl: false,
    // maxBounds: new L.LatLngBounds(new L.LatLng(84,-180), new L.LatLng(11, 180)),
    maxBoundsViscosity: 0.75,
    minimap: {
        position: 'bottomleft', map: "assets/ui/minimap.png",
        width: 230, height: 107, style:
            { opacity: 0.7, borderRadius: '0px', backgroundColor: '#4272F4' }
        },
        icons: {"pointer": {
            iconUrl: 'assets/ui/pointers/hand.png',
            // shadowUrl: 'assets/icons/hand_shadow.png',

            iconSize:     [100, 50], // size of the icon
            shadowSize:   [100, 50], // size of the shadow
            iconAnchor:   [0, 55], // point of the icon which will correspond to markerLoc's location
            shadowAnchor: [0, 45],  // the same for the shadow
            popupAnchor:  [50, -70] // point from which the popup should open relative to the iconAnchor
        }},

}


class HTMLLeafletMapElement extends HTMLElement
{
    static observedAttributes = ['src']
    constructor()
    {
        super()
    }

    connectedCallback()
    {
        this.map = L.map(this.id)
    }

    load()
    {

    }
}

customElements.define('leaflet-map', HTMLLeafletMapElement)
