// Render map, player, collision, dan kamera.
class WorldScene extends Phaser.Scene {
  constructor() { super('WorldScene'); }

  create() {
    const worldW = MAP_W * TILE;
    const worldH = MAP_H * TILE;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Gambar tile + buat body statis hanya untuk tile solid
    this.solids = this.physics.add.staticGroup();
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const key = MAP_DATA[y][x];
        this.add.image(x * TILE, y * TILE, key).setOrigin(0);
        if (SOLID_TILES.includes(key)) {
          const z = this.add.zone(x * TILE + TILE / 2, y * TILE + TILE / 2, TILE, TILE);
          this.solids.add(z);
        }
      }
    }

    // Player mulai di plaza tengah
    this.player = this.physics.add.sprite(30 * TILE + TILE / 2, 30 * TILE + TILE / 2, 'player');
    this.player.setDepth(10).setCollideWorldBounds(true);
    this.player.body.setSize(22, 22, true); // hitbox sedikit lebih kecil agar lolos celah 1 tile
    this.physics.add.collider(this.player, this.solids);

    // Input: arrow keys + WASD
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // Kamera mengikuti dengan lerp halus
    const cam = this.cameras.main;
    cam.setBounds(0, 0, worldW, worldH);
    cam.startFollow(this.player, true, 0.1, 0.1);

    this.scene.launch('UIScene');
  }

  update() {
    const c = this.cursors, k = this.wasd;
    const dx = (c.right.isDown || k.D.isDown ? 1 : 0) - (c.left.isDown || k.A.isDown ? 1 : 0);
    const dy = (c.down.isDown || k.S.isDown ? 1 : 0) - (c.up.isDown || k.W.isDown ? 1 : 0);
    // Normalisasi supaya gerak diagonal tidak lebih cepat
    this.player.body.setVelocity(dx, dy).normalize().scale(PLAYER_SPEED);
  }
}
