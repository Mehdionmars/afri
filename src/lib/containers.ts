/**
 * Catalogue des conteneurs (src/content/containers.json) et silhouettes vues de côté,
 * dessinées à l'échelle pour les cartes « familles » et le comparateur.
 */
import catalog from '../content/containers.json';

export type Family = 'dry' | 'reefer' | 'openTop' | 'flatRack' | 'tank';

export interface ContainerFormat {
  id: string;
  family: Family;
  ft: number;
  /** Extérieur : longueur, largeur, hauteur (m). */
  ext: number[];
  /** Intérieur : longueur, largeur, hauteur (m), null pour la citerne. */
  int: number[] | null;
  /** Porte : largeur, hauteur (m). */
  door: number[] | null;
  volume: number | null;
  capacityL?: number;
  tare: number;
  maxGross: number;
  payload: number;
  pallets: number | null;
  temp?: number[];
}

export const formats = catalog.formats as ContainerFormat[];
export const families: Family[] = ['dry', 'reefer', 'openTop', 'flatRack', 'tank'];
export const byId = (id: string) => formats.find((f) => f.id === id)!;

const r = (n: number) => Math.round(n * 10) / 10;

/**
 * Vue de côté d'un conteneur à l'échelle `s` (px par mètre), en SVG.
 * Origine en haut à gauche ; renvoie le contenu d'un <g>.
 */
