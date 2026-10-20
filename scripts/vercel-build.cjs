const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'site');
const entry = path.join(site, 'index.html');

if (!fs.existsSync(entry)) {
  console.error('Vercel build gagal: site/index.html tidak ditemukan. Jalankan export Godot melalui workflow Manus sebelum push.');
  process.exit(1);
}

const required = ['index.js', 'index.png', 'index.pck', 'index.wasm', 'game-release.json'];
const missing = required.filter((name) => !fs.existsSync(path.join(site, name)));
if (missing.length > 0) {
  console.error(`Vercel build gagal: artefak static hilang: ${missing.join(', ')}`);
  process.exit(1);
}

const html = fs.readFileSync(entry, 'utf8');
if (html.includes('/manus-storage/')) {
  console.error('Vercel build gagal: index.html masih menunjuk ke Manus Storage internal.');
  process.exit(1);
}

console.log(`Vercel static build siap: ${site}`);
