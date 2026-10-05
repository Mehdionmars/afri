/**
 * Économie de batterie : les animations en boucle (conteneurs 3D, halo du Maroc)
 * s'arrêtent quand elles sortent de l'écran ou quand l'onglet est caché.
 */
const loops = document.querySelectorAll<HTMLElement>('[data-anim]');

if (loops.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-off', !entry.isIntersecting);
      }
    },
    { rootMargin: '120px 0px' },
  );
  loops.forEach((el) => observer.observe(el));
}

document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('paused', document.hidden);
});
