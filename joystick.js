// Joystick virtual berbasis Pointer Events (jalan di iOS Safari 13+).
// Hasilnya disimpan di JOY.x dan JOY.y (rentang -1..1), dibaca oleh WorldScene.
const JOY = { x: 0, y: 0 };

(function () {
  const base = document.getElementById('joy-base');
  const knob = document.getElementById('joy-knob');
  const hint = document.getElementById('hint');
  if (!base || !knob) return;

  // Ganti teks hint di perangkat sentuh
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    hint.textContent = 'Geser joystick untuk gerak';
  }

  const RADIUS = 40;     // jarak maksimum knob dari pusat (px)
  const DEADZONE = 0.2;  // abaikan geseran sangat kecil
  let activeId = null;

  function update(e) {
    const r = base.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > RADIUS) { dx = (dx / dist) * RADIUS; dy = (dy / dist) * RADIUS; }

    knob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';

    const nx = dx / RADIUS, ny = dy / RADIUS;
    if (Math.hypot(nx, ny) < DEADZONE) { JOY.x = 0; JOY.y = 0; }
    else { JOY.x = nx; JOY.y = ny; }
  }

  function reset() {
    activeId = null;
    JOY.x = 0; JOY.y = 0;
    knob.style.transform = 'translate(0, 0)';
  }

  base.addEventListener('pointerdown', (e) => {
    if (activeId !== null) return;
    activeId = e.pointerId;
    base.setPointerCapture(activeId);  // tetap terima event walau jari keluar dari lingkaran
    update(e);
    e.preventDefault();
  });
  base.addEventListener('pointermove', (e) => {
    if (e.pointerId === activeId) update(e);
  });
  base.addEventListener('pointerup', (e) => { if (e.pointerId === activeId) reset(); });
  base.addEventListener('pointercancel', (e) => { if (e.pointerId === activeId) reset(); });
  base.addEventListener('contextmenu', (e) => e.preventDefault());
})();
