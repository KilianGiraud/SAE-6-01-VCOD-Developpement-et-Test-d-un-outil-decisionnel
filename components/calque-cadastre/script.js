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



//test

let cadastreGeoJSONLayer = null;

// Cette fonction récupère le code INSEE depuis une position (lat,lng)
async function obtenirCodeInseeDepuisCoords(lat, lon) {
    const response = await fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=code&format=json`);
    if (!response.ok) throw new Error('Erreur API GEO');
    const communes = await response.json();
    return communes[0]?.code;
}

// Charge les parcelles depuis le code INSEE
async function chargerParcellesCadastre(code_insee) {
    const url = `https://apicarto.ign.fr/api/cadastre/parcelle?code_insee=${code_insee}&_limit=10000`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const parcelles = await response.json();
        if (cadastreGeoJSONLayer) map.removeLayer(cadastreGeoJSONLayer);

        function getRandomColor() {
            const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        cadastreGeoJSONLayer = L.geoJSON(parcelles, {
            style: function(feature) {
                return {
                    color: getRandomColor(), // Couleur aléatoire parmi la liste
                    weight: 2, 
                    fillOpacity: 0.15
                };
            },
            onEachFeature: function(feature, layer) {
                const props = feature.properties;
                layer.bindPopup(`Parcelle : ${props.numero}<br>Section : ${props.section}`);
            }
        }).addTo(map);

        map.fitBounds(cadastreGeoJSONLayer.getBounds());

    } catch (error) {
        console.error('Erreur lors de la récupération des parcelles : ', error);
    }
}

// Gestionnaire de la case à cocher
document.getElementById('cadastreCheckbox').addEventListener('change', function(e) {
    if (e.target.checked) {
        map.on('click', onMapClickForCadastre);
        alert('Clique sur la carte pour afficher les parcelles cadastrales.');
    } else {
        if (cadastreGeoJSONLayer) map.removeLayer(cadastreGeoJSONLayer);
        map.off('click', onMapClickForCadastre);
    }
});

// Fonction déclenchée lors du clic sur la carte
async function onMapClickForCadastre(e) {
    const { lat, lng } = e.latlng;
    try {
        const code_insee = await obtenirCodeInseeDepuisCoordonnees(lat, lng);
        if (code_insee) {
            chargerParcellesCadastre(code_insee);
        } else {
            alert('Aucune commune trouvée à cet endroit.');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// Fonction pour obtenir le code INSEE d'un point précis (via API du gouvernement)
async function obtenirCodeInseeDepuisCoordonnees(lat, lon) {
    const response = await fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=code`);
    const data = await response.json();
    return data.length > 0 ? data[0].code : null;
}
