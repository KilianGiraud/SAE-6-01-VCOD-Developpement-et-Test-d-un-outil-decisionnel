Cahier des charges
==================

# Fond de carte + Calque cadastre

## Description
### Amadou
Ce projet met en œuvre une carte interactive utilisant la bibliothèque JavaScript Leaflet. L'application permet d'afficher une carte centrée sur la Tour Eiffel, avec la possibilité de basculer entre un fond de carte OpenStreetMap et une orthophoto de l'IGN.

### Cyprien
Ce projet permet d'afficher une carte interactive avec la possibilité d'afficher les parcelles cadastrales grâce à l'API IGN Apicarto. L'affichage est contrôlé via une case à cocher permettant d'activer/désactiver les parcelles sur la carte.

L'application est construite en HTML, CSS et JavaScript, et utilise la bibliothèque Leaflet pour la gestion de la carte.

## Fonctionnalités
- Affichage interactif de la carte
- Basculement entre OpenStreetMap et orthophoto IGN
- Marqueur sur la Tour Eiffel avec une info-bulle
- Affichage des parcelles cadastrales via l'API IGN Apicarto (10 000 parcelles d'un seul coup)
- Interaction : clic sur la carte pour charger dynamiquement les parcelles de la commune sélectionnée
- Case à cocher en bas à gauche pour activer/désactiver les parcelles
- Amélioration de la lisibilité avec des couleurs alternées pour les parcelles et un remplissage semi-transparent

## Technologies Utilisées
- HTML – Structure du projet
- CSS – Mise en page et positionnement des éléments
- JavaScript – Gestion de la carte et appel aux API
- Leaflet.js – Affichage et manipulation de la carte
- API IGN Apicarto – Récupération des données cadastrales
- API GeoGouv – Récupération automatique du code INSEE via un clic

## Installation et Execution
1. Clonez le dépôt :
   ```bash
   git clone git@databox.chavaroche-si.fr:chavaroche-si/tech-support/devel/databox/customtools/composants/fonddecarte-carte.git

2. Lancer le projet localement :
Comme c'est un projet purement front-end, il suffit d'ouvrir le fichier index.html dans un navigateur :
   open index.html   # Sur macOS/Linux
   start index.html  # Sur Windows

3. Exécuter avec un serveur local (Optionnel) :
Si certaines ressources nécessitent un serveur local, utilisez Live Server sur VS Code ou un serveur Python :
   python -m http.server 8000
   Puis ouvrez http://localhost:8000/ dans votre navigateur.

## Structure du projet 
/root (Dossier principal)
   index.html → Structure principale de la page
   styles.css → Mise en page et positionnement des éléments
   script.js → Gestion de la carte et des appels API
   README.md → Documentation du projet

## Comment utiliser le projet ?
- Ouvrir la carte dans un navigateur.
- Cocher la case en bas à gauche pour activer l'affichage du cadastre.
- Cliquer sur un point précis de la carte pour récupérer automatiquement les parcelles de la commune.
- Les parcelles s'affichent avec des couleurs alternées et une transparence pour ne pas masquer les noms des rues.
- Décochez la case pour masquer les parcelles cadastrales.

## Références et API utilisées
- Leaflet.js : https://leafletjs.com/ 
- API Cadastre IGN : https://apicarto.ign.fr/api/doc/cadastre
- API Géocodage GeoGouv : https://geo.api.gouv.fr
