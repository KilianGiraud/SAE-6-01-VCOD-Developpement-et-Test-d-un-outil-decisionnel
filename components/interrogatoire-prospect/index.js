document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour enregistrer le PDF
    function enregister() {
        print();
    }

    // Link la fonction 'enregistrer' au click du bouton
    document.getElementById("enregPdfButton").addEventListener("click", enregister);
});