export function sideView(f: ContainerFormat, s: number): string {
  const L = r(f.ext[0] * s);
  const H = r(f.ext[2] * s);
  const post = r(0.16 * s); // montants d'angle
  const rail = r(0.1 * s); // longerons haut et bas
  const parts: string[] = [];
  const ribs = (x0: number, x1: number, y0: number, y1: number, color: string, step = 0.32) => {
    const lines: string[] = [];
    for (let x = x0 + step * s; x < x1 - step * s * 0.5; x += step * s) lines.push(`M${r(x)} ${y0}V${y1}`);
    return `<path d="${lines.join('')}" stroke="${color}" stroke-width="${r(Math.max(1, 0.05 * s))}" fill="none"/>`;
  };
  const frame = (fill: string, edge: string) =>
    `<rect x="0" y="0" width="${L}" height="${H}" rx="${r(0.04 * s)}" fill="${fill}" stroke="${edge}" stroke-width="${r(Math.max(1.2, 0.05 * s))}"/>` +
    `<rect x="0" y="0" width="${post}" height="${H}" fill="${edge}" opacity=".55"/>` +
    `<rect x="${r(L - post)}" y="0" width="${post}" height="${H}" fill="${edge}" opacity=".55"/>` +
    `<rect x="0" y="${r(H - rail)}" width="${L}" height="${rail}" fill="${edge}" opacity=".5"/>`;

  switch (f.family) {
    case 'dry': {
      parts.push(frame('#FFC342', '#0F2340'));
      parts.push(`<rect x="0" y="0" width="${L}" height="${rail}" fill="#0F2340" opacity=".45"/>`);
      parts.push(ribs(post, L - post, rail, H - rail, 'rgba(15, 35, 64,.28)'));
      // Barres de verrouillage des portes, côté droit.
      const bx = L - post - 0.35 * s;
      parts.push(`<path d="M${r(bx)} ${r(rail * 1.5)}V${r(H - rail * 1.5)}M${r(bx + 0.18 * s)} ${r(rail * 1.5)}V${r(H - rail * 1.5)}" stroke="#0B0B0C" stroke-width="${r(Math.max(1, 0.05 * s))}"/>`);
      break;
    }
    case 'reefer': {
      parts.push(frame('#FFFFFF', '#8B949E'));
      parts.push(ribs(post + 0.55 * s, L - post, rail, H - rail, 'rgba(15, 35, 64,.12)', 0.5));
      // Groupe froid à l'avant.
      const gx = post;
      const gw = r(0.55 * s);
      parts.push(`<rect x="${gx}" y="${r(rail * 1.4)}" width="${gw}" height="${r(H - rail * 2.8)}" fill="#3F4650"/>`);
      const grill: string[] = [];
      for (let y = rail * 2; y < H - rail * 2; y += 0.14 * s) grill.push(`M${r(gx + 0.06 * s)} ${r(y)}H${r(gx + gw - 0.06 * s)}`);
      parts.push(`<path d="${grill.join('')}" stroke="#8B949E" stroke-width="${r(Math.max(0.8, 0.03 * s))}"/>`);
      parts.push(`<circle cx="${r(gx + gw / 2)}" cy="${r(H * 0.32)}" r="${r(0.13 * s)}" fill="none" stroke="#FFC342" stroke-width="${r(Math.max(1, 0.04 * s))}"/>`);
      break;
    }
    case 'openTop': {
      const top = r(0.42 * s);
      parts.push(`<rect x="0" y="${top}" width="${L}" height="${r(H - top)}" rx="${r(0.04 * s)}" fill="#5E6670" stroke="#0B0B0C" stroke-width="${r(Math.max(1.2, 0.05 * s))}"/>`);
      parts.push(ribs(post, L - post, top + rail, H - rail, 'rgba(255,255,255,.14)'));
      parts.push(`<rect x="0" y="${top}" width="${post}" height="${r(H - top)}" fill="#0B0B0C" opacity=".6"/><rect x="${r(L - post)}" y="${top}" width="${post}" height="${r(H - top)}" fill="#0B0B0C" opacity=".6"/>`);
      // Bâche bombée et cordes.
      const q = r(L / 4);
      parts.push(`<path d="M0 ${top}Q${q} ${r(top - 0.5 * s)} ${r(L / 2)} ${r(top - 0.34 * s)}T${L} ${top}Z" fill="#FFC342" stroke="#0F2340" stroke-width="${r(Math.max(1, 0.04 * s))}"/>`);
      const ropes: string[] = [];
      for (let x = 0.6 * s; x < L - 0.4 * s; x += 1.2 * s) ropes.push(`M${r(x)} ${r(top - 0.22 * s)}V${r(top + 0.3 * s)}`);
      parts.push(`<path d="${ropes.join('')}" stroke="#0B0B0C" stroke-width="${r(Math.max(0.8, 0.03 * s))}" stroke-dasharray="${r(0.08 * s)} ${r(0.06 * s)}"/>`);
      break;
    }
    case 'flatRack': {
      const deck = r(0.42 * s);
      const wall = r(0.26 * s);
      parts.push(`<rect x="0" y="${r(H - deck)}" width="${L}" height="${deck}" fill="#0B0B0C"/>`);
      parts.push(`<rect x="0" y="0" width="${wall}" height="${H}" fill="#0B0B0C"/><rect x="${r(L - wall)}" y="0" width="${wall}" height="${H}" fill="#0B0B0C"/>`);
      parts.push(`<path d="M${wall} ${r(0.25 * s)}L${r(wall + 0.5 * s)} ${r(H - deck)}M${r(L - wall)} ${r(0.25 * s)}L${r(L - wall - 0.5 * s)} ${r(H - deck)}" stroke="#0B0B0C" stroke-width="${r(0.08 * s)}"/>`);
      // Colis lourd arrimé sur le plateau.
      const cw = r(L * 0.5);
      const ch = r((H - deck) * 0.62);
      const cx = r((L - cw) / 2);
      const cy = r(H - deck - ch);
      parts.push(`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="${r(0.06 * s)}" fill="#FFC342" stroke="#0F2340" stroke-width="${r(Math.max(1, 0.04 * s))}"/>`);
      parts.push(`<path d="M${cx} ${cy}L${r(cx - 0.5 * s)} ${r(H - deck)}M${r(cx + cw)} ${cy}L${r(cx + cw + 0.5 * s)} ${r(H - deck)}" stroke="#0F2340" stroke-width="${r(Math.max(0.8, 0.03 * s))}"/>`);
      break;
    }
    case 'tank': {
      const b = r(0.14 * s);
      parts.push(`<rect x="0" y="0" width="${L}" height="${H}" fill="none" stroke="#0B0B0C" stroke-width="${b}"/>`);
      parts.push(`<path d="M0 0L${r(0.7 * s)} ${H}M${L} 0L${r(L - 0.7 * s)} ${H}" stroke="#0B0B0C" stroke-width="${r(0.07 * s)}"/>`);
      const ty = r(0.28 * s);
      const th = r(H - 0.56 * s);
      parts.push(`<rect x="${r(0.45 * s)}" y="${ty}" width="${r(L - 0.9 * s)}" height="${th}" rx="${r(th / 2)}" fill="#DDE1E6" stroke="#8B949E" stroke-width="${r(Math.max(1, 0.04 * s))}"/>`);
      parts.push(`<path d="M${r(1 * s)} ${r(ty + th * 0.3)}H${r(L - 1 * s)}" stroke="#FFFFFF" stroke-width="${r(0.09 * s)}" stroke-linecap="round" opacity=".9"/>`);
      parts.push(`<rect x="${r(L / 2 - 0.2 * s)}" y="${r(ty - 0.18 * s)}" width="${r(0.4 * s)}" height="${r(0.2 * s)}" fill="#3F4650"/>`);
      break;
    }
  }
  return parts.join('');
}

