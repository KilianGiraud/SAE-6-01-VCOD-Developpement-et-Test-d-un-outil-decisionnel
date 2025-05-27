// ---------------------------------------------------
//               FONCTIONS DU FORMULAIRE
// ---------------------------------------------------

// Liste des modules photovoltaïques
const modulesData = [
    { nom: "DM385M6-60HBW", fabricant: "DMEGC", puissance: "375", largeur: "1038", longueur: "1755", ucoMax: "0,00", iccMax: "0" },
    { nom: "DM405M10-50HBW-V", fabricant: "DMEGC", puissance: "405", largeur: "1134", longueur: "1722", ucoMax: "0,00", iccMax: "0" },
    { nom: "DM410M10-54HBW", fabricant: "DMEGC", puissance: "410", largeur: "1134", longueur: "1722", ucoMax: "0,00", iccMax: "0" },
    { nom: "DM415M10-54HBW", fabricant: "DMEGC", puissance: "415", largeur: "1134", longueur: "1722", ucoMax: "0,00", iccMax: "0" },
    { nom: "DM450M10RT-54HSW/HBW", fabricant: "DMEGC", puissance: "450", largeur: "1134", longueur: "1762", ucoMax: "33,24", iccMax: "13,96" },
    { nom: "DM460M6-72HSW/-V", fabricant: "DMEGC", puissance: "455", largeur: "1038", longueur: "2094", ucoMax: "0,00", iccMax: "0" },
    { nom: "DM500M10RT-B60HBT", fabricant: "DMEGC", puissance: "500", largeur: "1134", longueur: "1950", ucoMax: "44,22", iccMax: "14,04" },
    { nom: "DN-BT108N", fabricant: "DUONERGY", puissance: "410", largeur: "1134", longueur: "1728", ucoMax: "0,00", iccMax: "0" },
    { nom: "DUOMAX TWIN 365", fabricant: "TRINA SOLAR", puissance: "365", largeur: "1046", longueur: "1773", ucoMax: "0,00", iccMax: "0" },
    { nom: "FLASH 405 HC WHITE", fabricant: "DUALSUN", puissance: "405", largeur: "1134", longueur: "1708", ucoMax: "0,00", iccMax: "0" },
    { nom: "JAM54S30-405/MR", fabricant: "JA SOLAR", puissance: "405", largeur: "1134", longueur: "1722", ucoMax: "0,00", iccMax: "0" },
    { nom: "JAM60S10-345", fabricant: "JA SOLAR", puissance: "345", largeur: "0", longueur: "0", ucoMax: "0,00", iccMax: "0" },
    { nom: "JKM450N-54HL4R", fabricant: "JINKO SOLAR", puissance: "450", largeur: "1134", longueur: "1762", ucoMax: "39,78", iccMax: "14" },
    { nom: "JW-HD120N-370", fabricant: "JOLYWOOD", puissance: "370", largeur: "1042", longueur: "1768", ucoMax: "0,00", iccMax: "0" },
    { nom: "LR4-60HIH-375M", fabricant: "LONGI", puissance: "375", largeur: "1038", longueur: "1755", ucoMax: "0,00", iccMax: "0" },
    { nom: "LR5-54HIH-405M", fabricant: "LONGI", puissance: "405", largeur: "1134", longueur: "1722", ucoMax: "0,00", iccMax: "0" },
    { nom: "MODELE DEPOT", fabricant: "0", puissance: "280", largeur: "0", longueur: "0", ucoMax: "0,00", iccMax: "0" },
    { nom: "MULTISOL P6-54 210", fabricant: "SCHEUTEN", puissance: "210", largeur: "1000", longueur: "1500", ucoMax: "0,00", iccMax: "0" },
    { nom: "TP660M-320", fabricant: "TALESUN", puissance: "320", largeur: "992", longueur: "1650", ucoMax: "0,00", iccMax: "0" },
    { nom: "TP6F60M-340", fabricant: "TALESUN", puissance: "340", largeur: "1002", longueur: "1684", ucoMax: "0,00", iccMax: "0" },
    { nom: "TRINA 340", fabricant: "TRINA SOLAR", puissance: "340", largeur: "1004", longueur: "1698", ucoMax: "0,00", iccMax: "0" },
    { nom: "TSM DE06M.08", fabricant: "TRINA SOLAR", puissance: "335", largeur: "0", longueur: "0", ucoMax: "0,00", iccMax: "0" },
    { nom: "TSM-DE08M.08", fabricant: "TRINA SOLAR", puissance: "375", largeur: "0", longueur: "0", ucoMax: "0,00", iccMax: "0" },
    { nom: "VERTEX 400", fabricant: "TRINA SOLAR", puissance: "400", largeur: "1096", longueur: "1754", ucoMax: "41,20", iccMax: "0" },
    { nom: "VERTEX 405", fabricant: "TRINA SOLAR", puissance: "405", largeur: "1096", longueur: "1754", ucoMax: "0,00", iccMax: "0" },
    { nom: "VERTEX 420", fabricant: "TRINA SOLAR", puissance: "420", largeur: "1134", longueur: "1762", ucoMax: "0,00", iccMax: "0" },
    { nom: "VERTEX 425", fabricant: "TRINA SOLAR", puissance: "425", largeur: "1134", longueur: "1762", ucoMax: "0,00", iccMax: "0" },
    { nom: "VERTEX 430", fabricant: "TRINA SOLAR", puissance: "430", largeur: "1134", longueur: "1762", ucoMax: "0,00", iccMax: "0" },
    { nom: "VERTEX 435", fabricant: "TRINA SOLAR", puissance: "435", largeur: "1134", longueur: "1762", ucoMax: "50,40", iccMax: "0" },
    { nom: "VERTEX S+ 440", fabricant: "TRINA SOLAR", puissance: "440", largeur: "1134", longueur: "1762", ucoMax: "52,20", iccMax: "10,67" },
    { nom: "VERTEX S+ 445", fabricant: "TRINA SOLAR", puissance: "445", largeur: "1134", longueur: "1762", ucoMax: "52,60", iccMax: "10,71" }
];

