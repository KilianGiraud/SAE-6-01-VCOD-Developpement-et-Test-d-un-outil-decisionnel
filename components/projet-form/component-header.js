async function remplirSelection() {
  await getprojectWPtype(4).then(
    function(value) {
      const types = value._embedded.elements.filter(type => type.hasOwnProperty('name'));
      
      const listtypes = document.getElementById('typeCentrale')
      types.forEach(type => {
        let option = document.createElement("option");
        option.setAttribute('value', '' + type.name + '-Sous-traitance(' + type.id + ')');
        option.innerText = '' + type.name;

        listtypes.appendChild(option);
      });
    },
    function(error) {alert('Aucun projets trouvés: ' + error)}
  );

  await getprojectWPtype(29).then(
    function(value) {
      const types = value._embedded.elements.filter(grid => grid.hasOwnProperty('name'));
      
      const listtypes = document.getElementById('typeCentrale')
      types.forEach(type => {
        let option = document.createElement("option");
        option.setAttribute('value', '' + type.name + '-Ecosolaire(' + type.id + ')');
        option.innerText = '' + type.name;
        
        listtypes.appendChild(option);
      });
    },
    function(error) {alert('Aucun projets trouvés: ' + error)}
  );

  await getprojectWPtype(28).then(
    function(value) {
      const types = value._embedded.elements.filter(grid => grid.hasOwnProperty('name'));
      
      const listtypes = document.getElementById('typeCentrale')
      types.forEach(type => {
        let textOptions = listtypes.innerHTML;

        if(textOptions.indexOf(type.name) === -1) {
          let option = document.createElement("option");
          option.setAttribute('value', '' + type.name + '-Maintenance(' + type.id + ')');
          option.innerText = '' + type.name;
        
          listtypes.appendChild(option);
        }
      });
    },
    function(error) {alert('Aucun projets trouvés: ' + error)}
  );
}

function calculzoneGPS() {
  const input = document.getElementById('coordonnesGPS').value.trim();

  // Expression régulière pour vérifier le format des coordonnées GPS
  const gpsRegex = /^(-?\d+(\.\d+)?)[, ]\s*(-?\d+(\.\d+)?)$/;

  const LATdepotESE = 45.21814471124944;
  const LONGdepotESE = 2.3476984937123424;

  const LATdepotMS = 44.575332318206904; 
  const LONGdepotMS = 2.0914186120408464;

  const whatCentrale = document.getElementById('typeCentrale').value;
  
  if (gpsRegex.test(input)) {
    // Extraire latitude et longitude
    const matches = input.match(gpsRegex);
    const latitude = parseFloat(matches[1]);
    const longitude = parseFloat(matches[3]);

    // Vérifier les plages des valeurs GPS
    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      let distESE = calculateDistance(latitude,longitude,LATdepotESE,LONGdepotESE);
      let distMS = calculateDistance(latitude,longitude,LATdepotMS,LONGdepotMS);

      let zoneESE = calculerZone(distESE);
      let zoneMS = calculerZone(distMS);
      
      if(whatCentrale.indexOf("Mecojit") !== -1) {
        return 'ESE : ' + zoneESE + '\n MS : ' + zoneMS;
      } else {
        return zoneESE;  
      }
    }
  } else {
    return "";
  }
}

function specifier() {
  const input = document.getElementById('typeCentrale').value;

  const esRegex = /^.*Sous-traitance.*$/;
  
  if (esRegex.test(input)) {
    const newgroups = document.getElementsByClassName('form-group-if');

    for(let i = 0;i < newgroups.length; i++) {
      newgroups[i].style.display = "none";
      newgroups.getElementsByTagName("input")[0].value="";
    }
  } else {
    const newgroups = document.getElementsByClassName('form-group-if');

    for(let i = 0;i < newgroups.length; i++) {
      newgroups[i].style.display = "block";
    }
  }
}

/**
 * Calcule la distance entre deux points sur une sphère.
 * @param {number} latA - Latitude du point A (en degrés)
 * @param {number} lonA - Longitude du point A (en degrés)
 * @param {number} latB - Latitude du point B (en degrés)
 * @param {number} lonB - Longitude du point B (en degrés)
 * @param {number} radius - Rayon de la sphère (en mètres), par défaut 6378137m
 * @returns {number} Distance entre les deux points (en kilomètres)
 */
