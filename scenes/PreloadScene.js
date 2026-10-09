// language: JavaScript, file: scenes/PreloadScene.js
// Generate semua tile pakai canvas, gak ada load external

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create() {
    // loading screen simple
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    this.add.text(cx, cy, 'Loading...', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    // generate semua tile
    this.makeGrass();
    this.makePath();
    this.makeHouse();
    this.makeOffice();
    this.makeMarket();
    this.makeFarm();
    this.makeTree();
    this.makeWater();
    this.makePlayer();
    this.makeNPC();

    // langsung masuk game
    this.scene.start('WorldScene');
  }

  // helper: bikin texture dari graphics
  makeTex(key, w, h, drawFn) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    drawFn(g);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  makeGrass() {
    this.makeTex('grass', 32, 32, (g) => {
      g.fillStyle(0x5a9e4a, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x3d7033, 1);
      for (let i = 0; i < 10; i++) {
        g.fillRect(Math.random() * 30 | 0, Math.random() * 30 | 0, 2, 2);
      }
    });
  }

  makePath() {
    this.makeTex('path', 32, 32, (g) => {
      g.fillStyle(0xa89878, 1);
      g.fillRect(0, 0, 32, 32);
      g.lineStyle(1, 0x7a6a4a, 1);
      g.strokeRect(0, 0, 32, 32);
      g.fillStyle(0x8a7a5a, 1);
      for (let i = 0; i < 6; i++) {
        g.fillRect(Math.random() * 30 | 0, Math.random() * 30 | 0, 2, 2);
      }
    });
  }

  makeHouse() {
    this.makeTex('house', 32, 32, (g) => {
      // badan rumah
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(2, 14, 28, 18);
      // atap
      g.fillStyle(0xc04030, 1);
      g.beginPath();
      g.moveTo(0, 14);
      g.lineTo(16, 2);
      g.lineTo(32, 14);
      g.closePath();
      g.fillPath();
      // pintu
      g.fillStyle(0x4a2a1a, 1);
      g.fillRect(13, 22, 6, 10);
      // jendela
      g.fillStyle(0x9ed8ff, 1);
      g.fillRect(6, 18, 4, 4);
      g.fillRect(22, 18, 4, 4);
    });
  }

  makeOffice() {
    this.makeTex('office', 32, 32, (g) => {
      g.fillStyle(0x6a6a8a, 1);
      g.fillRect(2, 4, 28, 28);
      g.fillStyle(0x3a3a5a, 1);
      g.fillRect(2, 4, 28, 3);
      // jendela grid
      g.fillStyle(0x9ed8ff, 1);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          g.fillRect(5 + c * 8, 10 + r * 7, 5, 4);
        }
      }
      // pintu
      g.fillStyle(0x2a2a4a, 1);
      g.fillRect(13, 26, 6, 6);
    });
  }

  makeMarket() {
    this.makeTex('market', 32, 32, (g) => {
      g.fillStyle(0xc8a860, 1);
      g.fillRect(2, 12, 28, 18);
      // atap garis merah putih
      g.fillStyle(0xc04030, 1);
      g.fillRect(0, 8, 32, 6);
      g.fillStyle(0xffffff, 1);
      for (let i = 0; i < 4; i++) {
        g.fillRect(i * 8 + 2, 8, 4, 6);
      }
      // tiang
      g.fillStyle(0x5a3a1a, 1);
      g.fillRect(2, 14, 2, 16);
      g.fillRect(28, 14, 2, 16);
      // barang
      g.fillStyle(0xcc4444, 1);
      g.fillRect(6, 20, 4, 4);
      g.fillStyle(0x44cc44, 1);
      g.fillRect(14, 20, 4, 4);
      g.fillStyle(0xcccc44, 1);
      g.fillRect(22, 20, 4, 4);
    });
  }

  makeFarm() {
    this.makeTex('farm', 32, 32, (g) => {
      g.fillStyle(0x7a5a3a, 1);
      g.fillRect(0, 0, 32, 32);
      // baris tanaman
      g.fillStyle(0x4a8a3a, 1);
      for (let i = 0; i < 3; i++) {
        g.fillRect(4, 6 + i * 8, 24, 3);
      }
      g.fillStyle(0x2a5a1a, 1);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 6; j++) {
          g.fillRect(5 + j * 4, 6 + i * 8, 2, 1);
        }
      }
    });
  }

  makeTree() {
    this.makeTex('tree', 32, 32, (g) => {
      // batang
      g.fillStyle(0x5a3a1a, 1);
      g.fillRect(13, 20, 6, 12);
      // daun bertingkat
      g.fillStyle(0x2a6a2a, 1);
      g.beginPath();
      g.arc(16, 14, 11, 0, Math.PI * 2);
      g.fillPath();
      g.fillStyle(0x3a8a3a, 1);
      g.beginPath();
      g.arc(14, 12, 7, 0, Math.PI * 2);
      g.fillPath();
    });
  }

  makeWater() {
    this.makeTex('water', 32, 32, (g) => {
      g.fillStyle(0x4a7ab0, 1);
      g.fillRect(0, 0, 32, 32);
      g.lineStyle(1, 0xaad0f0, 1);
      g.beginPath();
      g.moveTo(4, 10);
      g.lineTo(12, 10);
      g.strokePath();
      g.beginPath();
      g.moveTo(18, 18);
      g.lineTo(28, 18);
      g.strokePath();
      g.beginPath();
      g.moveTo(6, 24);
      g.lineTo(16, 24);
      g.strokePath();
    });
  }

  makePlayer() {
    this.makeTex('player', 32, 32, (g) => {
      // badan
      g.fillStyle(0x3366cc, 1);
      g.fillRect(6, 12, 20, 16);
      // outline badan
      g.lineStyle(2, 0x1a3366, 1);
      g.strokeRect(6, 12, 20, 16);
      // kepala
      g.fillStyle(0xf5d0a9, 1);
      g.fillRect(9, 2, 14, 12);
      g.lineStyle(2, 0x8a6a4a, 1);
      g.strokeRect(9, 2, 14, 12);
      // rambut
      g.fillStyle(0x3a2a1a, 1);
      g.fillRect(8, 1, 16, 4);
      // mata
      g.fillStyle(0x000000, 1);
      g.fillRect(12, 7, 2, 2);
      g.fillRect(18, 7, 2, 2);
      // kaki
      g.fillStyle(0x333333, 1);
      g.fillRect(8, 28, 6, 4);
      g.fillRect(18, 28, 6, 4);
    });
  }

  makeNPC() {
    // 6 NPC dengan warna beda
    const colors = {
      'npc_budi': 0xdd8833,
      'npc_sari': 0x3366cc,
      'npc_andi': 0xddaa33,
      'npc_maya': 0xdd66aa,
      'npc_rian': 0x8833dd,
      'npc_tika': 0x33aa66
    };
    for (const key in colors) {
      const color = colors[key];
      this.makeTex(key, 32, 32, (g) => {
        // badan
        g.fillStyle(color, 1);
        g.fillRect(6, 12, 20, 16);
        g.lineStyle(2, 0x333333, 1);
        g.strokeRect(6, 12, 20, 16);
        // kepala
        g.fillStyle(0xf5d0a9, 1);
        g.fillRect(9, 2, 14, 12);
        g.lineStyle(2, 0x8a6a4a, 1);
        g.strokeRect(9, 2, 14, 12);
        // rambut
        g.fillStyle(0x3a2a1a, 1);
        g.fillRect(8, 1, 16, 4);
        // mata
        g.fillStyle(0x000000, 1);
        g.fillRect(12, 7, 2, 2);
        g.fillRect(18, 7, 2, 2);
        // kaki
        g.fillStyle(0x333333, 1);
        g.fillRect(8, 28, 6, 4);
        g.fillRect(18, 28, 6, 4);
      });
    }
  }
}
