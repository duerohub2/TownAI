window.gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#15151f',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%'
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
    powerPreference: 'high-performance'
  },
  input: {
    activePointers: 3
  },
  fps: {
    target: 60,
    min: 30
  },
  scene: [PreloadScene, WorldScene]
};
