// Simuler des données de la centrale
const centralData = {
    currentPower: 50, // en MW
    totalProduction: 1500, // en MWh
    status: 'En ligne'
};

// Mettre à jour les éléments HTML avec les données de la centrale
document.getElementById('current-power').textContent = `${centralData.currentPower} MW`;
document.getElementById('total-production').textContent = `${centralData.totalProduction} MWh`;
document.getElementById('status').textContent = centralData.status;

// Fonction pour mettre à jour les données périodiquement
function updateData() {
    // Simuler une mise à jour des données
    centralData.currentPower = Math.floor(Math.random() * 100);
    centralData.totalProduction += Math.floor(Math.random() * 10);
    centralData.status = centralData.currentPower > 0 ? 'En ligne' : 'Hors ligne';

    // Mettre à jour les éléments HTML avec les nouvelles données
    document.getElementById('current-power').textContent = `${centralData.currentPower} MW`;
    document.getElementById('total-production').textContent = `${centralData.totalProduction} MWh`;
    document.getElementById('status').textContent = centralData.status;
}

// Mettre à jour les données toutes les 5 secondes
setInterval(updateData, 500000);
