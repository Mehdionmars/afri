import type { ImageMetadata } from 'astro';

/**
 * Photos du site. Pour remplacer un espace réservé, déposez une image dans
 * src/assets/photos/ avec le nom attendu (par exemple `pourquoi.jpg`).
 * Formats acceptés : jpg, jpeg, png, webp, avif. Astro la convertit en AVIF/WebP.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase();
  byName.set(name, mod.default);
}

export function getPhoto(key: string): ImageMetadata | undefined {
  return byName.get(key.toLowerCase());
}

/** Noms de fichiers attendus, repris dans le README et dans src/assets/photos/LISEZMOI.txt. */
export const PHOTO_KEYS = [
  'services-etude-de-marche',
  'services-partenaires',
  'services-douane',
  'services-logistique',
  'services-contrats',
  'services-formation',
  'methode-diagnostic',
  'methode-strategie',
  'methode-mise-en-oeuvre',
  'methode-suivi',
  'pourquoi',
  'page-services',
  'page-methode',
  'page-conteneurs',
  'page-resultats',
  'mission-agro',
  'mission-artisanat',
  'mission-industrie',
  'etat-neuf',
  'etat-occasion',
] as const;
