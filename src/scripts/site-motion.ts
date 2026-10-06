/**
 * Mouvement du site : GSAP 3 + ScrollTrigger (cdnjs) et Lenis (jsDelivr), chargés dans BaseLayout.
 * - Lenis lisse le défilement ; il est synchronisé avec ScrollTrigger
 *   (lenis.on('scroll', ScrollTrigger.update) et gsap.ticker).
 * - Chaque section de l'accueil a son animation ; les pages intérieures utilisent les animations
 *   génériques (.reveal, titres découpés en lignes).
 * - Sous 768 px : ni épinglage, ni défilement horizontal (gsap.matchMedia).
 * - Avec « mouvement réduit » : ni Lenis, ni animation au scroll ; tout reste visible.
 * - Sans GSAP (CDN injoignable) : rien n'est masqué, le site reste complet.
 *
 * Toutes les valeurs à régler sont regroupées dans CONFIG, juste en dessous.
 */

const CONFIG = {
  /** Défilement doux : plus lerp est petit, plus le défilement est amorti (0,05 à 0,15). */
  lenis: { lerp: 0.1, wheelMultiplier: 1 },
  /** Amorti des animations liées au scroll (secondes de retard sur la molette). */
  scrub: 0.2,
  breakpoints: { desktop: '(min-width: 768px)', mobile: '(max-width: 767px)', wide: '(min-width: 1024px)' },
  /** Apparition générique des éléments .reveal. */
  reveal: { y: 30, duration: 0.9, ease: 'power3.out', start: 'top 88%' },
  /** 1. Intro : lignes du titre, puis effacement au scroll. */
  intro: { lineY: 10, duration: 0.9, stagger: 0.01, ease: 'power3.out', start: 'top 60%', exitY: -200 },
  /** 2. Chiffres clés : durée de l'épinglage et course des losanges (en largeurs d'écran). */
  figures: { end: '+=200%', diamondTravel: 1.4 },
  /** 4. Bandeau valeurs : part de la longueur du texte parcourue pendant la traversée de l'écran. */
  values: { travel: 0.45 },
  /** 5. Méthode : durée de l'épinglage, puis apparition des colonnes une par une. */
  method: { end: '+=130%', stagger: 0.1 },
  /** 6. Services : la section s'efface en sortant. */
  services: { fadeStart: 'bottom 75%', fadeEnd: 'bottom 25%' },
  /** 7. Parallaxe : photo et triangle à deux vitesses différentes. */
  parallax: { photoY: -400, triangleY: -200 },
  /** 8. Engagements : les deux photos décalées. */
  commitments: { photoAY: -120, photoBY: -260 },
  /** Page Conteneurs, familles : conditions d'épinglage et durée par famille (en % d'écran).
   *  Le point et le grossissement de chaque zoom sont dans ContainerFamilies.astro (focus). */
  families: {
    pinned: '(min-width: 1024px) and (min-height: 600px)',
    stacked: '(max-width: 1023px), (max-height: 599px)',
    perItem: 90,
  },
};

type AnyFn = (...args: any[]) => any;
interface Gsap {
  registerPlugin: AnyFn;
  set: AnyFn;
  to: AnyFn;
  from: AnyFn;
  fromTo: AnyFn;
  timeline: AnyFn;
  matchMedia: AnyFn;
  utils: { toArray: <T>(target: string | Element | null) => T[] };
  ticker: { add: AnyFn; lagSmoothing: AnyFn };
}

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Découpe un titre en lignes : chaque ligne dans un masque (overflow: hidden) pour l'animer. */
function splitLines(el: HTMLElement): HTMLElement[] {
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  const words = text.split(' ');
  el.textContent = '';
  const spans = words.map((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    el.append(span);
    if (i < words.length - 1) el.append(' ');
    return span;
  });
  const lines: string[][] = [];
  let top: number | null = null;
  for (const span of spans) {
    if (top === null || Math.abs(span.offsetTop - top) > 3) {
      lines.push([]);
      top = span.offsetTop;
    }
    lines[lines.length - 1].push(span.textContent ?? '');
  }
  el.textContent = '';
  return lines.map((line, i) => {
    const mask = document.createElement('span');
    mask.className = 'split-line';
    const inner = document.createElement('span');
    inner.className = 'split-line-inner';
    // Espace en fin de ligne : les lecteurs d'écran ne collent pas deux mots.
    inner.textContent = line.join(' ') + (i < lines.length - 1 ? ' ' : '');
    mask.append(inner);
    el.append(mask);
    return inner;
  });
}

