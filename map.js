
// DON'T FUCKING TOUCH THIS !!!
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

function loadCSV(file){
    console.log("Starting CSV load from:", file);
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header:true,
            download: true,
            complete: function(results) {
                console.log("CSV successfully loaded. First row:", results.data[0]);
                console.log("Total rows:", results.data.length);
                resolve(results.data);
            },
            error: function(error) {
                console.error("CSV loading error:", error);
                reject(error);
            }
        });
    });

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


 // Plot school data on the map
async function plotSchoolData(file) {
    try {
        console.log("Starting to load CSV from", file);
        const schoolData = await loadCSV(file);

        // Debug: Log the first row of data
        console.log("First row of school data:", schoolData[0]);
        // Debug: Log all column names
        console.log("Available Columns:", Object.keys(schoolData[0]));

        for (const school of schoolData){
            // Debug logging
            console.log("Processing school data:", {
                name: school['Name'],
                address: school['Address'],
                city: school ['City'],
                state: school['State'],
                zip: school['ZIP']
            });

            // Check if we have all required fields
            if (!school['Address'] || !school['City'] || !school['State'] ||!school['ZIP']) {
                console.warn("Missing address information for school: ", {
                    address: school['Address'],
                    city: school['City'],
                    state: school['State'],
                    zip: school['ZIP']
                });
                continue;
            }
            
            const address = `${school['Address']}, ${school['City']}, ${school['State']}, ${school['ZIP']}`;
            console.log("Processing address:", address);

            const coords = await geocodeAddress(address);
            console.log("Received coordinates:", coords);

            if (coords) {
                console.log("Adding marker at:", coords.lat, coords.lng);
                L.marker([coords.lat, coords.lng])
                    .addTo(map)
                    .bindPopup(`<strong>${school['Name']}</strong><br>${address}`);
            }
        }

    } catch (error) {
        console.error("Error in plotting school data:", error);
        console.error("Error details:", error.message);
    }
}

// Update the CSV file path as needed for your setup
plotSchoolData('/data/school-data/ohioschools.csv');


