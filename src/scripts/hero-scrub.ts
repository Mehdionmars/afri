/**
 * Moteur de l'accueil au scroll (standard du skill 10k websites).
 * Deux modes sur ordinateur :
 * - « scène » (pas de vidéo configurée) : le conteneur dessiné descend au rythme du scroll
 *   et se pose dans sa place ;
 * - « vidéo » : la vidéo du film avance et recule avec le scroll (la scène reste dessous
 *   tant qu'elle se charge).
 * Règles communes :
 * - la vidéo est chargée en entier en mémoire (Blob) : le scrub marche même
 *   chez les hébergeurs qui ne gèrent pas les requêtes partielles ;
 * - l'image affichée suit le scroll avec un lissage indépendant de la fréquence d'écran ;
 * - une seule recherche dans la vidéo à la fois, la plus récente gagne ;
 * - la page n'est modifiée que quand une valeur change ;
 * - cinq conditions (téléphone, tablette portrait, tactile, paysage bas, mouvement réduit)
 *   basculent en direct vers l'accueil fixe, sans rien télécharger.
 */

const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
];

const RING = 126; // circonférence de l'anneau (rayon 20)
const SMALL_VIDEO = 8_000_000;

interface Band {
  el: HTMLElement;
  a: number;
  b: number;
  ramp: number;
  first: boolean;
  last: boolean;
  op: number;
  k: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Générateur pseudo-aléatoire à graine : les décalages sont identiques à chaque chargement. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

/** Découpe un texte en mots (spans .w) avec un seuil d'apparition --th, en ordre de lecture. */
function splitWords(el: HTMLElement, spread: number, seed: number) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const rand = rng(seed);
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = word;
    span.style.setProperty('--th', ((i / Math.max(1, words.length)) * spread + rand() * 0.04).toFixed(3));
    el.append(span, document.createTextNode(' '));
  });
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const DROP_END = 0.82; // progression à laquelle le conteneur touche le quai

