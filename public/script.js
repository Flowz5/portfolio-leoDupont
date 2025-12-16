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

    // --- ScrollSpy system ---
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar nav a");

    function onScroll() {
        let current = "";

        // Find which section is currently visible
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        // Highlight the active link
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", onScroll);
    onScroll(); // run once at load


    // --- ACCORDÉON COMPÉTENCES (MOBILE) ---
    const skillHeaders = document.querySelectorAll('.skill-header');

    skillHeaders.forEach(header => {
        header.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            const parent = header.parentElement;
            parent.classList.toggle('open');
        });
    });

    // --- NOUVEAU : Année dynamique (Footer) ---
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- NOUVEAU : Bouton Retour en haut (Scroll To Top) ---
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        // Si on a scrollé de plus de 300px, on affiche le bouton
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});