// Riferimento al contenitore principale
const archiveContainer = document.getElementById('archive-container');

// Variabile per memorizzare i dati del JSON
let archiveData = [];

// Stato dei filtri attivi
let activeFilters = {
  category: null,
  timeline: null,
};

// Carica i dati dal file JSON
fetch('archive.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Errore nel caricamento del file JSON');
    }
    return response.json(); // Parsing JSON
  })
  .then(data => {
    archiveData = data; // Salva i dati in una variabile globale
    renderArchiveItems(data); // Visualizza tutti gli elementi inizialmente
  })
  .catch(error => {
    console.error('Errore:', error);
  });

// Funzione per generare e visualizzare gli elementi
function renderArchiveItems(items) {
  archiveContainer.innerHTML = ''; // Svuota il contenitore
  items.forEach(item => {
    const archiveItem = document.createElement('div');
    archiveItem.classList.add('archive-item');
    
    // Aggiungi il contenuto HTML dell'elemento dell'archivio
    archiveItem.innerHTML = `
    <div id="linee-archivio">
      <div class="archive-container">
        <div><img src="${item.logo}" alt="${item.name}"></div>
        <div id="name"><p>${item.name}</p></div>
        <div id="timeline"><p>${item.timeline}</p></div>
        <div id="shiftedTimelines"><p>${item.shiftedTimelines}</p></div>
        <div id="category"><p>${item.category}</p></div>
      </div>
    </div>  
    `;

    // Evento di click per reindirizzare sempre a logotemplate.html
archiveItem.addEventListener("click", () => {
  window.location.href = `logotemplate.html?name=${encodeURIComponent(item.name)}`;
});
    

    
    archiveContainer.appendChild(archiveItem);
  });

  // Mostra un messaggio se non ci sono risultati
  if (items.length === 0) {
    const noResults = document.createElement('div');
    noResults.classList.add('no-results');
    noResults.textContent = 'Nessun elemento trovato.';
    archiveContainer.appendChild(noResults);
  }
}

// Funzione per aggiungere il footer separatamente
function addFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <section class="footer"> 
      <div id="logofooter">
          <img src="assets/logo senza descrittore-08.png">
      </div>
      <div class="column">
          <h3>EXPLORE</h3>
          <a href="index.html">HOME</a>
          <a href="about.html">ABOUT</a>
          <a href="archive.html">ARCHIVE</a>
          <a href="timeline.html">TIMELINE</a>
          <a href="dossier.html">DOSSIER</a>
          <a href="report.html">REPORT DECOHERENCE</a>
      </div>
      <div class="column">
          <h3>SHIFT PAVILION</h3>
          <p>Rue du Mont-Blanc 10,<br>1201 Genève, Switzerland</p>
          <p><strong>Monday:</strong> Closed<br>
             <strong>Thursday - Friday:</strong> 10:30 a.m. - 06:00 p.m.<br>
             <strong>Saturday - Sunday:</strong> 11:00 a.m. - 05:00 p.m.</p>
      </div>
      <div class="column">
          <h3>CONTACTS</h3>
          <p>info@shift.ch </p>
          <p>administration@shift.ch</p>
          <p>press@shift.ch</p>
          <div class="icons">
             <img src="assets/icona x-02.svg">
             <img src="assets/icona ig-02.svg">
             <img src="assets/icona yt-02.svg">
             <img src="assets/icona facebook-02.svg">  
          </div>
      </div>
      <div class="column legal">
          <h3>LEGAL AREA</h3>
          <p>Accessibility</p>
          <p>Privacy policy</p>
          <p>Terms and conditions</p>
          <p>Cookies</p>
          <p>Budget & annual reports</p>
      </div>
    </section>
    <div class="bottom-note">
        Website conform to WCAG 2.1 standard © 2024 SHIFT institute
    </div>
  `;

  // Aggiungi il footer al body (fuori da archiveContainer)
  document.body.appendChild(footer);
}

// Aggiungi il footer dopo aver caricato gli elementi dell'archivio
addFooter();

// Funzione per filtrare i dati in base ai filtri attivi
function applyFilters() {
  // Filtra i dati
  const filteredItems = archiveData.filter(item => {
    const matchesCategory = !activeFilters.category || item.category.trim().toLowerCase() === activeFilters.category;
    const matchesTimeline = !activeFilters.timeline || item.timeline.trim().toLowerCase() === activeFilters.timeline;
    return matchesCategory && matchesTimeline;
  });

  // Visualizza i risultati filtrati
  renderArchiveItems(filteredItems);
}

// Funzione per gestire i clic sui bottoni dei filtri
function handleFilterClick(button, filterType) {
  const filterValue = button.getAttribute(`data-${filterType}`).trim().toLowerCase();

  // Se il filtro è già attivo, disattivalo
  if (activeFilters[filterType] === filterValue) {
    activeFilters[filterType] = null;
    button.classList.remove('active');
  } else {
    // Attiva il filtro selezionato
    activeFilters[filterType] = filterValue;

    // Rendi attivo il bottone
    document.querySelectorAll(`.filter-btn[data-${filterType}]`).forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  }

  // Resetta i filtri se vengono selezionati più di due
  if (Object.values(activeFilters).filter(Boolean).length > 2) {
    activeFilters = { category: null, timeline: null };
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  }

  // Applica i filtri
  applyFilters();
}

// Aggiungi eventi di clic ai bottoni dei filtri di categoria
document.querySelectorAll('.filter-btn[data-category]').forEach(button => {
  button.addEventListener('click', () => handleFilterClick(button, 'category'));
});

// Aggiungi eventi di clic ai bottoni dei filtri di timeline
document.querySelectorAll('.filter-btn[data-timeline]').forEach(button => {
  button.addEventListener('click', () => handleFilterClick(button, 'timeline'));
});
