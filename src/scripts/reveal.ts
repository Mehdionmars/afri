/**
 * Repli pour les navigateurs sans `animation-timeline: view()` :
 * ajoute .is-in aux éléments .reveal quand ils entrent à l'écran.
 */
const supportsViewTimeline = CSS.supports('animation-timeline: view()');

if (!supportsViewTimeline) {
  const items = document.querySelectorAll<HTMLElement>('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    items.forEach((el) => observer.observe(el));
  }
}
