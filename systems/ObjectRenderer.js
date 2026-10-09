class ObjectRenderer {
  constructor(scene) {
    this.scene = scene;
    this.cache = new Map();
    this.counter = 0;
  }

  render(desc) {
    const sig = this._sig(desc);
    if (this.cache.has(sig)) return this.cache.get(sig);
    const info = this._build(desc);
    this.cache.set(sig, info);
    return info;
  }

  _sig(desc) {
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
    try {
      drawFn(g);
      g.generateTexture(key, w, h);
    } finally {
      g.destroy();
    }
    return key;
  }

  _brighten(color, amount) {
    const r = Math.min(255, ((color >> 16) & 0xff) + amount);
    const g = Math.min(255, ((color >> 8)  & 0xff) + amount);
    const b = Math.min(255, ( color        & 0xff) + amount);
    return (r << 16) | (g << 8) | b;
  }

  _darken(color, amount) {
    const r = Math.max(0, ((color >> 16) & 0xff) - amount);
    const g = Math.max(0, ((color >> 8)  & 0xff) - amount);
    const b = Math.max(0, ( color        & 0xff) - amount);
    return (r << 16) | (g << 8) | b;
  }

  _build(desc) {
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
      case "lamp":      return this._buildLamp(desc);
      case "flower":    return this._buildFlower(desc);
      case "bench":     return this._buildBench(desc);
      case "sign":      return this._buildSign(desc);
      case "trash":     return this._buildTrash(desc);
      case "arcade":    return this._buildArcade(desc);
      case "cabinet":   return this._buildCabinet(desc);
      case "rug":       return this._buildRug(desc);
      case "coffee":    return this._buildCoffee(desc);
      case "path":      return this._buildPath(desc);
      default:          return this._buildDesk(desc);
    }
  }

  // ============================================================
  // DESK — 4 kaki + permukaan tipis + drawer
  // ============================================================
  _buildDesk(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1;
    const topH = 6;
    const legH = 16;
    const totalH = topH + legH;
    const pad = 14;
    const width  = (w + d) * HW + pad * 2;
    const height = (w + d) * HH + totalH + pad * 2;
    const nx = d * HW + pad, ny = totalH + pad;

    const topC = 0xc69060, topL = 0x7a5020, topR = 0xa07848;
    const legC = 0x5a3a10, legL = 0x3a2008, legR = 0x4a2a10;
    const drawerC = 0x9a6a3a, drawerLine = 0x3a2010, handleC = 0xe0c080;

    const key = this._makeTex(width, height, (g) => {
      // Legs (render dulu supaya di belakang top)
      const legW = 0.2, legD = 0.2;
      const inX = 4, inY = 4;

      // North leg
      window.drawIsoBox(g, nx + inX, ny + inY, legW, legD, legH, legC, legL, legR);
      // East leg
      window.drawIsoBox(g, nx + (w - legW) * HW - inX, ny + (w - legW) * HH + inY,
                        legW, legD, legH, legC, legL, legR);
      // South leg
      window.drawIsoBox(g,
        nx + (w - d - legW + legD) * HW + inX,
        ny + (w + d - legW - legD) * HH - inY,
        legW, legD, legH, legC, legL, legR);
      // West leg
      window.drawIsoBox(g,
        nx - (d - legD) * HW - inX,
        ny + (d - legD) * HH - inY,
        legW, legD, legH, legC, legL, legR);

      // Top thin box
      window.drawIsoBox(g, nx, ny - legH, w, d, topH, topC, topL, topR);

      // Drawer panel di face kanan (E–S)
      const Ex = nx + w * HW,       Ey = ny - legH + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny - legH + (w + d) * HH;
      const drwH = legH * 0.55;
      const drwTop = Ey - 2, drwTopSy = Sy - 2;

      g.fillStyle(drawerC, 1);
      g.beginPath();
      g.moveTo(Ex, drwTop);
      g.lineTo(Ex, drwTop + drwH);
      g.lineTo(Sx, drwTopSy + drwH);
      g.lineTo(Sx, drwTopSy);
      g.closePath();
      g.fillPath();

      g.lineStyle(1, drawerLine, 0.9);
      g.beginPath();
      g.moveTo(Ex, drwTop);
      g.lineTo(Ex, drwTop + drwH);
      g.lineTo(Sx, drwTopSy + drwH);
      g.lineTo(Sx, drwTopSy);
      g.closePath();
      g.strokePath();

      // Handle
      g.fillStyle(handleC, 1);
      g.fillRect((Ex + Sx) / 2 - 4, (drwTop + drwTopSy) / 2 + drwH * 0.5 - 2, 8, 3);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // TABLE — 4 kaki + permukaan sangat tipis
  // ============================================================
  _buildTable(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1;
    const topH = 5;
    const legH = 15;
    const totalH = topH + legH;
    const pad = 14;
    const width  = (w + d) * HW + pad * 2;
    const height = (w + d) * HH + totalH + pad * 2;
    const nx = d * HW + pad, ny = totalH + pad;

    const topC = 0xc09060, topL = 0x705030, topR = 0xa07848;
    const legC = 0x4a2a10, legL = 0x2a1000, legR = 0x3a1a08;

    const key = this._makeTex(width, height, (g) => {
      const legW = 0.18, legD = 0.18;
      const inX = 4, inY = 4;

      window.drawIsoBox(g, nx + inX, ny + inY, legW, legD, legH, legC, legL, legR);
      window.drawIsoBox(g, nx + (w - legW) * HW - inX, ny + (w - legW) * HH + inY,
                        legW, legD, legH, legC, legL, legR);
      window.drawIsoBox(g,
        nx + (w - d - legW + legD) * HW + inX,
        ny + (w + d - legW - legD) * HH - inY,
        legW, legD, legH, legC, legL, legR);
      window.drawIsoBox(g,
        nx - (d - legD) * HW - inX,
        ny + (d - legD) * HH - inY,
        legW, legD, legH, legC, legL, legR);

      window.drawIsoBox(g, nx, ny - legH, w, d, topH, topC, topL, topR);

      // Highlight edge N–E
      const Nx = nx,                 Ny = ny - legH - topH;
      const Ex = nx + w * HW,        Ey = ny - legH - topH + w * HH;
      g.lineStyle(1, 0xe0b880, 0.8);
      g.beginPath();
      g.moveTo(Nx, Ny);
      g.lineTo(Ex, Ey);
      g.strokePath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // CHAIR — kaki + dudukan + sandaran
  // ============================================================
  _buildChair(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = 0.85, d = 0.85;
    const legH = 10;
    const seatH = 5;
    const backH = 13;
    const totalH = legH + seatH + backH;
    const pad = 16;
    const width  = (w + d) * HW + pad * 2;
    const height = (w + d) * HH + totalH + pad * 2;
    const nx = d * HW + pad, ny = totalH + pad;

    const seatC = 0x4a3a4a, seatL = 0x2a1a2a, seatR = 0x3a2a3a;
    const legC  = 0x2a1a10, legL = 0x1a0a00, legR = 0x201008;
    const backC = 0x5a4a5a, backL = 0x3a2a3a, backR = 0x4a3a4a;

    const key = this._makeTex(width, height, (g) => {
      // Sandaran (render dulu, di belakang)
      const backD = 0.18;
      window.drawIsoBox(g, nx, ny - legH - seatH - backH + 2, w, backD, backH,
                        backC, backL, backR);

      // 4 kaki
      const legW = 0.15, legD = 0.15;
      const inX = 3, inY = 3;
      window.drawIsoBox(g, nx + inX, ny + inY, legW, legD, legH, legC, legL, legR);
      window.drawIsoBox(g, nx + (w - legW) * HW - inX, ny + (w - legW) * HH + inY,
                        legW, legD, legH, legC, legL, legR);
      window.drawIsoBox(g,
        nx + (w - d - legW + legD) * HW + inX,
        ny + (w + d - legW - legD) * HH - inY,
        legW, legD, legH, legC, legL, legR);
      window.drawIsoBox(g,
        nx - (d - legD) * HW - inX,
        ny + (d - legD) * HH - inY,
        legW, legD, legH, legC, legL, legR);

      // Dudukan
      window.drawIsoBox(g, nx, ny - legH, w, d, seatH, seatC, seatL, seatR);

      // Cushion highlight (parallelogram tipis di permukaan atas)
      const Nx = nx,                  Ny = ny - legH - seatH;
      const Ex = nx + w * HW,         Ey = ny - legH - seatH + w * HH;
      const Sx = nx + (w - d) * HW,   Sy = ny - legH - seatH + (w + d) * HH;
      const Wx = nx - d * HW,         Wy = ny - legH - seatH + d * HH;

      g.fillStyle(this._brighten(seatC, 25), 1);
      g.beginPath();
      g.moveTo((Nx + Ex) / 2, (Ny + Ey) / 2);
      g.lineTo((Ex + Sx) / 2, (Ey + Sy) / 2);
      g.lineTo((Sx + Wx) / 2, (Sy + Wy) / 2);
      g.lineTo((Wx + Nx) / 2, (Wy + Ny) / 2);
      g.closePath();
      g.fillPath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // CABINET — box + 3 drawer + handle
  // ============================================================
  _buildCabinet(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1, h = desc.h || 44;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h;
    const nx = d * HW, ny = h;

    const topC = 0xa07040, leftC = 0x5a3a10, rightC = 0x7a4a1a;
    const lineC = 0x2a1a08, handleC = 0xe0c080;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, topC, leftC, rightC);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;

      // 3 garis drawer
      const nd = 3;
      for (let i = 1; i < nd; i++) {
        const fy = i / nd;
        g.lineStyle(1, lineC, 0.9);
        g.beginPath();
        g.moveTo(Ex, Ey - h * fy);
        g.lineTo(Sx, Sy - h * fy);
        g.strokePath();
      }
      // Handle (di tengah setiap drawer)
      for (let i = 0; i < nd; i++) {
        const fy = (i + 0.5) / nd;
        const hx = (Ex + Sx) / 2;
        const hy = (Ey + Sy) / 2 - h * fy + 2;
        g.fillStyle(handleC, 1);
        g.fillRect(hx - 4, hy, 8, 3);
      }
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // COUNTER — box + top edge + drawer
  // ============================================================
  _buildCounter(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1, h = desc.h || 30;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h;
    const nx = d * HW, ny = h;

    const topC = 0xe8e8e8, leftC = 0x909090, rightC = 0xb8b8b8;
    const edgeC = 0x606060;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, topC, leftC, rightC);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;
      const Nx = nx,                Ny = ny - h;

      // Edge highlight di top north-east
      g.lineStyle(2, edgeC, 0.5);
      g.beginPath();
      g.moveTo(Nx, Ny);
      g.lineTo(Ex, Ey - h);
      g.strokePath();

      // Drawer line
      g.lineStyle(1, edgeC, 0.6);
      g.beginPath();
      g.moveTo(Ex, Ey - h * 0.5);
      g.lineTo(Sx, Sy - h * 0.5);
      g.strokePath();

      // Handle
      g.fillStyle(edgeC, 1);
      g.fillRect((Ex + Sx) / 2 - 5, (Ey + Sy) / 2 - h * 0.5 + 4, 10, 2);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // FLOWER — pot keramik putih + 5 kelopak warna-warni
  // ============================================================
  _buildFlower(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = 0.5, d = 0.5;
    const potH = 11;
    const stemH = 14;
    const petalSize = 15;
    const pad = 12;
    const width  = (w + d) * HW + pad * 2;
    const height = (w + d) * HH + potH + stemH + petalSize + pad * 2 + 6;
    const nx = d * HW + pad, ny = height - pad;

    const potC  = 0xf5ede0, potL = 0xb0a890, potR = 0xd5cdc0;
    const rimC  = 0xffffff;
    const leafC = 0x3a7a3a;
    const petals = [0xff4466, 0xffaa33, 0xff3388, 0xffee44, 0xaa55ff, 0xff8844];

    const seed = (desc.gx || 0) * 7 + (desc.gy || 0) * 13;

    const key = this._makeTex(width, height, (g) => {
      // Pot
      window.drawIsoBox(g, nx, ny, w, d, potH, potC, potL, potR);
      // Rim (tipis di atas pot)
      window.drawIsoBox(g, nx - 0.04, ny - potH + 1, w + 0.08, d + 0.08, 3,
                        rimC, potL, potR);

      // Pusat atas pot
      const cxp = nx + (w / 2 - d / 2) * HW;
      const cyp = ny + (w / 2 + d / 2) * HH - potH;

      // Daun
      g.fillStyle(leafC, 1);
      g.fillEllipse(cxp - 9, cyp - 2, 12, 7);
      g.fillEllipse(cxp + 9, cyp - 2, 12, 7);
      g.fillStyle(this._brighten(leafC, 20), 1);
      g.fillEllipse(cxp - 6, cyp - 4, 9, 5);
      g.fillEllipse(cxp + 6, cyp - 4, 9, 5);

      // Tangkai + kelopak
      const petalCenters = [];
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 + seed * 0.7;
        const fx = cxp + Math.cos(ang) * 7;
        const fy = cyp - stemH - Math.sin(ang) * 5;
        petalCenters.push({ x: fx, y: fy });

        g.lineStyle(2, leafC, 1);
        g.beginPath();
        g.moveTo(cxp, cyp);
        g.lineTo(fx, fy);
        g.strokePath();
      }
      // Kelopak (render setelah semua tangkai)
      for (let i = 0; i < petalCenters.length; i++) {
        const { x: fx, y: fy } = petalCenters[i];
        const pc = petals[(i + seed) % petals.length];

        g.fillStyle(pc, 1);
        g.fillEllipse(fx, fy, petalSize, petalSize);
        g.fillStyle(this._brighten(pc, 30), 1);
        g.fillEllipse(fx, fy, petalSize * 0.7, petalSize * 0.7);
        g.fillStyle(0xffee66, 1);
        g.fillEllipse(fx, fy, petalSize * 0.32, petalSize * 0.32);
      }
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // MONITOR — besar + layar biru terang + baris teks
  // ============================================================
  _buildMonitor(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 0.4, h = desc.h || 18;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 14;
    const nx = d * HW, ny = h + 12;

    const key = this._makeTex(width, height, (g) => {
      // Stand base
      window.drawIsoBox(g, nx, ny, 0.5, 0.4, 3, 0x3a3a3a, 0x1a1a1a, 0x2a2a2a);
      // Stand neck
      window.drawIsoBox(g, nx + 0.15, ny - 3, 0.2, 0.15, 5, 0x2a2a2a, 0x0a0a0a, 0x1a1a1a);
      // Body
      window.drawIsoBox(g, nx, ny - 8, w, d, h, 0x1a1a2a, 0x0a0a1a, 0x2a2a3a);

      const Ex = nx + w * HW,       Ey = ny - 8 + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny - 8 + (w + d) * HH;

      // Layar biru terang
      g.fillStyle(0x6aaaff, 1);
      g.beginPath();
      g.moveTo(Ex - 3, Ey - h * 0.88);
      g.lineTo(Sx + 3, Sy - h * 0.88);
      g.lineTo(Sx + 3, Sy - h * 0.12);
      g.lineTo(Ex - 3, Ey - h * 0.12);
      g.closePath();
      g.fillPath();

      // Baris "kode" di layar
      g.fillStyle(0xc0e0ff, 0.85);
      const lines = [0.75, 0.62, 0.50, 0.38];
      const widths = [0.85, 0.7, 0.9, 0.55];
      for (let i = 0; i < lines.length; i++) {
        const fy = lines[i];
        const fw = widths[i];
        g.beginPath();
        g.moveTo(Ex - 6, Ey - h * fy);
        g.lineTo(Ex - 6 + (Sx - Ex + 6) * fw, Ey - h * fy + (Sy - Ey) * fw);
        g.lineTo(Ex - 6 + (Sx - Ex + 6) * fw, Ey - h * fy + (Sy - Ey) * fw + 2);
        g.lineTo(Ex - 6, Ey - h * fy + 2);
        g.closePath();
        g.fillPath();
      }

      // Highlight kilap
      g.fillStyle(0xffffff, 0.25);
      g.beginPath();
      g.moveTo(Ex - 5, Ey - h * 0.85);
      g.lineTo(Sx + 5, Sy - h * 0.85);
      g.lineTo(Sx + 5, Sy - h * 0.68);
      g.lineTo(Ex - 5, Ey - h * 0.68);
      g.closePath();
      g.fillPath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // SOFA — body + backrest + cushion div
  // ============================================================
  _buildSofa(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 2, d = desc.d || 1, h = desc.h || 16;
    const bodyColor = desc.color || window.PALETTE.sofa.top;
    const cushion = this._brighten(bodyColor, 45);
    const bodyDark = this._darken(bodyColor, 30);

    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 18;
    const nx = d * HW, ny = h + 18;

    const key = this._makeTex(width, height, (g) => {
      // Backrest (di belakang, sisi utara)
      window.drawIsoBox(g, nx, ny - h, w, 0.2, h * 0.9,
                        cushion, bodyDark, bodyColor);

      // Body
      window.drawIsoBox(g, nx, ny, w, d, h, bodyColor, bodyDark, bodyColor);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;
      const Nx = nx,                Ny = ny;

      // Cushion division (kalau w >= 2)
      if (w >= 2) {
        const midNx = Nx + w * HW * 0.5;
        const midNy = Ny + w * HH * 0.5;
        const midEx = Ex + (Sx - Ex) * 0.5;
        const midEy = Ey + (Sy - Ey) * 0.5;

        g.lineStyle(2, 0x000000, 0.2);
        g.beginPath();
        g.moveTo(midNx, midNy - h);
        g.lineTo(midEx, midEy - h);
        g.strokePath();
        g.beginPath();
        g.moveTo(midNx, midNy);
        g.lineTo(midEx, midEy);
        g.strokePath();
      }

      // Top cushion highlight
      g.fillStyle(cushion, 0.5);
      g.beginPath();
      g.moveTo(Nx, Ny - h + 2);
      g.lineTo(Ex, Ey - h + 2);
      g.lineTo(Sx, Sy - h + 2);
      g.lineTo(Sx, Sy - h + 5);
      g.lineTo(Ex, Ey - h + 5);
      g.lineTo(Nx, Ny - h + 5);
      g.closePath();
      g.fillPath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // SIGN — tiang coklat + papan krem
  // ============================================================
  _buildSign(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const postH = 26, boardH = 18;
    const w = 0.3, d = 0.3;
    const boardW = 1.6, boardD = 0.2;
    const pad = 20;
    const width  = (boardW + boardD) * HW + pad * 2;
    const height = postH + boardH + pad * 2 + 6;
    const nx = width / 2, ny = height - pad;

    const postC = 0x5a3a20, postL = 0x3a2008, postR = 0x4a2a10;
    const boardC = 0xf5eed5, boardL = 0xb0a080, boardR = 0xd5cba8;
    const boardEdgeC = 0x8a6a3a;

    const key = this._makeTex(width, height, (g) => {
      // Post
      window.drawIsoBox(g, nx - w * HW / 2, ny, w, d, postH, postC, postL, postR);

      // Board (di atas post)
      const bx = nx - boardW * HW / 2 - boardD * HH * 0; // center post
      window.drawIsoBox(g, bx, ny - postH + 2, boardW, boardD, boardH,
                        boardC, boardL, boardR);

      const Ex = bx + boardW * HW,       Ey = ny - postH + 2 + boardW * HH;
      const Sx = bx + (boardW - boardD) * HW, Sy = ny - postH + 2 + (boardW + boardD) * HH;

      // Border hitam
      g.lineStyle(2, boardEdgeC, 1);
      g.beginPath();
      g.moveTo(Ex - 3, Ey - boardH * 0.85);
      g.lineTo(Sx + 3, Sy - boardH * 0.85);
      g.strokePath();

      // "Tulisan" di papan (garis-garis)
      g.lineStyle(1, 0x5a4a30, 0.8);
      for (let i = 0; i < 3; i++) {
        const fy = 0.3 + i * 0.22;
        g.beginPath();
        g.moveTo(Ex - 12, Ey - boardH * fy);
        g.lineTo(Sx + 12, Sy - boardH * fy);
        g.strokePath();
      }
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // LAMP — base + pole + shade + glow
  // ============================================================
  _buildLamp(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const h = desc.h || 44;
    const poleH = h * 0.7;
    const width  = 64;
    const height = h + 24;
    const nx = width / 2, ny = height - 12;
    const p = window.PALETTE.lamp;

    const key = this._makeTex(width, height, (g) => {
      // Base
      window.drawIsoBox(g, nx - 12, ny - 2, 0.75, 0.75, 4,
                        0x4a4a4a, 0x2a2a2a, 0x3a3a3a);

      // Pole
      window.drawIsoBox(g, nx - 4, ny - 6, 0.25, 0.25, poleH,
                        p.pole, p.poleDark, p.pole);

      const cxp = nx - 4 + 4; // = nx
      const cyp = ny - 6 + 8 - poleH;

      // Glow halo
      g.fillStyle(p.glow, 0.28);
      g.fillEllipse(cxp, cyp + 14, 38, 16);

      // Shade (trapesium)
      g.fillStyle(p.shade, 1);
      g.beginPath();
      g.moveTo(cxp - 16, cyp - 8);
      g.lineTo(cxp + 16, cyp - 8);
      g.lineTo(cxp + 10, cyp + 12);
      g.lineTo(cxp - 10, cyp + 12);
      g.closePath();
      g.fillPath();

      // Shade top
      g.fillStyle(p.shadeDark, 1);
      g.beginPath();
      g.moveTo(cxp - 16, cyp - 8);
      g.lineTo(cxp + 16, cyp - 8);
      g.lineTo(cxp + 13, cyp - 12);
      g.lineTo(cxp - 13, cyp - 12);
      g.closePath();
      g.fillPath();

      // Bulb bawah
      g.fillStyle(0xffee99, 1);
      g.fillEllipse(cxp, cyp + 12, 14, 6);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  // ============================================================
  // Simple / passing-through builders
  // ============================================================
  _buildFridge(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1, h = desc.h || 40;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h;
    const nx = d * HW, ny = h;
    const c = window.PALETTE.fridge;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, c.top, c.left, c.right);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;

      g.lineStyle(2, c.trim, 0.8);
      g.beginPath();
      g.moveTo(Ex, Ey - h + h * 0.35);
      g.lineTo(Sx, Sy - h + h * 0.35);
      g.strokePath();

      g.fillStyle(c.trim, 1);
      g.fillRect(Sx + 4, Sy - h + h * 0.30, 4, 10);
      g.fillRect(Sx + 4, Sy - h + h * 0.55, 4, 10);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildPlant(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const h = desc.h || 26;
    const potH = Math.max(8, h * 0.35);
    const leafH = h - potH;
    const w = 0.7, d = 0.7;
    const width  = (w + d) * HW + 24;
    const height = (w + d) * HH + h + 24;
    const nx = d * HW + 12, ny = h + 12;
    const p = window.PALETTE.plant;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, potH, p.pot, p.potDark, p.pot);

      const cxp = nx + (w / 2 - d / 2) * HW;
      const cyp = ny + (w / 2 + d / 2) * HH;

      const leaf = (dx, dy, rx, ry, color) => {
        g.fillStyle(color, 1);
        g.fillEllipse(cxp + dx, cyp + dy, rx * 2, ry * 2);
      };

      const baseY = cyp - potH - leafH * 0.4;
      leaf( 0, baseY + 4,  leafH * 0.55, leafH * 0.35, p.leafDark);
      leaf(-8, baseY,      leafH * 0.50, leafH * 0.32, p.leaf);
      leaf( 8, baseY + 2,  leafH * 0.50, leafH * 0.32, p.leaf);
      leaf( 0, baseY - 8,  leafH * 0.45, leafH * 0.30, p.leafLight);
      leaf( 0, baseY - 2,  leafH * 0.40, leafH * 0.28, p.leaf);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildTree(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const h = desc.h || 52;
    const trunkH = h * 0.45;
    const crownH = h - trunkH;
    const w = 0.5, d = 0.5;
    const width  = 140;
    const height = h + 40;
    const nx = width / 2, ny = h + 10;
    const t = window.PALETTE.tree;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, trunkH, t.trunk, t.trunkDark, t.trunk);

      const cxp = nx + (w / 2 - d / 2) * HW;
      const cyp = ny + (w / 2 + d / 2) * HH;
      const baseY = cyp - trunkH - crownH * 0.5;

      const blob = (dx, dy, rx, ry, color) => {
        g.fillStyle(color, 1);
        g.fillEllipse(cxp + dx, baseY + dy, rx * 2, ry * 2);
      };
      blob(-16,  8, 30, 22, t.leafDark);
      blob( 16,  8, 30, 22, t.leafDark);
      blob(  0,  0, 34, 24, t.leaf);
      blob(  0, -8, 26, 20, t.leafLight);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildBush(desc) {
    const width = 60, height = 40;
    const nx = 30, ny = 20;
    const b = window.PALETTE.bush;

    const key = this._makeTex(width, height, (g) => {
      const blob = (dx, dy, rx, ry, color) => {
        g.fillStyle(color, 1);
        g.fillEllipse(nx + dx, ny + dy, rx * 2, ry * 2);
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
      window.drawIsoBox(g, nx, ny, 0.8, 0.4, 4, 0x2a2a2a, 0x1a1a1a, 0x222222);
      window.drawIsoBox(g, nx, ny - 4, w, d, h, c.top, c.left, c.right);

      const Ex = nx + w * HW,       Ey = ny - 4 + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny - 4 + (w + d) * HH;

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
      window.drawIsoBox(g, nx, ny, w, d, h, b.top, b.left, b.right);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;

      const rows = [0.35, 0.68];
      for (const fy of rows) {
        const y1 = Ey - h * (fy + 0.05);
        const y2 = Sy - h * (fy + 0.05);

        g.fillStyle(b.shelf, 1);
        g.beginPath();
        g.moveTo(Ex, y1);
        g.lineTo(Sx, y2);
        g.lineTo(Sx, y2 + 2);
        g.lineTo(Ex, y1 + 2);
        g.closePath();
        g.fillPath();

        const n = 5;
        for (let i = 0; i < n; i++) {
          const t = (i + 0.2) / n;
          const bx = Ex + (Sx - Ex) * t;
          const by = y1 + (y2 - y1) * t;
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
      window.drawIsoDiamond(g, nx, ny, w, d, p.edgeDark);
      const inset = 0.15;
      window.drawIsoDiamond(g, nx, ny + inset * HH, w - inset, d - inset, p.edge);
      window.drawIsoDiamond(g, nx, ny + inset * HH * 2, w - inset * 2, d - inset * 2, p.water);
      window.drawIsoDiamond(g, nx + HW * 0.4, ny + inset * HH * 2 + HH * 0.6,
                            w - inset * 2 - 1, d - inset * 2 - 1, p.waterDeep);
      window.drawIsoDiamond(g, nx + HW * 1.2, ny + inset * HH * 2 + HH * 1.4,
                            w - inset * 2 - 2, d - inset * 2 - 2, p.waterDeep);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildBench(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 2, d = desc.d || 0.5, h = desc.h || 12;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 20;
    const nx = d * HW, ny = h + 20;
    const p = window.PALETTE.bench;

    const key = this._makeTex(width, height, (g) => {
      // Backrest
      window.drawIsoBox(g, nx, ny - h - 6, w, 0.15, h * 0.9, p.wood, p.woodDark, p.wood);
      // Seat
      window.drawIsoBox(g, nx, ny, w, d, h, p.wood, p.woodDark, p.wood);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;
      g.lineStyle(1, 0x2a1a08, 0.6);
      g.beginPath();
      g.moveTo(Ex, Ey - h);
      g.lineTo(Sx, Sy - h);
      g.strokePath();
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildTrash(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = 0.6, d = 0.6, h = 16;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 8;
    const nx = d * HW, ny = h + 4;
    const p = window.PALETTE.trash;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, p.body, p.bodyDark, p.body);
      window.drawIsoBox(g, nx, ny - h, w * 1.15, d * 1.15, 3, p.lid, 0x1a1a1a, p.lid);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildArcade(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = 0.9, d = 0.8, h = desc.h || 50;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 8;
    const nx = d * HW, ny = h + 4;
    const p = window.PALETTE.arcade;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, p.body, p.bodyDark, p.bodyRight);

      const Ex = nx + w * HW,       Ey = ny + w * HH;
      const Sx = nx + (w - d) * HW, Sy = ny + (w + d) * HH;

      // Screen neon
      g.fillStyle(p.screen, 1);
      g.beginPath();
      g.moveTo(Ex - 4, Ey - h * 0.80);
      g.lineTo(Sx + 4, Sy - h * 0.80);
      g.lineTo(Sx + 4, Sy - h * 0.42);
      g.lineTo(Ex - 4, Ey - h * 0.42);
      g.closePath();
      g.fillPath();

      // Inner screen glow
      g.fillStyle(0xffffff, 0.5);
      g.beginPath();
      g.moveTo(Ex - 7, Ey - h * 0.74);
      g.lineTo(Sx + 7, Sy - h * 0.74);
      g.lineTo(Sx + 7, Sy - h * 0.66);
      g.lineTo(Ex - 7, Ey - h * 0.66);
      g.closePath();
      g.fillPath();

      // Trim neon pink
      g.lineStyle(2, p.trim, 1);
      g.beginPath();
      g.moveTo(Ex, Ey - h * 0.92);
      g.lineTo(Sx, Sy - h * 0.92);
      g.strokePath();

      // Tombol
      g.fillStyle(p.btn, 1);
      g.fillEllipse(Ex - 10, Ey - h * 0.28, 6, 6);
      g.fillStyle(0x44ff44, 1);
      g.fillEllipse(Ex - 10, Ey - h * 0.16, 6, 6);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildRug(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 4, d = desc.d || 3;
    const width  = (w + d) * HW;
    const height = (w + d) * HH;
    const nx = d * HW, ny = 0;
    const p = window.PALETTE.rug;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoDiamond(g, nx, ny, w, d, p.border1);
      window.drawIsoDiamond(g, nx, ny + 3, w - 0.15, d - 0.15, p.fill);
      window.drawIsoDiamond(g, nx, ny + 10, w - 0.7, d - 0.7, p.fill2);
      window.drawIsoDiamond(g, nx, ny + 16, w - 1.2, d - 1.2, p.fill);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildCoffee(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = 0.6, d = 0.5, h = desc.h || 14;
    const width  = (w + d) * HW;
    const height = (w + d) * HH + h + 12;
    const nx = d * HW, ny = h + 8;
    const p = window.PALETTE.coffee;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoBox(g, nx, ny, w, d, h, p.top, p.left, p.right);

      const Ex = nx + w * HW, Ey = ny + w * HH;

      // LED merah
      g.fillStyle(p.led, 1);
      g.fillEllipse(Ex - 7, Ey - h + 6, 4, 4);
      g.fillStyle(0xffaa00, 1);
      g.fillEllipse(Ex - 7, Ey - h + 12, 4, 4);

      // Cangkir
      g.fillStyle(p.cup, 1);
      g.fillEllipse(Ex - 14, Ey - h + 5, 7, 4);
      g.fillStyle(0x8a4a20, 1);
      g.fillEllipse(Ex - 14, Ey - h + 5, 4, 2.5);
    });
    return { texKey: key, offX: nx, offY: ny };
  }

  _buildPath(desc) {
    const HW = window.TILE_HW, HH = window.TILE_HH;
    const w = desc.w || 1, d = desc.d || 1;
    const width  = (w + d) * HW;
    const height = (w + d) * HH;
    const nx = d * HW, ny = 0;
    const p = window.PALETTE.path;

    const key = this._makeTex(width, height, (g) => {
      window.drawIsoDiamond(g, nx, ny, w, d, p.stoneDark);
      window.drawIsoDiamond(g, nx, ny + 2, w - 0.15, d - 0.15, p.stone);
    });
    return { texKey: key, offX: nx, offY: ny };
  }
}
