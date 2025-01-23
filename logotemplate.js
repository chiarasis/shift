document.addEventListener("DOMContentLoaded", () => {
    // Leggi il parametro "name" dall'URL
    const params = new URLSearchParams(window.location.search);
    const logoName = params.get("name");

    // Verifica se il parametro esiste
    if (!logoName) {
        document.getElementById("layout").innerHTML = "<p>Logo not found!</p>";
        return;
    }

    // Carica i dati dal file JSON
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            // Cerca il logo corrispondente
            const logoData = data.find(item => item.name === logoName);

            if (!logoData) {
                document.getElementById("layout").innerHTML = "<p>Logo not found!</p>";
                return;
            }

            // Popola i dati nel layout
            document.getElementById("name").textContent = logoData.name;
            document.querySelector("#logo-grande img").src = logoData.logo_image ;

            document.getElementById("related_versions_1").textContent = logoData.related_version_1 ;
            document.querySelectorAll("#related-versions img")[0].src = logoData.related_version_1_img ;

            document.getElementById("related_versions_2").textContent = logoData.related_version_2 ;
            document.querySelectorAll("#related-versions img")[1].src = logoData.related_version_2_img ;

            document.getElementById("logo-description").textContent = logoData.description;
            document.getElementById("serial number").textContent = logoData.serial_number || "Not Available";
            document.getElementById("permalink").textContent = logoData.permalink || "Not Available";
            document.getElementById("tags").textContent = logoData.tags || "Not Available";
            document.getElementById("last-update").textContent = logoData.last_update || "Not Available";

            document.getElementById("original-timeline").textContent = logoData["original-timeline"] || "Not Available";
            document.getElementById("shifted-timelines").textContent = logoData["shifted-timelines"] || "Not Available";
            document.getElementById("year").textContent = logoData.year || "Not Available";
            document.getElementById("shift-type").textContent = logoData.shift_type.join(", ") || "Not Available";

            document.querySelectorAll(".colonne-description img")[0].src = logoData.shift_type_img[0] || "images/default_shift.png";
            document.querySelectorAll(".colonne-description img")[1].src = logoData.shift_type_img[1] || "images/default_shift.png";

            // Caricamento delle immagini della gallery
            const gallery = document.querySelector('.gallery');
            gallery.innerHTML = ""; // Svuota la gallery esistente
            logoData.gallery.forEach(imageSrc => {
                const img = document.createElement("img");
                img.src = imageSrc;
                gallery.appendChild(img);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento del file JSON:", error);
            document.getElementById("layout").innerHTML = "<p>Errore nel caricamento dei dati.</p>";
        });
});

// Funzionalità della gallery
const gallery = document.querySelector('.gallery');
const arrowLeft = document.querySelector('#arrows img:first-child'); // Freccia sinistra
const arrowRight = document.querySelector('#arrows img:last-child'); // Freccia destra

// Imposta variabili
let currentPosition = 0; // Posizione iniziale della gallery
const slideWidth = 529; // Larghezza immagine (309px + 20px di padding-right)

let isAnimating = false;

function updateGalleryPosition(direction) {
    if (isAnimating) return; // Blocca i clic multipli
    isAnimating = true;

    // Ottieni la larghezza dell'immagine
    const imageWidth = gallery.firstElementChild.offsetWidth;

    // Applica la transizione per muovere la gallery
    gallery.style.transition = "transform 0.4s ease";
    
    // Muovi la galleria
    if (direction === "right") {
        gallery.style.transform = `translateX(-${imageWidth}px)`;
    } else {
        gallery.style.transform = `translateX(${imageWidth}px)`;
    }

    // Dopo l'animazione, riordina gli elementi per creare l'effetto infinito
    setTimeout(() => {
        gallery.style.transition = "none"; // Disattiva la transizione temporaneamente
        if (direction === "right") {
            const firstImage = gallery.firstElementChild;
            gallery.appendChild(firstImage); // Sposta la prima immagine alla fine
        } else {
            const lastImage = gallery.lastElementChild;
            gallery.insertBefore(lastImage, gallery.firstElementChild); // Sposta l'ultima immagine all'inizio
        }

        // Resetta la posizione senza animazione
        gallery.style.transform = "translateX(0)";
        isAnimating = false;
    }, 400); // Durata dell'animazione
}

// Event Listeners per le frecce
arrowLeft.addEventListener("click", () => updateGalleryPosition("left"));
arrowRight.addEventListener("click", () => updateGalleryPosition("right"));
