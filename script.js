document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Sugar Cubes
    const sugarContainer = document.getElementById('sugarContainer');
    const sweetComment = document.getElementById('sweetComment');
    const sugarMessages = [
        "Pure and simple!",
        "A hint of sweet!",
        "Not too sweet!",
        "Just right!",
        "Getting cozy!",
        "Sweet tooth unlocked!",
        "Sugar high loading...",
        "Liquid candy mode!"
    ];

    for (let i = 1; i <= 8; i++) {
        const cube = document.createElement('img');
        cube.src = 'empty-cube.png';
        cube.className = 'sugar-cube';
        cube.dataset.index = i;
        cube.onclick = () => selectSweetness(i);
        sugarContainer.appendChild(cube);
    }

    function selectSweetness(index) {
        const cubes = document.querySelectorAll('.sugar-cube');
        cubes.forEach((c, idx) => {
            if (idx < index) {
                c.src = 'full-cube.png';
                c.style.transform = 'scale(1.1)';
            } else {
                c.src = 'empty-cube.png';
                c.style.transform = 'scale(1.0)';
            }
        });
        sweetComment.textContent = sugarMessages[index - 1];
    }

    // 2. Smooth Slider Logic
    const sliders = [
        { input: 'bitterSlider', val: 'bitterVal' },
        { input: 'smoothSlider', val: 'smoothVal' },
        { input: 'scoreSlider', val: 'scoreVal' }
    ];

    sliders.forEach(s => {
        const el = document.getElementById(s.input);
        const out = document.getElementById(s.val);
        el.oninput = function() {
            out.textContent = this.value;
        }
    });

    // 3. Adjusted Comments Logic
    const adjCheck = document.getElementById('adjCheck');
    const adjNotes = document.getElementById('adjNotes');
    adjCheck.onchange = function() {
        if(this.checked) adjNotes.classList.add('show');
        else adjNotes.classList.remove('show');
    };

    // 4. Dynamic Theme (Coffee vs Matcha)
    const baseType = document.getElementsByName('baseType');
    const root = document.documentElement;
    const headerTitle = document.querySelector('h1');

    baseType.forEach(radio => {
        radio.onchange = function() {
            if (this.value === 'matcha') {
                root.style.setProperty('--coffee-accent', '#8da676');
                headerTitle.style.color = '#5b6d4b';
            } else {
                root.style.setProperty('--coffee-accent', '#7b5e4f');
                headerTitle.style.color = '#7b5e4f';
            }
        }
    });

    // 5. Submit Logic
    document.getElementById('submitBtn').onclick = function() {
        this.innerHTML = "Stamped! ✨";
        this.style.background = "#ffcc00";
        setTimeout(() => {
            alert("Entry Saved to Sonia's Passport!");
            window.location.reload();
        }, 800);
    };
});
