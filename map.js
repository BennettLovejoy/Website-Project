// Declare map variable in the global scope
let map;

function initializeMap() {
    console.log("Initializing map");
    map = L.map('map').setView([39.9612, -82.9988], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    console.log("Map initialized");

    // Move CSV parsing here, after map is initialized
    parseCSV();
}

function addSchoolMarkers(data) {
    console.log("Adding markers. Data length:", data.length);
    var bounds = L.latLngBounds();
    
    data.forEach(function(school) {
        var lat = parseFloat(school.Latitude);
        var lng = parseFloat(school.Longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            var marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(school.Name);
            bounds.extend([lat, lng]);
            console.log("Marker added:", school.Name, lat, lng);
        } else {
            console.log("Invalid coordinates for:", school.Name);
        }
    });
    
    // Adjust map view to fit all markers
    map.fitBounds(bounds);
    console.log("Map bounds adjusted");
}

function parseCSV() {
    console.log("Starting to parse CSV");
    Papa.parse("data/schools.csv", {
        download: true,
        header: true,
        complete: function(results) {
            console.log("CSV parsing complete. Rows:", results.data.length);
            addSchoolMarkers(results.data);
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
        }
    });
}

// Wait for the DOM to be fully loaded before initializing the map
document.addEventListener('DOMContentLoaded', initializeMap);

console.log(results.data);

L.marker([39.9612, -82.9988]).addTo(map)
  .bindPopup('Columbus, Ohio');