// Liste des onduleurs
const onduleursData = [
    { nom: "BP50.0 TL3", fabricant: "KACO", puissance: "50", taillePO: "0", iccChaine: "0" },
    { nom: "BP92.0 TL3", fabricant: "KACO", puissance: "92", taillePO: "0", iccChaine: "0" },
    { nom: "DS3-H", fabricant: "AP SYSTEMS", puissance: "0.96", taillePO: "0", iccChaine: "0" },
    { nom: "DS3-L", fabricant: "AP SYSTEMS", puissance: "0.73", taillePO: "0", iccChaine: "0" },
    { nom: "ECO 27.0-3-S", fabricant: "FRONIUS", puissance: "27", taillePO: "0", iccChaine: "0" },
    { nom: "KF-SPI100K-B", fabricant: "KEHUA", puissance: "100", taillePO: "345", iccChaine: "450" },
    { nom: "KF-SPI125K-B", fabricant: "KEHUA", puissance: "125", taillePO: "360", iccChaine: "450" },
    { nom: "KF-SPI40K-B", fabricant: "KEHUA", puissance: "40", taillePO: "273", iccChaine: "500" },
    { nom: "KF-SPI60K-B", fabricant: "KEHUA", puissance: "60", taillePO: "273", iccChaine: "500" },
    { nom: "M13T", fabricant: "SOLARMAX", puissance: "13", taillePO: "0", iccChaine: "0" },
    { nom: "PICO CI 60", fabricant: "KOSTAL", puissance: "60", taillePO: "0", iccChaine: "0" },
    { nom: "QS1", fabricant: "AP SYSTEMS", puissance: "1.2", taillePO: "0", iccChaine: "0" },
    { nom: "QT2", fabricant: "AP SYSTEMS", puissance: "2", taillePO: "0", iccChaine: "0" },
    { nom: "SE82.8K", fabricant: "SOLAR EDGE", puissance: "82.8", taillePO: "0", iccChaine: "0" },
    { nom: "SE90K", fabricant: "SOLAR EDGE", puissance: "90", taillePO: "0", iccChaine: "0" },
    { nom: "SG110CX-V112", fabricant: "SUNGROW", puissance: "110", taillePO: "363", iccChaine: "450" },
    { nom: "SG125CX-P2", fabricant: "SUNGROW", puissance: "125", taillePO: "360", iccChaine: "450" },
    { nom: "SG15RT", fabricant: "SUNGROW", puissance: "15", taillePO: "0", iccChaine: "0" },
    { nom: "SG20RT", fabricant: "SUNGROW", puissance: "20", taillePO: "0", iccChaine: "0" },
    { nom: "SG33CX", fabricant: "SUNGROW", puissance: "33", taillePO: "310", iccChaine: "650" },
    { nom: "SG50CX", fabricant: "SUNGROW", puissance: "55", taillePO: "0", iccChaine: "0" },
    { nom: "SUN2000-100KTL", fabricant: "HUAWEI", puissance: "100", taillePO: "365", iccChaine: "600" },
    { nom: "SUN2000-10KTL-M2", fabricant: "HUAWEI", puissance: "10", taillePO: "262", iccChaine: "400" },
    { nom: "SUN2000-110KTL", fabricant: "HUAWEI", puissance: "110", taillePO: "365", iccChaine: "600" },
    { nom: "SUN2000-115KTL", fabricant: "HUAWEI", puissance: "115", taillePO: "365", iccChaine: "600" },
    { nom: "SUN2000-125KTL", fabricant: "HUAWEI", puissance: "125", taillePO: "0", iccChaine: "0" },
    { nom: "SUN2000-20KTL", fabricant: "HUAWEI", puissance: "20", taillePO: "228", iccChaine: "1000" },
    { nom: "SUN2000-30KTL", fabricant: "HUAWEI", puissance: "30", taillePO: "270", iccChaine: "600" },
    { nom: "SUN2000-36KTL", fabricant: "HUAWEI", puissance: "36", taillePO: "270", iccChaine: "600" },
    { nom: "SUN2000-40KTL", fabricant: "HUAWEI", puissance: "40", taillePO: "270", iccChaine: "600" },
    { nom: "SUN2000-50KTL", fabricant: "HUAWEI", puissance: "50", taillePO: "270", iccChaine: "600" },
    { nom: "SUN2000-60KTL", fabricant: "HUAWEI", puissance: "60", taillePO: "0", iccChaine: "0" },
    { nom: "SUN2000-65KTL", fabricant: "HUAWEI", puissance: "65", taillePO: "0", iccChaine: "0" },
    { nom: "SUN2000-75KTL", fabricant: "HUAWEI", puissance: "75", taillePO: "0", iccChaine: "0" },
    { nom: "SYMO 10.0-3-M", fabricant: "FRONIUS", puissance: "10", taillePO: "0", iccChaine: "0" },
    { nom: "SYMO 15.0-3-M", fabricant: "FRONIUS", puissance: "15", taillePO: "0", iccChaine: "0" },
    { nom: "SYMO 20.0-3-M", fabricant: "FRONIUS", puissance: "20", taillePO: "0", iccChaine: "0" },
    { nom: "SYMO 5.0-3-M", fabricant: "FRONIUS", puissance: "5", taillePO: "0", iccChaine: "0" },
    { nom: "TAURO 50-3-D 3MPPT", fabricant: "FRONIUS", puissance: "50", taillePO: "0", iccChaine: "0" },
    { nom: "TAURO ECO-100-3-D", fabricant: "FRONIUS", puissance: "100", taillePO: "0", iccChaine: "0" },
    { nom: "TAURO ECO-99-P", fabricant: "FRONIUS", puissance: "99", taillePO: "0", iccChaine: "0" },
    { nom: "TRIPOWER 17K TL10", fabricant: "SMA", puissance: "17", taillePO: "0", iccChaine: "0" },
    { nom: "TRIPOWER STP110-60", fabricant: "SMA SUNNY", puissance: "110", taillePO: "363", iccChaine: "450" },
    { nom: "TRIPOWER X12", fabricant: "SMA SUNNY", puissance: "12", taillePO: "266", iccChaine: "330" },
    { nom: "TRIPOWER X15", fabricant: "SMA SUNNY", puissance: "15", taillePO: "266", iccChaine: "330" },
    { nom: "TRIPOWER X20", fabricant: "SMA SUNNY", puissance: "20", taillePO: "266", iccChaine: "330" }
];

  // Au chargement de la page, remplir les sélecteurs
  window.addEventListener('DOMContentLoaded', () => {
    const moduleSelect = document.getElementById('moduleSelect');
    const onduleurSelect = document.getElementById('onduleurSelect');
  
    // Remplir le select des modules
    modulesData.forEach((module) => {
      const option = document.createElement('option');
      option.value = module.nom;
      option.textContent = module.nom;
      moduleSelect.appendChild(option);
    });
  
    // Remplir le select des onduleurs
    onduleursData.forEach((onduleur) => {
      const option = document.createElement('option');
      option.value = onduleur.nom;
      option.textContent = onduleur.nom;
      onduleurSelect.appendChild(option);
    });
  
    // Gestion de l'aperçu de l'image satellite
    const imageInput = document.getElementById('imageSatellite');
    const previewImage = document.getElementById('previewImage');
  
    imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });
  
  // Mettre à jour les infos du module sélectionné
  function updateModuleInfo() {
    const selectedModuleName = document.getElementById('moduleSelect').value;
    const selectedModule = modulesData.find(mod => mod.nom === selectedModuleName);
  
    if (selectedModule) {
      document.getElementById('moduleFabricant').value = selectedModule.fabricant;
      document.getElementById('moduleLongueur').value = selectedModule.longueur;
      document.getElementById('moduleLargeur').value = selectedModule.largeur;
      document.getElementById('modulePuissance').value = selectedModule.puissance;
    }
  }
  
  // Mettre à jour les infos de l’onduleur sélectionné
  function updateOnduleurInfo() {
    const selectedOnduleurName = document.getElementById('onduleurSelect').value;
    const selectedOnduleur = onduleursData.find(ond => ond.nom === selectedOnduleurName);
  
    if (selectedOnduleur) {
      document.getElementById('onduleurFabricant').value = selectedOnduleur.fabricant;
      document.getElementById('onduleurModele').value = selectedOnduleur.modele;
    }
  }

  // Fonction pour faire appel à une requête
