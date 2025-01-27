// Seleziona i bottoni, i div container, le immagini e i quadratini
const filterButtons = document.querySelectorAll(".filter-btn");
const containers = document.querySelectorAll(".container");
const universiImages = document.querySelectorAll("#lineeUniversi img");
const containerImages = document.querySelectorAll(".container img");
const squaresContainer = document.getElementById("squares-container"); // Contenitore dei quadratini
let activeFilters = [];

// Funzione per aggiornare la visibilità e l'opacità delle immagini di lineeUniversi
function updateImagesVisibility() {
  if (activeFilters.length === 0) {
    // Mostra tutte le immagini con opacità 1
    universiImages.forEach((image) => {
      image.style.visibility = "visible";
      image.style.opacity = "1";
    });

    containerImages.forEach((image) => {
      image.style.visibility = "visible";
    });
  } else {
    // Mostra solo le immagini corrispondenti al filtro
    universiImages.forEach((image) => {
      const matchesFilter = activeFilters.some((filter) =>
        image.id.includes(filter)
      );
      if (matchesFilter) {
        image.style.visibility = "visible";
        image.style.opacity = "1"; // Opacità piena per immagini corrispondenti
      } else {
        image.style.visibility = "visible"; // Mantiene visibili le immagini
        image.style.opacity = "0.2"; // Opacità ridotta per immagini non corrispondenti
      }
    });

    containerImages.forEach((image) => {
      const matchesFilter = activeFilters.some((filter) =>
        image.id.includes(filter)
      );
      if (matchesFilter) {
        image.style.visibility = "visible"; // Mostra immagini corrispondenti
      } else {
        image.style.visibility = "hidden"; // Nasconde immagini non corrispondenti
      }
    });
  }
}

// Aggiungi evento click a ogni bottone per gestire i filtri
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.textContent.trim().toLowerCase(); // Ottieni il filtro dal bottone

    if (activeFilters.includes(filter)) {
      // Rimuovi il filtro se è già attivo
      activeFilters = activeFilters.filter((f) => f !== filter);
      button.classList.remove("active");
    } else {
      // Aggiungi il filtro se non è già attivo
      activeFilters.push(filter);
      button.classList.add("active");
    }

    // Se vengono selezionati più di 4 filtri, resetta tutto
    if (activeFilters.length > 4) {
      activeFilters = [];
      filterButtons.forEach((btn) => btn.classList.remove("active"));
    }

    // Aggiorna la visibilità delle immagini
    updateImagesVisibility();
  });
});

// Funzione per animare progressivamente le immagini di "lineeUniversi" con clip-path
function animateUniversiImagesOnScroll() {
  const scrollY = window.scrollY;
  const universiHeight = document.getElementById("lineeUniversi").offsetHeight;

  const revealAmount = (scrollY / universiHeight) * 103;
  const cropAmount = Math.min(100, 100 - revealAmount); // Calcola il taglio progressivo

  universiImages.forEach((image) => {
    if (image.style.visibility === "visible") {
      image.style.clipPath = `inset(0 0 ${cropAmount}% 0)`; // Applica il taglio progressivo
    }
  });
}

// Funzione per animare progressivamente i container con opacità
function revealContainers() {
  containers.forEach((container, index) => {
    const rect = container.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => {
        container.classList.add("visible");
        container.style.opacity = "1";
        container.style.transition = "opacity 0.4s ease-in-out";
      }, index * 20);
    } else {
      container.style.opacity = "0"; // Nasconde i container non visibili
    }
  });
}

// Imposta opacità iniziale per tutti i container
containers.forEach((container) => {
  container.style.opacity = "0";
});

// Aggiungi evento scroll per animare i container e le immagini di lineeUniversi
window.addEventListener("scroll", () => {
  revealContainers();
  animateUniversiImagesOnScroll();
});

// Avvia le funzioni all'inizio
updateImagesVisibility();
revealContainers();

// Funzione per creare i quadratini con animazione di opacità
function createSquares(data) {
  data.forEach((item) => {
    // Crea il quadratino
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.top = item.top;
    square.style.left = item.left;

    // Crea il rettangolo di testo
    const text = document.createElement("div");
    text.classList.add("square-text");
    text.innerHTML = `
      <div id="quadratino"> </div>
      <div>${item.date}</div>
      <hr>
      <div><strong>Shifted timelines:</strong></div>
      <div>${item.timelines}</div>
      <div><strong>Decoherence type:</strong></div>
      <div>${item.dectype}</div>
      <div><strong>Generating event:</strong></div>
      <div>${item.event.replace(/\n/g, "<br>")}</div>
    `;

    // Aggiungi il quadratino e il testo al contenitore
    squaresContainer.appendChild(square);
    squaresContainer.appendChild(text);

    // Mostra il testo accanto al quadratino al passaggio del mouse
    square.addEventListener("mouseover", () => {
      text.style.display = "block";

      // Calcola la posizione accanto al quadratino
      const squareTop = square.offsetTop; // Coordinata verticale
      const squareLeft = square.offsetLeft; // Coordinata orizzontale

      text.style.top = `${squareTop}px`; // Allinea verticalmente
      text.style.left = `${squareLeft + square.offsetWidth + 10}px`; // Aggiungi offset a destra
    });

    // Nascondi il testo quando il mouse esce
    square.addEventListener("mouseout", () => {
      text.style.display = "none";
    });

    // Animazione di opacità per i quadratini durante lo scroll
    square.style.opacity = "0"; // Impostazione iniziale dell'opacità a 0
    const checkVisibility = () => {
      const rect = square.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        square.style.transition = "opacity 0.7s ease-in-out";
        square.style.opacity = "1"; // Fa comparire il quadrato
      }
    };
    window.addEventListener("scroll", checkVisibility);
    checkVisibility(); // Esegui il controllo subito per ogni quadratino
  });
}

// Carica il file JSON
fetch("timeline.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Errore nel caricamento del file JSON");
    }
    return response.json();
  })
  .then((data) => {
    createSquares(data);
  })
  .catch((error) => {
    console.error("Errore:", error);
  });