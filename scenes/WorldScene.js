class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#15151f');

    this.renderAllZones();
    this.setupCamera();
    this.setupInput();
  }

  // ---------- Rendering ----------

  renderAllZones() {
    const zones = window.ZONE_CONFIG;
    for (const key in zones) {
      this.renderZoneChunked(key, zones[key]);
    }
  }

  renderZoneChunked(zoneKey, zone) {
    const CHUNK = 32; // tile per sisi chunk
    const totalW = zone.x2 - zone.x1;
    const totalH = zone.y2 - zone.y1;
    const cols = Math.ceil(totalW / CHUNK);
    const rows = Math.ceil(totalH / CHUNK);

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const subZone = {
          x1: zone.x1 + cx * CHUNK,
          y1: zone.y1 + cy * CHUNK,
          x2: Math.min(zone.x1 + (cx + 1) * CHUNK, zone.x2),
          y2: Math.min(zone.y1 + (cy + 1) * CHUNK, zone.y2),
          floor: zone.floor
        };
        this.renderChunk(`${zoneKey}_${cx}_${cy}`, subZone);
      }
    }
  }

  renderChunk(key, zone) {
    const HW = window.TILE_HW;
    const HH = window.TILE_HH;
    const W  = window.TILE_W;
    const H  = window.TILE_H;

    const { x1, y1, x2, y2, floor } = zone;
    const xLast = x2 - 1;
    const yLast = y2 - 1;

    // 4 sudut polygon zona/chunk (parallelogram di iso space)
    const P1x = (x1 - y1) * HW + HW,        P1y = (x1 + y1) * HH;
    const P2x = (xLast - y1) * HW + W,      P2y = (xLast + y1) * HH + HH;
    const P3x = (xLast - yLast) * HW + HW,  P3y = (xLast + yLast) * HH + H;
    const P4x = (x1 - yLast) * HW,          P4y = (x1 + yLast) * HH + HH;

    const minX = Math.min(P1x, P2x, P3x, P4x);
    const minY = Math.min(P1y, P2y, P3y, P4y);
    const maxX = Math.max(P1x, P2x, P3x, P4x);
    const maxY = Math.max(P1y, P2y, P3y, P4y);
    const pw = maxX - minX;
    const ph = maxY - minY;

    const g = this.add.graphics();
    const color = window.FLOOR_COLORS[floor] || 0x808080;

    // 1) Fill seluruh area zona pakai 1 polygon (super cepat)
    g.fillStyle(color, 1);
    g.beginPath();
    g.moveTo(P1x - minX, P1y - minY);
    g.lineTo(P2x - minX, P2y - minY);
    g.lineTo(P3x - minX, P3y - minY);
    g.lineTo(P4x - minX, P4y - minY);
    g.closePath();
    g.fillPath();

    // 2) Grid lines (garis tipis)
    g.lineStyle(1, 0x000000, 0.10);

    // Garis kolom (gx tetap) — dari kiri-atas ke kanan-bawah
    // Rentang: x1+1 .. x2 (inklusif) biar chunk bersebelahan gak nabrak
    for (let gx = x1 + 1; gx <= x2; gx++) {
      const gxc = gx - 1;
      const ax = (gxc - y1) * HW + W - minX;
      const ay = (gxc + y1) * HH + HH - minY;
      const bx = (gxc - yLast) * HW + HW - minX;
      const by = (gxc + yLast) * HH + H - minY;
      g.beginPath();
      g.moveTo(ax, ay);
      g.lineTo(bx, by);
      g.strokePath();
    }

    // Garis baris (gy tetap) — dari kiri-atas ke kanan-bawah
    for (let gy = y1 + 1; gy <= y2; gy++) {
      const gyc = gy - 1;
      const ax = (x1 - gyc) * HW - minX;
      const ay = (x1 + gyc) * HH + HH - minY;
      const bx = (xLast - gyc) * HW + HW - minX;
      const by = (xLast + gyc) * HH + H - minY;
      g.beginPath();
      g.moveTo(ax, ay);
      g.lineTo(bx, by);
      g.strokePath();
    }

    const texKey = 'zone_' + key;
    if (this.textures.exists(texKey)) this.textures.remove(texKey);
    g.generateTexture(texKey, pw, ph);
    g.destroy();

    const img = this.add.image(minX, minY, texKey);
    img.setOrigin(0, 0);
    img.setDepth(-1000);
  }

  // ---------- Kamera ----------

  setupCamera() {
    const cam = this.cameras.main;
    const b = window.getMapBounds();

    cam.setBounds(b.minX, b.minY, b.width, b.height);
    cam.centerOn((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
    cam.setZoom(0.6);
  }

  setupInput() {
    const cam = this.cameras.main;

    // Wheel zoom (desktop)
    this.input.on('wheel', (p, over, dx, dy) => {
      const z = Phaser.Math.Clamp(cam.zoom - dy * 0.001, 0.08, 2);
      cam.setZoom(z);
    });

    // Keyboard pan
    this.keys = this.input.keyboard.addKeys({
      up:     Phaser.Input.Keyboard.KeyCodes.W,
      down:   Phaser.Input.Keyboard.KeyCodes.S,
      left:   Phaser.Input.Keyboard.KeyCodes.A,
      right:  Phaser.Input.Keyboard.KeyCodes.D,
      up2:    Phaser.Input.Keyboard.KeyCodes.UP,
      down2:  Phaser.Input.Keyboard.KeyCodes.DOWN,
      left2:  Phaser.Input.Keyboard.KeyCodes.LEFT,
      right2: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    // SPACE = reset
    this.input.keyboard.on('keydown-SPACE', () => {
      const b = window.getMapBounds();
      cam.centerOn((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
      cam.setZoom(0.6);
    });

    this._drag = null;
    this._pinchDist = 0;
  }

  // ---------- Update loop ----------

  update(_time, _delta) {
    const cam = this.cameras.main;
    const ptrs = this.input.manager.pointers.filter(p => p.isDown);

    if (ptrs.length >= 2) {
      // Pinch zoom
      const a = ptrs[0], b = ptrs[1];
      const dist = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      if (this._pinchDist > 0) {
        const factor = dist / this._pinchDist;
        cam.setZoom(Phaser.Math.Clamp(cam.zoom * factor, 0.08, 2));
      }
      this._pinchDist = dist;
      this._drag = null;
    } else if (ptrs.length === 1) {
      // Pan 1 jari
      this._pinchDist = 0;
      const p = ptrs[0];
      if (!this._drag || this._drag.pointer !== p) {
        this._drag = {
          pointer: p,
          x: p.x, y: p.y,
          sx: cam.scrollX, sy: cam.scrollY
        };
      } else {
        const dx = (p.x - this._drag.x) / cam.zoom;
        const dy = (p.y - this._drag.y) / cam.zoom;
        cam.scrollX = this._drag.sx - dx;
        cam.scrollY = this._drag.sy - dy;
      }
    } else {
      this._pinchDist = 0;
      this._drag = null;
    }

    // Keyboard pan
    const k = this.keys;
    if (k) {
      const speed = 12 / cam.zoom;
      if (k.left.isDown  || k.left2.isDown)  cam.scrollX -= speed;
      if (k.right.isDown || k.right2.isDown) cam.scrollX += speed;
      if (k.up.isDown    || k.up2.isDown)    cam.scrollY -= speed;
      if (k.down.isDown  || k.down2.isDown)  cam.scrollY += speed;
    }
  }
}
