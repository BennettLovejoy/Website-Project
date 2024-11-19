// markers.js
async function loadSchools(data) {
    const imageData= {}; // Dictionary to store school image paths

    // Fetch image path data from CSV
    await fetch('school_image_paths.csv')
    .then(response => response.text())
    .then(csvText => {
        const parsedData = Papa.parse(csvText, { header: true}).data;
        parsedData.forEach(entry => {
            imageData[entry['School Name']] = entry['Image Path'];
        });
    });

    const schoolMarkers = L.layerGroup('').addTo(map);

    for (const school of data) {
        if (!school || !school['School Name']) {
            console.warn('Invalid school data encountered');
            continue;
        }

        try {
            const location = await geocodingService.queueGeocode(school);
            if (location) {
                const imgPath = imageData[school['School Name']] ||'default_image.png';
                const popupContent = `
            <div>
                <h3>${school['School Name']}</h3>    
                <img src="${imgPath}" alt="${school['School Name']}" style="width:100%; max-width:300px;"/>
            </div>
            `;
            const marker = L.marker(location).bindPopup(popupContent);
            schoolMarkers.addLayer(marker);
            }
        } catch (error) {
            console.error(`Error processing school ${school['School Name']}:`, error);
        }
    }
}
      
function createSchoolMarker(school, location) {
    const images = school['Images'];
    let slideshowHTML = '';
    if (images && images.length > 0) {
        slideshowHTML += `<div class="slideshow-container">`;
        images.forEach((image, index) => {
            slideshowHTML += `
                <div class="mySlides" style="display: ${index === 0 ? 'block' : 'none'};">
                    <img src="${image}" style="width:100%">
                </div>
            `;
        });
        slideshowHTML += `
            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
        </div>`;
    } else {
        slideshowHTML = '<p>No images available for this school.</p>';
    }

    return L.marker([location.lat, location.lng], {
        icon: L.icon({
            iconUrl: 'school (1).png',
            iconSize: [25, 25]
        }),
        alt: school['School Name']
    }).bindPopup(`
        <div class="school-popup">
            <h1>${school['School Name']}</h1>
            <h4>${school['Street Address']}, ${school['City']}, ${school['State']} ${school['ZIP']}</h4>
            ${slideshowHTML}
            <br><strong>Lowest Grade:</strong> ${school['Low Grade*']}
            <br><strong>Highest Grade:</strong> ${school['High Grade*']}
            <br><strong>Number of Students:</strong> ${school['Students*']}
            <br><strong>Number of Teachers:</strong> ${school['Teachers*']}
            <br><strong>Student to Teacher Ratio:</strong> ${school['Student Teacher Ratio*']}
            <br><strong>Expenditures Per Equivalent Pupil:</strong> ${school['Expenditures per Equivalent Pupil']}
        </div>
    `);
}
