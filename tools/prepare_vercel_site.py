from pathlib import Path

root = Path(__file__).resolve().parents[1]
site = root / 'site'
index = site / 'index.html'
text = index.read_text(encoding='utf-8')

old_prefix = '  <script>(function(){var R='
start = text.find(old_prefix)
if start >= 0:
    end = text.find('</script>', start)
    if end < 0:
        raise SystemExit('Loader rewrite script is incomplete')
    text = text[:start] + '  <!-- Static Vercel deployment: Godot artifacts are served beside this HTML. -->\n' + text[end + len('</script>') + 1:]

if '/manus-storage/' in text:
    raise SystemExit('Vercel site still contains an internal Manus Storage path')

for name in ('index.pck', 'index.wasm', 'index.js', 'index.html'):
    if not (site / name).is_file():
        raise SystemExit(f'Missing static release artifact: {name}')

index.write_text(text, encoding='utf-8')
print('Prepared static Vercel site with local Godot artifacts')
