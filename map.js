window.TILE_W  = 64;
window.TILE_H  = 32;
window.TILE_HW = 32;
window.TILE_HH = 16;
window.MAP_COLS = 128;
window.MAP_ROWS = 96;

window.FLOOR_COLORS = {
  wood_light:    0xd4b088,
  carpet_gray:   0x6a6a7a,
  wood_dark:     0x5a4030,
  tile_gray:     0x9a9a9a,
  carpet_red:    0x8a2a2a,
  carpet_yellow: 0xb8a060,
  grass:         0x5a9e4a
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
