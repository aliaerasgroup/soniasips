document.addEventListener('DOMContentLoaded', () => {
    // 1. Date setup
    const dateField = document.getElementById('sipDate');
    if(dateField) dateField.valueAsDate = new Date();

    // 2. 6 Sugar Cubes
    const sugarContainer = document.getElementById('sugarContainer');
    const sweetComment = document.getElementById('sweetComment');
    const sugarMessages = [
        "PURE & RAW", "HINT OF SUGAR", "JUST RIGHT", 
        "GETTING COZY", "SUGAR RUSH", "SUGAR TOOTH UNLOCKED"
    ];

    for (let i = 1; i <= 6; i++) {
        const cube = document.createElement('img');
        cube.src = 'empty-cube.png';
        cube.className = 'sugar-cube';
        cube.onclick = () => updateCubes(i);
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

    // 3. Slider updates
    const tasteSlider = document.getElementById('tasteSlider');
    const tasteVal = document.getElementById('tasteVal');
    const scoreSlider = document.getElementById('scoreSlider');
    const scoreVal = document.getElementById('scoreVal');

    tasteSlider.oninput = function() { tasteVal.textContent = this.value; };
    scoreSlider.oninput = function() { scoreVal.textContent = parseFloat(this.value).toFixed(1); };

    // 4. Adjusted Field Logic
    const adjCheck = document.getElementById('adjCheck');
    const adjNotes = document.getElementById('adjNotes');
    adjCheck.onchange = () => {
        adjNotes.classList.toggle('show', adjCheck.checked);
    };

    // 5. Dynamic Colors
    const baseRadios = document.getElementsByName('baseType');
    const root = document.documentElement;

    baseRadios.forEach(r => {
        r.onchange = function() {
            const theme = this.value === 'matcha' ? '#8da676' : '#7b5e4f';
            root.style.setProperty('--accent', theme);
        };
    });

    // 6. LocalStorage Submission
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.onclick = () => {
        const entry = {
            cafe: document.getElementById('cafeName').value || "Cafe Incognito",
            drink: document.getElementById('drinkName').value || "The Regular",
            score: scoreSlider.value,
            again: document.querySelector('input[name="returnChoice"]:checked').value,
            date: dateField.value,
            adjusted: adjCheck.checked ? document.getElementById('adjInput').value : "Standard Recipe"
        };

        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        history.unshift(entry);
        localStorage.setItem('sipHistory', JSON.stringify(history));

        submitBtn.textContent = "Stamped! ✨";
        setTimeout(() => {
            submitBtn.textContent = "Stamp my passport!";
            location.reload(); 
        }, 800);
    };

    // 7. View Passport Logic
    const mainPage = document.getElementById('main-page');
    const historyPage = document.getElementById('history-page');
    const historyList = document.getElementById('history-list');

    document.getElementById('viewPassport').onclick = () => {
        mainPage.style.display = 'none';
        historyPage.classList.remove('hidden-page');
        renderHistory();
    };

    document.getElementById('backToForm').onclick = () => {
        historyPage.classList.add('hidden-page');
        mainPage.style.display = 'block';
    };

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('sipHistory') || '[]');
        historyList.innerHTML = history.length ? '' : '<p style="text-align:center; padding:50px; font-family:MatchaCih; opacity:0.5;">No stamps yet!</p>';
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <h4>${item.cafe}</h4>
                <p><strong>Order:</strong> ${item.drink}</p>
                <p><strong>Rating:</strong> ${item.score}/5.0 • <strong>Return:</strong> ${item.again}</p>
                <p style="font-size:0.7rem; color:#ccc; margin-top:5px;">Date: ${item.date}</p>
            `;
            historyList.appendChild(div);
        });
    }
});
