document.addEventListener("DOMContentLoaded", () => {
    // Initialisation AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 500, once: false });
    }

    // =========================================================
    // 1. VARIABLES GLOBALES ET TRADUCTIONS COMPLETES
    // =========================================================
    let currentLang = localStorage.getItem('lang') || 'fr';
    let currentCommands = [];
    let isInitialLoad = true;
    let typewriterTimeout;

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
            about_p1: "Ce qui m'anime, c'est de <strong>créer des choses utiles</strong> et d'être toujours à jour sur la tech. Que ce soit une automatisation en Python ou une application, j'aime voir le résultat concret de mon code.",
            about_hl1: "Exigence qualité — un code aussi lisible que fonctionnel",
            about_hl2: "Veille permanente — toujours à jour sur les dernières technos",
            about_hl3: "Apprentissage continu — chaque projet est une occasion de progresser",
            about_p2: "Mon objectif est de poursuivre mes études pour maîtriser l'architecture logicielle et devenir un <strong>Développeur Software</strong> complet. Je ne supporte pas de laisser un bug traîner ou de voir un code mal organisé.",
            about_h2: "<i class='fas fa-microchip'></i> Logique & Résolution de Problèmes",
            about_p3: "Ma curiosité pour le fonctionnement interne des systèmes m'a naturellement conduit vers la programmation. Ce qui m'intéresse, c'est de comprendre comment transformer une logique abstraite en un système fonctionnel.",
            about_p4: "Mes premiers projets (comme le développement de mécaniques de jeu ou la modélisation 3D avec Blender) ont été d'excellents exercices pour maîtriser la gestion des états, l'optimisation des ressources et l'algorithmie complexe.",
            path_title: "Mon Parcours", path_d1: "Depuis 2025", path_s1: "Lycée La Colinière, Nantes", path_t1: "BTS SIO - Option SLAM",
            path_p1: "Spécialisation en <strong>Solutions Logicielles et Applications Métiers</strong>. Apprentissage approfondi du développement, de la gestion de données et de la cybersécurité.",
            path_t2: "Baccalauréat Général", path_s2: "Mention Assez Bien",
            path_p2: "Spécialités <strong>Mathématiques</strong> et <strong>NSI</strong> (Numérique et Sciences Informatiques). Acquisition des bases solides en algorithmique et logique de programmation.",
            path_d3: "Avant 2023", path_t3: "Découverte & Stages", path_p3: "Plusieurs stages d'observation en entreprise qui ont confirmé ma volonté de travailler dans le secteur du numérique et du développement.",
            services_title: "Ce que je peux faire", serv_t1: "Développement Logiciel",
            serv_p1: "Création d'outils, scripts d'automatisation (Python) ou applications Windows (C#). Construction de la logique cachée derrière les interfaces.",
            serv_t2: "Intégration Web", serv_p2: "Transformation de maquettes en pages Web responsives. HTML/CSS propre, respectant les standards et l'accessibilité.",
            serv_t3: "Data & Automatisation", serv_p3: "Scripts Python pour automatiser des tâches (Scraping), manipuler des données et les stocker en base SQL.",
            skills_title: "Stack Technique", skill_t1: "<i class='fas fa-code'></i> Langages & Web", skill_t2: "<i class='fas fa-database'></i> Data & Back", skill_t3: "<i class='fas fa-tools'></i> Outils & Créa",
            skill_sql: "Requêtes / Jointures", skill_algo: "Algorithmique", skill_blend: "Blender (Modé/Anim)", 
            skill_csharp: "C#", skill_node: "Node.js (Bases)",
            projects_title: "Réalisations", projects_sub: "Des projets pour apprendre, tester et créer.",
            proj_title_1: "ChatBot RAG Local", proj_title_2: "Cyber-Watch : Veille B.I.", proj_title_3: "Doc-Hunter : Assistant Dev", 
            proj_title_4: "IA Vision Continue", proj_title_5: "Réplique \"Asteroids\"", proj_title_6: "Hand Tracking AI",
            proj_1: "<strong>Le défi :</strong> Concevoir un assistant IA privé et autonome. Déploiement de modèles de langage en local avec Ollama, orchestration via LangChain, et intégration d'une mémoire vectorielle ChromaDB pour interroger des documents personnels avec Streamlit.",
            proj_2: "<strong>Le défi :</strong> Solution complète de Business Intelligence. Collecte automatisée (Scraping), stockage BDD et restitution via un <strong>Dashboard interactif Streamlit</strong> (KPIs, Analyse sémantique).",
            proj_3: "<strong>Le défi :</strong> Moteur de recherche intégré à l'OS (Hyprland). Permet de scraper les docs officielles et d'afficher des <strong>Cheat Sheets</strong> de code instantanément sans quitter le clavier.",
            proj_4: "<strong>Le défi :</strong> Créer un moteur de classification d'images \"Human-in-the-loop\". Utilisation du modèle CLIP pour l'extraction de caractéristiques visuelles et de ChromaDB pour mémoriser les corrections en temps réel via une interface terminale avancée.",
            proj_5: "<strong>Le défi :</strong> Recréer le célèbre jeu d'arcade en JavaScript. Gestion de la physique, des collisions et du score en temps réel.",
            proj_6: "<strong>Le défi :</strong> Explorer la <strong>Computer Vision</strong> pour détecter et suivre les mains en temps réel via webcam. Utilisation de l'algorithme <strong>MediaPipe</strong> pour mapper 21 points de repère (landmarks) avec une latence minimale.",
            btn_code: "Voir le code", btn_play: "Jouer au jeu",
            terminal_title: "Terminal", terminal_sub: "Un petit aperçu en ligne de commande. Essayez de taper 'help'.",
            term_header: "Léo Dupont (Portfolio) [Version 1.0.0]",
            term_welcome: "Tapez 'help' pour afficher la liste des commandes disponibles.",
            term_cmd_help: "Commandes :<br>- <strong>ctrl+K</strong> : Palette<br>- <strong>whoami</strong> : Profil<br>- <strong>skills</strong> : Compétences<br>- <strong>contact</strong> : Infos<br>- <strong>clear</strong> : Nettoyer",
            term_cmd_whoami: "<span class='info'>Étudiant passionné en BTS SIO SLAM. Je construis des choses avec du code.</span>",
            term_cmd_skills: "<span class='success'>Python, JavaScript, SQL, HTML/CSS, Git, C#, Linux.</span>",
            term_cmd_contact: "Email: <a href='mailto:dupontleo999@gmail.com' style='color:#79c0ff;'>dupontleo999@gmail.com</a><br>GitHub: <a href='https://github.com/Flowz5' target='_blank' style='color:#79c0ff;'>Flowz5</a>",
            term_cmd_sudo: "L'utilisateur n'est pas dans le fichier sudoers. Cet incident sera signalé.",
            term_cmd_matrix_on: "Wake up, Neo... The Matrix has you.",
            term_cmd_matrix_off: "Déconnexion de la Matrice...",
            term_cmd_rm: "Suppression totale du système... Non je rigole, c'est juste un portfolio.",
            term_cmd_croissantage: "Alerte : Règle du croissantage enfreinte. Préparez la carte bleue, redirection en cours...",
            term_cmd_shutdown: "Arrêt du système... Le portfolio est maintenant hors ligne.",
            term_cmd_reboot: "Redémarrage... Le portfolio est de nouveau en ligne.",
            status_offline: "Hors ligne",
            term_cmd_not_found: "Commande introuvable : {cmd}. Tapez 'help' pour la liste.",
            veille_title: "Veille Technologique", veille_sub: "Actualités et tendances en développement et IA.",
            read_article: "Lire l'article", news_loading: "<i class='fas fa-spinner fa-spin'></i> Chargement des actualités...",
            contact_title: "Me Contacter", btn_send: "Envoyer le message",
            form_name: "Votre Nom", form_email: "Votre Email", form_msg: "Votre Message",
            cmd_search_placeholder: "Rechercher... (Projets, Contact...)", cmd_no_results: "Aucun résultat",
            cmd_theme_toggle: "Basculer le thème (Clair/Sombre)",
            cmd_copy_email: "Copier mon email (dupontleo999@gmail.com)",
            cmd_linkedin: "Ouvrir mon profil LinkedIn",
            cmd_dl_cv: "Télécharger mon CV (PDF)",
            cmd_lang_toggle: "Changer de langue (FR/EN)",
            cmd_scroll_top: "Remonter en haut de page",
            cmd_matrix: "Prendre la pilule rouge (Matrix)",
            cmd_croissant: "Enfreindre la règle d'or (Croissantage)",
            stat_projects: "Projets", stat_techs: "Technologies", stat_commits: "Commits", stat_passion: "Passion",
            footer_text: "Fait avec <span class='heart'>❤</span> & du code — Léo Dupont © 2025"
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
            about_p1: "What drives me is <strong>creating useful things</strong> and staying up-to-date with tech. Whether it's Python automation or an app, I love seeing the tangible results of my code.",
            about_hl1: "Quality standards — code as readable as it is functional",
            about_hl2: "Constant watch — always up-to-date on the latest technologies",
            about_hl3: "Continuous learning — every project is a chance to grow",
            about_p2: "My goal is to continue my studies to master software architecture and become a complete <strong>Software Developer</strong>. I can't stand leaving a bug behind or poorly organized code.",
            about_h2: "<i class='fas fa-microchip'></i> Logic & Problem Solving",
            about_p3: "My curiosity about the inner workings of systems naturally led me to programming. What interests me is understanding how to transform abstract logic into a functional system.",
            about_p4: "My early projects (such as game mechanics development or 3D modeling with Blender) were excellent exercises to master state management, resource optimization, and complex algorithms.",
            path_title: "My Journey", path_d1: "Since 2025", path_s1: "La Colinière High School, Nantes", path_t1: "BTS SIO - SLAM Option",
            path_p1: "Specializing in <strong>Software Solutions and Business Applications</strong>. In-depth learning of development, data management, and cybersecurity.",
            path_t2: "General Baccalaureate", path_s2: "Graduated with Honors",
            path_p2: "Specialized in <strong>Mathematics</strong> and <strong>Computer Science</strong>. Acquired solid foundations in algorithms and programming logic.",
            path_d3: "Before 2023", path_t3: "Discovery & Internships", path_p3: "Several observation internships in IT companies that confirmed my desire to work in the digital and development sector.",
            services_title: "What I can do", serv_t1: "Software Development",
            serv_p1: "Creating tools, automation scripts (Python), or Windows applications (C#). Building the hidden logic behind interfaces.",
            serv_t2: "Web Integration", serv_p2: "Transforming mockups into real, responsive web pages. Clean HTML/CSS, respecting standards and accessibility.",
            serv_t3: "Data & Automation", serv_p3: "Python scripts to automate tasks (Scraping), manipulate data, and store it in SQL databases.",
            skills_title: "Tech Stack", skill_t1: "<i class='fas fa-code'></i> Languages & Web", skill_t2: "<i class='fas fa-database'></i> Data & Back", skill_t3: "<i class='fas fa-tools'></i> Tools & Design",
            skill_sql: "Queries / Joins", skill_algo: "Algorithms", skill_blend: "Blender (3D/Anim)",
            skill_csharp: "C#", skill_node: "Node.js (Basics)",
            projects_title: "My Work", projects_sub: "Projects to learn, test, and create.",
            proj_title_1: "Local RAG ChatBot", proj_title_2: "Cyber-Watch: B.I. Watch", proj_title_3: "Doc-Hunter: Dev Assistant", 
            proj_title_4: "Continuous Vision AI", proj_title_5: "\"Asteroids\" Replica", proj_title_6: "Hand Tracking AI",
            proj_1: "<strong>The Challenge:</strong> Design a private, autonomous AI assistant. Deployed local LLMs with Ollama, orchestrated via LangChain, and integrated ChromaDB vector memory to query personal documents via Streamlit.",
            proj_2: "<strong>The Challenge:</strong> A complete Business Intelligence solution. Automated collection (Scraping), DB storage, and presentation via an <strong>Interactive Streamlit Dashboard</strong> (KPIs, Semantic Analysis).",
            proj_3: "<strong>The Challenge:</strong> An OS-integrated search engine (Hyprland). Scrapes official docs and displays code <strong>Cheat Sheets</strong> instantly without leaving the keyboard.",
            proj_4: "<strong>The Challenge:</strong> Create a 'Human-in-the-loop' image classification engine. Used the CLIP model for visual feature extraction and ChromaDB to memorize corrections in real-time via an advanced terminal UI.",
            proj_5: "<strong>The Challenge:</strong> Recreate the famous arcade game in JavaScript. Real-time handling of physics, collisions, and scoring.",
            proj_6: "<strong>The Challenge:</strong> Explore <strong>Computer Vision</strong> to detect and track hands in real-time via webcam. Used the <strong>MediaPipe</strong> algorithm to map 21 landmarks with minimal latency.",
            btn_code: "View source", btn_play: "Play the game",
            terminal_title: "Terminal", terminal_sub: "A quick look at the command line. Try typing 'help'.",
            term_header: "Léo Dupont (Portfolio) [Version 1.0.0]",
            term_welcome: "Type 'help' to see the list of available commands.",
            term_cmd_help: "Commands :<br>- <strong>ctrl+K</strong> : Palette<br>- <strong>whoami</strong> : Profile<br>- <strong>skills</strong> : Tech Stack<br>- <strong>contact</strong> : Infos<br>- <strong>clear</strong> : Clear output",
            term_cmd_whoami: "<span class='info'>Passionate IT Student. I build things with code.</span>",
            term_cmd_skills: "<span class='success'>Python, JavaScript, SQL, HTML/CSS, Git, C#, Linux.</span>",
            term_cmd_contact: "Email: <a href='mailto:dupontleo999@gmail.com' style='color:#79c0ff;'>dupontleo999@gmail.com</a><br>GitHub: <a href='https://github.com/Flowz5' target='_blank' style='color:#79c0ff;'>Flowz5</a>",
            term_cmd_sudo: "User is not in the sudoers file. This incident will be reported.",
            term_cmd_matrix_on: "Wake up, Neo... The Matrix has you.",
            term_cmd_matrix_off: "Disconnecting from the Matrix...",
            term_cmd_rm: "Total system wipe... Just kidding, it's just a portfolio.",
            term_cmd_croissantage: "Alert: Croissantage rule broken. Get your credit card ready, redirecting...",
            term_cmd_shutdown: "Shutting down... The portfolio is now offline.",
            term_cmd_reboot: "Rebooting... The portfolio is back online.",
            status_offline: "Offline",
            term_cmd_not_found: "Command not found: {cmd}. Type 'help' for the list.",
            veille_title: "Tech Watch", veille_sub: "News and trends in software development and AI.",
            read_article: "Read Article", news_loading: "<i class='fas fa-spinner fa-spin'></i> Loading news...",
            contact_title: "Contact Me", btn_send: "Send message",
            form_name: "Your Name", form_email: "Your Email", form_msg: "Your Message",
            cmd_search_placeholder: "Search... (Projects, Contact...)", cmd_no_results: "No results found",
            cmd_theme_toggle: "Toggle Theme (Light/Dark)",
            cmd_copy_email: "Copy my email (dupontleo999@gmail.com)",
            cmd_linkedin: "Open my LinkedIn profile",
            cmd_dl_cv: "Download my Resume (PDF)",
            cmd_lang_toggle: "Switch Language (FR/EN)",
            cmd_scroll_top: "Scroll to top of page",
            cmd_matrix: "Take the red pill (Matrix Mode)",
            cmd_croissant: "Break the golden rule (Croissantage)",
            stat_projects: "Projects", stat_techs: "Technologies", stat_commits: "Commits", stat_passion: "Passion",
            footer_text: "Made with <span class='heart'>❤</span> & code — Léo Dupont © 2025"
        }
    };

    // =========================================================
    // 2. FONCTIONS DE MISE À JOUR (LANGUE, PALETTE ET MACHINE A ECRIRE)
    // =========================================================
    function updatePaletteCommands(lang) {
        const t = translations[lang];
        currentCommands = [
            { title: t.nav_home, icon: "fa-home", action: () => window.location.hash = '#accueil' },
            { title: t.nav_about, icon: "fa-user", action: () => window.location.hash = '#about' },
            { title: t.nav_projects, icon: "fa-code", action: () => window.location.hash = '#projects' },
            { title: t.nav_contact, icon: "fa-envelope", action: () => window.location.hash = '#contact' },
            { title: t.nav_terminal, icon: "fa-terminal", action: () => { window.location.hash = '#terminal-section'; setTimeout(() => document.getElementById('terminal-input').focus(), 500); } },
            { title: t.nav_cv, icon: "fa-file-alt", action: () => window.open('./CV/index.html', '_blank') },
            { title: t.cmd_dl_cv, icon: "fa-download", action: () => { const link = document.createElement('a'); link.href = './CV/mon-cv.pdf'; link.download = 'mon-cv.pdf'; link.click(); } },
            { title: "GitHub", icon: "fa-github", action: () => window.open('https://github.com/Flowz5', '_blank') },
            { title: t.cmd_linkedin, icon: "fa-linkedin", action: () => window.open('https://www.linkedin.com/in/léo-dupont-646a58385', '_blank') },
            { title: t.cmd_copy_email, icon: "fa-copy", action: () => { navigator.clipboard.writeText('le.dupont.pro@gmail.com'); alert(lang === 'fr' ? 'Email copié !' : 'Email copied!'); } },
            { title: t.cmd_theme_toggle, icon: "fa-adjust", action: () => document.getElementById('theme-toggle').click() },
            { title: t.cmd_lang_toggle, icon: "fa-language", action: () => document.getElementById('lang-toggle').click() },
            { title: t.cmd_scroll_top, icon: "fa-arrow-up", action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { title: t.cmd_matrix, icon: "fa-capsules", action: () => document.body.classList.toggle('matrix-mode') },
            { title: t.cmd_croissant, icon: "fa-cookie", action: () => window.open('https://www.croissantage.fr/', '_blank') }
        ];
    }

    const langText = document.getElementById('lang-text');

    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        if (langText) langText.textContent = lang === 'fr' ? 'EN' : 'FR';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                
                if (key === 'hero_dev') {
                    clearTimeout(typewriterTimeout); 
                    el.textContent = ''; 
                    el.classList.add('typewriter-cursor');
                    
                    let charIndex = 0;
                    const textToType = translations[lang][key];
                    
                    function typeText() {
                        if (charIndex < textToType.length) {
                            el.textContent += textToType.charAt(charIndex);
                            if (window.playKeySound) window.playKeySound();
                            charIndex++;
                            typewriterTimeout = setTimeout(typeText, 50);
                        } else {
                            el.classList.remove('typewriter-cursor');
                        }
                    }
                    
                    typewriterTimeout = setTimeout(typeText, isInitialLoad ? 1000 : 300);
                } 
                else {
                    const targetText = translations[lang][key];
                    // Don't scramble if it contains HTML
                    if (targetText.includes('<')) {
                        el.innerHTML = targetText;
                    } else {
                        // Scramble Effect
                        const chars = '!<>-_\\\\/[]{}—=+*^?#________';
                        let iteration = 0;
                        clearInterval(el.dataset.scrambleInterval);
                        
                        const interval = setInterval(() => {
                            el.textContent = targetText
                                .split('')
                                .map((letter, index) => {
                                    if(index < iteration) {
                                        return targetText[index];
                                    }
                                    return chars[Math.floor(Math.random() * chars.length)];
                                })
                                .join('');
                            
                            if(iteration >= targetText.length){
                                clearInterval(interval);
                            }
                            iteration += 1.5; // Faster unscrambling (was 0.5)
                        }, 15); // Faster interval (was 20)
                        el.dataset.scrambleInterval = interval;
                    }
                }
            }
        });

        const formName = document.getElementById('form_name');
        const formEmail = document.getElementById('form_email');
        const formMsg = document.getElementById('form_message');
        const cmdInputNode = document.getElementById('cmd-input');
        
        const labelName = document.getElementById('label_form_name');
        const labelEmail = document.getElementById('label_form_email');
        const labelMsg = document.getElementById('label_form_message');
        
        if(formName) formName.placeholder = translations[lang].form_name;
        if(formEmail) formEmail.placeholder = translations[lang].form_email;
        if(formMsg) formMsg.placeholder = translations[lang].form_msg;
        if(cmdInputNode) cmdInputNode.placeholder = translations[lang].cmd_search_placeholder;
        
        // MAJ des labels pour l'accessibilité
        if(labelName) labelName.textContent = translations[lang].form_name;
        if(labelEmail) labelEmail.textContent = translations[lang].form_email;
        if(labelMsg) labelMsg.textContent = translations[lang].form_msg;

        updatePaletteCommands(lang);
        fetchTechNews();
        
        isInitialLoad = false;
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
        themeToggle._handler = () => {
            const isLight = body.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateToggleUI(isLight);
        };
        themeToggle.addEventListener('click', themeToggle._handler);
    }

    if(toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            navbar.classList.toggle("nav-open");
        });
    }

    const navLinks = document.querySelectorAll(".floating-nav a.nav-item");

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
            if (window.scrollY > 300) scrollTopBtn.classList.add('visible');
            else scrollTopBtn.classList.remove('visible');
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================================
    // 5. BOUTONS MAGNÉTIQUES
    // =========================================================
    // Upgrade to Magnetic logic (1.1)
    const magneticElements = document.querySelectorAll('.btn-primary, .nav-item, .social-links a, .glass-btn');
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            btn.style.transition = 'none';
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // =========================================================
    // 6. GESTION DE LA PALETTE (CTRL+K)
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
            const noResText = translations[currentLang].cmd_no_results;
            cmdResults.innerHTML = `<li style="padding: 15px 20px; color: var(--text-muted);">${noResText}</li>`;
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
    // 7. TERMINAL INTERACTIF & EASTER EGGS
    // =========================================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

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
                const t = translations[currentLang]; 

                if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                    return;
                } else if (command === '') {
                    // Ne rien faire
                } else if (command === 'sudo') {
                    responseBlock.innerHTML = `<p class="error">${t.term_cmd_sudo}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'matrix') {
                    document.body.classList.toggle('matrix-mode');
                    if (document.body.classList.contains('matrix-mode')) {
                        responseBlock.innerHTML = `<p class="success">${t.term_cmd_matrix_on}</p>`;
                    } else {
                        responseBlock.innerHTML = `<p class="info">${t.term_cmd_matrix_off}</p>`;
                    }
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'rm -rf /') {
                    responseBlock.innerHTML = `<p class="error">${t.term_cmd_rm}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'croissantage') {
                    responseBlock.innerHTML = `<p class="success">${t.term_cmd_croissantage}</p>`;
                    terminalOutput.appendChild(responseBlock);
                    setTimeout(() => {
                        window.open('https://www.croissantage.fr/', '_blank');
                    }, 1200);
                } else if (command === 'help') {
                    responseBlock.innerHTML = `<p>${t.term_cmd_help}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'whoami') {
                    responseBlock.innerHTML = `<p>${t.term_cmd_whoami}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'skills') {
                    responseBlock.innerHTML = `<p>${t.term_cmd_skills}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'contact') {
                    responseBlock.innerHTML = `<p>${t.term_cmd_contact}</p>`;
                    terminalOutput.appendChild(responseBlock);
                } else if (command === 'shutdown') {
                    const heroBadge = document.querySelector('.hero-badge');
                    const statusDot = document.querySelector('.status-dot');
                    const statusText = document.querySelector('[data-i18n="status"]');
                    if (heroBadge && !heroBadge.classList.contains('offline')) {
                        heroBadge.classList.add('offline');
                        if (statusText) statusText.textContent = t.status_offline;
                        responseBlock.innerHTML = `<p class="error">${t.term_cmd_shutdown}</p>`;
                    } else if (heroBadge) {
                        heroBadge.classList.remove('offline');
                        if (statusText) statusText.textContent = translations[currentLang].status;
                        responseBlock.innerHTML = `<p class="success">${t.term_cmd_reboot}</p>`;
                    }
                    terminalOutput.appendChild(responseBlock);
                } else {
                    const notFoundText = t.term_cmd_not_found.replace('{cmd}', command);
                    responseBlock.innerHTML = `<p class="error">${notFoundText}</p>`;
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
    // 8. API VEILLE TECHNOLOGIQUE (DEV.TO API)
    // =========================================================
    const newsScroller = document.getElementById('news-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    const mockNewsFR = [
        {
            user: { name: "FRANDROID" },
            title: "La double authentification contournée par une IA",
            description: "Pour la première fois, Google documente un exploit zero-day vraisemblablement conçu avec l'aide d'une intelligence artificielle...",
            url: "#", cover_image: "./Assets/code2.jpg"
        },
        {
            user: { name: "ZDNET FRANCE" },
            title: "Google détecte une attaque zero-day développée par IA",
            description: "Le Google Threat Intelligence Group révèle avoir détecté un code d'exploitation fonctionnel développé à l'aide de l'IA.",
            url: "#", cover_image: "./Assets/code3.jpg"
        },
        {
            user: { name: "IGENERATION" },
            title: "Google Maps intègre Gemini sur CarPlay",
            description: "Gemini débarque sur CarPlay. Ses rivaux n'ont pas perdu de temps et peuvent d'ores et déjà être sollicités à tout moment.",
            url: "#", cover_image: "./Assets/code2.jpg"
        },
        {
            user: { name: "LES NUMÉRIQUES" },
            title: "J'ai laissé l'IA fouiller mes comptes : voici le résultat",
            description: "Entre le streaming, le stockage en ligne et les abonnements oubliés, nos relevés bancaires sont des jungles. L'IA permet de faire le ménage.",
            url: "#", cover_image: "./Assets/code3.jpg"
        }
    ];

    async function fetchTechNews() {
        if(!newsScroller) return;
        
        try {
            const response = await fetch(`https://dev.to/api/articles?tag=programming&top=7&per_page=6`);
            
            if (!response.ok) throw new Error("Erreur d'accès à l'API");
            
            const articles = await response.json();
            
            if (articles && articles.length > 0) {
                renderNews(articles);
            } else {
                throw new Error("Aucun article trouvé");
            }
        } catch (error) {
            console.warn("⚠️ API Dev.to inaccessible (hors ligne ?). Chargement des données de secours...");
            renderNews(mockNewsFR);
        }
    }

    function renderNews(articles) {
        newsScroller.innerHTML = ''; 
        
        const readText = translations[currentLang].read_article || "Lire l'article";

        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'veille-item';
            card.innerHTML = `
                <h3 class="article-title">${article.title}</h3>
                <p>${article.description || 'Découvrez cet article sur les dernières tendances du développement logiciel.'}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                    ${readText} <i class="fas fa-arrow-right" style="font-size: 0.8em; margin-left: 5px;" aria-hidden="true"></i>
                </a>
            `;
            newsScroller.appendChild(card);
        });
    }

    // =========================================================
    // 9. MOUSE FOLLOWER GLOW
    // =========================================================
    const follower = document.getElementById('mouse-follower');
    if (follower) {
        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
            if (!follower.classList.contains('active')) {
                follower.classList.add('active');
            }
        });
        document.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
        });
    }

    // =========================================================
    // 10. COUNTER ANIMATION (IntersectionObserver)
    // =========================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.classList.contains('counted')) return;
                    el.classList.add('counted');
                    const target = parseInt(el.getAttribute('data-target'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    let current = 0;
                    const increment = Math.max(1, Math.floor(target / 40));
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current + suffix;
                    }, 30);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // =========================================================
    // 11. BENTO TILES 3D TILT (VanillaTilt)
    // =========================================================
    function initBentoTilt() {
        if (typeof VanillaTilt !== 'undefined') {
            const bentoTiles = document.querySelectorAll('.bento-tile');
            bentoTiles.forEach(tile => {
                VanillaTilt.init(tile, {
                    max: 5,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.1,
                    scale: 1.02
                });
            });
        }
    }
    // Delay to ensure VanillaTilt is loaded (deferred script)
    setTimeout(initBentoTilt, 500);

    // =========================================================
    // 12. AUTO-TYPING TERMINAL ON SCROLL
    // =========================================================
    const terminalSection = document.getElementById('terminal-section');
    let terminalAutoTyped = false;
    if (terminalSection && terminalInput && terminalOutput) {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !terminalAutoTyped) {
                    terminalAutoTyped = true;
                    const demoCommand = 'whoami';
                    let i = 0;
                    terminalInput.focus();
                    const typeInterval = setInterval(() => {
                        if (i < demoCommand.length) {
                            terminalInput.value += demoCommand[i];
                            i++;
                        } else {
                            clearInterval(typeInterval);
                            setTimeout(() => {
                                // Simulate Enter key
                                const enterEvent = new KeyboardEvent('keyup', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    bubbles: true
                                });
                                terminalInput.dispatchEvent(enterEvent);
                            }, 300);
                        }
                    }, 80);
                    terminalObserver.unobserve(terminalSection);
                }
            });
        }, { threshold: 0.4 });
        terminalObserver.observe(terminalSection);
    }

    // =========================================================
    // 13. SPLASH SCREEN
    // =========================================================
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.remove();
            }, 600);
        }, 3000);
    }

    // =========================================================
    // 14. KONAMI CODE EASTER EGG (confetti)
    // =========================================================
    const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                konamiIndex = 0;
                launchConfetti();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function launchConfetti() {
        const colors = ['#00f0ff', '#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#ef4444'];
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.width = (Math.random() * 8 + 5) + 'px';
            confetti.style.height = (Math.random() * 8 + 5) + 'px';
            confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            confetti.style.animationDelay = (Math.random() * 0.8) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    // =========================================================
    // 15. CIRCULAR THEME REVEAL
    // =========================================================
    const themeRevealOverlay = document.getElementById('theme-reveal');
    if (themeToggle && themeRevealOverlay) {
        // Override existing theme toggle with fade reveal
        themeToggle.removeEventListener('click', themeToggle._handler);
        const fadeThemeHandler = () => {
            // Set overlay to the NEW theme color
            const willBeLight = !body.classList.contains('light-mode');
            themeRevealOverlay.style.background = willBeLight ? '#f8fafc' : '#050505';

            // Fade in
            themeRevealOverlay.classList.add('expanding');

            // After fade-in, apply theme and fade out
            setTimeout(() => {
                const isLight = body.classList.toggle('light-mode');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
                updateToggleUI(isLight);

                // Fade out
                themeRevealOverlay.classList.remove('expanding');
            }, 300);
        };
        themeToggle.addEventListener('click', fadeThemeHandler);
    }

    // =========================================================
    // 16. CV MODAL
    // =========================================================
    const btnOpenCv = document.getElementById('btn-open-cv-modal');
    const cvModal = document.getElementById('cv-modal');
    const cvModalClose = document.getElementById('cv-modal-close');

    if (btnOpenCv && cvModal && cvModalClose) {
        btnOpenCv.addEventListener('click', () => {
            cvModal.classList.add('active');
        });
        cvModalClose.addEventListener('click', () => {
            cvModal.classList.remove('active');
        });
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.classList.remove('active');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('active')) {
                cvModal.classList.remove('active');
            }
        });
    }

    // =========================================================
    // 17. CUSTOM CURSOR
    // =========================================================
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Add outline element dynamically
    let cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && !cursorOutline) {
        cursorOutline = document.createElement('div');
        cursorOutline.classList.add('cursor-outline');
        document.body.appendChild(cursorOutline);
    }

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect
        const interactables = document.querySelectorAll('a, button, input, .project-card-modern, .bento-tile');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // =========================================================
    // 18. MECHANICAL KEYBOARD SOUNDS
    // =========================================================
    const keySound = new Audio('./Assets/keypress.mp3');
    keySound.volume = 0.2;

    window.playKeySound = function() {
        if (!keySound.paused) {
            keySound.currentTime = 0;
        }
        keySound.play().catch(() => {});
    };

    if (cmdInputNode) {
        cmdInputNode.addEventListener('keydown', (e) => {
            if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
                window.playKeySound();
            }
        });
    }

    // PREMIER LANCEMENT AU DÉMARRAGE
    applyLanguage(currentLang);
});