document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('sipDate');
    if(dateInput) dateInput.valueAsDate = new Date();

    // 1. Sugar Cubes Logic (6 cubes)
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

    // 2. Slider Sync
    const tasteSlider = document.getElementById('tasteSlider');
    const scoreSlider = document.getElementById('scoreSlider');
    tasteSlider.oninput = function() { document.getElementById('tasteVal').textContent = this.value; };
    scoreSlider.oninput = function() { document.getElementById('scoreVal').textContent = parseFloat(this.value).toFixed(1); };

    // 3. Theme & Adjustment Toggles
    const baseRadios = document.getElementsByName('baseType');
    baseRadios.forEach(r => {
        r.onchange = function() {
            const theme = this.value === 'matcha' ? '#8da676' : '#7b5e4f';
            document.documentElement.style.setProperty('--accent', theme);
        };
    });

    const adjCheck = document.getElementById('adjCheck');
    adjCheck.onchange = () => document.getElementById('adjNotes').classList.toggle('show', adjCheck.checked);

    // 4. Save Entry to LocalStorage
    document.getElementById('submitBtn').onclick = () => {
        const entry = {
            type: document.querySelector('input[name="baseType"]:checked').value,
            cafe: document.getElementById('cafeName').value || "Unnamed Cafe",
            drink: document.getElementById('drinkName').value || "Mystery Sip",
            comments: document.getElementById('generalComments').value,
            score: scoreSlider.value,
            again: document.querySelector('input[name="returnChoice"]:checked').value,
            date: dateInput.value,
            adjusted: adjCheck.checked ? document.getElementById('adjInput').value : "None"
        };

        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        history.unshift(entry);
        localStorage.setItem('sipHistory', JSON.stringify(history));

        document.getElementById('submitBtn').textContent = "Stamped! ✨";
        setTimeout(() => location.reload(), 800);
    };

    // 5. Navigation Logic
    const mainPage = document.getElementById('main-page');
    const historyPage = document.getElementById('history-page');
    const historyList = document.getElementById('history-list');

    document.getElementById('viewPassport').onclick = () => {
        mainPage.style.display = 'none';
        historyPage.classList.remove('hidden-view');
        renderHistory();
        window.scrollTo(0,0);
    };

    document.getElementById('backToForm').onclick = () => {
        historyPage.classList.add('hidden-view');
        mainPage.style.display = 'block';
        window.scrollTo(0,0);
    };

    // 6. Email Export Logic
    document.getElementById('exportEmail').onclick = () => {
        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        if(history.length === 0) return alert("Passport is empty!");

        let body = "Sonia's Synapse & Sips Passport Export:\n\n";
        history.forEach(item => {
            body += `${item.date} | ${item.cafe}\nOrder: ${item.drink}\nScore: ${item.score}/5.0 | Again? ${item.again}\nThoughts: ${item.comments || 'No comments'}\n\n`;
        });

        window.location.href = `mailto:?subject=Sip Passport Export&body=${encodeURIComponent(body)}`;
    };

    // 7. Render Color-Coded History
    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        historyList.innerHTML = history.length ? '' : '<p style="text-align:center; padding:50px; opacity:0.5;">Passport Empty!</p>';
        
        history.forEach(item => {
            const div = document.createElement('div');
            // Apply dynamic color coding class
            div.className = `history-item theme-${item.type}`;
            div.innerHTML = `
                <h4>${item.cafe}</h4>
                <p><strong>Order:</strong> ${item.drink}</p>
                <p><strong>Rating:</strong> ${item.score}/5.0 • <strong>Again?</strong> ${item.again}</p>
                ${item.comments ? `<div class="history-comments">"${item.comments}"</div>` : ''}
                <p style="font-size:0.7rem; color:#ccc; margin-top:15px;">Date: ${item.date}</p>
            `;
            historyList.appendChild(div);
        });
    }
});
