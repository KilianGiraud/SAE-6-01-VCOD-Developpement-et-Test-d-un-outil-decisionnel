document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        height: 'auto',
        headerToolbar: {
            left: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            right: 'prev today next'
        },
        events: [],

        // Suppression d'un événement sur clic
        eventClick: function (info) {
            if (confirm("Voulez-vous supprimer cet événement ?")) {
                info.event.remove();
                window.parent.postMessage({ type: "REMOVE_EVENT", id: info.event.id }, "*");
            }
        }
    });

    calendar.render();
    console.log("✅ Calendrier chargé !");

    let icsEventIds = {}; // Stocke les événements par URL

    // Fonction pour ajouter un événement au calendrier
    window.addEventToCalendar = function (event) {
        let newEvent = calendar.addEvent(event);
        return newEvent;
    };

    // Fonction pour ajouter un calendrier ICS
    window.addICSCalendar = async function (url) {
        try {
            let proxyUrl = "https://api.codetabs.com/v1/proxy?quest=";
            let response = await fetch(proxyUrl + url);
            let data = await response.text();
            let events = parseICS(data);

            let eventIds = [];
            events.forEach(event => {
                let newEvent = calendar.addEvent(event);
                eventIds.push(newEvent.id);
            });

            icsEventIds[url] = eventIds;
        } catch (error) {
            console.error("Erreur de chargement du calendrier ICS :", error);
        }
    };

    // Fonction pour parser les données ICS
    function parseICS(data) {
        let events = [];
        let lines = data.split(/\r?\n/);
        let event = null;

        lines.forEach(line => {
            if (line.startsWith("BEGIN:VEVENT")) {
                event = {};
            } else if (event) {
                if (line.startsWith("SUMMARY:")) {
                    event.title = line.replace("SUMMARY:", "").trim();
                } else if (line.startsWith("DTSTART")) {
                    let startTime = line.split(":")[1]?.trim();
                    event.start = parseICSTime(startTime);
                } else if (line.startsWith("DTEND")) {
                    let endTime = line.split(":")[1]?.trim();
                    event.end = parseICSTime(endTime);
                } else if (line.startsWith("END:VEVENT")) {
                    if (event.start) {
                        events.push(event);
                    }
                    event = null;
                }
            }
        });

        return events;
    }

    // Fonction pour parser les dates ICS
    function parseICSTime(timeStr) {
        if (!timeStr) return null;
        let match = timeStr.match(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?/);
        if (!match) return null;

        let [_, year, month, day, hour = "00", min = "00", sec = "00"] = match;
        return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
    }

    // Fonction pour supprimer un calendrier ICS
    function removeICSCalendar(url) {
        if (icsEventIds[url]) {
            icsEventIds[url].forEach(eventId => {
                let event = calendar.getEventById(eventId);
                if (event) {
                    event.remove();
                }
            });
            delete icsEventIds[url];
        }
    }

    // Fonction pour récupérer les paramètres de l'URL
    function getURLParameter(name) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name) ? JSON.parse(decodeURIComponent(urlParams.get(name))) : null;
    }

    // Récupérer les données de l'URL
    let data = getURLParameter("data");

    if (data) {
        if (data.events) {
            data.events.forEach(event => {
                calendar.addEvent(event);
            });
        }
        if (data.ics) {
            data.ics.forEach(url => {
                addICSCalendar(url);
            });
        }
    }

    // Écouteur pour les messages de l'iframe parent
    window.addEventListener("message", function (event) {
        if (event.data.type === "ADD_EVENT") {
            window.addEventToCalendar(event.data.event);
        } else if (event.data.type === "REMOVE_EVENT") {
            let eventToRemove = calendar.getEventById(event.data.id);
            if (eventToRemove) {
                eventToRemove.remove();
            }
        } else if (event.data.type === "ADD_CALENDAR") {
            window.addICSCalendar(event.data.url);
        } else if (event.data.type === "REMOVE_CALENDAR") {
            removeICSCalendar(event.data.url);
        } else if (event.data.type === "EXPORT_ICS") {
            exportToICS();
        }
    });

    // Fonction pour exporter les événements en format ICS
    function exportToICS() {
        let events = calendar.getEvents();
        if (events.length === 0) {
            alert("Aucun événement à exporter.");
            return;
        }

        let icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Mon Calendrier//FR\n";

        events.forEach(event => {
            let start = event.start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
            let end = event.end ? event.end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : start;
            let summary = event.title || "Événement";

            icsData += "BEGIN:VEVENT\n";
            icsData += "SUMMARY:" + summary + "\n";
            icsData += "DTSTART:" + start + "\n";
            icsData += "DTEND:" + end + "\n";
            icsData += "END:VEVENT\n";
        });

        icsData += "END:VCALENDAR";

        let blob = new Blob([icsData], { type: "text/calendar" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "mon_calendrier.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
