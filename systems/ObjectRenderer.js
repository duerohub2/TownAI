// Render objek isometric dengan texture caching (per signature).
// Pemakaian:
//   const renderer = new ObjectRenderer(scene);
//   const info = renderer.render(desc);  // { texKey, offX, offY }
//   // offX/offY = offset pixel dari anchor (north corner base diamond) ke tex top-left.
class ObjectRenderer {
  constructor(scene) {
    this.scene = scene;
    this.cache = new Map();
    this.counter = 0;
  }

  render(desc) {
    const sig = this._sig(desc);
    if (this.cache.has(sig)) return this.cache.get(sig);
    const info = this._build(desc, sig);
    this.cache.set(sig, info);
    return info;
  }

  _sig(desc) {
    // Buang gx/gy/z karena nggak ngaruh ke bentuk
    const copy = Object.assign({}, desc);
    delete copy.gx;
    delete copy.gy;
    delete copy.z;
    return JSON.stringify(copy);
  }

  _makeTex(width, height, drawFn) {
    const w = Math.ceil(width);
    const h = Math.ceil(height);
    const key = 'obj_' + (++this.counter);
    const g = this.scene.add.graphics();
    drawFn(g);
    g.generateTexture(key, w, h);
    g.destroy();
    return key;
  }

  _build(desc, sig) {
    switch (desc.type) {
      case "counter":   return this._buildCounter(desc);
      case "desk":      return this._buildDesk(desc);
      case "chair":     return this._buildChair(desc);
      case "table":     return this._buildTable(desc);
      case "monitor":   return this._buildMonitor(desc);
      case "sofa":      return this._buildSofa(desc);
      case "plant":     return this._buildPlant(desc);
      case "tree":      return this._buildTree(desc);
      case "bush":      return this._buildBush(desc);
      case "tv":        return this._buildTV(desc);
      case "fridge":    return this._buildFridge(desc);
      case "bookshelf": return this._buildBookshelf(desc);
      case "pool":      return this._buildPool(desc);
      default:          return this._buildDesk(desc);
    }
  }

  // ---- Tipe generik ----

