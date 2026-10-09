// Memuat aset dari Pollinations AI via URL. Aset yang gagal diganti warna solid.
const POLL = 'https://image.pollinations.ai/prompt/';
const asset = (prompt, seed) =>
  POLL + encodeURIComponent(prompt) + '?width=32&height=32&nologo=true&seed=' + seed;

// Seed berbeda per tile supaya hasil konsisten
const ASSETS = {
  grass:  asset('top down view pixel art grass tile 32x32 seamless simple', 1),
  house:  asset('top down view pixel art small house 32x32 simple', 2),
  office: asset('top down view pixel art office building 32x32 simple', 3),
  farm:   asset('top down view pixel art farm field 32x32 simple', 4),
  market: asset('top down view pixel art market stall 32x32 simple', 5),
  path:   asset('top down view pixel art stone path tile 32x32 seamless', 6),
  tree:   asset('top down view pixel art tree 32x32 simple', 7),
  player: asset('top down view pixel art character sprite 32x32 simple', 8)
};

class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  preload() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const barW = 300;

    this.add.text(cx, cy - 36, 'AI World', { fontFamily: 'monospace', fontSize: '22px', color: '#e2e8f0' }).setOrigin(0.5);
    const status = this.add.text(cx, cy + 28, 'Memuat aset 0%', { fontFamily: 'monospace', fontSize: '13px', color: '#94a3b8' }).setOrigin(0.5);
    this.add.rectangle(cx, cy, barW, 12, 0x1a2029).setStrokeStyle(1, 0x2a313c);
    const bar = this.add.rectangle(cx - barW / 2, cy, 0, 12, 0x6ee7b7).setOrigin(0, 0.5);

    this.load.on('progress', (v) => {
      bar.width = barW * v;
      status.setText('Memuat aset ' + Math.round(v * 100) + '%');
    });
    // Catat aset yang gagal; game tetap lanjut
    this.failed = new Set();
    this.load.on('loaderror', (file) => this.failed.add(file.key));

    for (const key in ASSETS) this.load.image(key, ASSETS[key]);
  }

  create() {
    for (const key in ASSETS) {
      if (this.failed.has(key) || !this.textures.exists(key)) {
        this.makeFallback(key);
      } else {
        this.normalize(key);
      }
    }
    this.scene.start('WorldScene');
  }

  // Pastikan tekstur persis 32x32 (hasil AI bisa beda ukuran)
  normalize(key) {
    const img = this.textures.get(key).getSourceImage();
    if (img.width === TILE && img.height === TILE) return;
    const c = document.createElement('canvas');
    c.width = c.height = TILE;
    c.getContext('2d').drawImage(img, 0, 0, TILE, TILE);
    this.textures.remove(key);
    this.textures.addCanvas(key, c);
  }

  // Tekstur pengganti berupa warna solid
  makeFallback(key) {
    if (this.textures.exists(key)) this.textures.remove(key);
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(TILE_COLORS[key], 1);
    if (key === 'player') {
      g.fillCircle(TILE / 2, TILE / 2, 11);
    } else {
      g.fillRect(0, 0, TILE, TILE);
      g.lineStyle(1, 0x000000, 0.25);
      g.strokeRect(0.5, 0.5, TILE - 1, TILE - 1);
    }
    g.generateTexture(key, TILE, TILE);
    g.destroy();
  }
}
