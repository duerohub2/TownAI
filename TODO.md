# AI Living City — Delivery TODO

## 1. Playable offline city MVP — COMPLETE FOR MVP CHECKPOINT

- [x] Game berjalan sebagai browser Web export dan menampilkan kota kecil isometrik, bukan landing page statis.
- [x] Kota memiliki Town Square, Residential District, Commercial District, Civic District, dan Park District yang dapat dibedakan melalui tile, landmark, serta label.
- [x] Pengguna dapat menjelajahi kota dengan memilih tile atau lokasi dari peta.
- [x] Peta mendukung pan dan zoom serta memiliki layout desktop dan portrait mobile.
- [x] Satu karakter utama ditampilkan dengan lokasi saat ini dan status kebutuhan dasar.
- [x] NPC memiliki profil singkat, lokasi berbasis jadwal, dan perilaku deterministik ringan tanpa LLM.
- [x] Pengguna dapat memilih NPC dan melakukan interaksi sosial dasar.
- [x] Pengguna dapat melihat dan menerima pekerjaan.
- [x] Pengguna dapat menjalankan shift, memperoleh reward uang, dan melihat aktivitasnya.
- [x] Pengguna dapat membelanjakan uang untuk item dasar di Commercial District.
- [x] Inventory, uang, lokasi, pekerjaan, kebutuhan, dan riwayat aktivitas tersimpan lokal setelah reload.
- [x] UI menggunakan Bahasa Indonesia dan menyediakan kontrol zoom, pan, serta opsi pengurangan animasi.
- [x] Fitur yang membutuhkan backend—multiplayer, autentikasi, Supabase, ledger produksi, governance, AI LLM, backup, dan simulasi server-side—ditandai belum tersedia, bukan diklaim selesai.

## 2. Quality and delivery — IN PROGRESS

- [x] `npm run check` lulus untuk source dan boot.
- [x] `npm run build` menghasilkan export Web pada `dist/standalone`.
- [x] `npm run check -- --pack` lulus untuk pack yang dibangun.
- [x] `npm run preview:build` berhasil dan native Preview menampilkan map serta panel konteks.
- [ ] Checkpoint managed tersimpan ke remote project.
- [ ] Source hasil implementasi disinkronkan ke `duerohub2/TownAI`.
- [ ] Smoke acceptance interaktif di browser pengguna masih perlu dilakukan; native checks tidak membuktikan seluruh input browser.

## 3. Next phases — NOT STARTED

- [ ] Supabase Auth dan database persisten.
- [ ] Server-authoritative economy dan append-only ledger.
- [ ] Backend multiplayer/shared world.
- [ ] AI residents dengan memory service dan scheduler server-side.
- [ ] Governance, pemilu, moderation, backup, observability, dan production security.
