document.addEventListener("DOMContentLoaded", () => {
    // Leggi il parametro "name" dall'URL
    const params = new URLSearchParams(window.location.search);
    const logoName = params.get("name");

    // Verifica se il parametro esiste
    if (!logoName) {
        document.querySelector(".layout").innerHTML = "<p>Logo not found!</p>";
        return;
    }

    // Funzione per caricare i dati da un singolo file JSON
    const fetchData = async () => {
        try {
            const data = await fetch("data.json").then(response => response.json());
            return data; // Restituisce solo i dati di data.json
        } catch (error) {
            console.error("Errore nel caricamento del file JSON:", error);
            document.querySelector(".layout").innerHTML = "<p>Errore nel caricamento dei dati.</p>";
            throw error;
        }
    };

    fetchData().then(data => {
        // Cerca il logo corrispondente
        const logoData = data.find(item => item.name === logoName);

        if (!logoData) {
            document.querySelector(".layout").innerHTML = "<p>Logo not found!</p>";
            return;
        }

        // Popola i dati nel layout
        document.getElementById("name").textContent = logoData.name;
        document.querySelector("#logo-grande img").src = logoData.logo_image || "images/default_logo.png";

        // Popola le versioni correlate
        const relatedContainer = document.querySelector("#related-versions");
        const relatedImages = document.querySelectorAll("#related-versions img");
        const relatedTexts = [
            "related_versions_1",
            "related_versions_2",
            "related_versions_3",
            "related_versions_4"
        ];

        relatedTexts.forEach((key, index) => {
            const relatedTextElement = document.getElementById(key);
            if (logoData[key]) {
                relatedTextElement.textContent = logoData[key];
                relatedImages[index].src = logoData[`${key}_img`] || "images/default_related.png";
            } else {
                // Nasconde il campo e l'immagine se i dati non esistono
                relatedTextElement.parentElement.style.display = "none";
            }
        });

        // Popola i dettagli
        document.getElementById("logo-description").textContent = logoData.description || "Not Available";
        document.getElementById("serial number").textContent = logoData.serial_number || "Not Available";
        document.getElementById("permalink").textContent = logoData.permalink || "Not Available";
        document.getElementById("tags").textContent = logoData.tags || "Not Available";
        document.getElementById("last-update").textContent = logoData.last_update || "Not Available";

        document.getElementById("original-timeline").textContent = logoData["original-timeline"] || "Not Available";
        document.getElementById("shifted-timelines").textContent = logoData["shifted-timelines"] || "Not Available";
        document.getElementById("year").textContent = logoData.year || "Not Available";
        document.getElementById("shift-type").textContent = logoData.shift_type?.join(", ") || "Not Available";

        // Immagini del tipo di shift
        // Immagini del tipo di shift
const shiftImages = document.querySelectorAll("#shift-tipo img");
if (logoData.shift_type_img) {
    shiftImages.forEach((img, index) => {
        if (logoData.shift_type_img[index]) {
            img.src = logoData.shift_type_img[index]; // Usa l'immagine specificata
        } else {
            img.style.display = "none"; // Nascondi l'immagine se non esiste
        }
    });
} else {
    // Se shift_type_img non è presente, nascondi tutte le immagini
    shiftImages.forEach(img => img.style.display = "none");
}


        // Caricamento della gallery
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = ""; // Svuota la gallery esistente
        if (logoData.gallery) {
            logoData.gallery.forEach(imageSrc => {
                const img = document.createElement("img");
                img.src = imageSrc;
                gallery.appendChild(img);
            });
        }
    });

    // Funzionalità della gallery
    const gallery = document.querySelector('.gallery');
    const arrowLeft = document.querySelector('#arrows img:first-child'); // Freccia sinistra
    const arrowRight = document.querySelector('#arrows img:last-child'); // Freccia destra

    let isAnimating = false;

    // Funzione per spostare la gallery
    function updateGalleryPosition(direction) {
        if (isAnimating) return; // Blocca i clic multipli
        isAnimating = true;

        const imageWidth = gallery.firstElementChild.offsetWidth; // Calcola la larghezza dell'immagine
        const spacing = 10; // Spazio tra le immagini

        gallery.style.transition = "transform 0.4s ease"; // Aggiungi transizione per il movimento orizzontale
        gallery.style.transform = direction === "right"
            ? `translateX(-${imageWidth + spacing}px)` // Sposta a sinistra per "right"
            : `translateX(${imageWidth + spacing}px)`;  // Sposta a destra per "left"

        // Dopo 0.4s (tempo della transizione), riorganizza le immagini
        setTimeout(() => {
            gallery.style.transition = "none"; // Disabilita transizione per il riordino
            if (direction === "right") {
                gallery.appendChild(gallery.firstElementChild); // Sposta la prima immagine alla fine
            } else {
                gallery.insertBefore(gallery.lastElementChild, gallery.firstElementChild); // Sposta l'ultima immagine all'inizio
            }

            // Ripristina la posizione senza transizione
            gallery.style.transform = "translateX(0)";
            isAnimating = false; // Permetti un nuovo click
        }, 400); // Allinea il tempo con la durata della transizione
    }

    // Eventi di click per le frecce della gallery
    arrowLeft.addEventListener("click", () => updateGalleryPosition("left"));
    arrowRight.addEventListener("click", () => updateGalleryPosition("right"));

    // Funzionalità per le immagini correlate
    const relatedImages = document.querySelectorAll('#related-versions img');
    relatedImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            const relatedLogoName = logoData[`related_versions_${index + 1}`]; // Ottieni il nome della versione correlata
            if (relatedLogoName) {
                window.location.href = `logotemplate.html?name=${relatedLogoName}`;
            }
        });
    });
});
