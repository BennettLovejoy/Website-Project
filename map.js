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
    header: true,
    skipEmptyLines: true,
    encoding: "UTF-8",
    delimiter: ",",
    complete: function(results) {
        console.log("Parsed CSV Data Length:", results.data.length);
        console.log("First Row:", results.data[0]);
        console.log("Parsing Errors:", results.errors);
        
        if (results.data.length > 0) {
            loadSchools(results.data);
        } else {
            console.error("No data parsed from CSV")
        }
    },
    error: function(error) {
        console.error("Papa Parse Error:", error);
    }
});

function getSchoolIcon(studentsCount) {
    let color;

    if (studentsCount >= 301) {
        color = 'red';
        iconSize = [25, 41];
    } else if (studentsCount <= 300) {
        color = 'green';
        iconSize = [20, 36];
    } else {
        color = 'blue';
        izonSize = [15, 31];
    }

    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}





// Load and geocode each school, then plot on map
async function loadSchools(data){
    console.log("Data passed to loadSchools:", data);
    for (let school of data) {
        if (!school) {
            console.warn("Encoutered null or undefined row in CSV data.");
            continue;
        }
        const students = Number(school.Students) || 0;
        const teachers = Number(school.Teachers) || 0;
        const ratio = parseFloat(school.Ratio) || 0;
        const schoolName = `${school[' Name']}` || 0;
        const reducedLunch = `${school[' Reduced '] || 0}`.trim();
        const freeLunch =  `${school[' Free '] || 0}`.trim();
        const address = `${school[' Address'] || school[' Address '] || ''}`.trim();
        const city = `${school[' City'] || school[' City '] || ''}`.trim();
        const state = `${school[' State'] || school[' State '] || 'OH'}`.trim();
        const zip = `${school[' ZIP'] ||  school[' ZIP'] || ''}`.trim();        

        const location = await geocodeAddress(`${address}, ${city}, ${state} ${zip}`);
        if (location) {
            const icon = getSchoolIcon(school.Students);
            L.marker([location.lat, location.lng], {
                icon: schoolIcon,
                alt: school.Name
            }).addTo(map)
            .bindPopup(`
            <br>School: <strong>${schoolName}</strong></br>
            <br>Address: <strong>${address}, ${city}, ${state} ${zip}</strong></br>
            <br>Students: <strong>${students || "N/A"}</strong></br>
            <br>Teachers: <strong>${teachers || "N/A"}</strong></br>
            <br>Student-to-teacher ratio: <strong>${ratio || "N/A"}</strong></br>
            <br>Students receiving free school lunch: <strong>${freeLunch ||"N/A"}</strong></br>
            <br>Students receiving reduced price school lunch: <strong>${reducedLunch || "N/A"}</strong></br>
            `);

        }
    }
}

async function geocodeAddress(address) {
    const apiKey = 'AIzaSyAQFIkUkEXhX4oPYf1-ezT7dnCbr8nHaog';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            console.error(`Geocoding failed for address "${Address}":`, data.status);
            return null;
        }
    } catch (error) {
        console.error("Geocoding request failed:", error);
        return null;
    }
}

