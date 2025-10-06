// --- Navbar toggle ---
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const toggleBtn = document.getElementById("toggle-btn");

    if (window.innerWidth > 600) navbar.classList.add("nav-open");
    else navbar.classList.add("nav-closed");

    toggleBtn.addEventListener("click", () => {
        navbar.classList.toggle("nav-open");
        navbar.classList.toggle("nav-closed");
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 600) {
            navbar.classList.add("nav-open");
            navbar.classList.remove("nav-closed");
        } else {
            navbar.classList.add("nav-closed");
            navbar.classList.remove("nav-open");
        }
    });
});

// --- About Me Carousel ---
const slides = document.querySelectorAll("#about-carousel .carousel-slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentSlide = 0;

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
    });
}

// Initial setup
updateCarousel();

// Buttons
prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
});
nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
});

// Auto slide
setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}, 5000);
