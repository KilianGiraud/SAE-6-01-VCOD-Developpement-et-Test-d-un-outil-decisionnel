function afficherGraphiques() {
    const ctxRepartition = document.getElementById('graphRepartition').getContext('2d');
    const ctxHiver = document.getElementById('graphHiver').getContext('2d');
    const ctxEte = document.getElementById('graphEte').getContext('2d');

    const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    
    const tableRows = document.querySelectorAll("#releveTable tbody tr");
    let consoMois = new Array(12).fill(0);
    
    tableRows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        const moisIndex = moisNoms.indexOf(cells[0].innerText.split(" - ")[0]);
        if (moisIndex !== -1) {
            consoMois[moisIndex] += parseFloat(cells[5].innerText) || 0;
        }
    });

    new Chart(ctxRepartition, {
        type: 'line',
        data: {
            labels: moisNoms,
            datasets: [{
                label: 'Répartition annuelle',
                data: consoMois,
                borderColor: 'red',
                fill: false
            }]
        },
        options: {
            scales: {
                y: { min: 0, max: Math.max(...consoMois, 1.2) }
            }
        }
    });

    const heures = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    let consoHiver = new Array(24).fill(0);
    let consoEte = new Array(24).fill(0);

    tableRows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        const hph = parseFloat(cells[1].innerText) || 0;
        const hch = parseFloat(cells[2].innerText) || 0;
        const hpe = parseFloat(cells[3].innerText) || 0;
        const hce = parseFloat(cells[4].innerText) || 0;
        
        if (cells[0].innerText.includes("Décembre") || cells[0].innerText.includes("Janvier") || cells[0].innerText.includes("Février")) {
            consoHiver = consoHiver.map((val, idx) => val + (hph + hch) / 24);
        } else if (cells[0].innerText.includes("Juin") || cells[0].innerText.includes("Juillet") || cells[0].innerText.includes("Août")) {
            consoEte = consoEte.map((val, idx) => val + (hpe + hce) / 24);
        }
    });

    new Chart(ctxHiver, {
        type: 'line',
        data: {
            labels: heures,
            datasets: [{
                label: 'Consommation Hiver',
                data: consoHiver,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Heures' } },
                y: { min: 0, max: Math.max(...consoHiver, 1.2) }
            }
        }
    });

    new Chart(ctxEte, {
        type: 'line',
        data: {
            labels: heures,
            datasets: [{
                label: 'Consommation Été',
                data: consoEte,
                borderColor: 'orange',
                fill: false
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Heures' } },
                y: { min: 0, max: Math.max(...consoEte, 1.2) }
            }
        }
    });
}
function ajouterReleve() {
    var periodeSelect = document.getElementById("periode");
    var selectedPeriode = periodeSelect.value;
    
    // Vérifier si la période a déjà été sélectionnée
    var tableRows = document.querySelectorAll("#releveTable tbody tr");
    for (let row of tableRows) {
        if (row.cells[0].innerText === selectedPeriode) {
            alert("Cette période a déjà été sélectionnée.");
            return;
        }
    }
    
    var table = document.getElementById("releveTable").getElementsByTagName('tbody')[0];
    var row = table.insertRow();
    
    var hph = parseFloat(document.getElementById("consoHPH").value) || 0;
    var hch = parseFloat(document.getElementById("consoHCH").value) || 0;
    var hpe = parseFloat(document.getElementById("consoHPE").value) || 0;
    var hce = parseFloat(document.getElementById("consoHCE").value) || 0;
    var totalConso = hph + hch + hpe + hce;
    var montantFacture = parseFloat(document.getElementById("prix").value) || 0;
    
    var values = [
        selectedPeriode,
        hph,
        hch,
        hpe,
        hce,
        totalConso,
        montantFacture.toFixed(2) + " €"
    ];
    
    for (var j = 0; j < values.length; j++) {
        row.insertCell(j).innerText = values[j];
    }
    
    // Désactiver l'option sélectionnée pour éviter une sélection multiple
    periodeSelect.querySelector(`option[value='${selectedPeriode}']`).disabled = true;
    
    var totals = ["totalHPH", "totalHCH", "totalHPE", "totalHCE", "totalConso", "totalPrix"];
    for (var i = 0; i < totals.length; i++) {
        var totalCell = document.getElementById(totals[i]);
        var currentTotal = parseFloat(totalCell.innerText) || 0;
        var newValue = parseFloat(values[i + 1]) || 0;
        totalCell.innerText = (currentTotal + newValue).toFixed(2) + (i == 5 ? " €" : "");
    }
}

function toggleOption(option) {
    var button = document.getElementById(option + "Button");
    button.classList.toggle("active");

    if (option === "heu") {
        var inputs = document.querySelectorAll("#consoHPE, #consoHCE");
        inputs.forEach(input => {
            input.disabled = !button.classList.contains("active");
            input.classList.toggle("disabled", input.disabled);
        });
    }
}
