
// DON'T TOUCH THIS !!!
var map = L.map('map').setView([39.983334, -82.983330], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var baseMaps = {
    "Street View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "Satellite View": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
};
L.control.layers(baseMaps).addTo(map);


// Test marker
L.marker([39.983334, -82.983330], 
    {alt: 'First'}).addTo(map) // "First" is the accessible name of this marker
    .bindPopup('Bennett Learning About Popups!')
    .openPopup(); 

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
    header: true,
    skipEmptyLines: true,
    encoding: "UTF-8", // Try specifying encoding
    delimiter: ",", // Explicitly set delimiter
    complete: function(results) {
        console.log("Parsed CSV Data Length:", results.data.length); // Add this to see what's being parsed
        console.log("First Row:", results.errors);
        if (results.data.length > 0) {
            loadSchools(results.data);
        } else {
            console.error("No data parsed from CSV")
        }
    },
    error: function(error) {
        console.error("Papa Parse Error:", error); // Add error logging
    }
});

// Load and geocode each school, then plot on map
async function loadSchools(data){
    for (let school of data) {
        const address = `${school.Address}, ${school.City}, ${school.State} ${school.ZIP}`;
        const location = await geocodeAddress(address);
        if (location) {
            L.marker([location.lat, location.lng], {alt: school.Name})
            .addTo(map)
            .bindPopup(`
                <strong>${school.Name}</strong><br>
                ${school.Address}, ${school.City}, ${school.State} ${school.ZIP}</br>
                Students: ${school.Students}, Teachers: ${school.Teachers}</br>
                Student-to-Teacher Ratio: ${school.Ratio}<br>
                Free Lunch: ${school.Free}, Reduced: ${school.Reduced}
                `);
        }
    }
}

async function geocodeAddress(Address) {
    const apiKey = 'AIzaSyAQFIkUkEXhX4oPYf1-ezT7dnCbr8nHaog';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(Address)}&key=${apiKey}`;
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

