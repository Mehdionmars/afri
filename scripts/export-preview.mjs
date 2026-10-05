/**
 * Exporte un aperçu à envoyer au client : chaque page devient un fichier HTML autonome
 * (styles, polices, scripts et icônes intégrés) qui s'ouvre d'un double-clic, sans serveur
 * ni connexion. Les photos sont rangées dans un dossier images/ à côté (une version WebP
 * par photo, pour garder un aperçu léger). Les pages se renvoient entre elles (FR ↔ EN).
 *
 * Usage : npm run export:apercu
 * (construit le site en mode aperçu, non indexable, puis écrit le dossier apercu-client/)
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'apercu-client');
const imagesDir = path.join(out, 'images');

// Toutes les pages FR et EN du site construit (sauf la racine et la 404).
const routes = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html') routes.push('/' + path.relative(dist, path.dirname(full)).split(path.sep).join('/') + '/');
  }
};
for (const lang of ['fr', 'en']) walk(path.join(dist, lang));
const fileFor = (route) => {
  if (route === '/fr/') return 'AFRIEXPORT-apercu-FR.html';
  if (route === '/en/') return 'AFRIEXPORT-preview-EN.html';
  return `${route.slice(1, -1).replace(/\//g, '-')}.html`;
};
const pages = routes.sort().map((route) => ({ route, file: fileFor(route) }));
const routeToFile = new Map(pages.map((p) => [p.route, p.file]));

const MIME = {
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

const dataUri = (urlPath) => {
  const file = path.join(dist, decodeURIComponent(urlPath));
  if (!fs.existsSync(file)) return null;
  const mime = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
};

// Polices et images référencées dans le CSS.
const inlineCssUrls = (css) =>
  css.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (match, _quote, url) => {
    const uri = dataUri(url);
    return uri ? `url("${uri}")` : match;
  });

/** Copie une image du site dans images/ et renvoie son chemin relatif. */
const copied = new Set();
function localImage(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const name = path.basename(clean);
  if (!copied.has(name)) {
    fs.copyFileSync(path.join(dist, clean), path.join(imagesDir, name));
    copied.add(name);
  }
  return `images/${name}`;
}

/** Choisit dans un srcset la version la plus proche de 1200 px de large. */
function pickFromSrcset(srcset) {
  const candidates = srcset
    .split(',')
    .map((part) => part.trim().split(/\s+/))
    .map(([url, w]) => ({ url, w: parseInt(w, 10) || 0 }));
  candidates.sort((a, b) => Math.abs(a.w - 1200) - Math.abs(b.w - 1200) || b.w - a.w);
  return candidates[0]?.url;
}

/**
 * Les modules partagés (`import … from "./chunk.js"`) ne se chargent pas depuis un fichier
 * ouvert en local : on les intègre en adresses data:, autorisées hors serveur.
 */
const chunkCache = new Map();
function resolveImports(js) {
  return js.replace(/(from|import)\s*"\.\/([^"]+\.js)"/g, (_, keyword, name) => {
    if (!chunkCache.has(name)) {
      const code = resolveImports(fs.readFileSync(path.join(dist, '_astro', name), 'utf8'));
      chunkCache.set(name, `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
    }
    return `${keyword}"${chunkCache.get(name)}"`;
  });
}

function inlinePage(html) {
  // Feuilles de style → <style> intégré.
  html = html.replace(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g, (_, href) => {
    const css = fs.readFileSync(path.join(dist, href), 'utf8');
    return `<style>${inlineCssUrls(css)}</style>`;
  });
  // Scripts externes → scripts intégrés.
  html = html.replace(/<script type="module" src="(\/_astro\/[^"]+\.js)"><\/script>/g, (_, src) => {
    const js = resolveImports(fs.readFileSync(path.join(dist, src), 'utf8')).replace(/<\/script/gi, '<\\/script');
    return `<script type="module">${js}</script>`;
  });
  // Icônes : le favicon SVG est intégré, le reste est retiré (inutile hors ligne).
  html = html.replace(/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/, () => `<link rel="icon" href="${dataUri('/favicon.svg')}" type="image/svg+xml">`);
  html = html.replace(/<link rel="icon" href="\/favicon\.ico"[^>]*>/, '');
  html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, '');
  html = html.replace(/<link rel="manifest"[^>]*>/, '');
  // Photos : <picture> (AVIF, WebP, plusieurs tailles) → une seule image WebP dans images/.
  html = html.replace(/<picture>([\s\S]*?)<\/picture>/g, (_, inner) => {
    const webp = inner.match(/<source[^>]*type="image\/webp"[^>]*srcset="([^"]+)"/) ?? inner.match(/<source[^>]*srcset="([^"]+)"[^>]*type="image\/webp"/);
    const img = inner.match(/<img\b[^>]*>/)?.[0] ?? '';
    const chosen = webp ? pickFromSrcset(webp[1]) : img.match(/\ssrc="([^"]+)"/)?.[1];
    if (!chosen) return img;
    return img
      .replace(/\s(?:srcset|sizes)="[^"]*"/g, '')
      .replace(/\ssrc="[^"]*"/, ` src="${localImage(chosen)}"`);
  });
  // Autres images du site, s'il en reste.
  html = html.replace(/(src|srcset)="([^"]*\/_astro\/[^"]*)"/g, (_, attr, value) => {
    const replaced = value.replace(/\/_astro\/[^\s,]+/g, (url) => localImage(url));
    return `${attr}="${replaced}"`;
  });
  // Liens internes → fichiers voisins.
  html = html.replace(/href="(\/(?:fr|en)\/[^"#]*)(#[^"]*)?"/g, (match, route, hash = '') => {
    const file = routeToFile.get(route);
    return file ? `href="${file}${hash}"` : match;
  });
  return html;
}

if (!fs.existsSync(path.join(dist, 'fr', 'index.html'))) {
  console.error('dist/ est vide : lancez d’abord le build (npm run export:apercu le fait pour vous).');
  process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(imagesDir, { recursive: true });

for (const page of pages) {
  const src = path.join(dist, page.route, 'index.html');
  const html = inlinePage(fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(path.join(out, page.file), html);
  const leftovers = (html.match(/(?:href|src)="\/(?!\/)[^"]*"/g) ?? []).filter((m) => !m.includes('href="/"'));
  console.log(`${page.file.padEnd(52)} ${(Buffer.byteLength(html) / 1024).toFixed(0).padStart(5)} Ko${leftovers.length ? `  (liens restants : ${leftovers.join(', ')})` : ''}`);
}
const imagesSize = [...copied].reduce((sum, name) => sum + fs.statSync(path.join(imagesDir, name)).size, 0);
console.log(`\n${copied.size} photos dans images/ (${(imagesSize / 1024 / 1024).toFixed(1)} Mo).`);
console.log(`Aperçu prêt dans ${path.relative(root, out)}/ : ouvrez ${pages.find((p) => p.route === '/fr/').file} d’un double-clic.`);
