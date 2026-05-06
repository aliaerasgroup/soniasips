document.addEventListener('DOMContentLoaded', () => {
    const cubes = document.querySelectorAll('.cube');
    const againBtn = document.getElementById('againBtn');
    const overallRating = document.getElementById('overallRating');
    const ratingValue = document.getElementById('ratingValue');
    const saveBtn = document.getElementById('saveEntry');

    // 1. Sweetness Selection (Sugar Cubes)
    cubes.forEach(cube => {
        cube.addEventListener('click', () => {
            const val = parseInt(cube.getAttribute('data-value'));
            updateCubes(val);
        });
    });

    function updateCubes(val) {
        cubes.forEach(c => {
            const cubeVal = parseInt(c.getAttribute('data-value'));
            if (cubeVal <= val) {
                c.src = 'full-cube.png';
                c.style.transform = 'scale(1.1)';
            } else {
                c.src = 'empty-cube.png';
                c.style.transform = 'scale(1.0)';
            }
        });
        // Feedback animation
        const selected = cubes[val-1];
        selected.classList.add('float-anim');
        setTimeout(() => selected.classList.remove('float-anim'), 1000);
    }

    // 2. Rating Slider Update
    overallRating.addEventListener('input', (e) => {
        ratingValue.textContent = parseFloat(e.target.value).toFixed(1);
    });

    // 3. "Get it Again" Toggle
    againBtn.addEventListener('click', () => {
        againBtn.classList.toggle('active');
        if (againBtn.classList.contains('active')) {
            againBtn.style.borderColor = '#ffcc00';
            againBtn.querySelector('span').textContent = "Absolutely Again!";
        } else {
            againBtn.style.borderColor = 'var(--accent-coffee)';
            againBtn.querySelector('span').textContent = "Would I get it again?";
        }
    });

    // 4. Dynamic Theme Switching (Matcha vs Coffee)
    const drinkRadios = document.querySelectorAll('name="drinkType"');
    document.querySelectorAll('input[name="drinkType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const theme = e.target.value;
            const root = document.documentElement;
            if (theme === 'matcha') {
                root.style.setProperty('--accent-coffee', '#6b8e23');
                document.querySelector('h1').style.color = '#556b2f';
            } else {
                root.style.setProperty('--accent-coffee', '#7b5e4f');
                document.querySelector('h1').style.color = '#7b5e4f';
            }
        });
    });

    // 5. Save Entry (Haptic/Visual feedback)
    saveBtn.addEventListener('click', () => {
        saveBtn.textContent = "Saved to Passport! ✨";
        saveBtn.style.background = '#8da676';
        
        // Reset after 2 seconds
        setTimeout(() => {
            saveBtn.textContent = "Log Entry";
            saveBtn.style.background = 'var(--accent-coffee)';
        }, 2000);

        const data = {
            name: document.getElementById('drinkName').value,
            rating: overallRating.value,
            again: againBtn.classList.contains('active')
        };
        console.log("Saving Entry:", data);
    });
});
