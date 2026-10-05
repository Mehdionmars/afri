/**
 * Petit serveur statique pour regarder le site construit (dist/) en local, sans dépendance.
 * Utile quand un serveur Astro tourne déjà pour ce projet (Astro n'en accepte qu'un à la fois).
 *
 * Usage : npm run build && node scripts/serve-dist.mjs   (port : variable PORT, sinon 4323)
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..', 'dist');
const port = Number(process.env.PORT) || 4323;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const file = path.normalize(path.join(root, clean));
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  const index = path.join(file, 'index.html');
  return fs.existsSync(index) ? index : null;
}

if (!fs.existsSync(path.join(root, 'fr', 'index.html'))) {
  console.error('dist/ est vide : lancez d’abord « npm run build ».');
  process.exit(1);
}

http
  .createServer((req, res) => {
    const url = req.url ?? '/';
    // Comme chez l'hébergeur : /fr → /fr/, et la racine mène à /fr/.
    if (url === '/') return res.writeHead(302, { Location: '/fr/' }).end();
    const file = resolve(url);
    if (!file) {
      const withSlash = !url.endsWith('/') && resolve(`${url}/`);
      if (withSlash) return res.writeHead(301, { Location: `${url}/` }).end();
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      return fs.createReadStream(path.join(root, '404.html')).pipe(res);
    }
    const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    // Compression gzip des fichiers texte, comme chez un hébergeur (mesures de vitesse fiables).
    const gzip = /text|javascript|json|xml|svg|manifest/.test(type) && /gzip/.test(String(req.headers['accept-encoding'] ?? ''));
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache',
      Vary: 'Accept-Encoding',
      ...(gzip ? { 'Content-Encoding': 'gzip' } : {}),
    });
    const stream = fs.createReadStream(file);
    (gzip ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
  })
  .listen(port, () => console.log(`Site construit servi sur http://localhost:${port}/fr/`));
