document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("menutendina");

    menuIcon.addEventListener("click", function () {
        this.classList.toggle("active");
    });

    // Chiude il menu se si clicca fuori
    document.addEventListener("click", function (event) {
        if (!menuIcon.contains(event.target)) {
            menuIcon.classList.remove("active");
        }
    });
});
