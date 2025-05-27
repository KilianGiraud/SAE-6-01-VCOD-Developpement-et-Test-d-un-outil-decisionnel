/*
Fichier JavaScript pour le projet "Trajet Retours"
*/

let map, depot, depannage, entretiens = [];
let retourRoute, selectedEntretienMarker = null;
let markers = {}; // Stockage des marqueurs d'entretien

// Icônes pour les entretiens
const grayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function squaredDistance(lat1, lng1, lat2, lng2) {
  return (lat2 - lat1) ** 2 + (lng2 - lng1) ** 2;
}

function updateRetourRoute(entretien) {
  // Si le même entretien est déjà sélectionné, on ne fait rien
  if (selectedEntretienMarker && selectedEntretienMarker === entretien.marker) {
    return;
  }
  
  // Si un entretien était déjà sélectionné, on remet son icône en gris et on supprime son tooltip
  if (selectedEntretienMarker) {
    selectedEntretienMarker.setIcon(grayIcon);
    selectedEntretienMarker.unbindTooltip();
  }
  
  // Mettre à jour le marqueur sélectionné : changer l'icône en rouge et ajouter le tooltip
  selectedEntretienMarker = entretien.marker;
  selectedEntretienMarker.setIcon(redIcon);
  selectedEntretienMarker.bindTooltip("Entretien sélectionné", { permanent: true, direction: 'top', offset: [0, -10] }).openTooltip();

  // Mettre à jour le trajet retour
  if (retourRoute) map.removeControl(retourRoute);
  retourRoute = L.Routing.control({
    router: new L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    waypoints: [
      L.latLng(depannage.lat, depannage.lng),
      L.latLng(entretien.lat, entretien.lng),
      L.latLng(depot.lat, depot.lng)
    ],
    lineOptions: { styles: [{ color: 'red', opacity: 0.8, weight: 5 }] },
    createMarker: () => null,
    addWaypoints: false,
    draggableWaypoints: false
  }).addTo(map);
  // Modifier la couleur du contour des détails de l'itinéraire pour le trajet retour
  retourRoute.getContainer().style.border = '2px solid red';
}

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    depot = data.points.find(p => p.name === "Dépôt");
    depannage = data.points.find(p => p.name === "Dépannage");
    entretiens = data.points.filter(p => p.name === "Entretien");

    // Initialisation de la carte centrée sur le dépôt
    map = L.map('map').setView([depot.lat, depot.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

    // Ajout des marqueurs pour le dépôt et le dépannage
    L.circleMarker([depot.lat, depot.lng], { radius: 8, color: 'darkblue', fillOpacity: 1 })
      .addTo(map)
      .bindTooltip("Dépôt", { permanent: true, direction: 'top', offset: [0, -10] });

    L.circleMarker([depannage.lat, depannage.lng], { radius: 8, color: 'darkblue', fillOpacity: 1 })
      .addTo(map)
      .bindTooltip("Dépannage", { permanent: true, direction: 'top', offset: [0, -10] });

    // Déterminer le point d'entretien le plus proche du dépannage
    let closestEntretien = entretiens.reduce((prev, curr) => (
      squaredDistance(depannage.lat, depannage.lng, curr.lat, curr.lng) <
      squaredDistance(depannage.lat, depannage.lng, prev.lat, prev.lng) ? curr : prev
    ), entretiens[0]);

    // Ajout des marqueurs pour les entretiens et stockage dans l'objet markers
    entretiens.forEach((pt, index) => {
      let icon = (pt === closestEntretien) ? redIcon : grayIcon;
      let marker = L.marker([pt.lat, pt.lng], { icon: icon })
        .addTo(map)
        .on('click', () => updateRetourRoute(pt));
      // Si c'est le point initialement sélectionné, ajouter le tooltip
      if (pt === closestEntretien) {
        marker.bindTooltip("Entretien sélectionné", { permanent: true, direction: 'top', offset: [0, -10] });
      }
      markers[index] = marker;
      pt.marker = marker; // Stocker le marqueur dans l'objet entretien pour y accéder dans updateRetourRoute
    });

    // Tracé du trajet Aller (en bleu)
    let allerRoute = L.Routing.control({
      router: new L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      waypoints: [
        L.latLng(depot.lat, depot.lng),
        L.latLng(depannage.lat, depannage.lng)
      ],
      lineOptions: { styles: [{ color: 'blue', opacity: 0.8, weight: 5 }] },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false
    }).addTo(map);
    // Modifier la couleur du contour des détails de l'itinéraire pour le trajet aller
    allerRoute.getContainer().style.border = '2px solid blue';

    // Tracé du trajet Retour avec le point d'entretien le plus proche
    updateRetourRoute(closestEntretien);

    // Légende
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<i style="background: darkblue; width:18px; height:18px; display:inline-block;"></i> Dépôt<br>';
      div.innerHTML += '<i style="background: darkblue; width:18px; height:18px; display:inline-block;"></i> Dépannage<br>';
      div.innerHTML += '<i style="background: red; width:18px; height:18px; display:inline-block;"></i> Entretien sélectionné<br>';
      div.innerHTML += '<hr>';
      div.innerHTML += '<i style="background: blue; width:18px; height:18px; display:inline-block;"></i> Trajet Aller<br>';
      div.innerHTML += '<i style="background: red; width:18px; height:18px; display:inline-block;"></i> Trajet Retour<br>';
      return div;
    };
    legend.addTo(map);
  });
