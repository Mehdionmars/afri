/**
 * Passage d'une page à l'autre : au clic sur un lien vers une autre page du site,
 * le voile blanc (.page-veil, BaseLayout) monte depuis le bas, puis la page suivante s'ouvre
 * et le voile s'y lève (classe html.veil posée avant le premier affichage).
 * Rien avec « mouvement réduit », ni pour les ancres de la page en cours, les nouveaux onglets,
 * les téléchargements, les liens externes, tel: ou mailto:.
 */

const OUT_MS = 450;
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

function isPageLink(event: MouseEvent): URL | null {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!link || link.hasAttribute('download') || link.dataset.noVeil !== undefined) return null;
  if (link.target && link.target !== '_self') return null;
  const url = new URL(link.href, location.href);
  if (url.protocol !== location.protocol || url.origin !== location.origin) return null;
  // Même page (ancre ou lien vers soi-même) : le défilement habituel suffit.
  if (url.pathname === location.pathname && url.search === location.search) return null;
  return url;
}

document.addEventListener('click', (event) => {
  if (reduce.matches) return;
  const url = isPageLink(event);
  if (!url) return;
  event.preventDefault();
  root.classList.remove('veil');
  root.classList.add('veil-out');
  window.setTimeout(() => {
    location.href = url.href;
  }, OUT_MS);
});

// Retour arrière depuis le cache du navigateur : la page revient telle qu'on l'a quittée,
// voile compris. On le retire pour la rendre visible tout de suite.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) root.classList.remove('veil', 'veil-out');
});

// Module (pas un script global) : ses variables ne se mélangent pas à celles des autres scripts.
export {};
