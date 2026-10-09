window.addEventListener('load', () => {
  window.game = new Phaser.Game(window.gameConfig);
});

window.addEventListener('contextmenu', (e) => e.preventDefault());
