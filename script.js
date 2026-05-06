document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate 6 Sugar Cubes
    const sugarContainer = document.getElementById('sugarContainer');
    const sweetComment = document.getElementById('sweetComment');
    const sugarMessages = [
        "Pure & Raw", "Hint of Sugar", "Just right!", 
        "Getting cozy!", "Sugar Rush!", "Sugar Tooth Unlocked!"
    ];

    let currentSweetness = 0;

    for (let i = 1; i <= 6; i++) {
        const cube = document.createElement('img');
        cube.src = 'empty-cube.png';
        cube.className = 'sugar-cube';
        cube.onclick = () => {
            currentSweetness = i;
            updateCubes(i);
        };
        sugarContainer.appendChild(cube);
    }

    function updateCubes(index) {
        const cubes = document.querySelectorAll('.sugar-cube');
        cubes.forEach((c, idx) => {
            c.src = (idx < index) ? 'full-cube.png' : 'empty-cube.png';
            c.style.transform = (idx < index) ? 'scale(1.1)' : 'scale(1.0)';
        });
        sweetComment.textContent = sugarMessages[index - 1];
    }

    // 2. Sliders (No leading zeros, small size)
    const tasteSlider = document.getElementById('tasteSlider');
    const tasteVal = document.getElementById('tasteVal');
    const scoreSlider = document.getElementById('scoreSlider');
    const scoreVal = document.getElementById('scoreVal');

    tasteSlider.oninput = function() { tasteVal.textContent = this.value; };
    scoreSlider.oninput = function() { scoreVal.textContent = parseFloat(this.value).toFixed(1); };

    // 3. Adjusted Toggle
    const adjCheck = document.getElementById('adjCheck');
    const adjNotes = document.getElementById('adjNotes');
    adjCheck.onchange = () => adjNotes.classList.toggle('show', adjCheck.checked);

    // 4. Color Theme (Subtitles & Accents)
    const baseRadios = document.getElementsByName('baseType');
    const root = document.documentElement;
    const titles = document.querySelectorAll('.section-title, h1, .standard-row');

    baseRadios.forEach(r => {
        r.onchange = function() {
            const theme = this.value === 'matcha' ? '#8da676' : '#7b5e4f';
            root.style.setProperty('--accent', theme);
        };
    });

    // 5. Passport Storage Logic
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.onclick = () => {
        const entry = {
            cafe: document.getElementById('cafeName').value || "Unknown Cafe",
            drink: document.getElementById('drinkName').value || "Mystery Sip",
            score: scoreSlider.value,
            again: document.querySelector('input[name="returnChoice"]:checked').value,
            date: new Date().toLocaleDateString()
        };

        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        history.unshift(entry);
        localStorage.setItem('sipHistory', JSON.stringify(history));

        submitBtn.textContent = "Stamped! ✨";
        setTimeout(() => {
            submitBtn.textContent = "Stamp my passport!";
            window.location.reload(); 
        }, 1000);
    };

    // 6. Navigation to History
    const mainPage = document.getElementById('main-page');
    const historyPage = document.getElementById('history-page');
    const historyList = document.getElementById('history-list');

    document.getElementById('viewPassport').onclick = () => {
        mainPage.classList.add('hidden');
        historyPage.classList.remove('hidden');
        renderHistory();
    };

    document.getElementById('backToForm').onclick = () => {
        historyPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    };

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        historyList.innerHTML = history.length ? '' : '<p style="text-align:center; opacity:0.5;">No stamps yet!</p>';
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <h4>${item.cafe}</h4>
                <p><strong>Drink:</strong> ${item.drink}</p>
                <p><strong>Score:</strong> ${item.score}/5.0 • <strong>Again?</strong> ${item.again}</p>
                <p style="font-size:0.6rem; color:#aaa;">${item.date}</p>
            `;
            historyList.appendChild(div);
        });
    }
});
