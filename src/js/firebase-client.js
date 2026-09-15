import { db } from './firebase-init.js';
import { collection, addDoc, doc, getDoc, updateDoc, increment, setDoc, onSnapshot, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- 1. Visitor Tracking ---
async function trackVisitor() {
    // Only track once per session
    if (sessionStorage.getItem('tracked')) return;
    
    try {
        // Fetch IP and Geo data
        const res = await fetch('https://ipapi.co/json/');
        const geo = await res.json();
        
        // Simple Browser/OS detection
        const ua = navigator.userAgent;
        let browser = "Unknown";
        if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";
        
        let os = "Unknown";
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "MacOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("like Mac")) os = "iOS";

        // Save to Firestore
        await addDoc(collection(db, "visitors"), {
            ip: geo.ip || "Unknown",
            city: geo.city || "Unknown",
            postal: geo.postal || "",
            country: geo.country_name || "Unknown",
            isp: geo.org || "Unknown",
            browser: browser,
            os: os,
            screen: `${window.screen.width}x${window.screen.height}`,
            lang: navigator.language || "Unknown",
            referrer: document.referrer || "Direct",
            date: Date.now()
        });

        // Increment global counter
        const globalRef = doc(db, "stats", "global");
        try {
            await updateDoc(globalRef, { views: increment(1) });
        } catch(e) {
            // If doc doesn't exist, create it
            await setDoc(globalRef, { views: 1 });
        }

        sessionStorage.setItem('tracked', 'true');
    } catch(e) {
        console.error("Tracking blocked or failed", e);
    }
}

// --- 2. CV Download Tracking ---
function trackCV() {
    const cvButtons = document.querySelectorAll('a[href*="CV.pdf"]');
    cvButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const cvRef = doc(db, "stats", "cv");
            try {
                await updateDoc(cvRef, { downloads: increment(1) });
            } catch(e) {
                await setDoc(cvRef, { downloads: 1 });
            }
        });
    });
}

// --- 3. Dynamic Status & Banner ---
async function fetchConfig() {
    try {
        const docSnap = await getDoc(doc(db, "config", "status"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Inject Banner if exists
            if (data.banner && data.banner.trim() !== '') {
                const bannerDiv = document.createElement('div');
                bannerDiv.style.cssText = "background:var(--accent); color:#000; text-align:center; padding:10px; font-weight:bold; z-index:1000; position:relative;";
                bannerDiv.textContent = data.banner;
                document.body.prepend(bannerDiv);
            }
            
            // We update the existing hero badge
            if (data.text) {
                const heroBadge = document.querySelector('.hero-badge');
                if(heroBadge) {
                    let statusText = heroBadge.querySelector('span:not(.status-dot)') || heroBadge.querySelector('span');
                    
                    if (!statusText) {
                        // fallback if no span wrapping the text
                        const dot = heroBadge.querySelector('.status-dot');
                        heroBadge.innerHTML = '';
                        if(dot) heroBadge.appendChild(dot);
                        statusText = document.createElement('span');
                        heroBadge.appendChild(statusText);
                    }
                    
                    // Remove default translation hook to prevent it from overwriting
                    statusText.removeAttribute('data-i18n');
                    statusText.dataset.firebaseStatus = data.text;

                    let githubStatusFR = null;
                    let githubStatusEN = null;

                    // Apply translated text based on current language
                    const applyStatusLang = () => {
                        const lang = localStorage.getItem('lang') || 'fr';
                        let text = data.text;
                        
                        if (githubStatusFR && githubStatusEN && data.text.toLowerCase().includes("en ligne")) {
                            text = lang === 'en' ? githubStatusEN : githubStatusFR;
                        } else if (lang === 'en') {
                            if (text.toLowerCase().includes("hors ligne")) text = "Offline";
                            else if (text.toLowerCase().includes("en ligne")) text = "Online";
                        }
                        statusText.textContent = text;
                    };
                    applyStatusLang();

                    // Fetch GitHub status if currently online
                    if (data.text.toLowerCase().includes("en ligne")) {
                        fetch('https://api.github.com/users/Flowz5/events/public')
                            .then(res => res.json())
                            .then(events => {
                                const lastPush = events.find(e => e.type === 'PushEvent');
                                if (lastPush) {
                                    const pushDate = new Date(lastPush.created_at);
                                    if ((new Date() - pushDate) / (1000 * 60 * 60) < 24) {
                                        const repoName = lastPush.repo.name.split('/')[1] || lastPush.repo.name;
                                        githubStatusFR = `En train de coder sur ${repoName}`;
                                        githubStatusEN = `Coding on ${repoName}`;
                                        
                                        const dot = heroBadge.querySelector('.status-dot');
                                        if(dot) {
                                            dot.style.backgroundColor = '#a855f7';
                                            dot.style.boxShadow = '0 0 10px #a855f7';
                                        }
                                        applyStatusLang();
                                    }
                                }
                            }).catch(() => {});
                    }
                    
                    if (data.text.toLowerCase().includes("en ligne") || data.text.toLowerCase().includes("recherche")) {
                        heroBadge.classList.remove('offline');
                    } else {
                        heroBadge.classList.add('offline');
                    }

                    // Listen for language toggle to translate dynamically
                    document.querySelectorAll('.lang-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            setTimeout(applyStatusLang, 50);
                        });
                    });
                }
            }
        }
    } catch(e) { console.error("Error fetching config", e); }
}

// --- 4. Intercept Contact Form ---
function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        // We don't prevent default, because we STILL want formsubmit.co to send the email!
        // But we save it to Firebase right before the page redirects.
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;
        
        try {
            await addDoc(collection(db, "messages"), {
                name: name,
                email: email,
                message: message,
                date: Date.now()
            });
        } catch(err) {
            console.error("Failed to save message to db", err);
        }
    });
}

