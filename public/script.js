document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const toggleBtn = document.getElementById("toggle-btn");

    const themeToggle = document.getElementById('theme-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateToggleUI(true);
    }

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateToggleUI(isLight);
    });

    function updateToggleUI(isLight) {
        if (isLight) {
            toggleIcon.classList.replace('fa-moon', 'fa-sun');
            toggleIcon.style.transform = 'rotate(180deg)';
            themeText.textContent = 'Mode Clair';
        } else {
            toggleIcon.classList.replace('fa-sun', 'fa-moon');
            toggleIcon.style.transform = 'rotate(0deg)';
            themeText.textContent = 'Mode Sombre';
        }
    }

    if(toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            navbar.classList.toggle("nav-open");
        });
    }

    const navLinks = document.querySelectorAll(".navbar nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 1024) {
                navbar.classList.remove("nav-open");
            }
        });
    });

    const sections = document.querySelectorAll("section");

    function onScroll() {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollTopBtn.classList.add('active');
            else scrollTopBtn.classList.remove('active');
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});