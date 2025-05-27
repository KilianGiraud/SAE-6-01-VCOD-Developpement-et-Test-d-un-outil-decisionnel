document.addEventListener('DOMContentLoaded', function () {
  initCalendar();
  attachEventHandlers();
  createTeams();
  fetchTasksFromAPI(); // Récupération des tâches via API
});

/* Initialisation du calendrier */
function initCalendar() {
  const yearSelect = document.getElementById('yearSelect');
  const weekSelect = document.getElementById('weekSelect');

  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      let option = new Option(i, i);
      yearSelect.appendChild(option);
  }
  yearSelect.value = currentYear;

  for (let i = 1; i <= 52; i++) {
      let option = new Option(`Semaine ${i}`, i);
      weekSelect.appendChild(option);
  }

  let currentWeek = getCurrentWeekNumber();
  weekSelect.value = currentWeek;

  updateDays();
}

/* Mise à jour des jours du calendrier */
function updateDays() {
  const year = parseInt(document.getElementById('yearSelect').value);
  const week = parseInt(document.getElementById('weekSelect').value);

  let firstThursday = new Date(year, 0, 1);
  while (firstThursday.getDay() !== 4) {
      firstThursday.setDate(firstThursday.getDate() + 1);
  }

  let startOfWeek = new Date(firstThursday);
  startOfWeek.setDate(startOfWeek.getDate() + (week - 1) * 7 - 3);

  for (let i = 0; i < 7; i++) {
      let day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      document.getElementById(`day${i + 1}`).textContent = day.toLocaleDateString('fr-FR');
  }

  createTaskCells();
  fetchTasksFromAPI(); // Mise à jour des tâches après changement de semaine
}

/* Récupération du numéro de la semaine actuelle */
function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((diff / oneWeek) + start.getDay() / 7);
}

/* Sélection d'une date via input date */
function selectDate() {
  let datePicker = document.getElementById('datePicker');
  let selectedDate = new Date(datePicker.value);

  let year = selectedDate.getFullYear();
  let week = getWeekNumber(selectedDate);

  document.getElementById('yearSelect').value = year;
  document.getElementById('weekSelect').value = week;

  updateDays();
}

/* Calcul du numéro de semaine pour une date donnée */
function getWeekNumber(date) {
  let firstThursday = new Date(date.getFullYear(), 0, 1);
  while (firstThursday.getDay() !== 4) {
      firstThursday.setDate(firstThursday.getDate() + 1);
  }

  let diff = date - firstThursday;
  let oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((diff / oneWeek) + 1);
}

/* Gestion des changements de sélection */
function attachEventHandlers() {
  document.getElementById('yearSelect').addEventListener('change', updateDays);
  document.getElementById('weekSelect').addEventListener('change', updateDays);
  attachTaskHandlers();
}

/* Création des équipes dans le sélecteur */
function createTeams() {
  const teamSelect = document.getElementById('teamSelect');
  const teams = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'];
  teams.forEach(team => {
      let option = new Option(team, team);
      teamSelect.appendChild(option);
  });
}

/* Création des cellules pour chaque équipe et jour */
function createTaskCells() {
  const teams = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'];

  teams.forEach(team => {
      for (let i = 0; i < 7; i++) {
          let cellId = `day${i + 1}-${team}`;
          let existingCell = document.getElementById(cellId);
          if (!existingCell) {
              let cell = document.createElement('div');
              cell.id = cellId;
              cell.classList.add('task-cell');
              document.getElementById(`day${i + 1}`).appendChild(cell);
          }
      }
  });
}

/* Récupération des tâches depuis l'API OpenProject */
async function fetchTasksFromAPI() {
  const url = "https://databox.chavaroche-si.fr/openproject/api/v3/projects/54/queries/188/results";
  const apiKey = "350eda122e468ece5f00b0baa3c1f959cca3637e0c0d059567a4693185da97ac";

  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Accept": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error(`Erreur API: ${response.statusText}`);
      }

      const data = await response.json();
      displayTasks(data);
  } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
  }
}

/* Affichage des tâches dans le calendrier */
function displayTasks(data) {
  data._embedded.results.forEach(task => {
      const taskName = task.subject;
      const dueDate = task.dueDate;
      const team = "Team A"; // Modifier si une équipe est assignée

      if (dueDate) {
          let taskDate = new Date(dueDate);
          let year = taskDate.getFullYear();
          let week = getWeekNumber(taskDate);
          let dayOfWeek = taskDate.getDay();
          if (dayOfWeek === 0) dayOfWeek = 7;

          let selectedYear = parseInt(document.getElementById('yearSelect').value);
          let selectedWeek = parseInt(document.getElementById('weekSelect').value);

          if (year === selectedYear && week === selectedWeek) {
              let targetCell = document.getElementById(`day${dayOfWeek}-${team}`);
              if (targetCell) {
                  targetCell.innerHTML += `<strong>${taskName}</strong><br>`;
              }
          }
      }
  });
}

/* Gestion des tâches */
function attachTaskHandlers() {
  document.getElementById('createTaskBtn').addEventListener('click', createTask);
  document.getElementById('editTaskBtn').addEventListener('click', editTask);
  document.getElementById('deleteTaskBtn').addEventListener('click', deleteTask);
}

/* Création d'une tâche */
function createTask() {
  let taskName = document.getElementById('taskName').value;
  let team = document.getElementById('teamSelect').value;
  let details = document.getElementById('taskDetails').value;
  let dayIndex = document.getElementById('taskDay').value;

  if (!taskName || !team || !details) {
      alert("Veuillez remplir tous les champs !");
      return;
  }

  let targetCell = document.getElementById(`day${parseInt(dayIndex) + 1}-${team}`);
  if (targetCell) {
      targetCell.innerHTML = `<strong>${taskName} (${team})</strong><br>${details}`;
  }
}

/* Modification d'une tâche */
function editTask() {
  let team = document.getElementById('teamSelect').value;
  let dayIndex = document.getElementById('taskDay').value;

  let targetCell = document.getElementById(`day${parseInt(dayIndex) + 1}-${team}`);
  if (targetCell && targetCell.innerHTML !== "") {
      let newTaskName = prompt("Nouveau nom de la tâche :", targetCell.querySelector('strong')?.innerText || "");
      let newDetails = prompt("Nouveaux détails :", targetCell.innerHTML.split('<br>')[1] || "");

      if (newTaskName && newDetails) {
          targetCell.innerHTML = `<strong>${newTaskName} (${team})</strong><br>${newDetails}`;
      }
  }
}

/* Suppression d'une tâche */
function deleteTask() {
  let team = document.getElementById('teamSelect').value;
  let dayIndex = document.getElementById('taskDay').value;

  let targetCell = document.getElementById(`day${parseInt(dayIndex) + 1}-${team}`);
  if (targetCell && targetCell.innerHTML !== "") {
      if (confirm("Supprimer cette tâche ?")) {
          targetCell.innerHTML = "";
      }
  } else {
      alert("Aucune tâche à supprimer !");
  }
}

/* Rafraîchir les tâches lorsqu'on change d'année ou de semaine */
document.getElementById('yearSelect').addEventListener('change', fetchTasksFromAPI);
document.getElementById('weekSelect').addEventListener('change', fetchTasksFromAPI);
