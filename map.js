window.TILE_W  = 64;
window.TILE_H  = 32;
window.TILE_HW = 32;
window.TILE_HH = 16;
window.MAP_COLS = 128;
window.MAP_ROWS = 96;

// Multiplier ukuran objek (meja, pohon, sofa, dll).
// Naikkan kalau masih kerasa kecil, turunkan kalau overlap.
window.OBJ_SCALE = 1.6;

window.FLOOR_COLORS = {
  wood_light:    0xd4b088,
  carpet_gray:   0x6a6a7a,
  wood_dark:     0x5a4030,
  tile_gray:     0x9a9a9a,
  carpet_red:    0x8a2a2a,
  carpet_yellow: 0xb8a060,
  grass:         0x5a9e4a
};

window.PALETTE = {
  wallTop:    0x4a3a2a,
  wallLeft:   0x7a6858,
  wallRight:  0xb8a890,
  box:        { top: 0xa06a3a, left: 0x6a4520, right: 0x8b5a2b },
  desk:       { top: 0xb8804a, left: 0x7a5020, right: 0x9a6a3a },
  chair:      { top: 0x4a3a4a, left: 0x2a1a2a, right: 0x3a2a3a },
  counter:    { top: 0xc0c0c0, left: 0x707070, right: 0x909090 },
  monitor:    { top: 0x1a1a2a, left: 0x0a0a1a, right: 0x2a2a3a, screen: 0x4a7ab0 },
  sofa:       { top: 0x5a3a6a, left: 0x3a1a4a, right: 0x4a2a5a, cushion: 0x7a5a8a },
  plant:      { pot: 0x8a5030, potDark: 0x5a3010, leaf: 0x2a6a2a, leafDark: 0x1a4a1a, leafLight: 0x4a8a4a },
  tree:       { trunk: 0x5a3a20, trunkDark: 0x3a2010, leaf: 0x3a7a3a, leafDark: 0x2a5a2a, leafLight: 0x5a9a5a },
  tv:         { top: 0x1a1a1a, left: 0x0a0a0a, right: 0x2a2a2a, screen: 0x3a5a8a },
  fridge:     { top: 0xf0f0f0, left: 0xa0a0a0, right: 0xd0d0d0, trim: 0x808080 },
  bookshelf:  { top: 0x6a4a2a, left: 0x3a2a10, right: 0x5a3a1a, shelf: 0x2a1a08,
                books: [0xb04040, 0x408040, 0x4040b0, 0xb0b040, 0xb06040, 0x40a0a0] },
  pool:       { water: 0x4a7ab0, waterDeep: 0x2a5a90, edge: 0x9a9a9a, edgeDark: 0x5a5a5a },
  bush:       { top: 0x4a8a4a, left: 0x2a5a2a, right: 0x3a6a3a },

  lamp:       { pole: 0x4a4a4a, poleDark: 0x2a2a2a, shade: 0xf0e0a0, shadeDark: 0xb8a060, glow: 0xffd880 },
  flower:     { pot: 0x9a5a3a, potDark: 0x5a3010, leaf: 0x3a7a3a,
                petals: [0xff6688, 0xffaa44, 0xff4488, 0xffee66, 0xaa66ff] },
  bench:      { wood: 0x8b5a2b, woodDark: 0x5a3a10, leg: 0x3a2a10 },
  fence:      { top: 0xa07a4a, left: 0x6a4a20, right: 0x8a6a3a },
  sign:       { post: 0x5a3a20, postDark: 0x3a2010, board: 0xe8d8a8, boardDark: 0xa89060 },
  trash:      { body: 0x4a4a4a, bodyDark: 0x2a2a2a, lid: 0x2a2a2a, trim: 0x6a6a6a },
  arcade:     { body: 0x2a1a4a, bodyDark: 0x1a0a3a, bodyRight: 0x3a2a5a, screen: 0x4affaa, trim: 0xff44aa, btn: 0xff4444 },
  cabinet:    { top: 0x8b5a2b, left: 0x5a3a10, right: 0x7a4a1a },
  rug:        { border1: 0x8a2a2a, border2: 0xd4a060, fill: 0xc09050, fill2: 0xa07040 },
  coffee:     { top: 0x3a3a4a, left: 0x1a1a2a, right: 0x2a2a3a, cup: 0xf0f0f0, led: 0xff4444 },
  path:       { stone: 0xc0b090, stoneDark: 0x9a8a6a }
};

