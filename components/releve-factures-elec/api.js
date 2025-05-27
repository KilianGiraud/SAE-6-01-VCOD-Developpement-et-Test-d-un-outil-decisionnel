async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {
        status.innerText = "Veuillez sélectionner un fichier PDF.";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("https://databox.chavaroche-si.fr/openproject/api/v3/projects/54/attachments", {
            method: "POST",
            headers: {
                "Authorization": "Token 350eda122e468ece5f00b0baa3c1f959cca3637e0c0d059567a4693185da97ac"
            },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            status.innerText = `Fichier envoyé avec succès. ID: ${data.id}`;
        } else {
            status.innerText = `Erreur : ${data.message || "Échec de l'envoi"}`;
        }
    } catch (error) {
        status.innerText = "Erreur de connexion avec l'API.";
        console.error(error);
    }
}