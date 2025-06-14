let clients = JSON.parse(localStorage.getItem('clients') || '[]');
let selectedClient = 0;
let loggedIn = localStorage.getItem('loggedIn') === 'true';

function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
}

function renderLogin() {
  document.getElementById("app").innerHTML = `
    <main style="max-width:400px;margin:100px auto;text-align:center">
      <h2>Inloggen</h2>
      <input type="password" id="password" placeholder="Wachtwoord" />
      <button onclick="login()">Login</button>
    </main>
  `;
}

function login() {
  const pwd = document.getElementById('password').value;
  if (pwd === 'zorg') {
    localStorage.setItem('loggedIn', 'true');
    loggedIn = true;
    renderApp();
  } else {
    alert('Verkeerd wachtwoord');
  }
}

function logout() {
  localStorage.setItem('loggedIn', 'false');
  location.reload();
}

function renderApp() {
  if (!clients[selectedClient]) selectedClient = 0;
  const client = clients[selectedClient];
  document.getElementById("app").innerHTML = `
    <header>
      <div>Ecqare Begeleiding</div>
      <button onclick="logout()">Uitloggen</button>
    </header>
    <div id="clientBar">
      <button onclick="addClient()">+ Nieuwe Cliënt</button>
      ${clients.map((c, i) =>
        `<button class="${i === selectedClient ? 'selected' : ''}" onclick="selectClient(${i})">${c.name}</button>`
      ).join('')}
    </div>
    <main>
      <section>
        <h3>Dossier: ${client.name}</h3>
        <textarea id="notes">${client.notes || ''}</textarea>
        <button onclick="saveNotes()">Notities opslaan</button>
      </section>
      <section>
        <h3>Dagboek</h3>
        <textarea id="diary">${client.diary || ''}</textarea>
        <button onclick="saveDiary()">Dagboek opslaan</button>
      </section>
      <section>
        <h3>Taken</h3>
        <ul class="list">${(client.tasks || []).map((t, i) =>
          `<li><input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleTask(${i})"> ${t.name}</li>`
        ).join('')}</ul>
        <input type="text" id="newTask" placeholder="Nieuwe taak..." />
        <button onclick="addTask()">Toevoegen</button>
      </section>
      <section>
        <h3>Medicatie</h3>
        <ul class="list">${(client.medication || []).map((m, i) =>
          `<li><input type="checkbox" ${m.done ? "checked" : ""} onchange="toggleMed(${i})"> ${m.name}</li>`
        ).join('')}</ul>
        <input type="text" id="newMed" placeholder="Nieuwe medicatie..." />
        <button onclick="addMed()">Toevoegen</button>
      </section>
      <section>
        <h3>Activiteiten</h3>
        <ul class="list">${(client.activities || []).map(a =>
          `<li>${a.name} op ${a.datetime}</li>`
        ).join('')}</ul>
        <input type="text" id="newAct" placeholder="Activiteit..." />
        <input type="datetime-local" id="newTime" />
        <button onclick="addActivity()">Toevoegen</button>
      </section>
    </main>
  `;
}

function addClient() {
  const name = prompt("Naam cliënt?");
  if (name) {
    clients.push({ name, notes: '', diary: '', tasks: [], medication: [], activities: [] });
    selectedClient = clients.length - 1;
    saveClients();
    renderApp();
  }
}

function selectClient(i) {
  selectedClient = i;
  renderApp();
}

function saveNotes() {
  clients[selectedClient].notes = document.getElementById('notes').value;
  saveClients();
}

function saveDiary() {
  clients[selectedClient].diary = document.getElementById('diary').value;
  saveClients();
}

function addTask() {
  const val = document.getElementById('newTask').value;
  if (val) {
    clients[selectedClient].tasks.push({ name: val, done: false });
    saveClients();
    renderApp();
  }
}

function toggleTask(i) {
  clients[selectedClient].tasks[i].done = !clients[selectedClient].tasks[i].done;
  saveClients();
  renderApp();
}

function addMed() {
  const val = document.getElementById('newMed').value;
  if (val) {
    clients[selectedClient].medication.push({ name: val, done: false });
    saveClients();
    renderApp();
  }
}

function toggleMed(i) {
  clients[selectedClient].medication[i].done = !clients[selectedClient].medication[i].done;
  saveClients();
  renderApp();
}

function addActivity() {
  const name = document.getElementById('newAct').value;
  const datetime = document.getElementById('newTime').value;
  if (name && datetime) {
    clients[selectedClient].activities.push({ name, datetime });
    saveClients();
    renderApp();
  }
}

if (loggedIn) renderApp();
else renderLogin();
