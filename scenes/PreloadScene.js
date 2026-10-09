class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // STEP 1: tidak ada asset eksternal. Semua tile digenerate procedural.
  }

  create() {
    this.scene.start('WorldScene');
  }
}
