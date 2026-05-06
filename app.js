/* ============================================================
   Sonia's Sip Passport — app.js
   ============================================================ */

/* ── Helpers ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);

/* ── State ───────────────────────────────────────────────── */
let sweetness = 0;
let rating    = 0;
const TOTAL_CUBES = 8;
const TOTAL_STARS = 5;

/* ── Sweet descriptors ───────────────────────────────────── */
const sweetDescs = [
  'No sugar, please! 😤',
  'Barely a whisper 🌿',
  'Just a hint ✨',
  'Lightly sweet 🌸',
  'Perfectly Balanced ⚖️',
  'Getting cozy 🍯',
  'Sweetie pie 🧁',
  'Sugar rush incoming! 🍬',
  'Pure dessert energy 🍰',
];

/* ── Star labels ─────────────────────────────────────────── */
const starLabels = [
  '',
  "Wouldn't rush back 😅",
  "It was fine, I guess 🤷",
  "Decent! Would sip again 😊",
  "Really loved it! 💕",
  "Life-changing. A masterpiece ✨🏆",
];

/* ── Drink Type Toggle ───────────────────────────────────── */
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $('drink-type').value = btn.dataset.value;
    ripple(btn);
  });
});

/* ── Order Toggle ────────────────────────────────────────── */
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.order-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $('order-type').value = btn.dataset.value;
    ripple(btn);
    const note = $('adjustment-note');
    if (btn.dataset.value === 'adjusted') {
      note.classList.remove('hidden');
      requestAnimationFrame(() => note.classList.add('visible'));
    } else {
      note.classList.remove('visible');
      setTimeout(() => note.classList.add('hidden'), 400);
    }
  });
});

/* ── Sliders ─────────────────────────────────────────────── */
function initSlider(sliderId, valueId) {
  const slider = $(sliderId);
  const valEl  = $(valueId);
  const update = () => {
    const v = slider.value;
    valEl.textContent = v;
    // Fill track
    const pct = ((v - 1) / 9) * 100;
    slider.style.setProperty('--fill', `${pct}%`);
    // Pop animation
    valEl.classList.add('pop');
    clearTimeout(valEl._popTimer);
    valEl._popTimer = setTimeout(() => valEl.classList.remove('pop'), 300);
  };
  slider.addEventListener('input', update);
  update();
}

initSlider('smoothness', 'smoothness-val');
initSlider('bitterness', 'bitterness-val');

/* ── Sugar Cubes ─────────────────────────────────────────── */
function buildCubes() {
  const row = $('sugar-row');
  row.innerHTML = '';
  for (let i = 1; i <= TOTAL_CUBES; i++) {
    const cube = document.createElement('div');
    cube.className = 'sugar-cube';
    cube.dataset.index = i;
    cube.setAttribute('role', 'button');
    cube.setAttribute('aria-label', `Sweetness ${i}`);
    cube.innerHTML = cubeSVG();
    cube.addEventListener('click', () => selectCubes(i, cube));
    row.appendChild(cube);
  }
}

function cubeSVG() {
  return `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <polygon class="cube-face-top"   points="22,4 38,14 22,24 6,14" fill="#EEE5D3"/>
    <polygon class="cube-face-front" points="6,14 22,24 22,40 6,30"  fill="#D5C5A8"/>
    <polygon class="cube-face-side"  points="22,24 38,14 38,30 22,40" fill="#C2AF8E"/>
    <circle  class="cube-dots" cx="17" cy="16" r="1.8" fill="rgba(255,255,255,0.5)"/>
    <circle  class="cube-dots" cx="22" cy="13" r="1.8" fill="rgba(255,255,255,0.5)"/>
    <circle  class="cube-dots" cx="27" cy="16" r="1.8" fill="rgba(255,255,255,0.5)"/>
  </svg>`;
}

