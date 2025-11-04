document.addEventListener("DOMContentLoaded", () => {

    // --- Navbar toggle ---
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

    // --- ScrollSpy + Skills Animation ---
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar nav a");

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

        // Animate skills when visible
        const skillsSection = document.getElementById("skills");
        const skillsTop = skillsSection.offsetTop - window.innerHeight + 100;
        if (window.scrollY >= skillsTop) {
            const fills = document.querySelectorAll(".skill-fill");
            fills.forEach(fill => {
                fill.style.width = fill.getAttribute("style-width") || fill.style.width; 
            });
        }
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    // --- Projects Filter ---
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const category = btn.dataset.category;

            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            projectCards.forEach(card => {
                if (category === "all" || card.dataset.category === category) {
                    card.classList.remove("hide");
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });

    // --- Contact Form Validation ---
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();

            if (!name || !email || !message) {
                alert("Merci de remplir tous les champs.");
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert("Merci d'entrer un email valide.");
                return;
            }

            alert("Message envoyé ! (simulation)");
            contactForm.reset();
        });
    }

});
