import { auth, db } from './firebase-init.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, getDocs, doc, getDoc, setDoc, addDoc, query, orderBy, limit, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- UI Elements ---
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');
const toast = document.getElementById('admin-toast');

// --- Navigation ---
document.querySelectorAll('.admin-menu-item').forEach(item => {
    if(item.id === 'btn-logout') return;
    item.addEventListener('click', () => {
        document.querySelectorAll('.admin-menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(item.dataset.target).classList.add('active');
    });
});

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadDashboardData();
    } else {
        loginScreen.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
});

// --- Login / Logout ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        loginError.style.display = 'block';
        loginError.textContent = "Identifiants incorrects.";
    }
});

btnLogout.addEventListener('click', () => signOut(auth));

// --- Load Data ---
async function loadDashboardData() {
    loadStatus();
    loadMessages();
    loadVisitors();
    loadVeille();
}

// 1. Status & Banner
async function loadStatus() {
    try {
        const docSnap = await getDoc(doc(db, "config", "status"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(data.text) document.getElementById('admin-status').value = data.text;
            if(data.banner) document.getElementById('banner-input').value = data.banner;
        }
    } catch(e) { console.error("Error loading status", e); }
}

document.getElementById('btn-save-status').addEventListener('click', async () => {
    const statusText = document.getElementById('admin-status').value;
    await setDoc(doc(db, "config", "status"), { text: statusText }, { merge: true });
    showToast("Statut mis à jour !");
});

document.getElementById('btn-save-banner').addEventListener('click', async () => {
    const bannerText = document.getElementById('banner-input').value;
    await setDoc(doc(db, "config", "status"), { banner: bannerText }, { merge: true });
    showToast("Bannière mise à jour !");
});

// 2. Messages Inbox
async function loadMessages() {
    const msgList = document.getElementById('messages-list');
    try {
        const q = query(collection(db, "messages"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            msgList.innerHTML = "<p>Aucun message.</p>";
            return;
        }
        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.date ? new Date(data.date).toLocaleString('fr-FR') : 'Inconnue';
            html += `
                <div class="msg-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <strong>${data.name} (${data.email})</strong>
                        <span style="color:var(--text-muted); font-size:0.8rem;">${date}</span>
                    </div>
                    <p style="white-space:pre-wrap;">${data.message}</p>
                </div>
            `;
        });
        msgList.innerHTML = html;
    } catch(e) { 
        console.error(e);
        msgList.innerHTML = "<p>Erreur de chargement des messages.</p>";
    }
}

// 3. Visitors Analytics
async function loadVisitors() {
    const vList = document.getElementById('visitors-list');
    const statViews = document.getElementById('stat-views');
    const statCv = document.getElementById('stat-cv');
    
    try {
        // Fetch CV downloads count
        const docSnap = await getDoc(doc(db, "stats", "cv"));
        if(docSnap.exists() && docSnap.data().downloads) {
            statCv.textContent = docSnap.data().downloads;
        }

        // Fetch Visitors
        const q = query(collection(db, "visitors"), orderBy("date", "desc"), limit(50));
        const snapshot = await getDocs(q);
        statViews.textContent = snapshot.size; // Showing recent 50 count or need a global counter
        
        // Actually, let's get the global global visitor counter if it exists
        const viewSnap = await getDoc(doc(db, "stats", "global"));
        if(viewSnap.exists() && viewSnap.data().views) {
            statViews.textContent = viewSnap.data().views;
        }
        
        if (snapshot.empty) {
            vList.innerHTML = "<tr><td colspan='4'>Aucun visiteur récent</td></tr>";
            return;
        }
        
        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.date ? new Date(data.date).toLocaleString('fr-FR') : '-';
            const loc = `${data.city || '?'}, ${data.country || '?'}`;
            
            // Mask IP for privacy in UI if preferred, or show it.
            const ip = data.ip || 'Inconnue';
            
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${loc}</td>
                    <td style="font-size:0.8rem;">${data.os} / ${data.browser}</td>
                    <td>${ip}</td>
                </tr>
            `;
        });
        vList.innerHTML = html;
    } catch(e) {
        console.error(e);
        vList.innerHTML = "<tr><td colspan='4'>Erreur de chargement</td></tr>";
    }
}

// 4. Veille Tech
async function loadVeille() {
    const list = document.getElementById('veille-list');
    try {
        const q = query(collection(db, "veille"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `<li style="margin-bottom:10px; padding:10px; background:rgba(0,0,0,0.2); border-radius:4px;">
                <a href="${data.url}" target="_blank" style="color:var(--accent); text-decoration:none;">${data.title}</a>
            </li>`;
        });
        list.innerHTML = html || "<p>Aucun article.</p>";
    } catch(e) { console.error(e); }
}

document.getElementById('btn-add-veille').addEventListener('click', async () => {
    const title = document.getElementById('veille-title').value;
    const url = document.getElementById('veille-url').value;
    if(!title || !url) return;
    
    await addDoc(collection(db, "veille"), {
        title: title,
        url: url,
        date: Date.now()
    });
    
    document.getElementById('veille-title').value = '';
    document.getElementById('veille-url').value = '';
    showToast("Article ajouté !");
    loadVeille();
});
