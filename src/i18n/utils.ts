import fr from '../content/fr.json';
import enJson from '../content/en.json';
import site from '../content/site.json';
import routeTable from '../content/routes.json';

// `typeof fr` force en.json à avoir exactement les mêmes clés que fr.json.
const en: typeof fr = enJson;

export const languages = { fr: 'Français', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';
export const langs = Object.keys(languages) as Lang[];

const dictionaries: Record<Lang, typeof fr> = { fr, en };

export function useTranslations(lang: Lang) {
  return dictionaries[lang];
}

/** Pages du site et leur chemin dans chaque langue (src/content/routes.json). */
export const routes = routeTable.pages satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Les six services, dans l'ordre de fr.json. Chacun a sa page. */
export type ServiceId = keyof typeof routeTable.services;
export const serviceIds = Object.keys(routeTable.services) as ServiceId[];

/** Adresse de la page d'un service dans chaque langue. */
export function serviceRoute(id: ServiceId): Record<Lang, string> {
  const slug = routeTable.services[id];
  return { fr: `${routes.services.fr}${slug.fr}/`, en: `${routes.services.en}${slug.en}/` };
}

export function isLang(value: string | undefined): value is Lang {
  return !!value && value in languages;
}

/** Remplace `{name}` dans une chaîne traduite. */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

/** Une valeur entre crochets est un espace réservé en attente du client. */
export function isPlaceholder(value: string | undefined | null) {
  return !value || value.trim().startsWith('[');
}

const intlLocale: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };

export function formatNumber(lang: Lang, value: number, fractionDigits = 0) {
  return new Intl.NumberFormat(intlLocale[lang], {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** « 18 % » en français (espace fine insécable), « 18% » en anglais. */
export function formatPercent(lang: Lang, value: number, signed = false) {
  const sign = signed && value > 0 ? '+' : '';
  return lang === 'fr' ? `${sign}${value} %` : `${sign}${value}%`;
}

/** Deux-points typographique : « Adresse : » en français, « Address: » en anglais. */
export function colon(lang: Lang) {
  return lang === 'fr' ? ' : ' : ': ';
}

/** « Longueur : 5,90 m » avec l'espace insécable avant les deux-points en français. */
export function labelValue(lang: Lang, label: string, value: string) {
  return lang === 'fr' ? `${label} : ${value}` : `${label}: ${value}`;
}

/** Lien WhatsApp « clic pour discuter » avec message prérempli, ou null tant que le numéro manque. */
export function whatsappLink(lang: Lang) {
  const raw = site.contact.whatsapp;
  const digits = raw.replace(/\D/g, '');
  if (isPlaceholder(raw) || digits.length < 9) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(dictionaries[lang].contact.whatsappMessage)}`;
}

export { site };
