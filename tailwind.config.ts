/**
 * Charte graphique AFRIEXPORT CONSULTING.
 * Chargé dans Tailwind 4 via `@config` (src/styles/global.css).
 * Les composants 3D importent aussi `brand` pour leurs couleurs.
 */
import type { Config } from 'tailwindcss';

/**
 * Charte couleur : cinq couleurs, et aucune autre.
 * Blanc, noir, bleu marine, jaune, gris métal.
 */
export const brand = {
  white: '#FFFFFF', // Blanc
  ink: '#0B0B0C', // Noir
  navy: '#0F2340', // Bleu marine
  yellow: '#FFC342', // Jaune
  metal: '#8B949E', // Gris métal
} as const;

/**
 * Nuances des mêmes couleurs (plus claires ou plus foncées, même teinte), pour les fonds,
 * les traits, le texte secondaire lisible (contraste AA) et l'éclairage des conteneurs 3D.
 */
export const shades = {
  'navy-light': '#1B3459', // marine éclairci : survols, cartes sur fond marine
  'metal-50': '#F5F6F8', // gris métal très clair : ciel de l'accueil
  'metal-100': '#EEF0F2', // gris métal clair : fonds de section
  'metal-200': '#DDE1E6', // traits, fonds de photo en attente
  'metal-300': '#B8C0C9', // texte secondaire sur fond marine ou noir
  'metal-600': '#5E6670', // texte secondaire sur fond clair (AA)
  'metal-700': '#3F4650', // texte courant atténué sur fond clair
  'yellow-light': '#FFD677', // dessus éclairé des conteneurs jaunes, survols
  'yellow-shade': '#E5AC33', // nervures des conteneurs jaunes
} as const;

export default {
  theme: {
    // `colors` hors de `extend` : la palette par défaut de Tailwind est retirée,
    // aucune classe ne peut produire une couleur hors charte.
    colors: { transparent: 'transparent', current: 'currentColor', inherit: 'inherit', ...brand, ...shades },
    extend: {
      fontFamily: {
        // Grotesque fine (Inter Tight, auto-hébergée via @fontsource-variable/inter-tight).
        sans: ['"Inter Tight Variable"', '"Inter Tight"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        // Étiquettes de fret, codes et escales.
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Titres très grands, fins (300) et serrés : clamp(40px, 6vw, 96px).
        display: ['clamp(40px, 6vw, 96px)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        hook: ['clamp(2rem, 1rem + 3.6vw, 4.25rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        mega: ['clamp(3.5rem, 2rem + 4.6vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.045em' }],
        label: ['13px', { lineHeight: '1.3', letterSpacing: '0.14em' }],
        'h2-xl': ['clamp(40px, 6vw, 96px)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        'h2-lg': ['clamp(36px, 4.6vw, 76px)', { lineHeight: '1.02', letterSpacing: '-0.032em' }],
        'h2-md': ['clamp(32px, 3.8vw, 60px)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        h2: ['clamp(30px, 3.2vw, 52px)', { lineHeight: '1.08', letterSpacing: '-0.028em' }],
        'h3-xl': ['clamp(1.625rem, 1.3rem + 1vw, 2.125rem)', { lineHeight: '1.1', letterSpacing: '-0.024em' }],
        'h3-lg': ['clamp(1.5rem, 1.25rem + 0.8vw, 1.875rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h3: ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.012em' }],
        stat: ['clamp(3.25rem, 2.4rem + 2.6vw, 4.75rem)', { lineHeight: '1', letterSpacing: '-0.026em' }],
        lead: ['clamp(1.0625rem, 0.98rem + 0.35vw, 1.1875rem)', { lineHeight: '1.6' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.3', letterSpacing: '0.15em' }],
      },
      maxWidth: {
        page: '1240px',
        wide: '1320px',
      },
      borderRadius: {
        tile: '12px',
        card: '18px',
        panel: '20px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.2, .7, .2, 1)',
        'in-out': 'cubic-bezier(.65, 0, .35, 1)',
      },
      boxShadow: {
        lift: '0 28px 56px -28px rgba(0, 0, 0, .45)',
        btn: '0 12px 28px -12px rgba(0, 0, 0, .45)',
        pop: '0 20px 60px -20px rgba(0, 0, 0, .6)',
      },
    },
  },
} satisfies Config;