/** Lignes du comparateur et du tableau. */
export type SpecKey = 'volume' | 'payload' | 'tare' | 'maxGross' | 'length' | 'width' | 'height' | 'door' | 'pallets' | 'temp';
export const specKeys: SpecKey[] = ['volume', 'payload', 'length', 'width', 'height', 'door', 'pallets', 'tare', 'maxGross', 'temp'];

export interface SpecWords {
  none: string;
  open: string;
  /** « à » / « to » entre deux températures. */
  to: string;
}

/** Valeur chiffrée d'une ligne (pour les barres et les écarts), ou null. */
export function specValue(f: ContainerFormat, key: SpecKey): number | null {
  switch (key) {
    case 'volume':
      return f.volume ?? (f.capacityL ? f.capacityL / 1000 : null);
    case 'length':
      return f.int?.[0] ?? null;
    case 'width':
      return f.int?.[1] ?? null;
    case 'height':
      return f.int?.[2] ?? null;
    case 'door':
    case 'temp':
      return null;
    default:
      return f[key] ?? null;
  }
}

/** Unité affichée d'une ligne chiffrée. */
export const specUnit: Record<SpecKey, string> = {
  volume: 'm³',
  payload: 'kg',
  tare: 'kg',
  maxGross: 'kg',
  length: 'm',
  width: 'm',
  height: 'm',
  door: 'm',
  pallets: '',
  temp: '°C',
};
export const specDigits: Record<SpecKey, number> = {
  volume: 1,
  payload: 0,
  tare: 0,
  maxGross: 0,
  length: 2,
  width: 2,
  height: 2,
  door: 2,
  pallets: 0,
  temp: 0,
};

/** Texte affiché pour une ligne, dans la langue de la page. */
export function specText(f: ContainerFormat, key: SpecKey, locale: string, words: SpecWords): string {
  const n = (v: number, d = specDigits[key]) => new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const unit = specUnit[key] ? ` ${specUnit[key]}` : '';
  if (key === 'door') return f.door ? `${n(f.door[0])} × ${n(f.door[1])} m` : f.family === 'flatRack' ? words.open : words.none;
  if (key === 'temp') {
    if (!f.temp) return words.none;
    const t = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}`;
    return `${t(f.temp[0])} ${words.to} ${t(f.temp[1])} °C`;
  }
  if (key === 'volume' && !f.volume) {
    if (f.capacityL) return `≈ ${n(f.capacityL, 0)} L`;
    return f.family === 'flatRack' ? words.open : words.none;
  }
  const v = specValue(f, key);
  if (v === null) return words.none;
  return `${key === 'payload' || key === 'volume' ? '≈ ' : ''}${n(v)}${unit}`;
}
