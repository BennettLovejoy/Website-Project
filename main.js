// main.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await loadData("data/merged_dataset.csv");
        loadSchools(data);
    } catch (error) {
        console.error("Error loading data:", error);
    }
});

async function loadSchools(data) {
    const schoolMarkers = L.layerGroup().addTo(map);

    for (const school of data) {
        if (!school || !school['School Name']) {
            console.warn('Invalid school data encountered');
            continue;
        }

        try {
            const location = await geocodingService.queueGeocode(school);
            if (location) {
                const marker = createSchoolMarker(school, location);
                schoolMarkers.addLayer(marker);
            }
        } catch (error) {
            console.error(`Error processing school ${school['School Name']}:`, error);
        }
    }
}
