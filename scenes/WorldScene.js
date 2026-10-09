class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#15151f');

    this.renderAllZones();
    this.setupCamera();
    this.setupInput();
    this.createZoomButtons();
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

  zoomBy(delta) {
    const cam = this.cameras.main;
    cam.setZoom(Phaser.Math.Clamp(cam.zoom + delta, 0.15, 2));
  }

  setupInput() {
    const cam = this.cameras.main;

    // Wheel zoom (desktop)
    this.input.on('wheel', (p, over, dx, dy) => {
      const z = Phaser.Math.Clamp(cam.zoom - dy * 0.001, 0.15, 2);
      cam.setZoom(z);
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

    // SPACE = reset kamera
    this.input.keyboard.on('keydown-SPACE', () => {
      const b = window.getMapBounds();
      cam.centerOn((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
      cam.setZoom(0.5);
    });

    // Keyboard zoom pakai keyCode langsung (biar + / - / numpad semua kena)
    this.input.keyboard.on('keydown', (event) => {
      const kc = event.keyCode;
      if (kc === 187 || kc === 107) this.zoomBy(0.15);   // = / + / numpad+
      if (kc === 189 || kc === 109) this.zoomBy(-0.15);  // - / _ / numpad-
    });

    // State pan/pinch
    this._drag = null;
    this._pinchDist = 0;
    this._uiPressed = false;

    const clearUI = () => { this._uiPressed = false; };
    this.input.on('pointerup', clearUI);
    this.input.on('pointerupoutside', clearUI);
    this.input.on('gameout', clearUI);
  }

  createZoomButtons() {
    const SIZE = 44;
    const PAD  = 14;
    const bgColor = 0x2a2a3a;
    const borderColor = 0x5a5a6a;
    const textColor = '#ffffff';

    const makeBtn = (label) => {
      const bg = this.add.rectangle(0, 0, SIZE, SIZE, bgColor, 0.9)
        .setStrokeStyle(2, borderColor, 1)
        .setScrollFactor(0)
        .setDepth(10000)
        .setInteractive({ useHandCursor: true });
      const txt = this.add.text(0, 0, label, {
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
        color: textColor
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(10001);
      return { bg, txt };
    };

    const plus  = makeBtn('+');
    const minus = makeBtn('\u2212'); // minus sign

    plus.bg.on('pointerdown', () => {
      this._uiPressed = true;
      this.zoomBy(0.15);
    });
    minus.bg.on('pointerdown', () => {
      this._uiPressed = true;
      this.zoomBy(-0.15);
    });

    this._zoomButtons = { plus, minus, size: SIZE, pad: PAD };
    this.layoutZoomButtons();

    this.scale.on('resize', this.layoutZoomButtons, this);
  }

  layoutZoomButtons() {
    const ui = this._zoomButtons;
    if (!ui) return;
    const cam = this.cameras.main;
    const zoom = cam.zoom || 1;
    const inv = 1 / zoom;             // biar tombol tetap 44px di layar walau camera zoom
    const W = this.scale.width;

    const size = ui.size * inv;
    const pad  = ui.pad  * inv;
    const gap  = 8 * inv;

    const x = W - pad - size / 2;
    const yPlus  = pad + size / 2;
    const yMinus = yPlus + size + gap;

    const apply = (btn, x, y) => {
      btn.bg.setPosition(x, y);
      btn.bg.setDisplaySize(size, size);
      btn.bg.setStrokeStyle(2 * inv, 0x5a5a6a, 1);
      btn.txt.setPosition(x, y);
      btn.txt.setScale(inv);
    };

    apply(ui.plus, x, yPlus);
    apply(ui.minus, x, yMinus);
  }

  update(_time, _delta) {
    const cam = this.cameras.main;

    // Tombol UI selalu 44px di layar
    this.layoutZoomButtons();

    const ptrs = this.input.manager.pointers.filter(p => p.isDown);

    if (this._uiPressed) {
      // Jangan pan/pinch kalau lagi pencet tombol
      this._drag = null;
      this._pinchDist = 0;
    } else if (ptrs.length >= 2) {
      // Pinch-to-zoom
      const a = ptrs[0], b = ptrs[1];
      const dist = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      if (this._pinchDist > 0) {
        const factor = dist / this._pinchDist;
        const z = Phaser.Math.Clamp(cam.zoom * factor, 0.15, 2);
        cam.setZoom(z);
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
      const speed = 10 / cam.zoom;
      if (k.left.isDown  || k.left2.isDown)  cam.scrollX -= speed;
      if (k.right.isDown || k.right2.isDown) cam.scrollX += speed;
      if (k.up.isDown    || k.up2.isDown)    cam.scrollY -= speed;
      if (k.down.isDown  || k.down2.isDown)  cam.scrollY += speed;
    }
  }
}
