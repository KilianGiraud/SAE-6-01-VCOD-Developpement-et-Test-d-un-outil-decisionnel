# Composant principale 
*Réalisé par Kilian Giraud*

## Principe du composant

Il s'agit du composant **principal** et comme son nom l'indique, c'est celui qui va référencer tout les outils développés par les collègues de **BUT 3A VCOD**.

## Fonctionnement du site

Il y a différents boutons, les boutons en haut à gauche permettent d'accéder aux différents types de composants, il y a les **cartes**, les **formulaires** et les **calendrier**. Le bouton en haut à droite est une image, il permet de retourner à la **page d'accueil**.

Lorsque vous êtes sur une partie du site *(par exemple : Formulaires)*, vous aurez accès aux différents composants via des **onglets** disposés en bas de la page en bleu, une fois l'onglet sélectionné, le composant web associé apparaît et est apte à être utilisé.

## Arborescence du site

Le dossier principal est celui nommé **composant-princpal**, ici vous y trouverez le fichier **index.html**, la base du site web.

Vous trouverez également un sous-dossier **static** et à l'intérieur trois sous-dossiers :
- **css** : Contient le fichier **styles.css**
- **img** : Contient des images de références donc celle de l'icône du bouton **Home**
- **js** : Contient le fichier **main-script.js**

Vous trouverez également les composants web dans le sous-dossier **components**.

## Technologies utilisées

La page web a été réalisée en **HTML** sur le fichier **index.html** et les composants web ont été inclus via des balises *iframe*.

Le design de la page a été fait en **CSS** sur le fichier disponible dans **static/css/styles.css**.

Toutes les actions comme les changements de page, implémentation des bons composants web ou autres ont été fait en **JavaScript** sur le fichier disponible dans **static/js/main-script.js**

## Composants Web

Les composants Web sont intégrés comme dit précédemment grâce au **main-script.js** via l'utilisation de la balise *iframe* qui entre dynamiquement le bon chemin vers le bon composants Web dans le sous-dossier **components** *(cf. Arborescence du site*)