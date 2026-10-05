/**
 * Génère les icônes et les images de partage (Open Graph) dans public/.
 * À relancer si le logo ou le titre change : `node scripts/generate-assets.mjs`
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = (file) => path.join(root, 'public', file);

// Charte : blanc, noir, bleu marine, jaune, gris métal (et leurs nuances).
const C = { ink: '#0B0B0C', navy: '#0F2340', navyLight: '#1B3459', yellow: '#FFC342', yellowShade: '#E5AC33', yellowLight: '#FFD677', metal: '#8B949E', metal200: '#DDE1E6', metal300: '#B8C0C9', metal100: '#EEF0F2', white: '#FFFFFF' };

// ---------- Logo ----------
const globe = `<g fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></g>`;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="${C.yellow}"/><g transform="translate(9 9) scale(0.9167)">${globe}</g></svg>`;
fs.writeFileSync(pub('favicon.svg'), favicon);

// Icône pleine (sans coins arrondis) pour Apple et le manifeste.
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${C.yellow}"/><g transform="translate(8 8) scale(1)">${globe}</g></svg>`;
await sharp(Buffer.from(square)).resize(180, 180).png().toFile(pub('apple-touch-icon.png'));
await sharp(Buffer.from(square)).resize(192, 192).png().toFile(pub('icon-192.png'));
await sharp(Buffer.from(square)).resize(512, 512).png().toFile(pub('icon-512.png'));

// favicon.ico : un PNG 32×32 dans un conteneur ICO.
const png32 = await sharp(Buffer.from(favicon)).resize(32, 32).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6);
ico.writeUInt8(32, 7);
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png32.length, 14);
ico.writeUInt32LE(22, 18);
fs.writeFileSync(pub('favicon.ico'), Buffer.concat([ico, png32]));

fs.writeFileSync(
  pub('site.webmanifest'),
  JSON.stringify(
    {
      name: 'AFRIEXPORT CONSULTING',
      short_name: 'AFRIEXPORT',
      start_url: '/fr/',
      display: 'browser',
      background_color: C.navy,
      theme_color: C.navy,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ),
);

// ---------- Images Open Graph (1200×630) ----------
const dots = fs.readFileSync(path.join(root, 'src/data/world-dots.ts'), 'utf8');
const LAND = dots.match(/LAND_PATH = '([^']+)'/)[1];
const MOROCCO = dots.match(/MOROCCO_PATH = '([^']+)'/)[1];

// Conteneur isométrique : longueur L (axe x), profondeur D (axe z), hauteur H.
function container(ox, oy, L, D, H, side, rib, top, edge) {
  const cx = Math.cos(Math.PI / 6);
  const p = (x, y, z) => [ox + (x - z) * cx, oy + (x + z) * 0.5 - y];
  const pts = (arr) => arr.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ');
  const front = [p(0, 0, D), p(L, 0, D), p(L, H, D), p(0, H, D)];
  const end = [p(L, 0, D), p(L, 0, 0), p(L, H, 0), p(L, H, D)];
  const roof = [p(0, H, D), p(L, H, D), p(L, H, 0), p(0, H, 0)];
  let ribs = '';
  for (let x = 9; x < L - 4; x += 11) {
    const [a, b] = [p(x, 3, D), p(x, H - 3, D)];
    ribs += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${rib}" stroke-width="3"/>`;
  }
  for (let z = 9; z < D - 4; z += 10) {
    const [a, b] = [p(L, 3, z), p(L, H - 3, z)];
    ribs += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${edge}" stroke-width="2.5"/>`;
  }
  return `<g stroke-linejoin="round">
    <polygon points="${pts(front)}" fill="${side}" stroke="${edge}" stroke-width="3"/>
    <polygon points="${pts(end)}" fill="${rib}" stroke="${edge}" stroke-width="3"/>
    ${ribs}
    <polygon points="${pts(roof)}" fill="${top}" stroke="${edge}" stroke-width="3"/>
  </g>`;
}

const og = {
  fr: { eyebrow: 'CONSEIL EN IMPORT-EXPORT', lines: ['Développez vos échanges', 'entre le Maroc, l’Afrique', 'et le monde'] },
  en: { eyebrow: 'IMPORT-EXPORT CONSULTING', lines: ['Grow your trade between', 'Morocco, Africa', 'and the world'] },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

for (const [lang, copy] of Object.entries(og)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.navy}"/>
  <g transform="translate(470 120) scale(1.02)" opacity="0.9">
    <path d="${LAND}" fill="none" stroke="${C.navyLight}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="${MOROCCO}" fill="none" stroke="${C.yellow}" stroke-width="6" stroke-linecap="round"/>
  </g>
  ${container(940, 452, 200, 54, 56, C.metal300, C.metal, C.metal100, C.ink)}
  ${container(940, 394, 200, 54, 56, C.yellow, C.yellowShade, C.yellowLight, C.ink)}
  ${container(895, 314, 98, 54, 56, C.white, C.metal200, C.white, C.metal)}
  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <rect x="72" y="64" width="52" height="52" rx="12" fill="${C.yellow}"/>
    <g transform="translate(84 76) scale(1.17)">${globe}</g>
    <text x="142" y="100" xml:space="preserve" font-size="26" font-weight="700" fill="#FFFFFF" letter-spacing="0.6">AFRIEXPORT<tspan fill="${C.yellow}"> CONSULTING</tspan></text>
    <text x="72" y="268" font-size="20" font-weight="700" fill="${C.yellow}" letter-spacing="3">${copy.eyebrow}</text>
    ${copy.lines.map((line, i) => `<text x="70" y="${338 + i * 70}" font-size="60" font-weight="500" fill="#FFFFFF" letter-spacing="-1.2">${esc(line)}</text>`).join('\n    ')}
  </g>
</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(pub(`og-${lang}.jpg`));
}

console.log('Icônes et images Open Graph générées dans public/.');
