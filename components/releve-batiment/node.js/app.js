const axios = require('axios');

// URL de l'API
const apiUrl = 'https://databox.chavaroche-si.fr/openproject/api/v3/projects/54/queries';

// Fonction pour appeler l'API
async function callApi() {
    try {
        const response = await axios.get(apiUrl);
        console.log('Données reçues de l\'API:', response.data);
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API:', error);
    }
}

// Appeler la fonction
callApi();
