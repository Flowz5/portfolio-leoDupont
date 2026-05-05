document.addEventListener("DOMContentLoaded", () => {
    // --- GESTION DU MENU ET DU THEME ---
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

    // --- GESTION DU SCROLL ACTIF ---
    const sections = document.querySelectorAll("section");

    function onScroll() {
        let current = "";
        
        const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 60;

        if (isAtBottom) {
            current = sections[sections.length - 1].getAttribute("id");
        } else {
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute("id");
                }
            });
        }

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

    // =========================================================
    // NOUVELLES FONCTIONNALITÉS
    // =========================================================

    // --- 1. BOUTONS MAGNÉTIQUES ---
    const magneticButtons = document.querySelectorAll('.btn-primary');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 2. PALETTE DE COMMANDES (CTRL+K) ---
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');

    // Base de données des commandes
    const commands = [
        { title: "Aller à l'Accueil", icon: "fa-home", action: () => window.location.hash = '#accueil' },
        { title: "Voir le profil", icon: "fa-user", action: () => window.location.hash = '#about' },
        { title: "Explorer les projets", icon: "fa-code", action: () => window.location.hash = '#projects' },
        { title: "Me contacter", icon: "fa-envelope", action: () => window.location.hash = '#contact' },
        { title: "Ouvrir le Terminal", icon: "fa-terminal", action: () => { window.location.hash = '#terminal-section'; document.getElementById('terminal-input').focus(); } },
        { title: "Voir mon CV", icon: "fa-file-alt", action: () => window.open('./CV/index.html', '_blank') },
        { title: "Changer le thème", icon: "fa-moon", action: () => themeToggle.click() },
        { title: "Voir le GitHub", icon: "fa-github", action: () => window.open('https://github.com/Flowz5', '_blank') }
    ];

    function toggleCmdPalette() {
        if (cmdPalette.classList.contains('hidden')) {
            cmdPalette.classList.remove('hidden');
            cmdInput.value = '';
            renderCmdResults(commands);
            setTimeout(() => cmdInput.focus(), 100);
        } else {
            cmdPalette.classList.add('hidden');
            cmdInput.blur();
        }
    }

    function renderCmdResults(results) {
        cmdResults.innerHTML = '';
        if (results.length === 0) {
            cmdResults.innerHTML = '<li style="padding: 15px 20px; color: var(--text-muted);">Aucun résultat trouvé.</li>';
            return;
        }
        results.forEach(cmd => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.innerHTML = `<i class="fas ${cmd.icon}"></i> ${cmd.title}`;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                cmd.action();
                toggleCmdPalette();
            });
            li.appendChild(a);
            cmdResults.appendChild(li);
        });
    }

    // Écouteur de raccourci clavier
    document.addEventListener('keydown', (e) => {
        // Ctrl+K ou Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCmdPalette();
        }
        // Fermer avec Échap
        if (e.key === 'Escape' && !cmdPalette.classList.contains('hidden')) {
            toggleCmdPalette();
        }
    });

    // Filtre de recherche interactif
    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = commands.filter(cmd => cmd.title.toLowerCase().includes(term));
            renderCmdResults(filtered);
        });
    }

    // Fermer en cliquant à l'extérieur
    cmdPalette.addEventListener('click', (e) => {
        if (e.target === cmdPalette) toggleCmdPalette();
    });

    // --- 3. TERMINAL INTERACTIF ---
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    const terminalLogic = {
        'help': "Commandes disponibles :<br>- <strong>ctrl+K</strong> : Ouvrir la palette de commandes</strong> : En savoir plus sur moi<br>- <strong>skills</strong> : Afficher mes compétences clés<br>- <strong>contact</strong> : Mes informations de contact<br>- <strong>clear</strong> : Nettoyer le terminal",
        'whoami': "<span class='info'>Étudiant passionné en BTS SIO SLAM. Je construis des choses avec du code.</span>",
        'skills': "<span class='success'>Python, JavaScript, SQL, HTML/CSS, Git, C#, Linux.</span>",
        'contact': "Email: <a href='mailto:dupontleo999@gmail.com' style='color:#79c0ff;'>dupontleo999@gmail.com</a><br>GitHub: <a href='https://github.com/Flowz5' target='_blank' style='color:#79c0ff;'>Flowz5</a>"
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim().toLowerCase();
                this.value = '';

                terminalOutput.innerHTML += `<p><span class="prompt">guest@portfolio:~$</span> ${command}</p>`;

                if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                } else if (command === '') {
                } else if (terminalLogic[command]) {
                    terminalOutput.innerHTML += `<p>${terminalLogic[command]}</p>`;
                } else {
                    terminalOutput.innerHTML += `<p class="error">Commande introuvable : ${command}. Tapez 'help' pour la liste.</p>`;
                }

                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
        
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
});