function selectCubes(idx, clickedEl) {
  sweetness = (sweetness === idx) ? 0 : idx;
  document.querySelectorAll('.sugar-cube').forEach((c, i) => {
    const lit = i < sweetness;
    c.classList.toggle('lit', lit);
    c.classList.remove('bounce');
  });
  if (sweetness > 0) {
    const cubes = document.querySelectorAll('.sugar-cube');
    cubes[sweetness - 1].classList.add('bounce');
    setTimeout(() => cubes[sweetness - 1].classList.remove('bounce'), 400);
  }
  $('sweet-desc').textContent = sweetDescs[sweetness];
  $('sweet-desc').style.color = sweetness >= 6 ? 'var(--coffee)' : sweetness <= 1 ? 'var(--matcha-dk)' : 'var(--coffee)';
}

buildCubes();
$('sweet-desc').textContent = sweetDescs[0];

/* ── Star Rating ─────────────────────────────────────────── */
const STAR_EMOJIS = ['⭐','⭐','⭐','⭐','⭐'];

function buildStars() {
  const row = $('star-row');
  row.innerHTML = '';
  for (let i = 1; i <= TOTAL_STARS; i++) {
    const btn = document.createElement('button');
    btn.className = 'star-btn';
    btn.dataset.value = i;
    btn.textContent = '⭐';
    btn.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
    btn.addEventListener('click', () => selectStars(i, btn));
    btn.addEventListener('mouseenter', () => highlightStars(i));
    btn.addEventListener('mouseleave', () => highlightStars(rating));
    row.appendChild(btn);
  }
}

function highlightStars(n) {
  document.querySelectorAll('.star-btn').forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.style.filter = i < n ? 'none' : 'grayscale(0.6) brightness(0.9)';
  });
}

function selectStars(n, clickedEl) {
  rating = (rating === n) ? 0 : n;
  highlightStars(rating);
  document.querySelectorAll('.star-btn').forEach((s, i) => {
    if (i === rating - 1) {
      s.classList.add('bounce-star');
      setTimeout(() => s.classList.remove('bounce-star'), 400);
    }
  });
  $('rating-label').textContent = starLabels[rating];
}

buildStars();

/* ── Would You Get It Again ──────────────────────────────── */
document.querySelectorAll('.again-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.again-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    $('get-again').value = btn.dataset.value;
    ripple(btn);
  });
});

/* ── Ripple effect helper ────────────────────────────────── */
function ripple(el) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const size = Math.max(el.offsetWidth, el.offsetHeight);
  r.style.cssText = `width:${size}px;height:${size}px;left:50%;top:50%;margin-left:${-size/2}px;margin-top:${-size/2}px;`;
  el.style.position = 'relative';
  el.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

/* ── Local Storage ───────────────────────────────────────── */
function loadEntries() {
  try { return JSON.parse(localStorage.getItem('sipEntries') || '[]'); }
  catch { return []; }
}

function saveEntries(entries) {
  localStorage.setItem('sipEntries', JSON.stringify(entries));
}

