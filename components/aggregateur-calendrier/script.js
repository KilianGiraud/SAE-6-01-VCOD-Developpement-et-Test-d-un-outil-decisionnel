let events = []; // Tableau global pour stocker les événements
let icsCalendars = {}; // Stocke les événements par URL

function addEventToIframe(event) {
    let iframe = document.getElementById("calendar-iframe");

    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "ADD_EVENT", event }, "*");

        // Ajout de l'événement à la liste des événements
        let eventList = document.getElementById("eventList") || createEventList();
        let listItem = document.createElement("li");
        listItem.textContent = event.title;

        let removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.style.marginLeft = "10px";
        removeButton.onclick = function () {
            removeEventFromIframe(event.id);
            listItem.remove();
        };

        listItem.appendChild(removeButton);
        eventList.appendChild(listItem);
    }
}



// Fonction pour ajouter un lien de calendrier ICS
function addCalendarLink() {
    let calendarLink = document.getElementById("calendarLink").value.trim();
    if (!calendarLink) return;

    let listItem = document.createElement("li");
    listItem.textContent = calendarLink;

    let removeButton = document.createElement("button");
    removeButton.textContent = "❌";
    removeButton.style.marginLeft = "10px";
    removeButton.style.cursor = "pointer";
    removeButton.onclick = function () {
        removeCalendar(calendarLink);
        listItem.remove();
    };

    listItem.appendChild(removeButton);
    document.getElementById("calendarLinksList").appendChild(listItem);

    let iframe = document.getElementById("calendar-iframe");
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "ADD_CALENDAR", url: calendarLink }, "*");
    }

    icsCalendars[calendarLink] = true; // Stocke le calendrier ajouté
}

// Fonction pour supprimer un calendrier ICS
function removeCalendar(url) {
    let iframe = document.getElementById("calendar-iframe");
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "REMOVE_CALENDAR", url }, "*");
    }
    delete icsCalendars[url]; // Supprime du stockage
}

// Gestion du formulaire d'ajout d'événement
document.getElementById("eventForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value || start;

    if (!title || !start) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    let newEvent = {
        id: "event-" + Date.now(),  // Générer un ID unique
        title,
        start,
        end
    };

    events.push(newEvent); // Ajouter l'événement au tableau global
    addEventToIframe(newEvent);
    saveToLocalStorage(); // Sauvegarder dans le localStorage
    document.getElementById("eventForm").reset();
});

// Fonction pour supprimer un événement de l'iframe
function removeEventFromIframe(eventId) {
    let iframe = document.getElementById("calendar-iframe");
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "REMOVE_EVENT", id: eventId }, "*");
    }

    // Supprimer l'événement du tableau global
    events = events.filter(event => event.id !== eventId);
    saveToLocalStorage(); // Sauvegarder dans le localStorage
}

// Fonction pour exporter les événements en format ICS
document.getElementById("exportButton").addEventListener("click", function () {
    let iframe = document.getElementById("calendar-iframe");
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "EXPORT_ICS" }, "*");
    } else {
        alert("Le calendrier n'est pas encore chargé.");
    }
});

// Fonction pour sauvegarder les événements et les liens ICS dans le localStorage
function saveToLocalStorage() {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("icsLinks", JSON.stringify(Object.keys(icsCalendars)));
}

// Fonction pour charger les événements et les liens ICS depuis le localStorage
function loadFromLocalStorage() {
    let savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    let savedLinks = JSON.parse(localStorage.getItem("icsLinks")) || [];

    savedEvents.forEach(event => addEventToIframe(event));
    savedLinks.forEach(link => addCalendarLink(link));
}

// Charger les données sauvegardées au démarrage
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

// Fonction pour ouvrir le calendrier dans une nouvelle page
function openCalendar() {
    let events = getEvents();
    let ics = Object.keys(icsCalendars);

    let data = {
        events: events,
        ics: ics
    };

    let url = "calendar.html?data=" + encodeURIComponent(JSON.stringify(data));
    window.location.href = url;
}

// Fonction pour récupérer les événements
function getEvents() {
    return events; // Retourne les événements dynamiquement ajoutés
}

function generateICS() {
    if (events.length === 0) {
        alert("Aucun événement à exporter.");
        return;
    }

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Mon Calendrier//FR\n";

    events.forEach(event => {
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${event.id}@moncalendrier.com\n`;
        icsContent += `SUMMARY:${event.title}\n`;
        icsContent += `DTSTART:${formatDateToICS(event.start)}\n`;
        icsContent += `DTEND:${formatDateToICS(event.end)}\n`;
        icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    downloadICSFile(icsContent);
}

// Fonction pour formater une date en format ICS (YYYYMMDDTHHMMSSZ)
function formatDateToICS(dateString) {
    let date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Fonction pour télécharger le fichier ICS
function downloadICSFile(content) {
    let blob = new Blob([content], { type: "text/calendar" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "mon_calendrier.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Ajoute un événement au clic sur le bouton Exporter en ICS
document.getElementById("exportButton").addEventListener("click", generateICS);


// // Fonction pour créer la liste d'événements si elle n'existe pas encore
// function createEventList() {
//     let eventSection = document.createElement("section");
//     eventSection.innerHTML = "<h2>Événements ajoutés</h2><ul id='eventList'></ul>";
//     document.body.appendChild(eventSection);
//     return document.getElementById("eventList");
// }
// Fonction pour ajouter un événement à l'iframe