function requete(id = null) {
    const apiUrl = `https://databox.chavaroche-si.fr/openproject/api/v3/projects/54/queries/187`;
    const apiKey = '350eda122e468ece5f00b0baa3c1f959cca3637e0c0d059567a4693185da97ac';

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Données reçues :", data);
        // Traiter les données reçues
    })
    .catch(error => {
        console.error("Erreur lors de la requête :", error);
    });
}

// Fonction pour enregistrer
function enregistrer(imprimer = false) {
    // Exemple de données à envoyer
    const data = {
        module: document.getElementById("moduleSelect").value,
        onduleur: document.getElementById("onduleurSelect").value
    };

    // Exemple de requête POST pour enregistrer les données
    fetch('/api/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log("Données enregistrées :", result);
        if (imprimer) {
            // Appeler la fonction d'impression si nécessaire
            document.querySelector(".export-button").click();
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'enregistrement :", error);
    });
}
  
  // ---------------------------------------------------
  //                  EXPORT EN PDF
  // ---------------------------------------------------
  async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
  
    // Sélectionne l'élément principal à capturer
    const container = document.querySelector('.container');
  
    // Convertit l'élément en canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true
    });
  
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    let heightLeft = pdfHeight;
    let position = 0;

    // Ajouter une en-tête
    pdf.setFontSize(18);
    pdf.text('Prévision Chantier', pdfWidth / 2, 40, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Genéré le: ' + new Date().toLocaleDateString(), pdfWidth / 2, 60, { align: 'center' });
  
    // Ajoute l'image au PDF et gère les pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position + 80, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      position -= pdf.internal.pageSize.getHeight();
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }
  
    pdf.save('prevision_chantier.pdf');
  }