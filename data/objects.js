// Daftar objek per zona. Format: { type, gx, gy, w?, d?, h?, z?, ... }
window.OBJECT_CONFIG = {

  lobby: [
    // Resepsionis + area kerja
    { type:"counter",    gx:8,  gy:6,  w:3, d:1, h:34 },
    { type:"cabinet",    gx:14, gy:5,  w:1, d:1, h:44 },
    { type:"chair",      gx:10, gy:8,  h:14 },
    { type:"coffee",     gx:12, gy:6,  h:14, z:20 },

    // Area tunggu
    { type:"rug",        gx:6,  gy:14, w:6, d:5 },
    { type:"sofa",       gx:5,  gy:14, w:3, d:1, h:16, color:0x4a3a5a },
    { type:"sofa",       gx:5,  gy:18, w:3, d:1, h:16, color:0x4a3a5a },
    { type:"table",      gx:10, gy:16, w:1, d:1, h:14 },

    // Dekorasi sudut
    { type:"plant",      gx:2,  gy:2,  h:28 },
    { type:"plant",      gx:16, gy:2,  h:28 },
    { type:"plant",      gx:2,  gy:26, h:28 },
    { type:"plant",      gx:16, gy:26, h:28 },
    { type:"plant",      gx:2,  gy:14, h:24 },
    { type:"plant",      gx:16, gy:14, h:24 },

    // Lampu
    { type:"lamp",       gx:4,  gy:4,  h:44 },
    { type:"lamp",       gx:20, gy:4,  h:44 },
    { type:"lamp",       gx:4,  gy:28, h:44 },
    { type:"lamp",       gx:20, gy:28, h:44 },

    // Bunga & sampah
    { type:"flower",     gx:3,  gy:16 },
    { type:"flower",     gx:14, gy:16 },
    { type:"flower",     gx:3,  gy:20 },
    { type:"flower",     gx:14, gy:20 },
    { type:"trash",      gx:18, gy:10 },
    { type:"trash",      gx:18, gy:22 },

    // Sign welcome
    { type:"sign",       gx:15, gy:3,  h:44 }
  ],

  studio: [
    // 8 meja kerja + monitor
    { type:"desk",       gx:46, gy:5,  w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:5,  w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:47, gy:7,  h:14 },
    { type:"flower",     gx:46, gy:4 },

    { type:"desk",       gx:46, gy:12, w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:12, w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:47, gy:14, h:14 },
    { type:"flower",     gx:46, gy:11 },

    { type:"desk",       gx:46, gy:19, w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:19, w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:47, gy:21, h:14 },
    { type:"flower",     gx:46, gy:18 },

    { type:"desk",       gx:46, gy:26, w:2, d:1, h:22 },
    { type:"monitor",    gx:46, gy:26, w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:47, gy:28, h:14 },
    { type:"flower",     gx:46, gy:25 },

    { type:"desk",       gx:62, gy:5,  w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:5,  w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:63, gy:7,  h:14 },
    { type:"flower",     gx:62, gy:4 },

    { type:"desk",       gx:62, gy:12, w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:12, w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:63, gy:14, h:14 },
    { type:"flower",     gx:62, gy:11 },

    { type:"desk",       gx:62, gy:19, w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:19, w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:63, gy:21, h:14 },
    { type:"flower",     gx:62, gy:18 },

    { type:"desk",       gx:62, gy:26, w:2, d:1, h:22 },
    { type:"monitor",    gx:62, gy:26, w:1, d:0.4, h:14, z:5 },
    { type:"chair",      gx:63, gy:28, h:14 },
    { type:"flower",     gx:62, gy:25 },

    // Lemari arsip di sudut
    { type:"cabinet",    gx:42, gy:2,  w:1, d:1, h:44 },
    { type:"cabinet",    gx:42, gy:28, w:1, d:1, h:44 },
    { type:"cabinet",    gx:86, gy:2,  w:1, d:1, h:44 },
    { type:"cabinet",    gx:86, gy:28, w:1, d:1, h:44 },

    // Lampu
    { type:"lamp",       gx:44, gy:16, h:44 },
    { type:"lamp",       gx:84, gy:16, h:44 },
    { type:"lamp",       gx:56, gy:2,  h:44 },
    { type:"lamp",       gx:72, gy:30, h:44 },

    // Trash
    { type:"trash",      gx:56, gy:30 },
    { type:"trash",      gx:72, gy:2 },

    // Plant
    { type:"plant",      gx:84, gy:28, h:32 },
    { type:"plant",      gx:44, gy:30, h:28 }
  ],

  gaming: [
    { type:"desk",       gx:94,  gy:6,  w:2, d:1, h:24 },
    { type:"monitor",    gx:94,  gy:6,  w:1.2, d:0.4, h:18, z:5 },
    { type:"chair",      gx:95,  gy:8,  h:16 },
    { type:"flower",     gx:94,  gy:5 },

    { type:"desk",       gx:94,  gy:16, w:2, d:1, h:24 },
    { type:"monitor",    gx:94,  gy:16, w:1.2, d:0.4, h:18, z:5 },
    { type:"chair",      gx:95,  gy:18, h:16 },
    { type:"flower",     gx:94,  gy:15 },

    { type:"desk",       gx:110, gy:6,  w:2, d:1, h:24 },
    { type:"monitor",    gx:110, gy:6,  w:1.2, d:0.4, h:18, z:5 },
    { type:"chair",      gx:111, gy:8,  h:16 },
    { type:"flower",     gx:110, gy:5 },

    { type:"desk",       gx:110, gy:16, w:2, d:1, h:24 },
    { type:"monitor",    gx:110, gy:16, w:1.2, d:0.4, h:18, z:5 },
    { type:"chair",      gx:111, gy:18, h:16 },
    { type:"flower",     gx:110, gy:15 },

    // Arcade di dinding timur
    { type:"arcade",     gx:124, gy:3,  h:52 },
    { type:"arcade",     gx:124, gy:11, h:52 },
    { type:"arcade",     gx:124, gy:19, h:52 },
    { type:"arcade",     gx:124, gy:27, h:52 },

    // Lampu & dekorasi
    { type:"lamp",       gx:90,  gy:28, h:44 },
    { type:"lamp",       gx:120, gy:30, h:44 },
    { type:"plant",      gx:92,  gy:2,  h:28 },
    { type:"trash",      gx:118, gy:28 }
  ],

  pantry: [
    // Dapur
    { type:"fridge",     gx:2,  gy:36, h:42 },
    { type:"counter",    gx:4,  gy:36, w:3, d:1, h:30 },
    { type:"coffee",     gx:5,  gy:36, h:14, z:30 },
    { type:"cabinet",    gx:8,  gy:34, w:1, d:1, h:40 },
    { type:"trash",      gx:2,  gy:60 },

    // Meja makan besar 4x2
    { type:"table",      gx:10, gy:44, w:4, d:2, h:20 },
    { type:"flower",     gx:11, gy:44 },
    { type:"flower",     gx:12, gy:44 },

    // 8 kursi sekeliling meja (kiri, kanan, depan, belakang)
    { type:"chair",      gx:9,  gy:44, h:14 },
    { type:"chair",      gx:9,  gy:45, h:14 },
    { type:"chair",      gx:14, gy:44, h:14 },
    { type:"chair",      gx:14, gy:45, h:14 },
    { type:"chair",      gx:10, gy:46, h:14 },
    { type:"chair",      gx:11, gy:46, h:14 },
    { type:"chair",      gx:12, gy:46, h:14 },
    { type:"chair",      gx:13, gy:46, h:14 },

    // Tambahan
    { type:"plant",      gx:35, gy:36, h:28 },
    { type:"plant",      gx:2,  gy:40, h:24 },
    { type:"lamp",       gx:4,  gy:60, h:44 },
    { type:"lamp",       gx:32, gy:60, h:44 },
    { type:"lamp",       gx:20, gy:36, h:44 },
    { type:"flower",     gx:20, gy:52 },
    { type:"flower",     gx:24, gy:56 },
    { type:"trash",      gx:18, gy:36 }
  ],

  lounge: [
    // Sofa L-shape
    { type:"rug",        gx:44, gy:42, w:8, d:6 },
    { type:"sofa",       gx:46, gy:44, w:4, d:1, h:18, color:0x7a2a3a },
    { type:"sofa",       gx:46, gy:44, w:1, d:3, h:18, color:0x7a2a3a, z:2 },

    // Coffee table + TV
    { type:"table",      gx:50, gy:48, w:2, d:1, h:14 },
    { type:"coffee",     gx:50, gy:48, h:12, z:14 },
    { type:"tv",         gx:58, gy:50, w:3, d:0.4, h:24 },

    // Lampu & dekorasi
    { type:"lamp",       gx:42, gy:60, h:44 },
    { type:"lamp",       gx:76, gy:60, h:44 },
    { type:"flower",     gx:44, gy:36 },
    { type:"flower",     gx:76, gy:36 },
    { type:"plant",      gx:42, gy:34, h:28 },
    { type:"plant",      gx:76, gy:62, h:28 },
    { type:"plant",      gx:62, gy:34, h:28 },
    { type:"trash",      gx:76, gy:40 }
  ],

  library: [
    // Rak buku
    { type:"bookshelf",  gx:85,  gy:36, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:85,  gy:44, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:85,  gy:52, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:118, gy:36, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:118, gy:44, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:118, gy:52, w:1, d:3, h:44 },
    { type:"bookshelf",  gx:96,  gy:34, w:3, d:1, h:40 },
    { type:"bookshelf",  gx:108, gy:34, w:3, d:1, h:40 },

    // Meja baca + kursi
    { type:"table",      gx:100, gy:48, w:3, d:2, h:20 },
    { type:"chair",      gx:99,  gy:48, h:14 },
    { type:"chair",      gx:104, gy:48, h:14 },
    { type:"flower",     gx:101, gy:48 },
    { type:"flower",     gx:102, gy:48 },

    // Meja baca 2
    { type:"table",      gx:96,  gy:56, w:2, d:1, h:18 },
    { type:"chair",      gx:95,  gy:56, h:14 },
    { type:"flower",     gx:96,  gy:55 },

    // Lampu baca
    { type:"lamp",       gx:98,  gy:48, h:44 },
    { type:"lamp",       gx:104, gy:48, h:44 },
    { type:"lamp",       gx:96,  gy:58, h:44 },
    { type:"lamp",       gx:110, gy:58, h:44 },

    // Bench di sepanjang dinding
    { type:"bench",      gx:88,  gy:60, w:3, d:0.6, h:12 },
    { type:"bench",      gx:112, gy:60, w:3, d:0.6, h:12 },

    // Dekorasi
    { type:"plant",      gx:92,  gy:36, h:26 },
    { type:"plant",      gx:114, gy:36, h:26 },
    { type:"trash",      gx:94,  gy:62 },
    { type:"trash",      gx:116, gy:62 }
  ],

  garden: [
    // Kolam + path sekitar
    { type:"pool",       gx:55, gy:82, w:6, d:4 },
    { type:"path",       gx:48, gy:82 },
    { type:"path",       gx:49, gy:82 },
    { type:"path",       gx:50, gy:82 },
    { type:"path",       gx:51, gy:82 },
    { type:"path",       gx:52, gy:82 },
    { type:"path",       gx:53, gy:82 },
    { type:"path",       gx:54, gy:82 },
    { type:"path",       gx:61, gy:82 },
    { type:"path",       gx:62, gy:82 },
    { type:"path",       gx:63, gy:82 },
    { type:"path",       gx:64, gy:82 },
    { type:"path",       gx:65, gy:82 },
    { type:"path",       gx:66, gy:82 },
    { type:"path",       gx:67, gy:82 },
    { type:"path",       gx:68, gy:82 },

    // Pohon (tree besar)
    { type:"tree",       gx:6,   gy:68, h:56 },
    { type:"tree",       gx:20,  gy:76, h:56 },
    { type:"tree",       gx:34,  gy:68, h:56 },
    { type:"tree",       gx:44,  gy:90, h:56 },
    { type:"tree",       gx:68,  gy:70, h:56 },
    { type:"tree",       gx:82,  gy:88, h:56 },
    { type:"tree",       gx:98,  gy:70, h:56 },
    { type:"tree",       gx:118, gy:86, h:56 },
    { type:"tree",       gx:14,  gy:88, h:56 },
    { type:"tree",       gx:52,  gy:68, h:56 },
    { type:"tree",       gx:74,  gy:90, h:56 },
    { type:"tree",       gx:104, gy:90, h:56 },
    { type:"tree",       gx:124, gy:72, h:56 },

    // Semak / bush
    { type:"bush",       gx:28,  gy:92, h:18 },
    { type:"bush",       gx:42,  gy:72, h:18 },
    { type:"bush",       gx:78,  gy:92, h:18 },
    { type:"bush",       gx:92,  gy:76, h:18 },
    { type:"bush",       gx:108, gy:94, h:18 },
    { type:"bush",       gx:2,   gy:82, h:18 },

    // Bangku taman
    { type:"bench",      gx:40,  gy:80, w:2, d:0.6, h:14 },
    { type:"bench",      gx:74,  gy:80, w:2, d:0.6, h:14 },
    { type:"bench",      gx:54,  gy:78, w:2, d:0.6, h:14 },
    { type:"bench",      gx:54,  gy:88, w:2, d:0.6, h:14 },
    { type:"bench",      gx:20,  gy:80, w:2, d:0.6, h:14 },
    { type:"bench",      gx:94,  gy:80, w:2, d:0.6, h:14 },

    // Bunga-bunga taman
    { type:"flower",     gx:8,   gy:66 },
    { type:"flower",     gx:12,  gy:66 },
    { type:"flower",     gx:30,  gy:66 },
    { type:"flower",     gx:36,  gy:66 },
    { type:"flower",     gx:60,  gy:66 },
    { type:"flower",     gx:66,  gy:66 },
    { type:"flower",     gx:90,  gy:66 },
    { type:"flower",     gx:96,  gy:66 },
    { type:"flower",     gx:120, gy:66 },
    { type:"flower",     gx:124, gy:66 },
    { type:"flower",     gx:8,   gy:94 },
    { type:"flower",     gx:24,  gy:94 },
    { type:"flower",     gx:40,  gy:94 },
    { type:"flower",     gx:64,  gy:94 },
    { type:"flower",     gx:88,  gy:94 },
    { type:"flower",     gx:100, gy:94 },
    { type:"flower",     gx:30,  gy:80 },
    { type:"flower",     gx:80,  gy:80 },
    { type:"flower",     gx:30,  gy:86 },
    { type:"flower",     gx:80,  gy:86 },

    // Sampah
    { type:"trash",      gx:2,   gy:90 },
    { type:"trash",      gx:126, gy:90 },

    // Sign taman
    { type:"sign",       gx:22,  gy:66, h:44 },
    { type:"sign",       gx:88,  gy:66, h:44 }
  ]
};
