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

// 5. Security & Terminal Commands
async function loadSecurity() {
    const lockdownToggle = document.getElementById('lockdown-toggle');
    const lockdownStatus = document.getElementById('lockdown-status');
    const formCmd = document.getElementById('form-cmd');
    const cmdList = document.getElementById('cmd-list');

    try {
        // Load lockdown status
        const docSnap = await getDoc(doc(db, "config", "status"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            lockdownToggle.checked = !!data.lockdown;
            lockdownStatus.textContent = data.lockdown ? "(ACTIVÉ)" : "(Désactivé)";
        }

        // Toggle Lockdown
        lockdownToggle.addEventListener('change', async (e) => {
            const isActive = e.target.checked;
            lockdownStatus.textContent = isActive ? "(ACTIVÉ)" : "(Désactivé)";
            try {
                await setDoc(doc(db, "config", "status"), { lockdown: isActive }, { merge: true });
                showToast(isActive ? "LOCKDOWN ACTIVÉ" : "Lockdown désactivé");
                addSysLog(`Lockdown mode set to ${isActive}`, isActive ? "WARN" : "INFO");
            } catch(err) {
                console.error(err);
                showToast("Erreur lors de la maj du lockdown");
                e.target.checked = !isActive;
            }
        });

        // Load custom commands
        const loadCmds = async () => {
            const q = query(collection(db, "terminal_commands"));
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                cmdList.innerHTML = "<tr><td colspan='3'>Aucune commande personnalisée.</td></tr>";
                return;
            }
            let html = "";
            snapshot.forEach(d => {
                const data = d.data();
                html += `
                    <tr>
                        <td style="font-family:var(--font-mono); color:var(--accent);">${data.cmd}</td>
                        <td><div style="max-height:60px; overflow:hidden; font-size:0.8rem; background:rgba(0,0,0,0.5); padding:5px;">${data.response.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div></td>
                        <td>
                            <button class="btn-delete-cmd" data-id="${d.id}" style="background:transparent; border:none; color:#ef4444; cursor:pointer;" title="Supprimer">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            cmdList.innerHTML = html;

            document.querySelectorAll('.btn-delete-cmd').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    if(confirm("Supprimer cette commande ?")) {
                        await deleteDoc(doc(db, "terminal_commands", id));
                        showToast("Commande supprimée");
                        addSysLog(`Deleted command ${id}`, "SUCCESS");
                        loadCmds();
                    }
                });
            });
        };
        await loadCmds();

        // Add new command
        if(formCmd) {
            formCmd.addEventListener('submit', async (e) => {
                e.preventDefault();
                const cmdName = document.getElementById('cmd-name').value.trim().toLowerCase();
                const cmdResp = document.getElementById('cmd-response').value.trim();
                if(!cmdName || !cmdResp) return;
                
                try {
                    await setDoc(doc(db, "terminal_commands", cmdName), {
                        cmd: cmdName,
                        response: cmdResp,
                        date: new Date().toISOString()
                    });
                    showToast("Commande ajoutée !");
                    addSysLog(`Added new command: ${cmdName}`, "SUCCESS");
                    document.getElementById('cmd-name').value = "";
                    document.getElementById('cmd-response').value = "";
                    loadCmds();
                } catch(err) {
                    console.error(err);
                    showToast("Erreur lors de l'ajout");
                }
            });
        }
    } catch (e) {
        console.error(e);
        addSysLog("Error loading security configs.", "ERROR");
    }
}

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadDashboardData();
        loadSecurity();
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

// Helper to add logs to the terminal
function addSysLog(msg, type = "INFO") {
    const logs = document.getElementById('live-logs');
    if(!logs) return;
    const time = new Date().toLocaleTimeString('fr-FR');
    let color = "#64748b"; // default info
    if(type === "SUCCESS") color = "#00ff41";
    if(type === "WARN") color = "#eab308";
    if(type === "ERROR") color = "#ef4444";
    
    logs.innerHTML += `<div><span style="color:${color};">[${time}]</span> ${msg}</div>`;
    logs.scrollTop = logs.scrollHeight;
}

// 2. Messages Inbox
async function loadMessages() {
    const msgList = document.getElementById('messages-list');
    const statMsg = document.getElementById('stat-msg');
    try {
        const q = query(collection(db, "messages"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        if(statMsg) statMsg.textContent = snapshot.size;
        
        if (snapshot.empty) {
            msgList.innerHTML = "<p>Aucun message.</p>";
            addSysLog("No new messages found.");
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
                        <div>
                            <span style="color:var(--text-muted); font-size:0.8rem; margin-right:15px;">${date}</span>
                            <button class="btn-delete-msg" data-id="${doc.id}" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-size:1.1rem; transition:transform 0.2s;" title="Supprimer le message">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <p style="white-space:pre-wrap; margin-top:5px; color:#e2e8f0;">${data.message}</p>
                </div>
            `;
        });
        msgList.innerHTML = html;
        addSysLog(`Loaded ${snapshot.size} messages.`, "SUCCESS");

        // Add delete listeners
        document.querySelectorAll('.btn-delete-msg').forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.2)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('click', async (e) => {
                if(confirm("Veux-tu vraiment supprimer ce message ?")) {
                    const id = e.currentTarget.dataset.id;
                    addSysLog(`Deleting message ${id}...`, "WARN");
                    try {
                        await deleteDoc(doc(db, "messages", id));
                        showToast("Message supprimé !");
                        addSysLog(`Message deleted.`, "SUCCESS");
                        loadMessages(); // reload
                    } catch(err) {
                        console.error(err);
                        addSysLog(`Failed to delete message.`, "ERROR");
                    }
                }
            });
        });
    } catch(e) { 
        console.error(e);
        msgList.innerHTML = "<p>Erreur de chargement des messages.</p>";
        addSysLog("Failed to load messages.", "ERROR");
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
            addSysLog(`CV Downloads: ${docSnap.data().downloads}`);
        }

        // Fetch Visitors
        const q = query(collection(db, "visitors"), orderBy("date", "desc"), limit(50));
        const snapshot = await getDocs(q);
        statViews.textContent = snapshot.size; 
        
        const viewSnap = await getDoc(doc(db, "stats", "global"));
        if(viewSnap.exists() && viewSnap.data().views) {
            statViews.textContent = viewSnap.data().views;
            addSysLog(`Global Views: ${viewSnap.data().views}`);
        }
        
        if (snapshot.empty) {
            vList.innerHTML = "<tr><td colspan='4'>Aucun visiteur récent</td></tr>";
            return;
        }
        
        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.date ? new Date(data.date).toLocaleString('fr-FR') : '-';
            const loc = `${data.city || '?'}, ${data.postal || ''} ${data.country || '?'}`;
            const ip = data.ip || 'Inconnue';
            const isp = data.isp || 'Inconnu';
            const system = `${data.os} / ${data.browser}`;
            const screen = data.screen || 'Inconnue';
            const lang = data.lang || 'Inconnue';
            const ref = data.referrer ? (data.referrer.length > 30 ? data.referrer.substring(0,27)+'...' : data.referrer) : 'Direct';
            
            html += `
                <tr>
                    <td style="white-space:nowrap;">${date}</td>
                    <td>
                        <div style="font-family:var(--font-mono); color:var(--accent); font-size:0.9rem;">${ip}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-network-wired"></i> ${isp}</div>
                    </td>
                    <td>
                        <div>${system}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-desktop"></i> ${screen} | <i class="fas fa-globe"></i> ${lang}</div>
                    </td>
                    <td>
                        <div style="font-size:0.85rem; color:var(--text-light);"><i class="fas fa-link"></i> ${ref}</div>
                    </td>
                    <td>
                        <div>${loc}</div>
                    </td>
                </tr>
            `;
        });
        vList.innerHTML = html;
        addSysLog(`Loaded ${snapshot.size} recent visitors.`, "SUCCESS");
    } catch(e) {
        console.error(e);
        vList.innerHTML = "<tr><td colspan='4'>Erreur de chargement</td></tr>";
        addSysLog("Failed to load visitors.", "ERROR");
    }
}

