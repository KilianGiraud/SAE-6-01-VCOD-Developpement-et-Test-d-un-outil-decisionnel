# 📌 Projet : Historique des Chantiers

## 📖 Description  
Le projet **Historique des Chantiers** est une application web permettant de gérer et de suivre les chantiers de différentes équipes sur une base hebdomadaire. Il affiche un tableau interactif où les tâches sont attribuées aux équipes pour chaque jour de la semaine. L'interface permet également d'ajouter, modifier et supprimer des chantiers de manière dynamique.

---

## 🛠️ Technologies utilisées  
- **HTML** : Structure de la page et des tableaux  
- **CSS** : Mise en page et stylisation (design responsive)  
- **JavaScript** : Dynamisation du contenu (sélection des dates, récupération des tâches, interactions utilisateur)  
- **API OpenProject** : Récupération des tâches de chantier depuis un projet OpenProject  

---

## 📌 Fonctionnalités principales  
✅ Sélection de l'année et de la semaine pour afficher l'historique des chantiers  
✅ Sélection d'une date spécifique via un **date picker**  
✅ Affichage des chantiers par équipe et par jour de la semaine  
✅ Ajout, modification et suppression des chantiers via une interface utilisateur  
✅ Récupération des tâches depuis **OpenProject API** pour les afficher automatiquement dans le calendrier  
✅ Interface responsive et design épuré  

---

## 📁 Structure du projet  
```
/historique-chantiers
│── index.html          # Page principale contenant le tableau et les formulaires  
│── component.css       # Feuille de style CSS pour la mise en page et le design  
│── component-header.js # Fichier JS pour gérer les interactions et l'API OpenProject  
```

---

## 🚀 Installation et utilisation  

### 1️⃣ Cloner le projet  
```sh
git clone https://github.com/votre-repo/historique-chantiers.git
cd historique-chantiers
```

### 2️⃣ Ouvrir le fichier **index.html** dans un navigateur  
Aucune installation supplémentaire n'est requise pour afficher la page.

---

## 🔧 Personnalisation  

### Modifier l'URL de l'API OpenProject  
Dans `component-header.js`, vous pouvez modifier l'URL et la clé d'API si vous utilisez un autre projet OpenProject :  

```js
const url = "https://databox.chavaroche-si.fr/openproject/api/v3/projects/54/queries/188/results";
const apiKey = "VOTRE_CLE_API_ICI";
```

---

## 🏗️ Améliorations futures  
🔹 Ajout d’un système d’authentification des utilisateurs  
🔹 Attribution dynamique des équipes aux chantiers via OpenProject  
🔹 Exportation des données sous format PDF ou Excel  
---

## ✉️ Contact  
📧 **Illyès MAOUDA**  
🔗 [Mon Gitlab](https://gitlab.com/illyoussa)