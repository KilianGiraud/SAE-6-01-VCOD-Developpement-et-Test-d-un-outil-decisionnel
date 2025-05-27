let map;
let markersLayer;
let installationsData = [];

// Initialisation de la carte
function initMap(lat, lon) {
    map = L.map('map').setView([lat, lon], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    markersLayer = L.featureGroup().addTo(map);
}

// Géolocalisation de l'utilisateur au chargement
function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                console.log(`Géolocalisation réussie : ${userLat}, ${userLon}`);
                
                // Centrer la carte sur la position de l'utilisateur
                initMap(userLat, userLon);

                // Ajouter un marqueur pour la position actuelle
                let userMarker = L.marker([userLat, userLon])
                    .bindPopup("Vous êtes ici 📍")
                    .openPopup();

                markersLayer.addLayer(userMarker);
            },
            (error) => {
                console.error("Erreur de géolocalisation :", error);
                alert("Impossible de récupérer votre position, affichage par défaut.");
                
                // Position par défaut en cas d'erreur
                initMap(44.9308, 2.44482);
            }
        );
    } else {
        alert("Géolocalisation non supportée par votre navigateur.");
        initMap(44.9308, 2.44482);
    }
}

// Lancer la géolocalisation dès le chargement
document.addEventListener("DOMContentLoaded", locateUser);

// Chargement des données CSV
function requete(id = null) {
    Papa.parse('bdpv-opendata-installations/BDPV-opendata-installations.csv', {
        download: true,
        header: true,
        delimiter: ";",
        complete: function(results) {
            installationsData = results.data
                .filter(row => row.lat && row.lon)
                .map(row => ({
                    ...row,
                    lat: parseFloat(row.lat.replace(',', '.')),
                    lon: parseFloat(row.lon.replace(',', '.'))
                }));
            console.log(`Données chargées : ${installationsData.length} installations`);
        }
    });
}

// Calcul de la distance entre deux points
function distanceMeasure(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Mise à jour des marqueurs sur la carte
function updateMarkers(centerLat, centerLon, mode, radius, nCentrales) {
    markersLayer.clearLayers();
    let bounds = L.latLngBounds();

    let cityIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    let cityMarker = L.marker([centerLat, centerLon], { icon: cityIcon })
        .bindPopup("Position choisie")
        .openPopup();
    markersLayer.addLayer(cityMarker);
    bounds.extend(cityMarker.getLatLng());

    let filtered = installationsData.map(inst => {
        const distance = distanceMeasure(centerLat, centerLon, inst.lat, inst.lon);
        return { ...inst, distance };
    }).filter(inst => inst.distance <= radius);

    if (mode === "closest") {
        filtered.sort((a, b) => a.distance - b.distance);
        filtered = filtered.slice(0, nCentrales);
    }

    filtered.forEach(inst => {
        let marker = L.marker([inst.lat, inst.lon])
            .bindPopup(`<strong>ID:</strong> ${inst.id}<br>
                        <strong>Puissance:</strong> ${inst.puissance_crete} Wc<br>
                        <strong>Installateur:</strong> ${inst.installateur}<br>
                        <strong>Distance:</strong> ${inst.distance.toFixed(2)} km`);
        markersLayer.addLayer(marker);
        bounds.extend(marker.getLatLng());
    });

    map.fitBounds(bounds, { padding: [30, 30] });

    if (filtered.length === 0) {
        alert("Aucune centrale trouvée pour ces paramètres.");
    }
}

// Géocodage de la ville avec OpenStreetMap
function geocodeCity(cityName, callback) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                callback(lat, lon);
            } else {
                alert("Ville non trouvée.");
            }
        })
        .catch(err => {
            console.error("Erreur lors du géocodage :", err);
            alert("Erreur lors du géocodage.");
        });
}

// Fonction d'enregistrement des données (ajoutée pour respecter la structure)
function enregister(imprimer = false) {
    console.log("Enregistrement des données...");
    if (imprimer) {
        console.log("Impression des données...");
    }
}

// Gestionnaire d'événement pour le bouton de mise à jour
document.getElementById('updateBtn').addEventListener('click', function() {
    const city = document.getElementById('city').value.trim();
    let radius = parseFloat(document.getElementById('radius').value);
    let nCentrales = parseInt(document.getElementById('nCentrales').value, 10);
    let mode = document.getElementById('mode').value;

    if (!city) {
        alert("Veuillez entrer une ville.");
        return;
    }
    if (isNaN(radius) || radius <= 0) {
        alert("Veuillez entrer un périmètre valide.");
        return;
    }
    if (isNaN(nCentrales) || nCentrales < 1) {
        alert("Veuillez entrer un nombre de centrales valide.");
        return;
    }

    geocodeCity(city, function(lat, lon) {
        updateMarkers(lat, lon, mode, radius, nCentrales);
    });
});

// Initialisation
initMap(44.9308, 2.44482);
requete();
