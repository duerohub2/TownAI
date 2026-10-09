// Konfigurasi Phaser
const GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0e1116',
  pixelArt: true,
  scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
  physics: { default: 'arcade', arcade: { debug: false } },
  // crossOrigin wajib untuk gambar dari domain lain; batasi download paralel agar tidak kena rate limit
  loader: { crossOrigin: 'anonymous', maxParallelDownloads: 4, timeout: 20000 },
  scene: [PreloadScene, WorldScene, UIScene]
};
