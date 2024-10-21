var map = L.map('map').setView([39.983334, -82.983330], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var baseMaps = {
    "Street View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "Satellite View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
};
L.control.layers(baseMaps).addTo(map);

L.marker([39.983334, -82.983330]).addTo(map)
  .bindPopup('Bennett Made A Popup!')
  .openPopup();