  _buildBoxLike(desc, colors) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1, h = desc.h || 20;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h;
    const nx = d * HW, ny = h;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, colors.top, colors.left, colors.right);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildDesk(desc) {
    return this._buildBoxLike(desc, window.PALETTE.desk);
  }

  _buildChair(desc) {
    const c = window.PALETTE.chair;
    return this._buildBoxLike(desc, c);
  }

  _buildTable(desc) {
    const c = window.PALETTE.desk;
    return this._buildBoxLike(desc, c);
  }

  _buildCounter(desc) {
    return this._buildBoxLike(desc, window.PALETTE.counter);
  }

  _buildFridge(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1, h = desc.h || 40;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h;
    const nx = d * HW, ny = h;
    const c = window.PALETTE.fridge;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, c.top, c.left, c.right);

      // Garis pintu (shelf) di face kanan
      g.lineStyle(1, c.trim, 0.8);
      g.beginPath();
      g.moveTo(nx + w * HW,     ny + w * HH - h + h * 0.35);
      g.lineTo(nx + (w - d) * HW, ny + (w + d) * HH - h + h * 0.35);
      g.strokePath();

      // Handle kecil
      g.fillStyle(c.trim, 1);
      g.fillRect(nx + (w - d) * HW + 4, ny + (w + d) * HH - h + h * 0.30, 3, 8);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildMonitor(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 0.4, h = desc.h || 14;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 8;
    const nx = d * HW, ny = h + 4;
    const c = window.PALETTE.monitor;

    const key = this._makeTex(width, height, (g) => {
      // Stand
      window.drawIsoBox(g, nx, ny, 0.4, 0.3, 4, 0x2a2a2a, 0x1a1a1a, 0x222222);
      // Body monitor
      window.drawIsoBox(g, nx, ny - 4, w, d, h, c.top, c.left, c.right);

      // Layar glow (parallelogram di face kanan, menghadap tenggara)
      const Ex = nx + w * HW;
      const Ey = ny - 4 + w * HH;
      const Sx = nx + (w - d) * HW;
      const Sy = ny - 4 + (w + d) * HH;
      g.fillStyle(c.screen, 1);
      g.beginPath();
      g.moveTo(Ex - 3, Ey - h * 0.85);
      g.lineTo(Sx + 3, Sy - h * 0.85);
      g.lineTo(Sx + 3, Sy - h * 0.15);
      g.lineTo(Ex - 3, Ey - h * 0.15);
      g.closePath();
      g.fillPath();

      // Highlight tipis
      g.fillStyle(0x8ec0ff, 0.35);
      g.beginPath();
      g.moveTo(Ex - 5, Ey - h * 0.80);
      g.lineTo(Sx + 5, Sy - h * 0.80);
      g.lineTo(Sx + 5, Sy - h * 0.55);
      g.lineTo(Ex - 5, Ey - h * 0.55);
      g.closePath();
      g.fillPath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildSofa(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 2, d = desc.d || 1, h = desc.h || 16;
    const bodyColor = desc.color || window.PALETTE.sofa.top;
    const cushion    = Phaser.Display.Color.IntegerToColor(bodyColor).brighten(20).color;

    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 8;
    const nx = d * HW, ny = h + 8;

    const key = this._makeTex(width, height, (g) => {
      // Base sofa
      window.drawIsoBox(g, nx, ny, w, d, h, bodyColor, window.PALETTE.sofa.left, bodyColor);
      // Cushion lines
      const Ex = nx + w * HW;
      const Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW;
      const Sy = ny + (w + d) * HH;
      g.lineStyle(1, 0x000000, 0.2);
      g.beginPath();
      g.moveTo(Ex, Ey - h);
      g.lineTo(Sx, Sy - h);
      g.strokePath();
      // Sandaran (kecil di sisi utara)
      window.drawIsoBox(g, nx, ny - h, w, 0.15, h * 0.6,
                        cushion, window.PALETTE.sofa.left, cushion);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildPlant(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const h = desc.h || 26;
    const potH = Math.max(8, h * 0.35);
    const leafH = h - potH;
    const d = 0.6, w = 0.6;
    const width  = (w + d) * HW + 8;
    const height = (w + d) * HH + h + 8;
    const nx = d * HW + 4, ny = potH;
    const p = window.PALETTE.plant;

    const key = this._makeTex(width, height, (g) => {
      // Pot
      window.drawIsoBox(g, nx, ny, w, d, potH, p.pot, p.potDark, p.pot);

      // Daun — beberapa ellipse di atas pot
      const cxp = nx + (w / 2 - d / 2) * HW;
      const cyp = ny - 2 + (w / 2 + d / 2) * HH;

      const leaf = (dx, dy, rx, ry, color) => {
        g.fillStyle(color, 1);
        g.beginPath();
        g.ellipse(cxp + dx, cyp + dy, rx, ry, 0, 0, Math.PI * 2);
        g.fillPath();
      };

      const baseY = cyp - potH - leafH * 0.5;
      leaf( 0,   baseY + 4,        leafH * 0.55, leafH * 0.35, p.leafDark);
      leaf(-6,   baseY,            leafH * 0.50, leafH * 0.32, p.leaf);
      leaf( 6,   baseY + 2,        leafH * 0.50, leafH * 0.32, p.leaf);
      leaf( 0,   baseY - 6,        leafH * 0.45, leafH * 0.30, p.leafLight);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildTree(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const h = desc.h || 52;
    const trunkH = h * 0.45;
    const crownH = h - trunkH;
    const w = 0.5, d = 0.5;
    const width  = 100;
    const height = h + 30;
    const nx = width / 2, ny = h;
    const t = window.PALETTE.tree;

    const key = this._makeTex(width, height, (g) => {
      // Trunk
      window.drawIsoBox(g, nx, ny, w, d, trunkH, t.trunk, t.trunkDark, t.trunk);

      // Crown (3 ellipse hijau bertumpuk)
      const cxp = nx + (w / 2 - d / 2) * HW;
      const cyp = ny + (w / 2 + d / 2) * HH;
      const baseY = cyp - trunkH - crownH * 0.5;

      const blob = (dx, dy, rx, ry, color) => {
        g.fillStyle(color, 1);
        g.beginPath();
        g.ellipse(cxp + dx, baseY + dy, rx, ry, 0, 0, Math.PI * 2);
        g.fillPath();
      };
      blob(-14,  8, 26, 20, t.leafDark);
      blob( 14,  8, 26, 20, t.leafDark);
      blob(  0,  0, 30, 22, t.leaf);
      blob(  0, -8, 24, 18, t.leafLight);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildBush(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const h = desc.h || 16;
    const width = 60, height = h + 20;
    const nx = 30, ny = 20;
    const b = window.PALETTE.bush;

    const key = this._makeTex(width, height, (g) => {
      const cxp = nx;
      const cyp = ny + HH * 0.5;
      const blob = (dx, dy, rx, ry, color) => {
        g.fillStyle(color, 1);
        g.beginPath();
        g.ellipse(cxp + dx, cyp + dy, rx, ry, 0, 0, Math.PI * 2);
        g.fillPath();
      };
      blob(-8, 0, 14, 10, b.left);
      blob( 8, 0, 14, 10, b.left);
      blob( 0, -3, 16, 12, b.top);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildTV(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 2, d = desc.d || 0.4, h = desc.h || 22;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 8;
    const nx = d * HW, ny = h + 6;
    const c = window.PALETTE.tv;

    const key = this._makeTex(width, height, (g) => {
      // Stand
      window.drawIsoBox(g, nx, ny, 0.8, 0.4, 4, 0x2a2a2a, 0x1a1a1a, 0x222222);
      // Body
      window.drawIsoBox(g, nx, ny - 4, w, d, h, c.top, c.left, c.right);

      // Layar
      const Ex = nx + w * HW;
      const Ey = ny - 4 + w * HH;
      const Sx = nx + (w - d) * HW;
      const Sy = ny - 4 + (w + d) * HH;
      g.fillStyle(c.screen, 1);
      g.beginPath();
      g.moveTo(Ex - 3, Ey - h * 0.85);
      g.lineTo(Sx + 3, Sy - h * 0.85);
      g.lineTo(Sx + 3, Sy - h * 0.15);
      g.lineTo(Ex - 3, Ey - h * 0.15);
      g.closePath();
      g.fillPath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildBookshelf(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 3, h = desc.h || 44;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h;
    const nx = d * HW, ny = h;
    const b = window.PALETTE.bookshelf;

    const key = this._makeTex(width, height, (g) => {
      // Body utama
      window.drawIsoBox(g, nx, ny, w, d, h, b.top, b.left, b.right);

      // Buku-buku: deretan kotak kecil di face kanan
      const Ex = nx + w * HW;
      const Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW;
      const Sy = ny + (w + d) * HH;

      // Dua baris rak
      const rows = [0.35, 0.68];
      for (const fy of rows) {
        // Shelf plank
        g.fillStyle(b.shelf, 1);
        const y1 = Ey - h * (fy + 0.05);
        const y2 = Sy - h * (fy + 0.05);
        g.beginPath();
        g.moveTo(Ex, y1);
        g.lineTo(Sx, y2);
        g.lineTo(Sx, y2 + 2);
        g.lineTo(Ex, y1 + 2);
        g.closePath();
        g.fillPath();

        // Buku random
        const n = 5;
        for (let i = 0; i < n; i++) {
          const t = (i + 0.2) / n;
          const bx = Phaser.Math.Linear(Ex, Sx, t);
          const by = Phaser.Math.Linear(y1, y2, t);
          const bk = b.books[(i * 7 + Math.floor(fy * 100)) % b.books.length];
          g.fillStyle(bk, 1);
          g.fillRect(bx - 3, by - h * 0.22, 6, h * 0.20);
        }
      }
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildPool(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 4, d = desc.d || 3;
    const width  = (w + d) * HW;
    const height = (w + d) * HH;
    const nx = d * HW, ny = 0;
    const p = window.PALETTE.pool;

    const key = this._makeTex(width, height, (g) => {
      // Border luar
      window.drawIsoDiamond(g, nx, ny, w, d, p.edgeDark);
      // Border tipis di dalam
      const inset = 0.15;
      window.drawIsoDiamond(g, nx, ny + inset * HH, w - inset, d - inset, p.edge);
      // Air
      window.drawIsoDiamond(g, nx, ny + inset * HH * 2, w - inset * 2, d - inset * 2, p.water);
      // Highlight ripple
      window.drawIsoDiamond(g, nx + HW * 0.4, ny + inset * HH * 2 + HH * 0.6, w - inset * 2 - 1, d - inset * 2 - 1, p.waterDeep);
    });
    return { texKey: key, offX: nx, offY: ny };
  }
}