function calculateDistance(latA, lonA, latB, lonB, radius = 6378137) {
  // Convertir les degrés en radians
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const phiA = toRadians(latA);
  const phiB = toRadians(latB);
  const lambdaA = toRadians(lonA);
  const lambdaB = toRadians(lonB);

  // Différence de longitude
  const dlambda = lambdaB - lambdaA;

  // Formule de la distance angulaire en radians
  const SA_B = Math.acos(
    Math.sin(phiA) * Math.sin(phiB) +
     Math.cos(phiA) * Math.cos(phiB) * Math.cos(dlambda)
  );

  // Distance en mètres
  const distance = SA_B * radius;

  return Math.round(distance/100)/10; // Retourne la distance en Kilomètres
}

function calculerZone(distance) {
  if(distance <= 5) {
    return 'zone 1A';
  } else if(distance <= 10) {
    return 'zone 1B';
  } else if(distance <= 20) {
    return 'zone 2';
  } else if(distance <= 30) {
    return 'zone 3';
  } else if(distance <= 40) {
    return 'zone 4';
  } else if(distance <= 50) {
    return 'zone 5';
  } else {
    return 'grand déplacement';
  }
}

async function creerChantier(renseigner = false) {
  let input = document.getElementById('typeCentrale').value;

  let name = document.getElementById('nomChantier').value;

  let idparent = 0;
  let wpId = 0;
  
  // Expression régulière pour vérifier le format des coordonnées GPS
  const stRegex = /^.*Sous-traitance.*$/;
  const esRegex = /^.*Ecosolaire.*$/;
  const mtRegex = /^.*Maintenance.*$/;
  const idRegex = /\(([^)]+)\)/;
  
  if (stRegex.test(input)) {
    idparent = 4;
  }
  
  if (esRegex.test(input)) {
    idparent = 29;
  }

  if (mtRegex.test(input)) {
    idparent = 28;
  }

  const match = input.match(idRegex);
  
  if (match) {
    wpId = match[1]; // Affiche : "avec un terme"
  }

  if(idparent >= 0) {
    await getworkpackages(27).then(
      function(value) {
        // Extract the list of child project identifiers
        const workpackage = value._embedded.elements[0];

        const updateinfos = {
          "_links": {
            "type": {
              "href": "/api/v3/types/" + wpId,
            },
          },
          "subject": name,
          "lockVersion": workpackage.lockVersion,
          "customField26": document.getElementById('coordonnesGPS').value,
          "customField80": {"raw": calculzoneGPS()},
          "customField44": document.getElementById('nomDuClient').value,
        };

        updateWorkpackage(workpackage.id, updateinfos);
      },
      function(error) {console.log('Echec de la création: ' + error);}
    );

    const copie = {
      "name" : name,
      "customField64": false,
      "_links": {
        "parent": {
          "href": "/openproject/api/v3/projects/" + idparent,
        },
      },
      "_meta": {
        "copyMembers": true,
        "copyCategories": true,
        "copyWorkPackages": true,
        "copyWorkPackageAttachments": true,
        "copyWorkPackageShares": true,
        "copyWiki": true,
        "copyWikiPageAttachments": true,
        "copyQueries": true,
        "copyBoards": true,
        "copyOverview": true,
        "copyStorages": true,
        "copyStorageProjectFolders": true,
        "copyFileLinks": true,
        "sendNotifications": false,
      },
    };

    let job = null;

    await copyproject(27, copie).then(
      function(value) {
        if(renseigner) {
          job = value;
        } else {
          document.querySelector('#creerUnProjet').reset();
          alert("centrale crée");
        }
      },
      function(error) {console.log('Echec de la création: ' + error);}
    );

    if(job!== null) {
      if(job.status && job._links.self.href) {
        while(job.status !== "success") {              
          await getAPIfromLink(job._links.self.href).then(
              function(value) {
                job = value;
              },
              function(error) {console.log('Echec de la création: ' + error); }
            );                
          setTimeout(function() {
            console.log('Attente de la création:');
          }, 2000);
        };
      }
      
      if(job.payload.redirect) {
        // Sélectionner un nœud parent
        var parentNode = window.top.document.getElementById('frames');

        // Parcourir les éléments enfants qui correspondent à un sélecteur CSS
        var childNode = parentNode.firstChild;
        while (childNode) {
          if(childNode.src && childNode.src.includes('createproject-form')) {
            childNode.src = job.payload.redirect + "/work_packages";
          }
          childNode = childNode.nextSibling;
        }
      }
    }
  }
}