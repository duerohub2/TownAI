// Daftar objek per zona.
// Field umum:
//   type   : tipe render
//   gx,gy  : tile anchor (north corner)
//   w,d    : ukuran dalam tile (lebar searah gx, dalam searah gy). Default 1.
//   h      : tinggi pixel
//   z      : depth offset opsional (default 0)
//   <ext>  : field spesifik tipe (mis. warna sofa)
window.OBJECT_CONFIG = {

  lobby: [
    { type:"counter",    gx:8,  gy:6,  w:3, d:1, h:34 },
    { type:"sofa",       gx:5,  gy:14, w:2, d:1, h:16, color:0x4a3a5a },
    { type:"sofa",       gx:5,  gy:18, w:2, d:1, h:16, color:0x4a3a5a },
    { type:"plant",      gx:2,  gy:2,  h:26 },
    { type:"plant",      gx:15, gy:2,  h:26 },
    { type:"plant",      gx:2,  gy:26, h:26 },
    { type:"plant",      gx:15, gy:26, h:26 }
  ],

  studio: [
    { type:"desk",       gx:46, gy:5,  w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:5,  w:1, d:0.4, h:14, z:5 },
    { type:"desk",       gx:46, gy:12, w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:12, w:1, d:0.4, h:14, z:5 },
    { type:"desk",       gx:46, gy:19, w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:19, w:1, d:0.4, h:14, z:5 },
    { type:"desk",       gx:46, gy:26, w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:26, w:1, d:0.4, h:14, z:5 },

    { type:"desk",       gx:62, gy:5,  w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:5,  w:1, d:0.4, h:14, z:5 },
    { type:"desk",       gx:62, gy:12, w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:12, w:1, d:0.4, h:14, z:5 },
    { type:"desk",       gx:62, gy:19, w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:19, w:1, d:0.4, h:14, z:5 },
    { type:"desk",       gx:62, gy:26, w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:26, w:1, d:0.4, h:14, z:5 },

    { type:"plant",      gx:84, gy:28, h:32 }
  ],

  gaming: [
    { type:"desk",       gx:94,  gy:6,  w:2, d:1, h:24 },
    { type:"monitor",    gx:94,  gy:6,  w:1.2, d:0.4, h:18, z:5 },
    { type:"desk",       gx:94,  gy:16, w:2, d:1, h:24 },
    { type:"monitor",    gx:94,  gy:16, w:1.2, d:0.4, h:18, z:5 },
    { type:"desk",       gx:110, gy:6,  w:2, d:1, h:24 },
    { type:"monitor",    gx:110, gy:6,  w:1.2, d:0.4, h:18, z:5 },
    { type:"desk",       gx:110, gy:16, w:2, d:1, h:24 },
    { type:"monitor",    gx:110, gy:16, w:1.2, d:0.4, h:18, z:5 },
    { type:"plant",      gx:124, gy:28, h:28 }
  ],

  pantry: [
    { type:"fridge",     gx:2,  gy:36, h:42 },
    { type:"counter",    gx:4,  gy:36, w:3, d:1, h:30 },
    { type:"table",      gx:10, gy:44, w:4, d:2, h:20 },
    { type:"chair",      gx:10, gy:42, h:14 },
    { type:"chair",      gx:12, gy:42, h:14 },
    { type:"chair",      gx:11, gy:47, h:14 },
    { type:"chair",      gx:13, gy:47, h:14 },
    { type:"plant",      gx:35, gy:36, h:24 }
  ],

  lounge: [
    { type:"sofa",       gx:46, gy:44, w:3, d:1, h:18, color:0x7a2a3a },
    { type:"sofa",       gx:46, gy:44, w:1, d:3, h:18, color:0x7a2a3a, z:2 },
    { type:"tv",         gx:58, gy:50, w:2, d:0.4, h:22 },
    { type:"plant",      gx:76, gy:60, h:26 },
    { type:"plant",      gx:42, gy:34, h:26 }
  ],

  library: [
    { type:"bookshelf",  gx:85,  gy:36, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:85,  gy:44, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:85,  gy:52, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:118, gy:36, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:118, gy:44, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:118, gy:52, w:1, d:3, h:44 },
    { type:"table",      gx:100, gy:48, w:3, d:2, h:20 }
  ],

  garden: [
    { type:"pool",       gx:55, gy:82, w:6, d:4 },
    { type:"tree",       gx:8,   gy:70, h:52 },
    { type:"tree",       gx:22,  gy:78, h:52 },
    { type:"tree",       gx:36,  gy:70, h:52 },
    { type:"tree",       gx:46,  gy:88, h:52 },
    { type:"tree",       gx:68,  gy:72, h:52 },
    { type:"tree",       gx:82,  gy:88, h:52 },
    { type:"tree",       gx:100, gy:72, h:52 },
    { type:"tree",       gx:118, gy:86, h:52 },
    { type:"bush",       gx:30,  gy:90, h:16 },
    { type:"bush",       gx:44,  gy:74, h:16 },
    { type:"bush",       gx:76,  gy:90, h:16 },
    { type:"bush",       gx:92,  gy:78, h:16 }
  ]
};