// --- 5. Fetch Veille Tech ---

async function fetchVeille() {
    const scroller = document.getElementById('news-scroller');
    if (!scroller) return;
    try {
        const q = query(collection(db, "veille"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'veille-item';
            // We give it a slight visual distinction to show it's from the personal admin
            card.style.borderLeft = "2px solid var(--accent)";
            card.innerHTML = `
                <h3 class="article-title">${data.title}</h3>
                <p style="color:var(--accent); font-size:0.8rem; margin-bottom:10px;"><i class="fas fa-star"></i> Choix de Léo</p>
                <a href="${data.url}" target="_blank" rel="noopener noreferrer">
                    Lire l'article <i class="fas fa-arrow-right" style="font-size: 0.8em; margin-left: 5px;" aria-hidden="true"></i>
                </a>
            `;
            scroller.prepend(card);
        });
    } catch(e) { console.error("Error fetching veille", e); }
}

function initCookieConsent() {
    if (localStorage.getItem('cookieConsent') !== null) {
        if (localStorage.getItem('cookieConsent') === 'true') {
            trackVisitor();
        }
        return;
    }
    
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.cssText = "position:fixed; bottom:20px; left:20px; right:20px; background:rgba(15,23,42,0.95); backdrop-filter:blur(10px); padding:20px; border-radius:12px; border:1px solid var(--accent); z-index:9999; display:flex; flex-direction:column; gap:15px; color:#fff; box-shadow:0 10px 25px rgba(0,0,0,0.5);";
    
    const style = document.createElement('style');
    style.innerHTML = "@media(min-width:768px){ #cookie-banner { flex-direction:row; align-items:center; justify-content:space-between; } }";
    document.head.appendChild(style);

    banner.innerHTML = `
        <div style="flex:1;">
            <h4 style="margin:0 0 8px 0; color:var(--accent); font-family:var(--font-mono);"><i class="fas fa-cookie-bite"></i> Cookies & Analytics</h4>
            <p style="margin:0; font-size:0.9rem; line-height:1.4;">
                Ce site collecte des données de visite (IP, navigateur) pour des statistiques anonymisées. Acceptez-vous d'être suivi ?
            </p>
        </div>
        <div style="display:flex; gap:10px; justify-content:flex-end; flex-shrink:0;">
            <button id="btn-refuse-cookies" style="padding:10px 18px; border:1px solid #ef4444; background:transparent; color:#ef4444; border-radius:6px; cursor:pointer; font-weight:bold; transition:all 0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='#ef4444';">Refuser</button>
            <button id="btn-accept-cookies" style="padding:10px 18px; border:none; background:var(--accent); color:#000; font-weight:bold; border-radius:6px; cursor:pointer; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';">Accepter</button>
        </div>
    `;
    document.body.appendChild(banner);
    
    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        banner.remove();
        trackVisitor();
    });
    
    document.getElementById('btn-refuse-cookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'false');
        banner.remove();
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initCookieConsent();
    trackCV();
    fetchConfig();
    setupContactForm();
    // Use setTimeout so the main script has time to load Dev.to articles first, then we prepend ours on top.
    setTimeout(fetchVeille, 1000);
});

// --- 5. Security Lockdown Mode ---
let bypassLockdown = false;

window.addEventListener('DOMContentLoaded', () => {
    // Create lockdown overlay
    const lockdownDiv = document.createElement('div');
    lockdownDiv.id = "lockdown-overlay";
    lockdownDiv.style.cssText = "display:none; position:fixed; inset:0; z-index:2147483647; background:#020617; color:#00ff41; font-family:monospace; flex-direction:column; justify-content:center; align-items:center; text-align:center;";
    lockdownDiv.innerHTML = `
        <style>@keyframes pulse-lock { 0% {opacity:1;} 50% {opacity:0.5;} 100% {opacity:1;} }</style>
        <h1 style="font-size:3rem; margin-bottom:1rem; text-shadow: 0 0 15px #ef4444; color:#ef4444; animation: pulse-lock 2s infinite;">// SYSTEM LOCKDOWN //</h1>
        <p style="font-size:1.2rem; max-width:600px; padding:20px;">Maintenance en cours. L'accès au réseau a été suspendu par l'administrateur système.</p>
    `;
    document.body.appendChild(lockdownDiv);

    // Secret bypass listener
    let secretBuffer = "";
    window.addEventListener('keydown', (e) => {
        secretBuffer += e.key;
        if (secretBuffer.length > 20) secretBuffer = secretBuffer.slice(-20);
        if (secretBuffer.toLowerCase().includes("sudo bypass")) {
            bypassLockdown = true;
            lockdownDiv.style.setProperty('display', 'none', 'important');
            console.log("Bypass accepted. Welcome back Admin.");
        }
    });

    // Listen to lockdown status
    onSnapshot(doc(db, "config", "status"), (docSnap) => {
        if (docSnap.exists() && !bypassLockdown) {
            const data = docSnap.data();
            if (data.lockdown) {
                lockdownDiv.style.setProperty('display', 'flex', 'important');
            } else {
                lockdownDiv.style.setProperty('display', 'none', 'important');
            }
        }
    });
});

// --- 6. Custom Terminal Commands ---
window.customCommands = {};
async function loadCustomCommands() {
    try {
        const q = query(collection(db, "terminal_commands"));
        const snapshot = await getDocs(q);
        snapshot.forEach(d => {
            window.customCommands[d.data().cmd] = d.data().response;
        });
    } catch(err) {
        console.error("Could not load custom commands", err);
    }
}
loadCustomCommands();