/** Attend la fin de l'écran de chargement (1re page) ou du voile blanc (pages suivantes). */
function pageReady(): Promise<void> {
  return new Promise((resolve) => {
    if (root.classList.contains('is-loading')) {
      addEventListener('afx:loaded', () => resolve(), { once: true });
      setTimeout(resolve, 4500);
    } else if (root.classList.contains('veil')) {
      setTimeout(resolve, 450);
    } else {
      resolve();
    }
  });
}

function start() {
  const w = window as unknown as { gsap?: Gsap; ScrollTrigger?: any; Lenis?: any; afxLenis?: any };
  const gsap = w.gsap;
  const ScrollTrigger = w.ScrollTrigger;
  if (!gsap || !ScrollTrigger || reduce) {
    root.classList.add('no-motion');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Lenis, synchronisé avec ScrollTrigger ----------
  if (w.Lenis) {
    const headerH = document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 80;
    const lenis = new w.Lenis({ lerp: CONFIG.lenis.lerp, wheelMultiplier: CONFIG.lenis.wheelMultiplier, anchors: { offset: -(headerH + 8) } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    w.afxLenis = lenis;
  }
  root.classList.add('motion');

  // ---------- Générique : apparition en fondu des éléments .reveal ----------
  // Opacité seule (pas de visibility: hidden) : les liens et champs restent atteignables au clavier
  // avant d'être apparus ; le focus fait défiler jusqu'à eux, ce qui les fait apparaître.
  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
    if (el.closest('[data-no-reveal]')) return;
    gsap.from(el, {
      y: CONFIG.reveal.y,
      opacity: 0,
      duration: CONFIG.reveal.duration,
      ease: CONFIG.reveal.ease,
      scrollTrigger: { trigger: el, start: CONFIG.reveal.start, once: true },
    });
  });

  // ---------- Générique : titres d'en-tête des pages intérieures, ligne par ligne au chargement ----------
  document.querySelectorAll<HTMLElement>('[data-split-load]').forEach((title) => {
    const lines = splitLines(title);
    gsap.set(lines, { yPercent: 100, autoAlpha: 0 });
    pageReady().then(() => gsap.to(lines, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: 'power3.out' }));
  });

  // ---------- 1. Intro de l'accueil ----------
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (intro) {
    const title = intro.querySelector<HTMLElement>('[data-intro-title]')!;
    const content = intro.querySelector<HTMLElement>('[data-intro-content]')!;
    const fades = intro.querySelectorAll('[data-intro-fade]');
    const lines = splitLines(title);
    gsap.set(lines, { y: CONFIG.intro.lineY, autoAlpha: 0 });
    gsap.set(fades, { y: CONFIG.intro.lineY, opacity: 0 });
    // Les lignes montent de 10 px avec un fondu, quand le haut de l'intro atteint 60 % de l'écran.
    ScrollTrigger.create({
      trigger: intro,
      start: CONFIG.intro.start,
      once: true,
      onEnter: () =>
        pageReady().then(() =>
          gsap
            .timeline()
            .to(lines, { y: 0, autoAlpha: 1, duration: CONFIG.intro.duration, stagger: CONFIG.intro.stagger, ease: CONFIG.intro.ease })
            .to(fades, { y: 0, opacity: 1, duration: CONFIG.intro.duration, stagger: 0.08, ease: CONFIG.intro.ease }, '<0.15'),
        ),
    });
    // Puis, au scroll : le titre et le texte s'effacent et la section remonte.
    gsap.to(content, {
      opacity: 0,
      y: CONFIG.intro.exitY,
      ease: 'none',
      scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom top', scrub: CONFIG.scrub },
    });
  }

  const mm = gsap.matchMedia();

  // ---------- 2. Chiffres clés : section épinglée, rangée qui défile en X ----------
  const figures = document.querySelector<HTMLElement>('[data-figures]');
  if (figures) {
    const track = figures.querySelector<HTMLElement>('[data-figures-track]')!;
    const diamonds = figures.querySelectorAll('[data-figures-diamond]');
    mm.add(CONFIG.breakpoints.desktop, () => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - innerWidth),
        ease: 'none',
        scrollTrigger: { trigger: figures, start: 'top top', end: CONFIG.figures.end, pin: true, scrub: CONFIG.scrub, invalidateOnRefresh: true },
      });
      // Les losanges traversent en sens inverse : effet de vitesse.
      gsap.to(diamonds, {
        x: () => innerWidth * CONFIG.figures.diamondTravel,
        ease: 'none',
        scrollTrigger: { trigger: figures, start: 'top top', end: CONFIG.figures.end, scrub: CONFIG.scrub, invalidateOnRefresh: true },
      });
    });
  }

  // ---------- 4. Bandeau valeurs : texte en contour qui glisse avec le scroll ----------
  const values = document.querySelector<HTMLElement>('[data-values]');
  if (values) {
    const track = values.querySelector<HTMLElement>('[data-values-track]')!;
    mm.add(CONFIG.breakpoints.desktop, () => {
      gsap.to(track, {
        x: () => -track.scrollWidth * CONFIG.values.travel,
        ease: 'none',
        scrollTrigger: { trigger: values, start: 'top bottom', end: 'bottom top', scrub: CONFIG.scrub, invalidateOnRefresh: true },
      });
    });
  }

  // ---------- 5. Méthode : fond photo, titre ligne par ligne, puis les étapes une par une ----------
  const method = document.querySelector<HTMLElement>('[data-method]');
  if (method) {
    const title = method.querySelector<HTMLElement>('[data-method-title]')!;
    const lines = splitLines(title);
    const cols = method.querySelectorAll('[data-method-col]');
    const extras = method.querySelectorAll('[data-method-fade]');
    mm.add(CONFIG.breakpoints.desktop, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: method, start: 'top top', end: CONFIG.method.end, pin: true, scrub: CONFIG.scrub } })
        .from(extras, { opacity: 0, y: 20, duration: 0.3 })
        .from(lines, { yPercent: 100, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '<')
        .from(cols, { y: 40, opacity: 0, duration: 0.5, stagger: CONFIG.method.stagger, ease: 'power2.out' }, '>-0.1')
        .to({}, { duration: 0.4 });
    });
    mm.add(CONFIG.breakpoints.mobile, () => {
      gsap.from([...extras, ...lines, ...cols], {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: method, start: 'top 75%', once: true },
      });
    });
  }

  // ---------- 6. Services : titre épinglé à gauche, la liste défile, puis la section s'efface ----------
  const services = document.querySelector<HTMLElement>('[data-services]');
  if (services) {
    const left = services.querySelector<HTMLElement>('[data-services-left]')!;
    const inner = services.querySelector<HTMLElement>('[data-services-inner]')!;
    mm.add(CONFIG.breakpoints.wide, () => {
      // Le titre reste en place (là où il est quand la section atteint le haut) jusqu'à la fin de la liste.
      ScrollTrigger.create({ trigger: services, start: 'top top', end: 'bottom bottom', pin: left, pinSpacing: false, invalidateOnRefresh: true });
    });
    gsap.to(inner, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: services, start: CONFIG.services.fadeStart, end: CONFIG.services.fadeEnd, scrub: CONFIG.scrub },
    });
  }

  // ---------- 7. Parallaxe : photo et triangle à deux vitesses ----------
  const parallax = document.querySelector<HTMLElement>('[data-parallax]');
  if (parallax) {
    mm.add(CONFIG.breakpoints.desktop, () => {
      const scroll = { trigger: parallax, start: 'top bottom', end: 'bottom top', scrub: CONFIG.scrub };
      gsap.to(parallax.querySelector('[data-parallax-photo]'), { y: CONFIG.parallax.photoY, ease: 'none', scrollTrigger: scroll });
      gsap.to(parallax.querySelector('[data-parallax-triangle]'), { y: CONFIG.parallax.triangleY, ease: 'none', scrollTrigger: { ...scroll } });
    });
  }

  // ---------- 8. Engagements : deux photos décalées en parallaxe ----------
  const commitments = document.querySelector<HTMLElement>('[data-commitments]');
  if (commitments) {
    mm.add(CONFIG.breakpoints.desktop, () => {
      const scroll = { trigger: commitments, start: 'top bottom', end: 'bottom top', scrub: CONFIG.scrub };
      gsap.to(commitments.querySelector('[data-commit-photo-a]'), { y: CONFIG.commitments.photoAY, ease: 'none', scrollTrigger: scroll });
      gsap.to(commitments.querySelector('[data-commit-photo-b]'), { y: CONFIG.commitments.photoBY, ease: 'none', scrollTrigger: { ...scroll } });
    });
  }

  // ---------- Page Conteneurs : zoom sur chaque famille ----------
  const fam = document.querySelector<HTMLElement>('[data-families]');
  if (fam) {
    const items = [...fam.querySelectorAll<HTMLElement>('[data-fam-item]')];
    const svgs = items.map((item) => item.querySelector<SVGSVGElement>('[data-fam-svg]')!);
    const rings = items.map((item) => item.querySelector<SVGElement>('[data-fam-ring]')!);
    const details = items.map((item) => item.querySelector<HTMLElement>('[data-fam-detail]')!);
    const buttons = [...fam.querySelectorAll<HTMLButtonElement>('[data-fam-go]')];
    let goTo: ((i: number) => void) | null = null;

    // Ordinateur : la séquence reste fixe ; chaque famille arrive, zoome sur son détail, puis laisse la place.
    mm.add(CONFIG.families.pinned, () => {
      fam.classList.add('is-pinned');
      gsap.set(items, { opacity: 0 });
      gsap.set(items[0], { opacity: 1 });
      gsap.set(details, { opacity: 0.35 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: fam,
          start: 'top top',
          end: `+=${items.length * CONFIG.families.perItem}%`,
          pin: true,
          scrub: CONFIG.scrub,
          onUpdate: (self: { progress: number; animation?: { duration: () => number; labels: Record<string, number> } }) => {
            // Famille en cours, d'après la position de défilement (pas le temps amorti de la frise) :
            // elle devient active dès qu'elle commence à apparaître (0,25 avant son repère).
            const anim = self.animation;
            if (!anim) return;
            const at = self.progress * anim.duration();
            let active = 0;
            items.forEach((_, i) => {
              if (at >= anim.labels[`f${i}`] - 0.26) active = i;
            });
            buttons.forEach((b, i) => (i === active ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
          },
        },
      });
      items.forEach((item, i) => {
        // Le zoom recadre le SVG (viewBox) : net à tout grossissement.
        tl.addLabel(`f${i}`)
          .to({}, { duration: 0.3 })
          .to(svgs[i], { attr: { viewBox: svgs[i].dataset.viewZoom }, duration: 0.9, ease: 'power2.inOut' })
          .to(rings[i], { opacity: 1, duration: 0.25 }, '>-0.25')
          .to(details[i], { opacity: 1, duration: 0.3 }, '<')
          .to({}, { duration: 0.35 });
        if (i < items.length - 1) {
          // L'une après l'autre : la famille sort, puis la suivante entre (les textes ne se superposent pas).
          tl.to(item, { opacity: 0, duration: 0.25 }).fromTo(items[i + 1], { opacity: 0 }, { opacity: 1, duration: 0.25 });
        }
      });
      // Index : un clic amène au début de la famille choisie (juste avant son zoom).
      goTo = (i: number) => {
        const st = tl.scrollTrigger;
        const y = st.start + ((tl.labels[`f${i}`] + 0.15) / tl.duration()) * (st.end - st.start);
        if (w.afxLenis) w.afxLenis.scrollTo(y);
        else scrollTo({ top: y, behavior: 'smooth' });
      };
      return () => {
        fam.classList.remove('is-pinned');
        goTo = null;
      };
    });

    // Téléphone et tablette : chaque dessin zoome sur son détail quand on le fait défiler.
    mm.add(CONFIG.families.stacked, () => {
      svgs.forEach((svg, i) => {
        const scroll = { trigger: items[i], start: 'top 65%', end: 'center 35%', scrub: CONFIG.scrub };
        gsap.to(svg, { attr: { viewBox: svg.dataset.viewZoomMobile }, ease: 'none', scrollTrigger: scroll });
        gsap.fromTo(rings[i], { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { ...scroll } });
      });
    });

    buttons.forEach((button, i) => button.addEventListener('click', () => goTo?.(i)));
  }

  // Les épinglages changent la hauteur de la page : on prévient la route maritime (bord droit).
  ScrollTrigger.addEventListener('refresh', () => dispatchEvent(new Event('afx:layout')));
  // Les polices et les photos changent les hauteurs : recalcul une fois tout chargé.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
}

// GSAP, ScrollTrigger et Lenis sont des scripts « defer » : ils ont tous tourné au DOMContentLoaded.
if ((window as unknown as { gsap?: unknown }).gsap) start();
else addEventListener('DOMContentLoaded', start, { once: true });

// Module (pas un script global) : ses variables ne se mélangent pas à celles des autres scripts.
export {};
