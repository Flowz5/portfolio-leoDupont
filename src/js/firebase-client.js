import { db } from './firebase-init.js';
import { collection, addDoc, doc, getDoc, updateDoc, increment, setDoc, onSnapshot, getDocs, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    const cvButtons = document.querySelectorAll('a[href*="mon-cv.pdf"]');
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

                    // Apply translated text based on current language
                    const applyStatusLang = () => {
                        const lang = localStorage.getItem('lang') || 'fr';
                        let text = data.text;
                        if (lang === 'en') {
                            if (text.toLowerCase().includes("hors ligne")) text = "Offline";
                            else if (text.toLowerCase().includes("en ligne")) text = "Online";
                        }
                        statusText.textContent = text;
                    };
                    applyStatusLang();
                    
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
import { getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    trackVisitor();
    trackCV();
    fetchConfig();
    setupContactForm();
    // Use setTimeout so the main script has time to load Dev.to articles first, then we prepend ours on top.
    setTimeout(fetchVeille, 1000);
});

// --- 5. Security Lockdown Mode ---
let bypassLockdown = false;

// Create lockdown overlay
const lockdownDiv = document.createElement('div');
lockdownDiv.id = "lockdown-overlay";
lockdownDiv.style = "display:none; position:fixed; inset:0; z-index:99999; background:#020617; color:#00ff41; font-family:monospace; flex-direction:column; justify-content:center; align-items:center; text-align:center;";
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
        lockdownDiv.style.display = 'none';
        console.log("Bypass accepted. Welcome back Admin.");
    }
});

// Listen to lockdown status
onSnapshot(doc(db, "config", "lockdown"), (docSnap) => {
    if (docSnap.exists() && !bypassLockdown) {
        const data = docSnap.data();
        if (data.active) {
            lockdownDiv.style.display = 'flex';
        } else {
            lockdownDiv.style.display = 'none';
        }
    }
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
