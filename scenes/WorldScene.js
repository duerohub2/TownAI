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

  renderAllZones() {
    const zones = window.ZONE_CONFIG;
    for (const key in zones) {
      this.renderZone(key, zones[key]);
    }
  }

  renderZone(key, zone) {
    const HW = window.TILE_HW;
    const HH = window.TILE_HH;
    const W  = window.TILE_W;
    const H  = window.TILE_H;

    const pb = window.getZonePixelBounds(zone);
    const color = window.FLOOR_COLORS[zone.floor] || 0x808080;

    const g = this.add.graphics();
    g.fillStyle(color, 1);
    g.lineStyle(1, 0x000000, 0.10);

    for (let gy = zone.y1; gy < zone.y2; gy++) {
      for (let gx = zone.x1; gx < zone.x2; gx++) {
        const sx = (gx - gy) * HW - pb.minX;
        const sy = (gx + gy) * HH - pb.minY;

        g.beginPath();
        g.moveTo(sx + HW, sy);
        g.lineTo(sx + W,  sy + HH);
        g.lineTo(sx + HW, sy + H);
        g.lineTo(sx,      sy + HH);
        g.closePath();
        g.fillPath();
        g.strokePath();
      }
    }

    const texKey = 'zone_' + key;
    if (this.textures.exists(texKey)) {
      this.textures.remove(texKey);
    }
    g.generateTexture(texKey, pb.width, pb.height);
    g.destroy();

    const img = this.add.image(pb.minX, pb.minY, texKey);
    img.setOrigin(0, 0);
    img.setDepth(-1000);
  }

  setupCamera() {
    const cam = this.cameras.main;
    const b = window.getMapBounds();

    cam.setBounds(b.minX, b.minY, b.width, b.height);
    cam.centerOn((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
    cam.setZoom(0.5);
  }

  setupInput() {
    const cam = this.cameras.main;

    // Zoom pakai wheel (desktop)
    this.input.on('wheel', (pointer, over, dx, dy) => {
      const z = Phaser.Math.Clamp(cam.zoom - dy * 0.001, 0.15, 2);
      cam.setZoom(z);
    });

    // Drag 1 jari untuk pan
    this._drag = null;
    this.input.on('pointerdown', (p) => {
      this._drag = {
        x: p.x, y: p.y,
        sx: cam.scrollX, sy: cam.scrollY,
        moved: false
      };
    });
    this.input.on('pointerup', () => { this._drag = null; });
    this.input.on('pointermove', (p) => {
      if (!this._drag || !p.isDown) return;
      const dx = (p.x - this._drag.x) / cam.zoom;
      const dy = (p.y - this._drag.y) / cam.zoom;
      if (Math.abs(dx) + Math.abs(dy) > 2) this._drag.moved = true;
      cam.scrollX = this._drag.sx - dx;
      cam.scrollY = this._drag.sy - dy;
    });

    // Keyboard pan
    this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up2:    Phaser.Input.Keyboard.KeyCodes.UP,
      down2:  Phaser.Input.Keyboard.KeyCodes.DOWN,
      left2:  Phaser.Input.Keyboard.KeyCodes.LEFT,
      right2: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    // SPACE = reset ke center
    this.input.keyboard.on('keydown-SPACE', () => {
      const b = window.getMapBounds();
      cam.centerOn((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
      cam.setZoom(0.5);
    });

    // +/- = zoom (STEP 1 keyboard, nanti diganti tombol UI di STEP 8)
    this.input.keyboard.on('keydown-PLUS',  () => cam.setZoom(Phaser.Math.Clamp(cam.zoom + 0.1, 0.15, 2)));
    this.input.keyboard.on('keydown-MINUS', () => cam.setZoom(Phaser.Math.Clamp(cam.zoom - 0.1, 0.15, 2)));
  }

  update(_time, _delta) {
    const cam = this.cameras.main;
    const speed = 10 / cam.zoom;
    const k = this.keys;
    if (!k) return;

    if (k.left.isDown  || k.left2.isDown)  cam.scrollX -= speed;
    if (k.right.isDown || k.right2.isDown) cam.scrollX += speed;
    if (k.up.isDown    || k.up2.isDown)    cam.scrollY -= speed;
    if (k.down.isDown  || k.down2.isDown)  cam.scrollY += speed;
  }
}
