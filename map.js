function initializeMap() {
    const map = L.map('map').setView([39.9612, -82.9988], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

window.onload = initializeMap;