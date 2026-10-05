import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  // Aperçu client : on interdit l'exploration.
  if (import.meta.env.PUBLIC_PREVIEW === '1') {
    return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