// 4. Veille Tech
async function loadVeille() {
    const list = document.getElementById('veille-list');
    const statVeille = document.getElementById('stat-veille');
    try {
        const q = query(collection(db, "veille"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        if(statVeille) statVeille.textContent = snapshot.size;
        
        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `<li style="margin-bottom:10px; padding:10px; background:rgba(0,0,0,0.2); border-radius:4px;">
                <a href="${data.url}" target="_blank" style="color:var(--accent); text-decoration:none;">${data.title}</a>
            </li>`;
        });
        list.innerHTML = html || "<p>Aucun article.</p>";
        addSysLog(`Loaded ${snapshot.size} tech watch articles.`, "SUCCESS");
    } catch(e) { 
        console.error(e); 
        addSysLog("Failed to load tech watch articles.", "ERROR");
    }
}

document.getElementById('btn-add-veille').addEventListener('click', async () => {
    const title = document.getElementById('veille-title').value;
    const url = document.getElementById('veille-url').value;
    if(!title || !url) return;
    
    addSysLog(`Adding new article: ${title}...`, "WARN");
    
    await addDoc(collection(db, "veille"), {
        title: title,
        url: url,
        date: Date.now()
    });
    
    document.getElementById('veille-title').value = '';
    document.getElementById('veille-url').value = '';
    showToast("Article ajouté !");
    addSysLog(`Article added successfully.`, "SUCCESS");
    loadVeille();
});
