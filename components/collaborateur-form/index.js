// Attendre que jsPDF soit chargé
if (typeof window.jspdf === 'undefined') {
    console.error('jsPDF n\'est pas chargé');
}

window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script chargé');
    const form = document.getElementById('collaborateurForm');
    
    if (!form) {
        console.error('Le formulaire n\'a pas été trouvé');
        return;
    }

    console.log('Formulaire trouvé, ajout du gestionnaire d\'événements submit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulaire soumis');

        try {
            // Vérification des composants
            const personalInfo = document.querySelector('personal-info-form');
            const formationCompetences = document.querySelector('formation-competences-form');
            const professionalInfo = document.querySelector('professional-info-form');
            const administrativeInfo = document.querySelector('administrative-info-form');
            const emergencyContact = document.querySelector('emergency-contact-form');
            const signaturePad = document.querySelector('signature-pad-component');

            console.log('Composants trouvés:', {
                personalInfo: !!personalInfo,
                formationCompetences: !!formationCompetences,
                professionalInfo: !!professionalInfo,
                administrativeInfo: !!administrativeInfo,
                emergencyContact: !!emergencyContact,
                signaturePad: !!signaturePad
            });

            // Vérification que tous les composants sont présents
            if (!personalInfo || !formationCompetences || !professionalInfo || 
                !administrativeInfo || !emergencyContact || !signaturePad) {
                throw new Error('Certains composants du formulaire sont manquants');
            }

            // Vérification de la validité
            const validations = {
                personalInfo: personalInfo.isValid(),
                formationCompetences: formationCompetences.isValid(),
                professionalInfo: professionalInfo.isValid(),
                administrativeInfo: administrativeInfo.isValid(),
                emergencyContact: emergencyContact.isValid(),
                signature: signaturePad.hasSignature()
            };

            console.log('Résultats de validation:', validations);

            if (Object.values(validations).some(v => !v)) {
                console.log('Validation échouée:', validations);
                alert('Veuillez remplir tous les champs obligatoires et signer le formulaire.');
                return;
            }

            // Récupération des données pour le nom du fichier
            const personalData = personalInfo.getData();

            // Masquer le bouton de soumission pendant la génération du PDF
            const submitButton = form.querySelector('button[type="submit"]');
            const saveButton = form.querySelector('button#saveData');
            if (submitButton) submitButton.style.display = 'none';
            if (saveButton) saveButton.style.display = 'none';

            // Afficher un message de chargement
            const loadingMessage = document.createElement('div');
            loadingMessage.textContent = 'Génération du PDF en cours...';
            loadingMessage.style.textAlign = 'center';
            loadingMessage.style.padding = '20px';
            loadingMessage.style.fontWeight = 'bold';
            form.appendChild(loadingMessage);

            // Attendre que le DOM soit mis à jour
            await new Promise(resolve => setTimeout(resolve, 100));

            // Création du PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;

            // Fonction pour capturer une partie du formulaire
            const captureElement = async (element) => {
                try {
                    console.log('Capture de l\'élément:', element.tagName);
                    
                    // Rendre l'élément visible si nécessaire
                    const originalDisplay = element.style.display;
                    element.style.display = 'block';
                    
                    const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        logging: true,
                        allowTaint: true,
                        foreignObjectRendering: false,
                        scrollX: 0,
                        scrollY: -window.scrollY
                    });
                    
                    // Restaurer l'affichage original
                    element.style.display = originalDisplay;
                    
                    return canvas;
                } catch (error) {
                    console.error('Erreur lors de la capture de l\'élément:', error);
                    return null;
                }
            };

            // Fonction pour ajouter un canvas au PDF
            const addCanvasToPDF = (canvas, y = null) => {
                if (!canvas) return 0;
                
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const imgWidth = pageWidth - (2 * margin);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Si y est null, ajouter une nouvelle page
                if (y === null) {
                    pdf.addPage();
                    y = margin;
                }
                
                // Vérifier s'il faut ajouter une nouvelle page
                if (y + imgHeight > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }
                
                pdf.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight);
                return y + imgHeight + margin;
            };

            // Ajouter l'en-tête
            pdf.setFontSize(18);
            pdf.setTextColor(0, 179, 101); // Couleur verte #00b365
            pdf.text('Formulaire de Nouveau Collaborateur', pageWidth / 2, margin + 10, { align: 'center' });
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0); // Noir
            pdf.text('Généré le: ' + new Date().toLocaleDateString('fr-FR'), pageWidth / 2, margin + 20, { align: 'center' });
            
            let currentY = margin + 30;

            // Capturer et ajouter chaque composant au PDF
            const components = [
                personalInfo,
                formationCompetences,
                professionalInfo,
                administrativeInfo,
                emergencyContact
            ];

            // Capturer tous les composants
            for (const component of components) {
                try {
                    // Trouver l'élément .form-section à l'intérieur du composant
                    const formSection = component.querySelector('.form-section');
                    if (formSection) {
                        const canvas = await captureElement(formSection);
                        if (canvas) {
                            currentY = addCanvasToPDF(canvas, currentY);
                        }
                    } else {
                        console.warn('Pas de .form-section trouvé dans', component.tagName);
                    }
                } catch (error) {
                    console.error('Erreur lors de la capture du composant:', error);
                }
            }

            // Ajouter la signature sur une nouvelle page
            if (signaturePad.hasSignature()) {
                const signatureCanvas = document.createElement('div');
                signatureCanvas.style.padding = '20px';
                signatureCanvas.style.backgroundColor = 'white';
                
                const signatureTitle = document.createElement('h2');
                signatureTitle.textContent = 'Signature Numérique';
                signatureTitle.style.color = '#00b365';
                signatureTitle.style.marginBottom = '20px';
                
                const signatureImg = document.createElement('img');
                signatureImg.src = signaturePad.getSignatureData();
                signatureImg.style.width = '300px';
                signatureImg.style.height = '150px';
                signatureImg.style.border = '1px solid #ccc';
                
                signatureCanvas.appendChild(signatureTitle);
                signatureCanvas.appendChild(signatureImg);
                
                document.body.appendChild(signatureCanvas);
                
                const canvas = await captureElement(signatureCanvas);
                document.body.removeChild(signatureCanvas);
                
                if (canvas) {
                    addCanvasToPDF(canvas, null); // null pour ajouter une nouvelle page
                }
            }

            // Restaurer les boutons
            if (submitButton) submitButton.style.display = '';
            if (saveButton) saveButton.style.display = '';
            
            // Supprimer le message de chargement
            if (loadingMessage.parentNode) {
                loadingMessage.parentNode.removeChild(loadingMessage);
            }

            // Génération du nom du fichier avec la date
            const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
            const fileName = `${personalData.nom}_${personalData.prenom}_${date}.pdf`;
            
            // Sauvegarde du PDF
            pdf.save(fileName);
            console.log('PDF généré avec succès');

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
            
            // Restaurer l'interface en cas d'erreur
            const submitButton = form.querySelector('button[type="submit"]');
            const saveButton = form.querySelector('button#saveData');
            if (submitButton) submitButton.style.display = '';
            if (saveButton) saveButton.style.display = '';
            
            const loadingMessage = form.querySelector('div:last-child');
            if (loadingMessage && loadingMessage.textContent === 'Génération du PDF en cours...') {
                form.removeChild(loadingMessage);
            }
        }
    });
}); 