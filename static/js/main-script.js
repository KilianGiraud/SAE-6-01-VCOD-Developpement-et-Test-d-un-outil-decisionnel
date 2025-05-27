//By Kilian Giraud

// Fonction pour changer d'onglet et charger le bon composant dans l'iframe
function changeTab(evt, moduleName) {
    // Supprime la classe 'active' de tous les onglets
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    // Ajoute la classe 'active' à l'onglet sélectionné
    evt.currentTarget.classList.add('active');
    
    // Sélectionne l'iframe et met à jour le src pour charger le bon fichier index.html
    const iframe = document.getElementById('component-frame');
    if (!iframe) return;
    
    // Détermine le chemin du fichier index.html correspondant au module sélectionné
    const componentPath = `/components/${moduleName}/index.html`;
    iframe.src = componentPath;
}

// Fonction pour afficher les bons onglets en fonction de la catégorie sélectionnée
function changeView(viewType) {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const contentContainer = document.getElementById('content-container');
    if (!tabsContainer || !contentContainer) return;
  
    // Réinitialisation des onglets et du contenu
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '<iframe id="component-frame" src="" frameborder="0"></iframe>';
    document.getElementById('home-content').style.display = 'none';
    tabsContainer.style.display = 'flex';
    contentContainer.style.display = 'flex';
  
    let components = {}; // Objet contenant les noms des onglets et les chemins des composants Web
  
    if (viewType === 'cartes') {
        components = {
            'trajet-retour': 'Calcul du trajet',
            'proximite-centrale': 'Centrales à proximité',
            'reseaux-enedis': 'Réseaux ENEDIS',
            'fond-carte': 'Fond de carte',
            'info-climat': 'Informations climat',
            'calque-cadastre': 'Calque de cadastre'
        };
    } else if (viewType === 'formulaires') {
        components = {
            'cahier-charges': 'Cahier des charges',
            'nouveauclient-form': 'Nouveau client',
            'projet-form': 'Création de projet',
            'collaborateur-form': 'Collaborateur',
            'deviseur-form': 'Deviseur',
            'interrogatoire-prospect': 'Interrogatoire prospect',
            'rapport-maintenance': 'Rapport de maintenance',
            'releve-batiment': 'Relevé de bâtiment existant',
            'releve-factures-elec': 'Relevé facture électricité',
            'info-centrale': 'Informations centrales photovoltaïques'
        };
    } else if (viewType === 'calendrier') {
        components = {
            'aggregateur-calendrier': 'Agrégateur de calendrier',
            'historique-chantiers': 'Historique des chantiers'
        };
    }
  
    // Génération dynamique des boutons d'onglets
    for (let key in components) {
        tabsContainer.innerHTML += `<button class="tab" data-module="${key}">${components[key]}</button>`;
    }
  
    // Ajout d'un écouteur d'événements aux onglets pour permettre le changement de contenu
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function(event) {
            changeTab(event, this.getAttribute('data-module'));
        });
    });
    
    // Afficher le premier onglet par défaut
    const firstTab = document.querySelector('.tab');
    if (firstTab) {
        firstTab.click();
    }
}
    
// Fonction pour revenir à la page d'accueil
function goHome() {
    window.location.href = '/';
}
