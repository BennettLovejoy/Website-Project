// map.js

// Initialize the map
var map = L.map('map', {
    zoomControl: false
}).setView([39.983334, -82.983330], 12);

// Custom tile layer styling and attribution
const mapStyle = {
    light: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
L.tileLayer(mapStyle.light, { attribution }).addTo(map);

var baseMaps = {
    "Light Mode": L.tileLayer(mapStyle.light, { attribution }),
    "Dark Mode": L.tileLayer(mapStyle.dark, { attribution }),
    "Satellite": L.tileLayer(mapStyle.satellite, { attribution })
};

L.control.zoom({ position: 'topleft' }).addTo(map);
L.control.layers(baseMaps, null, { position: 'topright', collapsed: true }).addTo(map);

map.on('click', function(e) {
    L.popup().setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
});