export function initHeroScrub() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const src = hero.dataset.video;
  const hasVideo = Boolean(src);

  const video = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
  const scene = hero.querySelector<HTMLElement>('[data-scene]');
  const slot = scene?.querySelector<SVGGraphicsElement>('[data-slot]');
  const posterLayer = hero.querySelector<HTMLElement>('[data-poster-layer]')!;
  const cue = hero.querySelector<HTMLElement>('[data-cue]')!;
  const bytesHint = Number(hero.dataset.bytes) || 0;

  const bands: Band[] = [...hero.querySelectorAll<HTMLElement>('[data-band]')].map((el) => ({
    el,
    a: Number(el.dataset.a),
    b: Number(el.dataset.b),
    ramp: Number(el.dataset.ramp) || 0,
    first: el.hasAttribute('data-first'),
    last: el.hasAttribute('data-last'),
    op: -1,
    k: -1,
  }));

  let scrubOn = false;
  let heroOnScreen = true;
  let target = 0;
  let shown = 0;
  let rafId: number | null = null;
  let lastTick = 0;
  let loadStart = 0;
  let pastStart = false;

  // ---------- Recherches dans la vidéo, jamais superposées ----------
  let seekBusy = false;
  let pendingTime: number | null = null;
  function requestSeek(t: number) {
    if (!video || !video.duration || !hero!.classList.contains('video-ready')) return;
    if (seekBusy) {
      pendingTime = t;
      return;
    }
    seekBusy = true;
    video.currentTime = t;
  }
  video?.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) {
      const t = pendingTime;
      pendingTime = null;
      requestSeek(t);
    }
  });
  video?.addEventListener('error', () => {
    seekBusy = false;
    pendingTime = null;
    failVideo();
  });

  // ---------- La scène dessinée : descente, rotation vers la vue de face, atterrissage ----------
  // Conteneur 20 pieds dessiné à 26 px/m (voir HeroScene.astro), scène en perspective 1200 px.
  const BOX = { l: 6.06 * 26, h: 2.59 * 26, w: 2.44 * 26 };
  const PERSPECTIVE = 1200;
  const PROGRESS_VARS = ['--y', '--turn', '--sway', '--land', '--puff', '--puff-grow'];
  const geo = { x: 0, y0: 0, y1: 0, ready: false };
  const sceneCache: Record<string, string> = {};
  function setSceneVar(name: string, value: string) {
    if (sceneCache[name] === value) return;
    sceneCache[name] = value;
    scene!.style.setProperty(name, value);
  }
  /** Mesure la place vide du parc (recadré selon l'écran) : position et taille exactes
   *  du conteneur une fois rangé, pour qu'il ait exactement le format de ses voisins. */
  function measureScene() {
    if (!scene || !slot) return;
    const sr = scene.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    if (!slotRect.width || !sr.height) return;
    // La face avant est légèrement grossie par la perspective : on en tient compte.
    let hs = slotRect.width / BOX.l;
    let mag = 1;
    for (let i = 0; i < 3; i++) {
      mag = PERSPECTIVE / (PERSPECTIVE - (BOX.w / 2) * hs);
      hs = slotRect.width / (BOX.l * mag);
    }
    geo.x = slotRect.left + slotRect.width / 2 - sr.left;
    geo.y1 = slotRect.bottom - sr.top - (BOX.h / 2) * hs * mag;
    geo.y0 = Math.max(sr.height * 0.2, 120);
    geo.ready = geo.y1 > geo.y0;
    setSceneVar('--hang-x', `${geo.x.toFixed(1)}px`);
    setSceneVar('--hang-scale', hs.toFixed(4));
    setSceneVar('--land-y', `${geo.y1.toFixed(1)}px`);
  }
  function updateScene(p: number) {
    if (!scene || !geo.ready) return;
    const t = clamp(p / DROP_END, 0, 1);
    const y = geo.y0 + (geo.y1 - geo.y0) * ease(t);
    setSceneVar('--y', `${y.toFixed(1)}px`);
    // En approchant du quai, il pivote pour se présenter de face, comme ses voisins.
    setSceneVar('--turn', (1 - smoothstep(p, DROP_END - 0.26, DROP_END - 0.04)).toFixed(3));
    setSceneVar('--sway', (1 - smoothstep(p, DROP_END - 0.22, DROP_END - 0.04)).toFixed(3));
    const land = smoothstep(p, DROP_END - 0.03, DROP_END);
    setSceneVar('--land', land.toFixed(3));
    setSceneVar('--puff', (land * (1 - smoothstep(p, DROP_END + 0.03, DROP_END + 0.16))).toFixed(3));
    setSceneVar('--puff-grow', smoothstep(p, DROP_END - 0.02, DROP_END + 0.16).toFixed(3));
  }
  /** Retour à l'accueil fixe : on garde la géométrie, on retire la progression. */
  function clearScene() {
    if (!scene) return;
    for (const name of PROGRESS_VARS) {
      scene.style.removeProperty(name);
      delete sceneCache[name];
    }
  }

  // ---------- Progression dans l'accueil épinglé ----------
  function heroProgress() {
    const range = hero!.offsetHeight - innerHeight;
    if (range <= 0) return 0;
    return clamp(-hero!.getBoundingClientRect().top / range, 0, 1);
  }

  function updateCaptions(p: number, now: number) {
    // loadStart < 0 : l'écran de chargement est encore là, la première phrase attend.
    const loadK = loadStart < 0 ? 0 : loadStart ? smoothstep(now - loadStart, 0, 900) : 1;
    for (const band of bands) {
      const { a, b } = band;
      const f = Math.min(0.02, (b - a) / 3);
      const inEase = band.first ? 1 : smoothstep(p, a, a + f);
      const outEase = band.last ? 1 : 1 - smoothstep(p, b - f, b);
      const op = inEase * outEase;
      const ramp = band.ramp || Math.min(0.025, (b - a) * 0.35);
      let k = clamp((p - a) / ramp, 0, 1);
      if (band.first) k = Math.max(k, loadK);
      if (Math.abs(op - band.op) > 0.004 || (op === 0) !== (band.op === 0)) {
        band.op = op;
        band.el.style.opacity = op.toFixed(3);
        // Les accroches sont décoratives ; le bloc final (titre, boutons) reste atteignable au clavier.
        if (!band.last) band.el.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      }
      if (Math.abs(k - band.k) > 0.008 || (k === 1 && band.k !== 1)) {
        band.k = k;
        band.el.style.setProperty('--k', k.toFixed(3));
      }
    }
    const past = p > 0.03;
    if (past !== pastStart) {
      pastStart = past;
      hero!.classList.toggle('is-past-start', past);
    }
    return loadStart > 0 && loadK < 1;
  }

  // ---------- Boucle lissée, qui se met au repos ----------
  function tick(now: number) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    const converged = Math.abs(target - shown) < 0.0005;
    if (converged) shown = target;
    updateScene(shown);
    requestSeek(shown * (video?.duration || 0));
    const loading = updateCaptions(shown, now);
    if (converged && !loading) {
      rafId = null;
      lastTick = 0;
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen && scrubOn) rafId = requestAnimationFrame(tick);
  }

  // L'écran de chargement se lève : la première phrase s'assemble (sécurité : 4,5 s au plus).
  const startIntro = () => {
    if (loadStart >= 0) return;
    loadStart = performance.now();
    if (scrubOn && rafId === null) rafId = requestAnimationFrame(tick);
  };
  addEventListener('afx:loaded', startIntro, { once: true });
  setTimeout(startIntro, 4500);

  // Au clavier, atteindre un bouton de l'accueil amène directement à la fin du film.
  hero.addEventListener('focusin', (event) => {
    if (!scrubOn) return;
    const settle = bands.find((band) => band.last);
    if (settle && settle.el.contains(event.target as Node) && heroProgress() < 0.99) {
      const top = hero!.offsetTop + hero!.offsetHeight - innerHeight;
      window.scrollTo({ top, behavior: 'auto' });
    }
  });

  new IntersectionObserver((entries) => {
    heroOnScreen = entries[0].isIntersecting;
    if (heroOnScreen) onScroll();
  }).observe(hero);

  // ---------- Chargement : affiche d'abord, puis la vidéo en Blob avec l'anneau ----------
  let started = false;
  function failVideo() {
    hero!.classList.add('video-failed');
  }

  async function loadHeroBlob() {
    if (!video || !src) return;
    const controller = new AbortController();
    let watchdog = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(src!, { signal: controller.signal, priority: 'low' } as RequestInit);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const total = Number(res.headers.get('Content-Length')) || bytesHint || SMALL_VIDEO;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let got = 0;
    let lastRing = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(watchdog);
      watchdog = setTimeout(() => controller.abort(), 20000);
      chunks.push(value);
      got += value.length;
      const frac = Math.min(1, got / total);
      const now = performance.now();
      if (now - lastRing > 100 || frac === 1) {
        lastRing = now;
        cue.style.setProperty('--ld', String(Math.round(RING * (1 - frac))));
      }
    }
    clearTimeout(watchdog);
    cue.style.setProperty('--ld', '0');
    video.src = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'video/mp4' }));
    const v = video;
    video.load();
    video.addEventListener(
      'canplay',
      () => {
        hero!.classList.add('video-ready');
        requestSeek(heroProgress() * v.duration);
      },
      { once: true },
    );
  }

  function startBlobFetch() {
    if (started) return;
    started = true;
    loadHeroBlob().catch(failVideo);
  }

  let initialised = false;
  function initHeroOnce() {
    if (initialised) return;
    initialised = true;
    // Sans vidéo, rien à télécharger : la scène dessinée joue le film.
    const poster = hero!.dataset.poster;
    if (hasVideo && poster) {
      posterLayer.style.backgroundImage = `url('${poster}')`;
      const img = new Image();
      img.onload = startBlobFetch;
      img.onerror = startBlobFetch;
      img.src = poster;
      setTimeout(startBlobFetch, 4000);
    } else if (hasVideo) {
      startBlobFetch();
    }
    // Découpage des textes en mots, une seule fois.
    hero!.querySelectorAll<HTMLElement>('.hook, .settle-title').forEach((el, i) => splitWords(el, 0.5, 7 + i));
  }

  // ---------- Bascule en direct entre accueil fixe et défilement vidéo ----------
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    hero!.classList.add('is-scrub', 'is-scene');
    if (!hasVideo) hero!.classList.add('scene-only');
    initHeroOnce();
    measureScene();
    loadStart = document.documentElement.classList.contains('is-loading') ? -1 : performance.now();
    bands.forEach((band) => {
      band.op = -1;
      band.k = -1;
    });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize, { passive: true });
    target = shown = heroProgress();
    updateScene(shown);
    updateCaptions(shown, performance.now());
    onScroll();
  }

  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onResize);
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    hero!.classList.remove('is-scrub', 'is-scene', 'scene-only', 'is-past-start');
    clearScene();
    measureScene();
    // Accueil fixe : tout le texte à son état final.
    bands.forEach((band) => {
      band.el.style.removeProperty('opacity');
      band.el.style.removeProperty('visibility');
      band.el.style.removeProperty('--k');
    });
  }

  function onResize() {
    // Le parc est recadré selon l'écran : on recalcule où se trouve la place vide.
    measureScene();
    updateScene(shown);
    onScroll();
  }

  function applyHeroMode() {
    if (MQLS.some((m) => m.matches)) disableScrub();
    else enableScrub();
  }

  // Les listes de requêtes restent référencées : certains anciens navigateurs perdaient sinon leurs écouteurs.
  const MQLS = GATES.map((q) => matchMedia(q));
  MQLS.forEach((m) => m.addEventListener('change', applyHeroMode));
  applyHeroMode();

  // Accueil fixe (téléphone, tablette, mouvement réduit) : le conteneur se range aussi
  // exactement dans sa place. On remesure quand la mise en page bouge (polices, rotation).
  measureScene();
  // Sa descente démarre quand le parc arrive à l'écran (sur téléphone, il est souvent plus bas).
  const yard = scene?.querySelector('.yard');
  if (scene && yard && 'IntersectionObserver' in window) {
    const seen = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        scene.classList.add('is-seen');
        seen.disconnect();
      },
      { threshold: 0.45 },
    );
    seen.observe(yard);
  } else {
    scene?.classList.add('is-seen');
  }
  addEventListener('resize', () => scrubOn || measureScene(), { passive: true });
  document.fonts?.ready.then(() => (scrubOn ? onResize() : measureScene()));
  addEventListener('load', () => (scrubOn ? onResize() : measureScene()), { once: true });
}
