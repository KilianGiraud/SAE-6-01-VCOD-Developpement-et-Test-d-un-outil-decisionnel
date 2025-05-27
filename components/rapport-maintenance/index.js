document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Script index.js chargé avec succès !");

    /* =========================
       GESTION DES TABLES DYNAMIQUES (Ajout & Suppression) POUR L'HISTORIQUE
    ========================== */
    const tableBody = document.querySelector("#historique-table tbody");
    const addRowBtn = document.getElementById("add-row");
    const removeRowBtn = document.getElementById("remove-row"); // Nouveau bouton de suppression

    if (tableBody && addRowBtn && removeRowBtn) {
        function addRow() {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="number" class="annee" placeholder="Année" min="2000" max="2100" required></td>
                <td><input type="number" class="releve-index" placeholder="Relevé index" min="0" step="0.1" required></td>
                <td><input type="number" class="prod-reelle" placeholder="Production réelle (kWh)" min="0" step="0.1" required></td>
                <td><input type="number" class="prod-theorique" placeholder="Production théorique (kWh)" min="0" step="0.1" required></td>
            `;
            tableBody.appendChild(newRow);
            updateRemoveButtonState();
        }

        function removeRow() {
            if (tableBody.rows.length > 1) {
                tableBody.deleteRow(tableBody.rows.length - 1);
            }
            updateRemoveButtonState();
        }

        function updateRemoveButtonState() {
            removeRowBtn.disabled = tableBody.rows.length <= 1;
        }

        addRowBtn.addEventListener("click", addRow);
        removeRowBtn.addEventListener("click", removeRow);

        // Mise à jour initiale de l'état du bouton de suppression
        updateRemoveButtonState();
    }

    /* =========================
        GESTION DU CHARGEMENT D’IMAGE
    ========================== */
    function handleImageUpload(inputId, imgId) {
        const input = document.getElementById(inputId);
        const img = document.getElementById(imgId);
        const removeBtn = document.querySelector(`.remove-photo[data-target="${inputId}"]`);
    
        if (input && img && removeBtn) {
            input.addEventListener("change", function (event) {
                const file = event.target.files[0];
    
                if (file) {
                    // Vérifier la taille du fichier (5 Mo max)
                    if (file.size > 5 * 1024 * 1024) {
                        alert("L’image est trop lourde ! Veuillez choisir une image de moins de 5 Mo.");
                        input.value = ""; // Réinitialise l’input
                        return;
                    }
    
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        img.src = e.target.result;
                        removeBtn.style.display = "block"; // Affiche le bouton de suppression
                    };
                    reader.readAsDataURL(file);
                }
            });
    
            removeBtn.addEventListener("click", function () {
                img.src = inputId === "local-technique" ? "local_technique.jpg" : "toiture.jpg"; // Remet l'image par défaut
                input.value = ""; // Réinitialise l’input file
                removeBtn.style.display = "none"; // Cache le bouton de suppression
            });
    
            // Cache le bouton de suppression si aucune image n'est chargée
            removeBtn.style.display = "none";
        }
    }
    
    // Appliquer la fonction aux images
    handleImageUpload("local-technique", "preview-local-technique");
    handleImageUpload("toiture", "preview-toiture");
    

    handleImageUpload("local-technique", "preview-local-technique");
    handleImageUpload("toiture", "preview-toiture");

    /* =========================
        AJOUT & SUPPRESSION DE LIGNES DANS "VÉRIFICATION DES TENSIONS"
    ========================== */
    const tableVerif = document.querySelector("#table-verification tbody");
    const addLineBtn = document.getElementById("ajouter-ligne");
    const removeLineBtn = document.getElementById("supprimer-ligne");

    if (tableVerif && addLineBtn && removeLineBtn) {
        function addVerificationRow() {
            let rowCount = tableVerif.rows.length + 1;

            let newRow = tableVerif.insertRow();
            newRow.innerHTML = `
                <td><input type="text" class="modele" placeholder="Modèle"></td>
                <td><input type="number" class="puissance" placeholder="Puissance (kW)" min="0" step="0.1"></td>
                <td class="mppt-number">${rowCount}</td>
                <td><input type="number" class="mppt-valeur" placeholder="Valeur (V)" min="0" step="0.1"></td>
            `;

            removeLineBtn.disabled = tableVerif.rows.length <= 1;
        }

        function removeVerificationRow() {
            if (tableVerif.rows.length > 1) {
                tableVerif.deleteRow(tableVerif.rows.length - 1);
            }

            removeLineBtn.disabled = tableVerif.rows.length <= 1;
        }

        addLineBtn.addEventListener("click", addVerificationRow);
        removeLineBtn.addEventListener("click", removeVerificationRow);
    }

    /* =========================
        GESTION DES COULEURS DES SELECTEURS
    ========================== */
    const selectElements = document.getElementsByClassName('selecteur-colore');

    for (let i = 0; i < selectElements.length; i++) {
        let selected = selectElements[i];

        selected.addEventListener('change', function () {
            selected.className = 'selecteur-colore'; 
            const selectedOption = selected.options[selected.selectedIndex];
            selected.classList.add(selectedOption.className);
        });

        const initialOption = selected.options[selected.selectedIndex];
        selected.classList.add(initialOption.className);
    }









    /* =========================
    ✍️ GESTION DE LA SIGNATURE ÉLECTRONIQUE
    ========================== */
    const canvas = document.getElementById("signature-pad");
    const clearBtn = document.getElementById("clear-signature");
    const ctx = canvas.getContext("2d");

    let drawing = false;

    function startDrawing(event) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    function draw(event) {
        if (!drawing) return;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }

    function stopDrawing() {
        drawing = false;
        ctx.closePath();
    }

    function clearSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    clearBtn.addEventListener("click", clearSignature);









    /* =========================
       GESTION DU BOUTON "IMPRIMER LE RAPPORT"
    ========================== */
    const printButton = document.getElementById("submitButton");

    if (printButton) {
        printButton.addEventListener("click", function (event) {
            event.preventDefault();
            setTimeout(() => {
                window.print();
            }, 500);
        });
    }

    /* =========================
        GESTION DU BOUTON "RÉINITIALISER LE FORMULAIRE"
    ========================== */
    const resetButton = document.getElementById("resetButton");

    if (resetButton) {
        resetButton.addEventListener("click", function (event) {
            if (!confirm("Êtes-vous sûr de vouloir réinitialiser le formulaire ?")) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            localStorage.clear();
            document.getElementById("maintenance-form").reset();

            document.getElementById("preview-local-technique").src = "local_technique.jpg"; 
            document.getElementById("preview-toiture").src = "toiture.jpg";

            document.getElementById("local-technique").value = "";
            document.getElementById("toiture").value = "";

            alert("Le formulaire a été réinitialisé avec succès !");
        });
    }
});




