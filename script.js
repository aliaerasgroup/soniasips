document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Sugar Cubes (8 total)
    const sugarContainer = document.getElementById('sugarContainer');
    const sweetComment = document.getElementById('sweetComment');
    const sugarMessages = [
        "Pure & Raw!", "Hint of Sugar", "Not too sweet!", "Just right!", 
        "Getting cozy!", "Sweet tooth unlocked!", "Sugar Rush!", "Liquid Candy!"
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

    // 2. Smooth Slider + OSD Number Formatting
    const sliderSettings = [
        { id: 'bitterSlider', display: 'bitterVal' },
        { id: 'smoothSlider', display: 'smoothVal' },
        { id: 'scoreSlider', display: 'scoreVal' }
    ];

    sliderSettings.forEach(s => {
        const slider = document.getElementById(s.id);
        const output = document.getElementById(s.display);
        
        slider.oninput = function() {
            let val = this.value;
            // Pad single digits for that OSD vibe
            if (s.id !== 'scoreSlider') {
                output.textContent = val < 10 ? '0' + val : val;
            } else {
                output.textContent = parseFloat(val).toFixed(1);
            }
        };
    });

    // 3. Adjusted Field Toggle
    const adjCheck = document.getElementById('adjCheck');
    const adjNotes = document.getElementById('adjNotes');
    adjCheck.onchange = () => {
        adjNotes.classList.toggle('show', adjCheck.checked);
    };

    // 4. Dynamic Color Theme
    const baseRadios = document.getElementsByName('baseType');
    const root = document.documentElement;
    const mainTitle = document.querySelector('h1');

    baseRadios.forEach(r => {
        r.onchange = function() {
            if (this.value === 'matcha') {
                root.style.setProperty('--coffee-accent', '#8da676');
                mainTitle.style.color = '#5b6d4b';
            } else {
                root.style.setProperty('--coffee-accent', '#7b5e4f');
                mainTitle.style.color = '#7b5e4f';
            }
        };
    });

    // 5. Submit Action
    document.getElementById('submitBtn').onclick = function() {
        this.textContent = "Stamped! ✨";
        this.style.background = "#ffcc00";
        setTimeout(() => {
            alert("Entry Saved! Check your passport later.");
            window.location.reload();
        }, 1000);
    };
});
