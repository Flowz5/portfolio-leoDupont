const navbar = document.getElementById("navbar");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
    navbar.classList.toggle("hidden");
});