/* ── Submit ──────────────────────────────────────────────── */
$('submit-btn').addEventListener('click', () => {
  const place = $('place-name').value.trim();
  const name  = $('drink-name').value.trim();

  if (!name) {
    $('drink-name').focus();
    $('drink-name').style.borderColor = 'var(--rose)';
    setTimeout(() => $('drink-name').style.borderColor = '', 1500);
    return;
  }

  const entry = {
    id:         Date.now(),
    drinkType:  $('drink-type').value,
    place,
    name,
    date:       $('drink-date').value || new Date().toISOString().split('T')[0],
    orderType:  $('order-type').value,
    adjustments: $('adjustments').value.trim(),
    smoothness: $('smoothness').value,
    bitterness: $('bitterness').value,
    sweetness,
    rating,
    getAgain:   $('get-again').value,
    notes:      $('notes').value.trim(),
  };

  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);
  renderEntries();
  resetForm();
  showToast();

  // Scroll to entries
  setTimeout(() => {
    $('entries-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 400);
});

/* ── Reset Form ──────────────────────────────────────────── */
function resetForm() {
  $('place-name').value  = '';
  $('drink-name').value  = '';
  $('drink-date').value  = '';
  $('adjustments').value = '';
  $('notes').value       = '';
  $('smoothness').value  = 5; initSlider('smoothness', 'smoothness-val');
  $('bitterness').value  = 5; initSlider('bitterness', 'bitterness-val');
  sweetness = 0;
  rating    = 0;
  selectCubes(0);
  highlightStars(0);
  $('rating-label').textContent = '✨ Give it a rating!';
  $('get-again').value = '';
  document.querySelectorAll('.again-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.toggle-btn')[0].click();
  document.querySelectorAll('.order-btn')[0].click();
}

/* ── Render Entries ──────────────────────────────────────── */
function renderEntries() {
  const list    = $('entries-list');
  const entries = loadEntries();

  if (!entries.length) {
    list.innerHTML = '<p class="no-entries">No sips recorded yet — get out there! ☕</p>';
    return;
  }

  list.innerHTML = entries.map(e => {
    const stars   = e.rating ? '⭐'.repeat(e.rating) : '—';
    const cubes   = e.sweetness ? '🟨'.repeat(e.sweetness) : '—';
    const icon    = e.drinkType === 'matcha' ? 'matcha-glass.png' : 'coffee-glass.png';
    const again   = { yes: '🔄 Again!', maybe: '🤔 Maybe', no: '🙅 Probably not' }[e.getAgain] || '';
    const adjBadge = e.orderType === 'adjusted' ? `<span class="badge badge-adj">✏️ Adjusted</span>` : '';
    const againBadge = e.getAgain ? `<span class="badge badge-${e.getAgain}">${again}</span>` : '';
    const date    = e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    return `
    <div class="entry-card" data-id="${e.id}">
      <img src="${icon}" class="entry-icon" alt="${e.drinkType}" />
      <div class="entry-info">
        <div class="entry-top">
          <div>
            <div class="entry-name">${e.name || 'Unnamed Sip'}</div>
            ${e.place ? `<div class="entry-place">📍 ${e.place}</div>` : ''}
          </div>
          <div class="entry-date">${date}</div>
        </div>
        <div class="entry-stars">${stars}</div>
        <div class="entry-badges">
          <span class="badge badge-${e.drinkType}">${e.drinkType === 'matcha' ? '🍵 Matcha' : '☕ Coffee'}</span>
          ${adjBadge}
          ${againBadge}
        </div>
        <div class="entry-meta" style="font-size:0.75rem;color:var(--text-light);margin-top:5px;">
          ${e.sweetness ? `🍬 Sweetness: ${e.sweetness}/${TOTAL_CUBES}` : ''}
          ${e.smoothness ? ` · 💧 Smooth: ${e.smoothness}/10` : ''}
          ${e.bitterness ? ` · ☕ Bitter: ${e.bitterness}/10` : ''}
        </div>
        ${e.notes ? `<div class="entry-notes">"${e.notes}"</div>` : ''}
        ${e.adjustments ? `<div class="entry-notes" style="color:var(--matcha-dk)">✏️ ${e.adjustments}</div>` : ''}
      </div>
      <button class="entry-delete" onclick="deleteEntry(${e.id})" title="Delete">✕</button>
    </div>`;
  }).join('');
}

/* ── Delete Entry ────────────────────────────────────────── */
window.deleteEntry = function(id) {
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
  const card = qs(`[data-id="${id}"]`);
  if (card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.9)';
    setTimeout(renderEntries, 320);
  }
};

/* ── Toast ───────────────────────────────────────────────── */
function showToast() {
  const t = $('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Set today as default date ───────────────────────────── */
const today = new Date().toISOString().split('T')[0];
$('drink-date').value = today;

/* ── Init ────────────────────────────────────────────────── */
renderEntries();

/* ── Passive touch support for sliders ──────────────────── */
document.querySelectorAll('.custom-slider').forEach(s => {
  s.addEventListener('touchstart', () => {}, { passive: true });
  s.addEventListener('touchmove',  () => {}, { passive: true });
});
