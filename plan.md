# AI Living City — MVP Plan

## Tujuan implementasi

Membangun playable offline MVP untuk browser desktop dan mobile. Pemain menjelajahi kota kecil isometrik, berpindah distrik, berbicara dengan NPC, mengambil pekerjaan, mendapatkan uang, membeli item, dan mempertahankan progres melalui penyimpanan lokal. Versi ini tidak mengklaim multiplayer, backend, autentikasi, LLM, governance, atau simulasi server-side.

## Pendekatan teknis

- Engine: Godot 4.7.2 dengan Web export yang cocok untuk hosting static di Vercel.
- Scene utama: satu scene `Main` dengan pemisahan tanggung jawab antara `TownGameState` (state dan persistence), `CityMap` (rendering/input peta), dan `main.gd` (UI serta orchestration).
- Persistence: JSON lokal melalui `user://townai_save.json`; setiap perubahan ekonomi, perjalanan, interaksi, dan inventory langsung disimpan.
- Simulation: jam kota dan jadwal NPC deterministik berbasis waktu sesi, tanpa panggilan LLM.
- Future boundaries: state operations dikumpulkan dalam `TownGameState` agar backend Supabase, ledger server-side, dan multiplayer authoritative dapat ditambahkan tanpa menaruh logika ekonomi di UI.
- Delivery: preview build Godot Web, finite checks, checkpoint managed, lalu source disimpan ke repo GitHub `duerohub2/TownAI`.

## Struktur proyek

- `project.godot` — identitas aplikasi, viewport adaptif, dan scene utama.
- `scenes/main.tscn` — entry scene.
- `scripts/main.gd` — layout UI, input actions, feedback, job flow, dan integrasi state/map.
- `scripts/city_map.gd` — peta isometrik, distrik, bangunan, NPC, player marker, pan/zoom, dan picking.
- `scripts/game_state.gd` — karakter, uang, item, pekerjaan, kebutuhan, aktivitas, jam kota, NPC schedule, dan local save.
- `plan.md` — keputusan implementasi dan desain.
- `TODO.md` — outcomes serta status delivery.

## Design

### Alternatif gaya

- **Warm civic pixel diorama** — probabilitas 0.04.
- **Pastel neighborhood notebook** — probabilitas 0.07.
- **Night market neon sim** — probabilitas 0.03.

Pilihan: **Warm civic pixel diorama**.

### Design Movement

Isometric pixel-art diorama yang memadukan keterbacaan game simulasi klasik dengan suasana kota kecil yang hangat.

### Core Principles

1. Setiap distrik langsung terbaca melalui warna, landmark, dan label.
2. State permainan selalu terlihat: uang, kebutuhan, pekerjaan, inventory, dan aktivitas.
3. Interaksi cukup satu atau dua klik dan tidak memerlukan joystick.
4. Visual dekoratif tidak boleh menyembunyikan tujuan atau status ekonomi pemain.

### Color Philosophy

Palet dasar memakai biru malam dan arang untuk memberi kontras pada panel, lalu teal sebagai warna aksi dan amber sebagai sinyal ekonomi. Distrik memakai coral, hijau taman, biru civic, dan peach komersial agar peta terbaca tanpa legenda panjang. Warna NPC dibuat beragam tetapi tidak lebih kuat daripada highlight pemain.

### Layout Paradigm

Peta mengambil bidang utama dengan sidebar konteks yang menempel di sisi kanan pada desktop. Pada layar kecil, sidebar turun menjadi panel bawah sehingga dunia tetap terlihat. Header berfungsi sebagai status bar selalu terlihat, bukan landing page.

### Signature Elements

- Jalur isometrik dengan tile berlian dan bayangan bangunan bertingkat.
- Pin lokasi berbentuk badge kecil untuk distrik dan NPC.
- Panel aktivitas seperti jurnal kota yang menyimpan jejak tindakan terbaru.

### Interaction Philosophy

Pemain memilih lokasi dan tujuan dari peta, lalu UI konteks menjelaskan satu tindakan yang relevan. Semua reward ditampilkan setelah state berubah dan autosave memberi sinyal bahwa progres lokal sudah tersimpan.

### Animation

Gerakan NPC sederhana dan berkala, perpindahan pemain menggunakan marker yang langsung dikoreksi oleh state, dan transisi ringan. Reduced motion menghapus pergeseran dekoratif serta menjaga feedback tetap informatif.

### Typography System

Memakai font UI bawaan template Godot untuk konsistensi export, dengan hierarki judul besar, label status kecil, dan body text yang cukup besar untuk layar mobile. Tidak ada teks yang dirasterkan ke dalam artwork.

### Brand Essence

Kota hidup yang dapat kamu bangun pelan-pelan, untuk pemain yang menyukai rutinitas sosial dan ekonomi kecil yang terasa nyata. Tiga sifat: hangat, ingin tahu, bertumbuh.

### Brand Voice

Headline: langsung dan mengundang tindakan.
CTA contoh: “Masuk ke kota”, “Mulai shift”, “Sapa warga”.
Microcopy contoh: “Perubahanmu tersimpan di perangkat ini.” dan “Distrik ini sedang menunggu langkahmu.”

### Wordmark & Logo

Wordmark `AI LIVING CITY` dipasangkan dengan simbol empat tile berlian yang membentuk siluet alun-alun. Pada MVP, simbol direpresentasikan sebagai bentuk live UI agar tetap tajam di semua resolusi.

### Signature Brand Color

Teal civic `#55D6BE`, dipakai untuk aksi utama, highlight pemain, dan indikator state tersimpan.
