dropdownMenu.classList.toggle("active"); // Mostra/nasconde il menu
menuIcona.classList.toggle("active"); // Cambia l'icona

// Chiude il menu cliccando fuori
document.addEventListener("click", function (event) {
if (!menuIcona.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove("active");
    menuIcona.classList.remove("active");
}
});
