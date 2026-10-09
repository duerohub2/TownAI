// language: JavaScript, file: scenes/WorldScene.js

class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
    this.tileSize = 32;
    this.mapSize = 60;
  }

  create() {
    const TILE = this.tileSize;
    const SIZE = this.mapSize;
    this.mapWidthPx = SIZE * TILE;
    this.mapHeightPx = SIZE * TILE;

    // ===== AMBIL MAP DATA =====
    let mapData = window.MAP_DATA;
    if (!mapData && typeof MAP_DATA !== 'undefined') mapData = MAP_DATA;
    if (!Array.isArray(mapData) || !Array.isArray(mapData[0])) {
      console.warn('MAP_DATA gak kebaca, fallback ke grass semua');
      mapData = [];
      for (let y = 0; y < SIZE; y++) {
        mapData[y] = [];
        for (let x = 0; x < SIZE; x++) mapData[y][x] = 'grass';
      }
    }

    // ===== RENDER MAP =====
    this.tilesGroup = this.physics.add.staticGroup();

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const type = (mapData[y] && mapData[y][x]) ? mapData[y][x] : 'grass';
        const px = x * TILE + TILE / 2;
        const py = y * TILE + TILE / 2;

        let tile;
        try {
          tile = this.tilesGroup.create(px, py, type);
        } catch (e) {
          tile = this.tilesGroup.create(px, py, 'grass');
        }
        tile.setOrigin(0.5);

        if (type === 'house' || type === 'office' || type === 'market' || type === 'tree' || type === 'water') {
          tile.body.setSize(TILE, TILE);
          tile.refreshBody();
        } else {
          tile.body.enable = false;
        }
      }
    }

    // ===== PLAYER =====
    this.player = this.physics.add.sprite(TILE * 30, TILE * 30, 'player');
    this.player.setSize(20, 24);
    this.player.setOffset(6, 8);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, this.mapWidthPx, this.mapHeightPx);
    this.physics.add.collider(this.player, this.tilesGroup);

    // ===== NPC =====
    const npcData = [
      { key: 'npc_budi', x: 15, y: 50, name: 'Budi' },
      { key: 'npc_sari', x: 45, y: 10, name: 'Sari' },
      { key: 'npc_andi', x: 50, y: 30, name: 'Andi' },
      { key: 'npc_maya', x: 35, y: 15, name: 'Maya' },
      { key: 'npc_rian', x: 52, y: 28, name: 'Rian' },
      { key: 'npc_tika', x: 25, y: 25, name: 'Tika' }
    ];

    this.npcs = [];
    npcData.forEach((n) => {
      const npc = this.physics.add.sprite(n.x * TILE, n.y * TILE, n.key);
      npc.setSize(20, 24);
      npc.setOffset(6, 8);
      npc.setImmovable(true);
      npc.setData('name', n.name);
      npc.setData('spriteKey', n.key);
      this.physics.add.collider(npc, this.tilesGroup);
      this.npcs.push(npc);
    });

    // ===== CAMERA =====
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.mapWidthPx, this.mapHeightPx);
    cam.setBackgroundColor(0x1a1a2e);
    cam.setZoom(1);
    cam.centerOn(this.player.x, this.player.y);
    cam.startFollow(this.player, true, 0.08, 0.08);

    // ===== KEYBOARD =====
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    // ===== ZOOM via tombol =====
    setTimeout(() => {
      const zin = document.getElementById('zoom-in');
      const zout = document.getElementById('zoom-out');
      if (zin) zin.onclick = () => cam.setZoom(Phaser.Math.Clamp(cam.zoom + 0.2, 0.4, 3));
      if (zout) zout.onclick = () => cam.setZoom(Phaser.Math.Clamp(cam.zoom - 0.2, 0.4, 3));
    }, 100);

    // ===== DRAG PAN =====
    let dragStart = null;

    this.input.on('pointerdown', (pointer) => {
      if (pointer.x < 200 && pointer.y > cam.height - 200) return;
      if (this.input.pointer1.isDown && this.input.pointer2.isDown) return;
      dragStart = {
        x: pointer.x,
        y: pointer.y,
        scrollX: cam.scrollX,
        scrollY: cam.scrollY
      };
      cam.stopFollow();
    });

    this.input.on('pointermove', (pointer) => {
      if (!dragStart) return;
      if (!pointer.isDown) return;
      if (this.input.pointer1.isDown && this.input.pointer2.isDown) return;
      const dx = (pointer.x - dragStart.x) / cam.zoom;
      const dy = (pointer.y - dragStart.y) / cam.zoom;
      cam.scrollX = dragStart.scrollX - dx;
      cam.scrollY = dragStart.scrollY - dy;
    });

    this.input.on('pointerup', () => {
      dragStart = null;
    });

    // ===== JOYSTICK =====
    this.joystick = {
      active: false,
      baseX: 90,
      baseY: 0,
      pointerId: null,
      dx: 0,
      dy: 0
    };

    this.input.on('pointerdown', (pointer) => {
      if (pointer.x < 200 && pointer.y > cam.height - 200 && this.joystick.pointerId === null) {
        this.joystick.active = true;
        this.joystick.pointerId = pointer.id;
        this.joystick.baseX = pointer.x;
        this.joystick.baseY = pointer.y;
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (pointer.id === this.joystick.pointerId) {
        const dx = pointer.x - this.joystick.baseX;
        const dy = pointer.y - this.joystick.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 60;
        const norm = dist > maxDist ? maxDist / dist : 1;
        this.joystick.dx = (dx * norm) / maxDist;
        this.joystick.dy = (dy * norm) / maxDist;
      }
    });

    this.input.on('pointerup', (pointer) => {
      if (pointer.id === this.joystick.pointerId) {
        this.joystick.active = false;
        this.joystick.pointerId = null;
        this.joystick.dx = 0;
        this.joystick.dy = 0;
      }
    });

    // ===== UI =====
    this.scene.launch('UIScene', { worldScene: this });
  }

  update() {
    const speed = 200;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown || this.keys.left.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.keys.right.isDown) vx += 1;
    if (this.cursors.up.isDown || this.keys.up.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.keys.down.isDown) vy += 1;

    if (this.joystick.active) {
      vx += this.joystick.dx;
      vy += this.joystick.dy;
    }

    const len = Math.sqrt(vx * vx + vy * vy);
    if (len > 1) { vx /= len; vy /= len; }

    this.player.setVelocity(vx * speed, vy * speed);
  }
}
