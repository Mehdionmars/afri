// @ts-check
import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL publique du site (balises canonical, Open Graph, sitemap).
// À définir dans .env ou chez l'hébergeur : SITE_URL=https://www.exemple.ma
const SITE_URL = (process.env.SITE_URL || 'https://www.afriexport-consulting.ma').replace(/\/$/, '');

// Pages traduites (même table que le site : src/content/routes.json) : sert aux liens hreflang du sitemap.
const routeTable = JSON.parse(fs.readFileSync(new URL('./src/content/routes.json', import.meta.url), 'utf8'));
const PAGES = [
  ...Object.values(routeTable.pages),
  ...Object.values(routeTable.services).map((slug) => ({
    fr: `${routeTable.pages.services.fr}${slug.fr}/`,
    en: `${routeTable.pages.services.en}${slug.en}/`,
  })),
];

export default defineConfig({
  site: SITE_URL,
  // Port du serveur local : variable PORT si elle est fournie (plusieurs serveurs en parallèle), sinon 4321.
  server: { port: Number(process.env.PORT) || 4321 },
  trailingSlash: 'always',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: true,
      // La racine est gérée par src/pages/index.astro et par les règles de l'hébergeur.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/' && path !== '/404/';
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        const page = PAGES.find((p) => p.fr === path || p.en === path);
        if (page) {
          item.links = [
            { lang: 'fr', url: SITE_URL + page.fr },
            { lang: 'en', url: SITE_URL + page.en },
            { lang: 'x-default', url: SITE_URL + page.fr },
          ];
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
