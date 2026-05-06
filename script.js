document.addEventListener('DOMContentLoaded', () => {
    
    // 1. GENERATE SUGAR CUBES (Reflecting claim: 8 cubes & left-fill logic)
    const sugarContainer = document.getElementById('sugarContainer');
    const sweetComment = document.getElementById('sweetComment');
    const sugarMessages = [
        "Not too sweet!",
        "Just a hint!",
        "Just right!",
        "Getting cozy!",
        "Sweet tooth unlocked!",
        "Sugar Rush!",
        "Sweetness Overload!",
        "The Sugar Queen!"
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
            // Fill all cubes to the left (Reflecting claim: filling left of selection)
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

    // 2. VHS SLIDER LOGIC (Reflecting claim: padded numbers 05 vs 5)
    const sliders = [
        { slider: 'bitterSlider', display: 'bitterVal' },
        { slider: 'smoothSlider', display: 'smoothVal' },
        { slider: 'scoreSlider', display: 'scoreVal' }
    ];

    sliders.forEach(item => {
        const sliderEl = document.getElementById(item.slider);
        const displayEl = document.getElementById(item.display);

        sliderEl.oninput = function() {
            let val = this.value;
            // Pad numbers for Bitter and Smooth sliders
            if (item.slider !== 'scoreSlider') {
                displayEl.textContent = val < 10 ? '0' + val : val;
            } else {
                // Keep decimal for overall score
                displayEl.textContent = parseFloat(val).toFixed(1);
            }
        };
    });

    // 3. ADJUSTMENT BOX TOGGLE
    const adjCheck = document.getElementById('adjCheck');
    const adjNotes = document.getElementById('adjNotes');
    adjCheck.onchange = () => {
        adjNotes.classList.toggle('show', adjCheck.checked);
    };

    // 4. DYNAMIC THEME COLORS (Matcha vs Coffee)
    const baseType = document.getElementsByName('baseType');
    const root = document.documentElement;
    const headerH1 = document.querySelector('h1');

    baseType.forEach(radio => {
        radio.onchange = function() {
            if (this.value === 'matcha') {
                root.style.setProperty('--coffee-theme', '#8da676');
                headerH1.style.color = '#5b6d4b';
            } else {
                root.style.setProperty('--coffee-theme', '#7b5e4f');
                headerH1.style.color = '#7b5e4f';
            }
        };
    });

    // 5. STAMP ACTION
    document.getElementById('submitBtn').onclick = function() {
        this.textContent = "Stamped! ✨";
        this.style.background = "#ffcc00";
        setTimeout(() => {
            alert("Entry Saved to Sonia's Passport!");
            window.location.reload();
        }, 800);
    };
});
