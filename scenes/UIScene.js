// Overlay UI: koordinat, minimap 100x100, hint. Elemen HTML ada di index.html.
class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); }

  create() {
    this.world = this.scene.get('WorldScene');
    this.coordsEl = document.getElementById('coords');
    this.ctx = document.getElementById('minimap').getContext('2d');
    this.size = 100;
    this.scale_ = this.size / MAP_W;

    // Lapisan dasar minimap digambar sekali
    this.base = document.createElement('canvas');
    this.base.width = this.base.height = this.size;
    const b = this.base.getContext('2d');
    const s = this.scale_;
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        b.fillStyle = toHex(TILE_COLORS[MAP_DATA[y][x]]);
        b.fillRect(Math.floor(x * s), Math.floor(y * s), Math.ceil(s), Math.ceil(s));
      }
    }
    document.getElementById('hud').classList.remove('hidden');
  }

  update() {
    const p = this.world.player;
    if (!p) return;
    this.coordsEl.textContent =
      'x: ' + Math.round(p.x) + '  y: ' + Math.round(p.y) +
      '  tile: ' + Math.floor(p.x / TILE) + ',' + Math.floor(p.y / TILE);

    // Minimap: lapisan dasar + titik posisi player
    this.ctx.drawImage(this.base, 0, 0);
    this.ctx.fillStyle = '#ef4444';
    const mx = (p.x / TILE) * this.scale_;
    const my = (p.y / TILE) * this.scale_;
    this.ctx.fillRect(Math.round(mx) - 2, Math.round(my) - 2, 4, 4);
  }
}
