// Data map 60x60 + konstanta dunia. Dibuat sekali saat load (hasil: array 2D nama tile).
const TILE = 32;
const MAP_W = 60;
const MAP_H = 60;
const PLAYER_SPEED = 160;

// Tile yang tidak bisa ditembus
const SOLID_TILES = ['house', 'office', 'market', 'tree'];

// Warna solid: dipakai sebagai fallback tekstur dan untuk minimap
const TILE_COLORS = {
  grass: 0x3f7d3a, tree: 0x1f4d2b, house: 0xb5651d, office: 0x5c6b7a,
  market: 0xd4a017, farm: 0x8a6b2f, path: 0x9a9a8f, player: 0xf1f5f9
};
const toHex = (c) => '#' + c.toString(16).padStart(6, '0');

const MAP_DATA = (function () {
  const g = [];
  for (let y = 0; y < MAP_H; y++) g.push(new Array(MAP_W).fill('grass'));

  // Isi area [x0,x1) x [y0,y1) dengan hasil fn(x,y)
  const fill = (x0, y0, x1, y1, fn) => {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) g[y][x] = fn(x, y);
  };
  // Hash sederhana agar sebaran pohon konsisten tiap load
  const h = (x, y) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 100;

  // Taman (0-20, 0-20): rumput + pohon
  fill(0, 0, 20, 20, (x, y) => (h(x, y) < 18 ? 'tree' : 'grass'));

  // Kantor (20-40, 0-20): blok gedung 2x2 dipisah jalan
  fill(20, 0, 40, 20, (x, y) => {
    const inside = x >= 22 && x <= 37 && y >= 2 && y <= 17;
    return inside && (x - 22) % 3 !== 2 && (y - 2) % 3 !== 2 ? 'office' : 'path';
  });

  // Rumah (0-20, 20-40): rumah per 2 tile, sisanya rumput
  fill(0, 20, 20, 40, (x, y) => {
    const inside = x >= 2 && x <= 17 && y >= 22 && y <= 37;
    return inside && x % 2 === 0 && y % 2 === 0 ? 'house' : 'grass';
  });

  // Pasar (40-60, 20-40): lapak berderet, lantai path
  fill(40, 20, 60, 40, (x, y) => {
    const inside = x >= 42 && x <= 57 && y >= 22 && y <= 37;
    return inside && x % 3 === 1 && y % 2 === 0 ? 'market' : 'path';
  });

  // Pertanian (0-60, 40-60): petak ladang dengan jalan setapak antar baris
  fill(0, 40, 60, 60, (x, y) => {
    const inside = x >= 2 && x <= 57 && y >= 42 && y <= 57;
    if (!inside) return 'grass';
    return (y - 42) % 3 === 2 ? 'path' : 'farm';
  });

  // Tengah (20-40, 20-40): rumput + plaza path di pusat
  fill(26, 26, 35, 35, () => 'path');

  // Jalan utama menghubungkan semua zona
  for (let x = 0; x < MAP_W; x++) { g[20][x] = 'path'; g[40][x] = 'path'; }
  for (let y = 0; y < 40; y++) { g[y][20] = 'path'; g[y][40] = 'path'; }

  return g;
})();
