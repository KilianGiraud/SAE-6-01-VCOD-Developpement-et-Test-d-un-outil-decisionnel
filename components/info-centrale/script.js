function genererPDF() {
    if (!window.jspdf) {
        console.error("jsPDF n'est pas chargé !");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let x = 20, y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Informations du Projet", x, y);
    y += 10;

    const formElements = document.querySelectorAll("#infoForm input");
    const rows = [];

    formElements.forEach((input) => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const value = input.value.trim();
        if (label && value) {
            rows.push([label.textContent, value]);
        }
    });

    // Génération du tableau
    doc.autoTable({
        head: [["Champ", "Valeur"]],
        body: rows,
        startY: y,
        theme: "grid", // "grid", "striped", "plain"
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [200,40,50] }, // Couleur d'en-tête
    });

    // Nom du fichier PDF
    const nomClient = document.getElementById("nom_client").value.trim();
    const nomFichier = nomClient ? `informations_projet_${nomClient}.pdf` : "informations_projet.pdf";

    doc.save(nomFichier);
}
