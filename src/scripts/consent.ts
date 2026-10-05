/**
 * Consentement aux cookies (loi 09-08, recommandations CNDP).
 * - Aucun script de mesure n'est chargé avant un accord explicite.
 * - Le choix est mémorisé dans localStorage et redemandé après 6 mois.
 * - Le lien « Gérer les cookies » du pied de page rouvre le bandeau.
 */

const STORAGE_KEY = 'afx-consent';
const VERSION = 1; // à incrémenter si la politique de cookies change : le bandeau réapparaît
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const GA_ID = import.meta.env.PUBLIC_GA_ID as string | undefined;

export interface Consent {
  v: number;
  date: string;
  analytics: boolean;
  marketing: boolean;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    afxConsent?: Consent | null;
    [key: `ga-disable-${string}`]: boolean;
  }
}

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const consent = JSON.parse(raw) as Consent;
    if (consent.v !== VERSION) return null;
    if (Date.now() - Date.parse(consent.date) > MAX_AGE_MS) return null;
    return consent;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, marketing: boolean): Consent {
  const consent: Consent = { v: VERSION, date: new Date().toISOString(), analytics, marketing };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Stockage indisponible (navigation privée stricte) : le choix vaut pour cette visite.
  }
  return consent;
}

let gaLoaded = false;

function loadAnalytics() {
  if (!GA_ID) return;
  window[`ga-disable-${GA_ID}`] = false;
  if (gaLoaded) return;
  gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag attend l'objet `arguments` lui-même.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // Cookies Google Analytics limités à 13 mois, comme annoncé dans la politique de cookies.
  window.gtag('config', GA_ID, { anonymize_ip: true, cookie_expires: 60 * 60 * 24 * 395 });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

function disableAnalytics() {
  if (!GA_ID) return;
  window[`ga-disable-${GA_ID}`] = true;
  const domain = location.hostname.replace(/^www\./, '');
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (name === '_ga' || name === '_gid' || name.startsWith('_ga_')) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
    }
  }
}

function applyConsent(consent: Consent) {
  window.afxConsent = consent;
  if (consent.analytics) loadAnalytics();
  else disableAnalytics();
  // Point d'accroche pour de futurs scripts marketing : écouter `afx:consent`.
  window.dispatchEvent(new CustomEvent('afx:consent', { detail: consent }));
}

export function initConsent() {
  const banner = document.querySelector<HTMLElement>('[data-cookie-banner]');
  if (!banner) return;

  const prefs = banner.querySelector<HTMLElement>('[data-cookie-prefs]')!;
  const customise = banner.querySelector<HTMLButtonElement>('[data-cookie-customise]')!;
  const save = banner.querySelector<HTMLButtonElement>('[data-cookie-save]')!;
  const analytics = banner.querySelector<HTMLInputElement>('[data-consent="analytics"]')!;
  const marketing = banner.querySelector<HTMLInputElement>('[data-consent="marketing"]')!;
  const status = document.querySelector<HTMLElement>('[data-cookie-status]');
  let returnFocus: HTMLElement | null = null;

  const showPrefs = (show: boolean) => {
    prefs.hidden = !show;
    save.hidden = !show;
    customise.hidden = show;
    customise.setAttribute('aria-expanded', String(show));
  };

  const open = (withPrefs: boolean, fromUser: boolean) => {
    const current = readConsent();
    analytics.checked = current?.analytics ?? false;
    marketing.checked = current?.marketing ?? false;
    showPrefs(withPrefs);
    banner.classList.toggle('no-delay', fromUser);
    banner.hidden = false;
    if (fromUser) banner.focus();
  };

  const close = (consent: Consent) => {
    applyConsent(consent);
    banner.hidden = true;
    if (status) {
      status.textContent = '';
      requestAnimationFrame(() => (status.textContent = status.dataset.saved ?? ''));
    }
    returnFocus?.focus();
    returnFocus = null;
  };

  banner.querySelector('[data-cookie-accept]')!.addEventListener('click', () => close(saveConsent(true, true)));
  banner.querySelector('[data-cookie-reject]')!.addEventListener('click', () => close(saveConsent(false, false)));
  customise.addEventListener('click', () => {
    showPrefs(true);
    analytics.focus();
  });
  save.addEventListener('click', () => close(saveConsent(analytics.checked, marketing.checked)));

  banner.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && returnFocus) {
      banner.hidden = true;
      returnFocus.focus();
      returnFocus = null;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', () => {
      returnFocus = button;
      open(true, true);
    });
  });

  const existing = readConsent();
  if (existing) applyConsent(existing);
  else open(false, false);
}
