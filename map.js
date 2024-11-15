// DON'T TOUCH THIS !!!
var map = L.map('map', {
    zoom: 9,
    zoomControl: false
});
map.setView([39.983334, -82.983330], 9);

const schoolIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom tile layer styling
const mapStyle = {
    default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    light: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

// Map Attribution
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Initialize Map
L.tileLayer(mapStyle.light, { attribution }).addTo(map);

var baseMaps = {
    "Light Mode": L.tileLayer(mapStyle.light, { attribution }),
    "Dark Mode": L.tileLayer(mapStyle.dark, { attribution }),
    "Satellite": L.tileLayer(mapStyle.satellite, { attribution })
};

// Move Zoom Control to bottom right corner of map
L.control.zoom({
    position: 'topleft'
}).addTo(map);

// Add layer control with custom styling
var layerControl = L.control.layers(baseMaps, null, {
    position: 'topright',
    collapsed: true,
}).addTo(map);


// If a user clicks on a part of the map without an icon, now the latitude and longitutde will appear. 
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    
    map.on('click', onMapClick);

// Loading schools using function
// Using Papa Parse to load and parse a CSV file with school data
Papa.parse("data/school-data/ohioschools.csv", {
    download: true,  // Important for loading external files
    header: true, // Ensures the first row is used as keys
    skipEmptyLines: true, // Skips empty lines
    complete: function(results) {
        console.log("Parsed CSV results:", results);
        console.log("Parsed CSV data:", results.data);
        //console.log("Student count parsed as:", Number(school.Students));
        //console.log("Raw school data:", school);
        loadSchools(results.data);
    },
    error: function(err, file) {
        console.error("Error parsing file:", err);
    }}
);


// Load and geocode each school, then plot on map
async function loadSchools(data){
   // console.log("Data passed to loadSchools:", data);
    for (let school of data) {
        if (!school) {
            console.warn("Encoutered null or undefined row in CSV data.");
            continue;
        }

        const schoolName = school[' Name'];
        const address = (school[' Address']);
        const city = (school[' City']);
        const state = (school[' State']);
        const zip = (school[' ZIP']);

        const location = await geocodeAddress(`${address},${city},${state},${zip}`);
        if (!location) {
            console.warn(`Geocoding failed for: ${address}, ${city}, ${state},${zip}`);
            continue;
        }
        if (location) {
            L.marker([location.lat, location.lng], {
                icon: L.icon({ iconUrl: 'school.ico', iconSize: [25, 25] }),
                alt: school.Name
            }).addTo(map)
            .bindPopup(`
            <br>School: <strong>${schoolName}</strong><br>
          `);

        }
    }
}

async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?<street,city,state,postalcode>`;


    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
          //  console.error(`Geocoding failed for address "${address}":`, data.status);
            return null;
        }
    } catch (error) {
        //console.error("Geocoding request failed:", error);
        return null;
    }
}
