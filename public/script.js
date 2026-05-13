document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // 1. VARIABLES GLOBALES
    // =========================================================
    let currentLang = localStorage.getItem('lang') || 'fr';
    let currentCommands = [];

    const translations = {
        fr: {
            role: "Étudiant en BTS SIO - Option SLAM",
            status: "En ligne",
            nav_search: "Recherche", nav_home: "Accueil", nav_about: "À Propos", nav_path: "Parcours",
            nav_services: "Services", nav_skills: "Compétences", nav_projects: "Projets", nav_terminal: "Terminal & Veille",
            nav_contact: "Contact", nav_cv: "Mon CV", theme_dark: "Mode Sombre", theme_light: "Mode Clair",
            skip_link: "Aller au contenu principal",
            hero_title: "Léo Dupont <span class='accent-text'>portfolio</span>",
            hero_dev: "Développeur Application & Web",
            hero_desc: "Passionné par le code et la technologie, je transforme des problèmes complexes en solutions logiques, propres et fonctionnelles.",
            btn_view_cv: "Voir mon CV", btn_dl_pdf: "Télécharger PDF",
            about_title: "Qui suis-je ?", about_h1: "<i class='fas fa-terminal'></i> Tech & Rigueur",
            about_p1: "Ce qui m'anime, c'est de <strong>créer des choses utiles</strong> et d'être toujours à jour sur la tech. Que ce soit une automatisation en Python ou une application, j'aime voir le résultat concret de mon code. Je suis très exigeant sur la qualité : je ne supporte pas de laisser un bug traîner ou de voir un code mal organisé. Pour moi, un code doit être aussi lisible que fonctionnel.",
            about_p2: "Mon objectif est de poursuivre mes études pour maîtriser toutes les notions d'architecture logicielle et devenir un <strong>Développeur Software</strong> complet.",
            about_h2: "<i class='fas fa-microchip'></i> Logique & Résolution de Problèmes",
            about_p3: "Ma curiosité pour le fonctionnement interne des systèmes m'a naturellement conduit vers la programmation. Ce qui m'intéresse, c'est de comprendre comment transformer une logique abstraite en un système fonctionnel.",
            about_p4: "Mes premiers projets (comme le développement de mécaniques de jeu ou la modélisation 3D avec Blender) ont été d'excellents exercices pour maîtriser la gestion des états, l'optimisation des ressources et l'algorithmie complexe.",
            path_title: "Mon Parcours", path_d1: "Depuis 2025", path_s1: "Lycée La Colinière, Nantes",
            path_p1: "Spécialisation en <strong>Solutions Logicielles et Applications Métiers</strong>. Apprentissage approfondi du développement, de la gestion de données et de la cybersécurité.",
            path_t2: "Baccalauréat Général", path_s2: "Mention Assez Bien",
            path_p2: "Spécialités <strong>Mathématiques</strong> et <strong>NSI</strong> (Numérique et Sciences Informatiques). Acquisition des bases solides en algorithmique et logique de programmation.",
            path_d3: "Avant 2023", path_t3: "Découverte & Stages", path_p3: "Plusieurs stages d'observation en entreprise qui ont confirmé ma volonté de travailler dans le secteur du numérique et du développement.",
            services_title: "Ce que je peux faire", serv_t1: "Développement Logiciel",
            serv_p1: "Création d'outils, de scripts d'automatisation (Python) ou de petites applications Windows (C#). J'aime construire la logique cachée derrière les interfaces.",
            serv_t2: "Intégration Web", serv_p2: "Transformation de maquettes ou d'idées en pages Web réelles et responsives. Je m'assure que le HTML/CSS est propre et respecte les standards.",
            serv_t3: "Data & Automatisation", serv_p3: "Développement de scripts Python pour automatiser des tâches (Web Scraping), manipuler des données et les stocker en base SQL. J'aime rendre les processus efficaces.",
            skills_title: "Stack Technique", skill_t1: "<i class='fas fa-code'></i> Langages & Web", skill_t2: "<i class='fas fa-database'></i> Data & Back", skill_t3: "<i class='fas fa-tools'></i> Outils & Créa",
            skill_sql: "Requêtes / Jointures", skill_algo: "Algorithmique", skill_blend: "Blender (Modé/Anim)",
            projects_title: "Réalisations", projects_sub: "Des projets pour apprendre, tester et créer.",
            proj_1: "<strong>Le défi :</strong> Concevoir un assistant IA privé et autonome. Déploiement de modèles de langage en local avec Ollama, orchestration via LangChain, et intégration d'une mémoire vectorielle ChromaDB pour interroger des documents personnels avec Streamlit.",
            proj_2: "<strong>Le défi :</strong> Solution complète de Business Intelligence. Collecte automatisée (Scraping), stockage BDD et restitution via un <strong>Dashboard interactif Streamlit</strong> (KPIs, Analyse sémantique).",
            proj_3: "<strong>Le défi :</strong> Moteur de recherche intégré à l'OS (Hyprland). Permet de scraper les docs officielles et d'afficher des <strong>Cheat Sheets</strong> de code instantanément sans quitter le clavier.",
            proj_4: "<strong>Le défi :</strong> Créer un moteur de classification d'images \"Human-in-the-loop\". Utilisation du modèle CLIP pour l'extraction de caractéristiques visuelles et de ChromaDB pour mémoriser les corrections en temps réel via une interface terminale avancée.",
            proj_5: "<strong>Le défi :</strong> Recréer le célèbre jeu d'arcade en JavaScript. Gestion de la physique, des collisions et du score en temps réel.",
            proj_6: "<strong>Le défi :</strong> Explorer la <strong>Computer Vision</strong> pour détecter et suivre les mains en temps réel via webcam. Utilisation de l'algorithme <strong>MediaPipe</strong> pour mapper 21 points de repère (landmarks) avec une latence minimale.",
            btn_code: "Voir le code", btn_play: "Jouer au jeu",
            terminal_title: "Terminal", terminal_sub: "Un petit aperçu en ligne de commande. Essayez de taper 'help'.",
            term_welcome: "Tapez 'help' pour afficher la liste des commandes disponibles.",
            veille_title: "Veille Technologique", veille_sub: "Actualités et tendances en développement et IA.",
            read_article: "Lire l'article",
            contact_title: "Me Contacter", btn_send: "Envoyer le message",
            form_name: "Votre Nom", form_email: "Votre Email", form_msg: "Votre Message"
        },
        en: {
            role: "BTS SIO Student - SLAM Option",
            status: "Online",
            nav_search: "Search", nav_home: "Home", nav_about: "About", nav_path: "Journey",
            nav_services: "Services", nav_skills: "Skills", nav_projects: "Projects", nav_terminal: "Terminal & Watch",
            nav_contact: "Contact", nav_cv: "My Resume", theme_dark: "Dark Mode", theme_light: "Light Mode",
            skip_link: "Skip to main content",
            hero_title: "Léo Dupont <span class='accent-text'>portfolio</span>",
            hero_dev: "Software & Web Developer",
            hero_desc: "Passionate about code and technology, I transform complex problems into logical, clean, and functional solutions.",
            btn_view_cv: "View my Resume", btn_dl_pdf: "Download PDF",
            about_title: "Who am I?", about_h1: "<i class='fas fa-terminal'></i> Tech & Rigor",
            about_p1: "What drives me is <strong>creating useful things</strong> and staying up-to-date with tech. Whether it's Python automation or an app, I love seeing the tangible results of my code. I am highly demanding regarding quality: I can't stand leaving a bug behind or poorly organized code. To me, code must be as readable as it is functional.",
            about_p2: "My goal is to continue my studies to master software architecture and become a complete <strong>Software Developer</strong>.",
            about_h2: "<i class='fas fa-microchip'></i> Logic & Problem Solving",
            about_p3: "My curiosity about the inner workings of systems naturally led me to programming. What interests me is understanding how to transform abstract logic into a functional system.",
            about_p4: "My early projects (such as game mechanics development or 3D modeling with Blender) were excellent exercises to master state management, resource optimization, and complex algorithms.",
            path_title: "My Journey", path_d1: "Since 2025", path_s1: "La Colinière High School, Nantes",
            path_p1: "Specializing in <strong>Software Solutions and Business Applications</strong>. In-depth learning of development, data management, and cybersecurity.",
            path_t2: "General Baccalaureate", path_s2: "Graduated with Honors",
            path_p2: "Specialized in <strong>Mathematics</strong> and <strong>Computer Science</strong>. Acquired solid foundations in algorithms and programming logic.",
            path_d3: "Before 2023", path_t3: "Discovery & Internships", path_p3: "Several observation internships in IT companies that confirmed my desire to work in the digital and development sector.",
            services_title: "What I can do", serv_t1: "Software Development",
            serv_p1: "Creating tools, automation scripts (Python), or small Windows applications (C#). I enjoy building the hidden logic behind interfaces.",
            serv_t2: "Web Integration", serv_p2: "Transforming mockups or ideas into real, responsive web pages. I ensure the HTML/CSS is clean and respects standards.",
            serv_t3: "Data & Automation", serv_p3: "Developing Python scripts to automate tasks (Web Scraping), manipulate data, and store it in SQL databases. I like making processes efficient.",
            skills_title: "Tech Stack", skill_t1: "<i class='fas fa-code'></i> Languages & Web", skill_t2: "<i class='fas fa-database'></i> Data & Back", skill_t3: "<i class='fas fa-tools'></i> Tools & Design",
            skill_sql: "Queries / Joins", skill_algo: "Algorithms", skill_blend: "Blender (3D/Anim)",
            projects_title: "My Work", projects_sub: "Projects to learn, test, and create.",
            proj_1: "<strong>The Challenge:</strong> Design a private, autonomous AI assistant. Deployed local LLMs with Ollama, orchestrated via LangChain, and integrated ChromaDB vector memory to query personal documents via Streamlit.",
            proj_2: "<strong>The Challenge:</strong> A complete Business Intelligence solution. Automated collection (Scraping), DB storage, and presentation via an <strong>Interactive Streamlit Dashboard</strong> (KPIs, Semantic Analysis).",
            proj_3: "<strong>The Challenge:</strong> An OS-integrated search engine (Hyprland). Scrapes official docs and displays code <strong>Cheat Sheets</strong> instantly without leaving the keyboard.",
            proj_4: "<strong>The Challenge:</strong> Create a 'Human-in-the-loop' image classification engine. Used the CLIP model for visual feature extraction and ChromaDB to memorize corrections in real-time via an advanced terminal UI.",
            proj_5: "<strong>The Challenge:</strong> Recreate the famous arcade game in JavaScript. Real-time handling of physics, collisions, and scoring.",
            proj_6: "<strong>The Challenge:</strong> Explore <strong>Computer Vision</strong> to detect and track hands in real-time via webcam. Used the <strong>MediaPipe</strong> algorithm to map 21 landmarks with minimal latency.",
            btn_code: "View source", btn_play: "Play the game",
            terminal_title: "Terminal", terminal_sub: "A quick look at the command line. Try typing 'help'.",
            term_welcome: "Type 'help' to see the list of available commands.",
            veille_title: "Tech Watch", veille_sub: "News and trends in software development and AI.",
            read_article: "Read Article",
            contact_title: "Contact Me", btn_send: "Send message",
            form_name: "Your Name", form_email: "Your Email", form_msg: "Your Message"
        }
    };

    // =========================================================
    // 2. FONCTIONS DE MISE À JOUR (LANGUE & PALETTE)
    // =========================================================
    function updatePaletteCommands(lang) {
        currentCommands = [
            { title: translations[lang].nav_home, icon: "fa-home", action: () => window.location.hash = '#accueil' },
            { title: translations[lang].nav_about, icon: "fa-user", action: () => window.location.hash = '#about' },
            { title: translations[lang].nav_projects, icon: "fa-code", action: () => window.location.hash = '#projects' },
            { title: translations[lang].nav_contact, icon: "fa-envelope", action: () => window.location.hash = '#contact' },
            { title: translations[lang].nav_terminal, icon: "fa-terminal", action: () => { window.location.hash = '#terminal-section'; setTimeout(() => document.getElementById('terminal-input').focus(), 500); } },
            { title: translations[lang].nav_cv, icon: "fa-file-alt", action: () => window.open('./CV/index.html', '_blank') },
            { title: "GitHub", icon: "fa-github", action: () => window.open('https://github.com/Flowz5', '_blank') }
        ];
    }

    const langText = document.getElementById('lang-text');

    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        if (langText) langText.textContent = lang === 'fr' ? 'EN' : 'FR';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        const formName = document.getElementById('form_name');
        const formEmail = document.getElementById('form_email');
        const formMsg = document.getElementById('form_message');
        if(formName) formName.placeholder = translations[lang].form_name;
        if(formEmail) formEmail.placeholder = translations[lang].form_email;
        if(formMsg) formMsg.placeholder = translations[lang].form_msg;

        updatePaletteCommands(lang);
        
        // Recharge la veille technique dans la bonne langue
        fetchTechNews();
    }

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            document.body.classList.add('lang-switching');

            setTimeout(() => {
                currentLang = currentLang === 'fr' ? 'en' : 'fr';
                localStorage.setItem('lang', currentLang);
                applyLanguage(currentLang);
                
                const themeText = document.getElementById('theme-text');
                const isLight = document.body.classList.contains('light-mode');
                if (themeText) {
                    themeText.textContent = isLight 
                        ? (currentLang === 'en' ? 'Light Mode' : 'Mode Clair')
                        : (currentLang === 'en' ? 'Dark Mode' : 'Mode Sombre');
                }

                document.body.classList.remove('lang-switching');
            }, 250);
        });
    }

    // =========================================================
    // 3. GESTION DU MENU ET DU THÈME
    // =========================================================
    const navbar = document.getElementById("navbar");
    const toggleBtn = document.getElementById("toggle-btn");
    const themeToggle = document.getElementById('theme-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    function updateToggleUI(isLight) {
        if (isLight) {
            toggleIcon.classList.replace('fa-moon', 'fa-sun');
            toggleIcon.style.transform = 'rotate(180deg)';
            if (themeText) {
                themeText.setAttribute('data-i18n', 'theme_light');
                themeText.textContent = currentLang === 'en' ? 'Light Mode' : 'Mode Clair';
            }
        } else {
            toggleIcon.classList.replace('fa-sun', 'fa-moon');
            toggleIcon.style.transform = 'rotate(0deg)';
            if (themeText) {
                themeText.setAttribute('data-i18n', 'theme_dark');
                themeText.textContent = currentLang === 'en' ? 'Dark Mode' : 'Mode Sombre';
            }
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateToggleUI(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateToggleUI(isLight);
        });
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

    // =========================================================
    // 4. SCROLL ACTIF ET RETOUR EN HAUT
    // =========================================================
    const sections = document.querySelectorAll("section");

    function onScroll() {
        let current = "";
        const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 60;

        if (isAtBottom && sections.length > 0) {
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
    // 5. BOUTONS MAGNÉTIQUES
    // =========================================================
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

    // =========================================================
    // 6. MACHINE À ÉCRIRE
    // =========================================================
    const heroSubtitle = document.querySelector('.hero-center h2');
    
    if (heroSubtitle) {
        const textToType = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.classList.add('typewriter-cursor');
        
        let charIndex = 0;
        
        function typeText() {
            if (charIndex < textToType.length) {
                heroSubtitle.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 50);
            } else {
                heroSubtitle.classList.remove('typewriter-cursor');
            }
        }
        
        setTimeout(() => {
            typeText();
        }, 1000);
    }

    // =========================================================
    // 7. GESTION DE LA PALETTE (CTRL+K)
    // =========================================================
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');
    const cmdBtnNav = document.getElementById('cmd-btn-nav');

    function toggleCmdPalette() {
        if (!cmdPalette) return;
        if (cmdPalette.classList.contains('hidden')) {
            cmdPalette.classList.remove('hidden');
            cmdInput.value = '';
            renderCmdResults(currentCommands);
            setTimeout(() => cmdInput.focus(), 100);
        } else {
            cmdPalette.classList.add('hidden');
            cmdInput.blur();
        }
    }

    function renderCmdResults(results) {
        if (!cmdResults) return;
        cmdResults.innerHTML = '';
        if (results.length === 0) {
            cmdResults.innerHTML = `<li style="padding: 15px 20px; color: var(--text-muted);">${currentLang === 'fr' ? 'Aucun résultat' : 'No results found'}</li>`;
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

    if (cmdBtnNav) {
        cmdBtnNav.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCmdPalette();
            if (window.innerWidth <= 1024) navbar.classList.remove("nav-open");
        });
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCmdPalette();
        }
        if (e.key === 'Escape' && cmdPalette && !cmdPalette.classList.contains('hidden')) {
            toggleCmdPalette();
        }
    });

    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = currentCommands.filter(cmd => cmd.title.toLowerCase().includes(term));
            renderCmdResults(filtered);
        });
    }

    if (cmdPalette) {
        cmdPalette.addEventListener('click', (e) => {
            if (e.target === cmdPalette) toggleCmdPalette();
        });
    }

    // =========================================================
    // 8. TERMINAL INTERACTIF & EASTER EGGS
    // =========================================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    const terminalLogic = {
        'help': "Commandes :<br>- <strong>ctrl+K</strong> : Palette<br>- <strong>whoami</strong> : Profil<br>- <strong>skills</strong> : Compétences<br>- <strong>contact</strong> : Infos<br>- <strong>clear</strong> : Nettoyer",
        'whoami': "<span class='info'>Étudiant passionné en BTS SIO SLAM. Je construis des choses avec du code.</span>",
        'skills': "<span class='success'>Python, JavaScript, SQL, HTML/CSS, Git, C#, Linux.</span>",
        'contact': "Email: <a href='mailto:dupontleo999@gmail.com' style='color:#79c0ff;'>dupontleo999@gmail.com</a><br>GitHub: <a href='https://github.com/Flowz5' target='_blank' style='color:#79c0ff;'>Flowz5</a>"
    };

    if (terminalInput && terminalOutput) {
        terminalInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
                e.preventDefault();

                const command = this.value.trim().toLowerCase();
                this.value = '';

                const commandLine = document.createElement('p');
                commandLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${command}`;
                terminalOutput.appendChild(commandLine);

                const responseBlock = document.createElement('div');

                if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                    return;
                } else if (command === '') {
                    // Ne rien faire
                } else if (command === 'sudo') {
                    responseBlock.innerHTML = `<p class="error">L'utilisateur n'est pas dans le fichier sudoers. Cet incident sera signalé.</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'matrix') {
                    document.body.classList.toggle('matrix-mode');
                    if (document.body.classList.contains('matrix-mode')) {
                        responseBlock.innerHTML = `<p class="success">Wake up, Neo... The Matrix has you.</p>`;
                    } else {
                        responseBlock.innerHTML = `<p class="info">Déconnexion de la Matrice...</p>`;
                    }
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'rm -rf /') {
                    responseBlock.innerHTML = `<p class="error">Suppression totale du système...</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (terminalLogic[command]) {
                    responseBlock.innerHTML = `<p>${terminalLogic[command]}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else {
                    responseBlock.innerHTML = `<p class="error">Commande introuvable : ${command}. Tapez 'help' pour la liste.</p>`;
                    terminalOutput.appendChild(responseBlock);
                }

                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            }
        });
        
        if (terminalBody) {
            terminalBody.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }

    // =========================================================
    // 9. API VEILLE TECHNOLOGIQUE (GNEWS API)
    // =========================================================
    const newsScroller = document.getElementById('news-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    // Remplace par ta vraie clé GNews (ex: '123456789abcdef...')
    const GNEWS_API_KEY = '6997dbca82d366276a1a5a1b9632d504'; 
    
    const mockNewsFR = [
        {
            source: { name: "Veille Secours" },
            title: "L'API d'actualités est temporairement indisponible",
            description: "Revenez plus tard pour découvrir les dernières actualités technologiques en temps réel.",
            url: "#",
            image: "./Assets/code2.jpg"
        }
    ];

    async function fetchTechNews() {
        if(!newsScroller) return;
        
        try {
            const query = currentLang === 'fr' ? 'technologie OR developpement OR IA' : 'technology OR programming OR AI';
            const response = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${currentLang}&max=6&apikey=${GNEWS_API_KEY}`);
            
            if (!response.ok) throw new Error("Erreur d'accès à l'API");
            
            const data = await response.json();
            
            if (data.articles && data.articles.length > 0) {
                renderNews(data.articles);
            } else {
                throw new Error("Aucun article trouvé");
            }
        } catch (error) {
            console.warn("⚠️ API GNews indisponible. Chargement des données de secours...");
            renderNews(mockNewsFR);
        }
    }

    function renderNews(articles) {
        newsScroller.innerHTML = ''; // Ceci retire le texte de chargement
        
        // Sécurité pour la traduction du bouton
        const readText = currentLang === 'en' ? "Read Article" : "Lire l'article";

        articles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'news-card';
            
            const imageUrl = article.image || './Assets/code2.jpg';
            
            card.innerHTML = `
                <img src="${imageUrl}" alt="Illustration de l'article" class="news-image" loading="lazy" onerror="this.src='./Assets/code2.jpg'">
                <div class="news-content">
                    <span class="news-source">${article.source.name || 'Tech News'}</span>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-desc">${article.description || ''}</p>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-link">
                        ${readText} <i class="fas fa-arrow-right" style="font-size: 0.8em; margin-left: 5px;"></i>
                    </a>
                </div>
            `;
            newsScroller.appendChild(card);
        });
    }

    if (scrollLeftBtn && scrollRightBtn && newsScroller) {
        scrollLeftBtn.addEventListener('click', () => {
            newsScroller.scrollBy({ left: -340, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            newsScroller.scrollBy({ left: 340, behavior: 'smooth' });
        });
    }

    // Recharge les actualités quand on clique sur le bouton de langue
    const langBtnNews = document.getElementById('lang-toggle');
    if (langBtnNews) {
        langBtnNews.addEventListener('click', () => {
            newsScroller.innerHTML = '<div class="news-loading"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
            setTimeout(fetchTechNews, 300);
        });
    }

    // Lancement au démarrage
    fetchTechNews();
});