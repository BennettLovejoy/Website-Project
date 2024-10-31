
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
        const reducedLunch = Number(school.Free) || 0;
        const freeLunch = Number(school.Reduced) || 0;
        const address = `${school[' Address'] || school[' Address '] || ''}`.trim();
        const city = `${school[' City'] || school[' City '] || ''}`.trim();
        const state = `${school['State'] || school[' State '] || 'OH'}`.trim();
        const zip = `${school['ZIP'] ||  school[' ZIP'] || ''}`.trim();        
        const location = await geocodeAddress(`${address}, ${city}, ${state} ${zip}`);
        if (location) {
            L.marker([location.lat, location.lng], {alt: school.Name})
            .addTo(map)
            .bindPopup(`
            <br><strong>School Name: ${school.schoolName}</strong></br>
            <br>Address: ${schoolName}, ${address}, ${city}, ${state} ${zip}</br>
            <br>Students: ${students || "N/A"}</br>
            <br>Teachers: ${teachers || "N/A"}</br>
            <br>Student-to-Teacher Ratio: ${ratio || "N/A"}</br>
            <br>Number of Students Receiving Free School Lunch: ${freeLunch || "N/A"}</br>
            <br>Number of Students Receiving Reduced Price School Lunch: ${reducedLunch || "N/A"}</br>
            `);

        }
    }
}

async function geocodeAddress(address) {
    const apiKey = 'MY_API_KEY';
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