window.isoToScreen = function (gx, gy) {
  return {
    x: (gx - gy) * window.TILE_HW,
    y: (gx + gy) * window.TILE_HH
  };
};

window.screenToIso = function (sx, sy) {
  const hw = window.TILE_HW;
  const hh = window.TILE_HH;
  return {
    gx: (sx / hw + sy / hh) / 2,
    gy: (sy / hh - sx / hw) / 2
  };
};

window.getZoneAt = function (gx, gy) {
  const zones = window.ZONE_CONFIG;
  for (const key in zones) {
    const z = zones[key];
    if (gx >= z.x1 && gx < z.x2 && gy >= z.y1 && gy < z.y2) return key;
  }
  return null;
};

window.getMapBounds = function () {
  const minX = (0 - (window.MAP_ROWS - 1)) * window.TILE_HW;
  const maxX = ((window.MAP_COLS - 1) - 0) * window.TILE_HW + window.TILE_W;
  const minY = 0;
  const maxY = ((window.MAP_COLS - 1) + (window.MAP_ROWS - 1)) * window.TILE_HH + window.TILE_H;
  return {
    minX, maxX, minY, maxY,
    width: maxX - minX,
    height: maxY - minY
  };
};

window.getZonePixelBounds = function (zone) {
  const { x1, y1, x2, y2 } = zone;
  const HW = window.TILE_HW;
  const HH = window.TILE_HH;
  const W  = window.TILE_W;
  const H  = window.TILE_H;

  const minX = (x1 - (y2 - 1)) * HW;
  const minY = (x1 + y1) * HH;
  const maxX = ((x2 - 1) - y1) * HW + W;
  const maxY = ((x2 - 1) + (y2 - 1)) * HH + H;

  return { minX, minY, width: maxX - minX, height: maxY - minY };
};

window.drawIsoBox = function (g, cx, cy, w, d, h, topColor, leftColor, rightColor) {
  const HW = window.TILE_HW;
  const HH = window.TILE_HH;

  const Nx = cx,                Ny = cy;
  const Ex = cx + w * HW,       Ey = cy + w * HH;
  const Sx = cx + (w - d) * HW, Sy = cy + (w + d) * HH;
  const Wx = cx - d * HW,       Wy = cy + d * HH;

  g.fillStyle(rightColor, 1);
  g.beginPath();
  g.moveTo(Ex, Ey);
  g.lineTo(Sx, Sy);
  g.lineTo(Sx, Sy - h);
  g.lineTo(Ex, Ey - h);
  g.closePath();
  g.fillPath();

  g.fillStyle(leftColor, 1);
  g.beginPath();
  g.moveTo(Wx, Wy);
  g.lineTo(Sx, Sy);
  g.lineTo(Sx, Sy - h);
  g.lineTo(Wx, Wy - h);
  g.closePath();
  g.fillPath();

  g.fillStyle(topColor, 1);
  g.beginPath();
  g.moveTo(Nx, Ny - h);
  g.lineTo(Ex, Ey - h);
  g.lineTo(Sx, Sy - h);
  g.lineTo(Wx, Wy - h);
  g.closePath();
  g.fillPath();
};

window.drawIsoDiamond = function (g, cx, cy, w, d, color) {
  const HW = window.TILE_HW;
  const HH = window.TILE_HH;
  const Nx = cx,                Ny = cy;
  const Ex = cx + w * HW,       Ey = cy + w * HH;
  const Sx = cx + (w - d) * HW, Sy = cy + (w + d) * HH;
  const Wx = cx - d * HW,       Wy = cy + d * HH;

  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(Nx, Ny);
  g.lineTo(Ex, Ey);
  g.lineTo(Sx, Sy);
  g.lineTo(Wx, Wy);
  g.closePath();
  g.fillPath();
};
