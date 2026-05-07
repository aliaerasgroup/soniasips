import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDwFwkwmx_kqAf_FqnFKYCB9UHpw2xCnb0",
  authDomain: "sonia-sips.firebaseapp.com",
  databaseURL: "https://sonia-sips-default-rtdb.firebaseio.com",
  projectId: "sonia-sips",
  storageBucket: "sonia-sips.firebasestorage.app",
  messagingSenderId: "1034846603122",
  appId: "1:1034846603122:web:5dfba1d9171db1dee57feb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('sipDate');
    if(dateInput) dateInput.valueAsDate = new Date();

    // 1. Auth Observer
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            document.getElementById('userNameDisplay').textContent = `Hi, ${user.displayName.split(' ')[0]}!`;
            document.getElementById('auth-page').classList.add('hidden-view');
            document.getElementById('main-page').classList.remove('hidden-view');
        } else {
            currentUser = null;
            document.getElementById('main-page').classList.add('hidden-view');
            document.getElementById('history-page').classList.add('hidden-view');
            document.getElementById('auth-page').classList.remove('hidden-view');
        }
    });

    document.getElementById('loginBtn').onclick = () => signInWithPopup(auth, provider);
    document.getElementById('logoutBtn').onclick = () => signOut(auth);

    // 2. Sugar Cubes (6)
    const sugarContainer = document.getElementById('sugarContainer');
    const sweetComment = document.getElementById('sweetComment');
    const sugarMessages = ["PURE & RAW", "HINT OF SUGAR", "JUST RIGHT", "GETTING COZY", "SUGAR RUSH", "SUGAR TOOTH UNLOCKED"];

    for (let i = 1; i <= 6; i++) {
        const cube = document.createElement('img');
        cube.src = 'empty-cube.png';
        cube.className = 'sugar-cube';
        cube.onclick = () => {
            document.querySelectorAll('.sugar-cube').forEach((c, idx) => {
                c.src = (idx < i) ? 'full-cube.png' : 'empty-cube.png';
            });
            sweetComment.textContent = sugarMessages[i - 1];
        };
        sugarContainer.appendChild(cube);
    }

    // 3. Slider Sync
    const tasteSlider = document.getElementById('tasteSlider');
    const scoreSlider = document.getElementById('scoreSlider');
    tasteSlider.oninput = function() { document.getElementById('tasteVal').textContent = this.value; };
    scoreSlider.oninput = function() { document.getElementById('scoreVal').textContent = parseFloat(this.value).toFixed(1); };

    // 4. Toggle/Color Theme
    const baseRadios = document.getElementsByName('baseType');
    baseRadios.forEach(r => {
        r.onchange = function() {
            const theme = this.value === 'matcha' ? '#8da676' : '#7b5e4f';
            document.documentElement.style.setProperty('--accent', theme);
        };
    });

    const adjCheck = document.getElementById('adjCheck');
    adjCheck.onchange = () => document.getElementById('adjNotes').classList.toggle('show', adjCheck.checked);

    // 5. Submit to Firestore
    document.getElementById('submitBtn').onclick = async () => {
        if(!currentUser) return;
        
        const entry = {
            uid: currentUser.uid,
            type: document.querySelector('input[name="baseType"]:checked').value,
            cafe: document.getElementById('cafeName').value || "Unnamed Cafe",
            drink: document.getElementById('drinkName').value || "Mystery Sip",
            thoughts: document.getElementById('generalComments').value,
            score: scoreSlider.value,
            again: document.querySelector('input[name="returnChoice"]:checked').value,
            date: dateInput.value,
            adjusted: adjCheck.checked ? document.getElementById('adjInput').value : "Standard",
            timestamp: Date.now()
        };

        try {
            await addDoc(collection(db, "entries"), entry);
            document.getElementById('submitBtn').textContent = "Stamped! ✨";
            setTimeout(() => location.reload(), 1000);
        } catch (e) { console.error(e); }
    };

    // 6. Navigation & History
    document.getElementById('viewPassport').onclick = async () => {
        document.getElementById('main-page').style.display = 'none';
        document.getElementById('history-page').classList.remove('hidden-view');
        
        const q = query(collection(db, "entries"), where("uid", "==", currentUser.uid), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const list = document.getElementById('history-list');
        list.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = `history-item theme-${data.type}`;
            div.innerHTML = `
                <h4>${data.cafe}</h4>
                <p><strong>Order:</strong> ${data.drink}</p>
                <p><strong>Rating:</strong> ${data.score}/5.0 • <strong>Return:</strong> ${data.again}</p>
                ${data.thoughts ? `<p style="font-style:italic; opacity:0.7;">"${data.thoughts}"</p>` : ''}
                <p style="font-size:0.7rem; color:#ccc; margin-top:10px;">Date: ${data.date}</p>
            `;
            list.appendChild(div);
        });
    };

    document.getElementById('backToForm').onclick = () => location.reload();

    document.getElementById('exportEmail').onclick = async () => {
        const q = query(collection(db, "entries"), where("uid", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        let body = "Passport Export:\n\n";
        snapshot.forEach(doc => {
            const d = doc.data();
            body += `${d.date} | ${d.cafe}: ${d.drink}\nScore: ${d.score}/5.0\n\n`;
        });
        window.location.href = `mailto:?subject=Sip Passport Export&body=${encodeURIComponent(body)}`;
    };
});
