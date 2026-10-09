// language: JavaScript, file: map.js
// 60x60 map, tiap cell = nama tile

window.MAP_DATA = (function () {
  const SIZE = 60;
  const map = [];

  for (let y = 0; y < SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < SIZE; x++) {
      map[y][x] = 'grass';
    }
  }

  // PATH utama (jalan silang)
  for (let x = 28; x < 32; x++) {
    for (let y = 0; y < SIZE; y++) map[y][x] = 'path';
  }
  for (let y = 28; y < 32; y++) {
    for (let x = 0; x < SIZE; x++) map[y][x] = 'path';
  }

  // ZONA 1: Taman (kiri atas)
  for (let y = 5; y < 18; y++) {
    for (let x = 5; x < 18; x++) {
      if (Math.random() < 0.15) map[y][x] = 'tree';
    }
  }

  // ZONA 2: Kantor (kanan atas)
  for (let y = 5; y < 15; y++) {
    for (let x = 40; x < 55; x++) {
      if ((y - 5) % 4 === 0 && (x - 40) % 4 === 0) map[y][x] = 'office';
    }
  }

  // ZONA 3: Rumah (kiri tengah)
  map[22][10] = 'house';
  map[22][15] = 'house';
  map[22][20] = 'house';

  // ZONA 4: Pasar (kanan tengah)
  for (let y = 22; y < 27; y++) {
    for (let x = 42; x < 54; x++) {
      if ((y - 22) % 3 === 0 && (x - 42) % 3 === 0) map[y][x] = 'market';
    }
  }

  // ZONA 5: Pertanian (bawah)
  for (let y = 42; y < 55; y++) {
    for (let x = 8; x < 50; x++) {
      map[y][x] = 'farm';
    }
  }

  // Kolam air
  for (let y = 35; y < 40; y++) {
    for (let x = 8; x < 14; x++) {
      map[y][x] = 'water';
    }
  }

  return map;
})();
