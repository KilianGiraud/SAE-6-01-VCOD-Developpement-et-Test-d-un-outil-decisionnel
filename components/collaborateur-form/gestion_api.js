document.getElementById("collaborator-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Vérification du format pour le numéro de téléphone
    const phoneInput = document.getElementById("phone");
    const phonePattern = /^\+33[1-9][0-9]{8}$/;
    
    if (!phonePattern.test(phoneInput.value)) {
        alert("Veuillez renseigner un numéro de téléphone valide au format +33xxxxxxxxx");
        phoneInput.focus();
        return;
    }
    
    const formData = new FormData(this);
    let content = "";
    
    formData.forEach((value, key) => {
        content += `${key}: ${value}\n`;
    });
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.text("Informations Collaborateur", 10, 10);
    doc.setFontSize(10);
    doc.text(content, 10, 20);
    
    // Génération du PDF en veillant à reprendre le nom et le prénom du collaborateur
    const nom = formData.get('nom');
    const prenom = formData.get('prenom');
    const fileName = `${nom}_${prenom}_informations.pdf`;
    doc.save(fileName);
    
    // Récupération de la clé API depuis un champ input
    const apiKey = document.getElementById("api-key").value;
    
    if (!apiKey) {
        alert("Veuillez renseigner une clé API");
        return;
    }
    
    // Envoi des données vers l'API
    fetch("https://databox.chavaroche-si.fr/openproject/api/v3/projects/54/queries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        console.log("Données envoyées avec succès:", data);
        alert("Les données ont été enregistrées avec succès !");
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi des données:", error);
        alert("Une erreur est survenue lors de l'enregistrement.");
    });
});
