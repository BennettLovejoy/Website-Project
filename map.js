// DON'T FUCKING TOUCH THIS !!!
var map = L.map('map').setView([39.983334, -82.983330], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var baseMaps = {
    "Street View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "Satellite View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
};
L.control.layers(baseMaps).addTo(map);


// Experimenting With Code to Add Data
L.marker([39.983334, -82.983330]).addTo(map)
  .bindPopup('Bennett Made A Popup!')
  .openPopup();


// Trying My Hand
function plotSchools(csvFile) {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;

            data.forEach(function(school) {
                if (school["Street Address"]) {
                    // Using a geocoding service to convert the address into latitude and longitude
                    geocodeAddress(school["Street Address"], function(lat, lon) {
                        if (lat && lon) {
                            // Create a marker for each school once coordinates are found
                            L.marker([lat, lon])
                            .addTo(map)
                            .bindPopup(`<b>${school["School Name"]}</b>`);
                        } else {
                            console.warn(`Could not geocode address for schoool: ${school["School Name"]}`);
                        }
                    });
                } else {
                    console.warn(`No street address for school: ${school["School Name"]}`);
                }
            });
        }
    });
}

function geocodeAddress(address, callback) {
    // Example using a placeholder for a geocoding API 
    const encodedAddress = encodeURIcomponent(address);
    const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&countrycode=us&bounds=-84.99023,38.44498,-80.28809,42.56926&key=a12188e143a347a0908ecc2f02b0732a1`;

    fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            callback(lat, lng);
        } else {
            console.error('No results found for address: ', address);
            callback(null, null);
        }
    })
    .catch(error => {
        console.error('Error geocoding address:', error);
        callback(null, null);
    });
}
plotSchools('data/school-data/ohioschools.csv');
