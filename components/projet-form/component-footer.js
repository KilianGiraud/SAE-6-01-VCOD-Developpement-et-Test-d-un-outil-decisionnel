const select = document.getElementsByClassName('selecteur-colore');

for(let i = 0; i< select.length; i++) {
  // Écouteur d'événement sur le changement de sélection
  let selected = select[i];
  selected.addEventListener('change', function () {
    // Supprimer toutes les classes existantes sur le <select>
    selected.className = '';

    // Ajouter la classe de l'option sélectionnée au <select>
    const selectedOption = selected.options[selected.selectedIndex];
    selected.classList.add(selectedOption.className);
  });

  // Initialiser la classe au chargement de la page
  window.onload = function () {
    const initialOption = selected.options[selected.selectedIndex];
    selected.classList.add(initialOption.className);
  };
}