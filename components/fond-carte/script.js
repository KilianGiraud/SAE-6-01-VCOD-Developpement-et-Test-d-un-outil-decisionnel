// Initialisation de la carte
const map = L.map('map').setView([48.8588443, 2.2943506], 13);

// Fond OpenStreetMap 
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Données © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
});

// Photographies aériennes IGN
const OrthoIGN = L.tileLayer('https://data.geopf.fr/wmts?' +
    '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
    '&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg' +
    '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}');

// Ajouter OpenStreetMap par défaut
osmLayer.addTo(map);

// Gestion du basculement des couches
let isPlanVisible = true; 

document.getElementById('toggle-btn').addEventListener('click', function() {

    if (isPlanVisible) {
        map.removeLayer(osmLayer);
        map.addLayer(OrthoIGN);
        document.getElementById('toggle-btn').src = 'icon/pl.png'; 
    } else {
        map.removeLayer(OrthoIGN);
        map.addLayer(osmLayer);
        document.getElementById('toggle-btn').src = 'icon/sa.png';
    }
    isPlanVisible = !isPlanVisible;
});

// Un marqueur d'exemple, j'ai Tour Eiffel
L.marker([48.8588443, 2.2943506]).addTo(map)
    .bindPopup("<b>Tour Eiffel</b><br>Point d'intérêt.")
    .openPopup();