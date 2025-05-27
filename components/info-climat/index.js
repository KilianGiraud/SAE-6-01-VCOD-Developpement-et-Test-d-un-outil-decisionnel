const map = L.map("map").setView([45.0308, 2.6573], 9);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`
}).addTo(map);

// Valeurs par defaut

document.getElementById("yearInput").value = new Date().getFullYear();

document.getElementById("monthInput").childNodes.forEach(option => {
    const month = new Date().getMonth().toString();

    if (option.value === month) {
        option.selected = true;
    }
});

const cities = [
    {
        name: "Aurillac",
        lat: 44.9167,
        lon: 2.45
    },
    {
        name: "Saint-Flour",
        lat: 45.0333,
        lon: 3.0833
    },
    {
        name: "Mauriac",
        lat: 45.2167,
        lon: 2.3333
    },
    {
        name: "Arpajon-sur-Cère",
        lat: 44.9013,
        lon: 2.46
    },
    {
        name: "Ytrac",
        lat: 44.9167,
        lon: 2.37
    },
    {
        name: "Riom-ès-Montagnes",
        lat: 45.2833,
        lon: 2.67
    },
    {
        name: "Maurs",
        lat: 44.7167,
        lon: 2.2
    },
    {
        name: "Murat",
        lat: 45.1167,
        lon: 2.8667
    },
    {
        name: "Vic-sur-Cère",
        lat: 44.9833,
        lon: 2.62
    }
];

function requete(id=null) {}
function enregister(imprimer=false) {}

function isleapYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

let markers = [];

async function fetchWeatherData(city, month, year) {
    const startDate = new Date(Date.UTC(year, month, 1));
    let endDate = null;
    console.log(month)

    if (month === Number.parseInt(new Date().getMonth())) {
        if (new Date().getDate() === 1) {
            throw new Error("Pas de donnée pour le mois actuel.");
        }

        endDate = new Date();
    } else if (isleapYear(year) && month === 1) {
        endDate = new Date(Date.UTC(year, month, 29)); // Annee bissextile
    } else if (month == 1) {
        endDate = new Date(Date.UTC(year, month, 28));
    } else {
        endDate = new Date(Date.UTC(year, month, month % 2 === 0? 31 : 30));
    }

    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];
    const url = `https://archive-api.open-meteo.com/v1/archive?start_date=${startDateString}&end_date=${endDateString}&latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum&timezone=CET`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Pas de données pour cette période.");
    }

    return await response.json();
}

function summarizeData(data) {
    return {
        minExtreme: Math.min(...data.daily.temperature_2m_min),
        minAverage: data.daily.temperature_2m_min.reduce((a, b) => a + b)/data.daily.temperature_2m_min.length,
        average: data.daily.temperature_2m_mean.reduce((a, b) => a + b)/data.daily.temperature_2m_mean.length,
        maxExtreme: Math.max(...data.daily.temperature_2m_max),
        maxAverage: data.daily.temperature_2m_max.reduce((a, b) => a + b)/data.daily.temperature_2m_max.length,
        precipitationSum: data.daily.precipitation_sum.reduce((a, b) => a + b)
    };
}

document.getElementById("fetchData").addEventListener("click", async () => {
    const yearSelect = document.getElementById("yearInput");

    const month = Number.parseInt(document.getElementById("monthInput").value);
    const year = Number.parseInt(yearSelect.value);

    if (markers.length > 0) {
        for (const marker of markers) {
            map.removeLayer(marker);
        }
    }

    markers = [];

    if (Number.isNaN(year)) {
        window.alert("L'année saisie n'est pas au bon format.");
    }

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    try {
        for (const city of cities) {
            let data = await fetchWeatherData(city, month, year);

            if (!data || data.length === 0) {
                window.alert(`Aucune donnée disponible pour ${city.name} à cette date.`);
                continue;
            }

            data = summarizeData(data);

            Object.keys(data).forEach(key => {
                data[key] = Math.round(data[key]*10) / 10;
            });

            const marker = L.marker([city.lat, city.lon]).addTo(map);
            marker.bindPopup(`<b>${city.name}</b><br/>Moyenne : ${data.average}°C<br/>
                Mini moyenne : ${data.minAverage}°C<br/>
                Mini extrême : ${data.minExtreme}°C<br/>
                Maxi moyenne : ${data.maxAverage}°C<br/>
                Maxi extrême : ${data.maxExtreme}°C<br/>
                Cumul : ${data.precipitationSum}mm`
            );
            markers.push(marker);
        }

    } catch (error) {
        alert(`Une erreur est survenue : ${error.message}`);
    } finally {
        loading.style.display = "none";
    }
});
