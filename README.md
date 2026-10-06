# AFRIEXPORT CONSULTING, site vitrine FR / EN

Site vitrine bilingue d'AFRIEXPORT CONSULTING, cabinet de conseil en import-export basé au Maroc.
Quinze pages par langue : l'accueil (une page qui défile, avec ancres), les pages Services (une par service), Méthode, Pourquoi nous, Conteneurs, Résultats, et les trois pages légales.

- **Astro 7** (site 100 % statique) + **Tailwind CSS 4** + TypeScript
- Animations : **GSAP 3 + ScrollTrigger** (cdnjs) et **Lenis** pour le défilement doux (jsDelivr), synchronisés ; aucun autre framework côté client
- Direction **version 4** (6 octobre 2026) : fond clair, bleu marine, accent jaune, grotesque fine (Inter Tight), très grands titres, petits labels en capitales, losanges en dégradé jaune. Voir « Version 4 » plus bas et le dossier de création : [docs/design-package.md](docs/design-package.md)
- Conteneurs 3D en CSS pur (`transform-style: preserve-3d`), sans bibliothèque
- Maquette d'origine : `maquette/fr` et `maquette/en` (extraites de « AFRIEXPORT CONSULTING – Site web.html »)

## Pages du site

| Page | Français | Anglais |
|---|---|---|
| Accueil | `/fr/` | `/en/` |
| Services (les six, en photos) | `/fr/services/` | `/en/services/` |
| Une page par service | `/fr/services/etude-de-marche/`, `recherche-de-partenaires/`, `douane-et-reglementation/`, `logistique-internationale/`, `contrats-et-paiements/`, `formation-export/` | `/en/services/market-research/`, `partner-search/`, `customs-and-compliance/`, `international-logistics/`, `contracts-and-payments/`, `export-training/` |
| Méthode (4 étapes détaillées) | `/fr/methode/` | `/en/method/` |
| Pourquoi nous | `/fr/pourquoi-nous/` | `/en/why-us/` |
| Guide des conteneurs | `/fr/conteneurs/` | `/en/containers/` |
| Résultats | `/fr/resultats/` | `/en/results/` |
| Pages légales | `/fr/mentions-legales/`, `politique-de-confidentialite/`, `politique-de-cookies/` | `/en/legal-notice/`, `privacy-policy/`, `cookie-policy/` |

Les adresses sont définies une seule fois dans `src/content/routes.json` (liens, sélecteur FR | EN et sitemap s'en servent).

Chaque page intérieure a la même structure : en-tête avec la photo de la page en fond (voile noir et bleu marine côté texte, titre et introduction en blanc), sections, questions fréquentes quand c'est utile, puis le formulaire de contact. La route maritime du bord droit (ordinateur) reprend les sections de chaque page.

- **Page d'un service** : ce que nous faisons, pour qui, déroulé de la mission, livrables (présentés en étiquettes de fret), questions fréquentes, autres services.
- **Méthode** : une section et une photo par étape (ce que nous faisons, ce que vous apportez, ce que vous recevez, durée indicative), nos engagements, questions.
- **Pourquoi nous** : atouts détaillés, chiffre clé, réseau de partenaires, carte des routes depuis le Maroc, équipe (à fournir).
- **Conteneurs** : conteneurs secs en 3D (dont le 45 pieds) sur fond blanc, **à faire tourner** au glissé (souris ou doigt, avec un peu d'élan), aux flèches du clavier ou en double-cliquant pour revenir de face ; **cinq familles avec un zoom sur chacune** : sur ordinateur, la séquence reste fixe pendant le défilement, chaque famille passe au premier plan puis le dessin zoome (net, en recadrant le SVG) sur le détail qui la distingue, avec un index pour aller à une famille ; sur téléphone, chaque dessin zoome quand on le fait défiler ; **comparateur** (deux formats au choix, silhouettes à la même échelle, écarts ligne par ligne), tableau des 11 formats filtrable, **calculateur** « quel conteneur pour ma marchandise » (volume, poids ou palettes), **états** (neuf, Cargo Worthy, Wind and Watertight, en l'état) avec tableau comparatif et check-list d'achat, questions.
- **Résultats** : les quatre chiffres expliqués (ce qu'ils mesurent, comment), trois missions types illustrées, témoignages et secteurs (à fournir).

## Résultats mesurés

Lighthouse, build de production, le 6 octobre 2026 (version 4 : GSAP, ScrollTrigger et Lenis depuis les CDN) :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| `/fr/` mobile / ordinateur | 96 / 100 | 100 | 100 | 100 |
| `/fr/methode/` mobile / ordinateur | 95 / 99 | 100 | 100 | 100 |

LCP 2,5 s sur mobile simulé (0,6 s sur ordinateur), CLS inférieur à 0,005. Les trois bibliothèques (environ 135 Ko non compressés) sont en « defer » : elles ne bloquent pas l'affichage.

## Installation

Prérequis : **Node.js 22.19 ou plus récent** (ou Node 24 LTS).

```bash
npm install
cp .env.example .env      # puis remplir les valeurs (voir plus bas)
npm run dev               # http://localhost:4321/fr/
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement automatique |
| `npm run build` | Génère le site final dans `dist/` |
| `npm run preview` | Sert `dist/` en local pour vérifier le build |
| `npm run check` | Vérifie les types et que `en.json` a les mêmes clés que `fr.json` |
| `npm run export:apercu` | Crée l'aperçu à envoyer au client (fichiers HTML autonomes dans `apercu-client/`) |
| `node scripts/generate-assets.mjs` | Régénère favicon, icônes et images de partage (Open Graph) |

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `SITE_URL` | Adresse publique (ex. `https://www.afriexport-consulting.ma`). Sert aux balises canonical, hreflang, Open Graph et au sitemap. |
| `PUBLIC_WEB3FORMS_KEY` | Clé Web3Forms du formulaire. Elle désigne la boîte e-mail qui reçoit les messages. |
| `PUBLIC_GA_ID` | Identifiant Google Analytics 4 (`G-…`). Facultatif. Chargé seulement après accord du visiteur. |
| `PUBLIC_PREVIEW` | `1` pour un aperçu non indexable (noindex + robots.txt fermé). À laisser vide pour la vraie mise en ligne. |

Les variables sont lues **au moment du build** : après une modification, relancer `npm run build` (ou redéployer).

## Modifier les contenus

| Je veux changer… | Fichier |
|---|---|
| Un texte en français | `src/content/fr.json` |
| Un texte en anglais | `src/content/en.json` (mêmes clés que `fr.json`) |
| Adresse, téléphone, e-mail, WhatsApp, réseaux sociaux | `src/content/site.json` → `contact`, `social` |
| Les chiffres de la section Résultats | `src/content/site.json` → `stats` |
| Les trois conteneurs de l'accueil (dimensions, volume, charge, palettes) | `src/content/site.json` → `containers` |
| Les 11 formats du guide des conteneurs (comparateur, tableau, calculateur) | `src/content/containers.json` |
| Les textes des pages intérieures | `fr.json` / `en.json` → `servicesPage`, `serviceDetails`, `methodPage`, `whyPage`, `containersPage`, `resultsPage` |
| L'adresse d'une page | `src/content/routes.json` |
| Les crédits des photos | `src/content/photo-credits.json` (affichés en bas des mentions légales) |
| La vidéo de l'accueil | `public/hero/` + `src/content/site.json` → `heroVideo` (voir plus bas) |
| Les mentions légales, la politique de confidentialité ou de cookies | `src/content/legal/fr/*.md` et `src/content/legal/en/*.md` |
| Une photo | Déposer le fichier dans `src/assets/photos/` (voir ci-dessous) |
| Les couleurs ou la typographie | `tailwind.config.ts` (charte en 5 couleurs : blanc, noir, bleu marine, jaune, gris métal ; la palette par défaut de Tailwind est retirée) |

**Espaces réservés.** Toute valeur entre crochets (`[Adresse du cabinet]`, `[+212 …]`…) est un espace réservé : elle reste affichée telle quelle sur le site, comme dans la maquette, jusqu'à ce qu'on la remplace. Dès qu'une vraie valeur est saisie, le site s'adapte seul : le téléphone devient un lien `tel:`, l'e-mail un lien `mailto:`, le bouton WhatsApp ouvre la conversation, et les données structurées Google sont complétées.

**Numéro WhatsApp.** Format international, chiffres uniquement : `212612345678`.

### Photos

Le site utilise **20 photos sous licence libre** (CC0, CC BY, CC BY-SA), trouvées sur Wikimedia Commons, dont plusieurs prises au Maroc (Tanger Med, port de Casablanca, céramiques de Safi, orangers). Chaque photo est créditée (auteur, licence, lien) dans `src/content/photo-credits.json` ; la liste s'affiche automatiquement en bas des mentions légales, comme l'exigent les licences CC BY et CC BY-SA. Les photos montrant en gros des logos de compagnies maritimes ont été écartées.

Pour remplacer une photo par une photo du client, déposer le fichier dans `src/assets/photos/` **sous le même nom** (jpg, png, webp ou avif, 1600 px de large ou plus), puis supprimer son entrée dans `photo-credits.json`. Astro la convertit en AVIF et WebP en plusieurs tailles.

| Fichier | Emplacement |
|---|---|
| `services-etude-de-marche.jpg` … `services-formation.jpg` (6) | Les six services : accueil, page Services, page de chaque service |
| `methode-diagnostic.jpg`, `methode-strategie.jpg`, `methode-mise-en-oeuvre.jpg`, `methode-suivi.jpg` | Les quatre étapes : accueil et page Méthode |
| `pourquoi.jpg` | Section « Pourquoi nous » et en-tête de sa page |
| `page-services.jpg`, `page-methode.jpg`, `page-conteneurs.jpg`, `page-resultats.jpg` | En-têtes des pages intérieures |
| `mission-agro.jpg`, `mission-artisanat.jpg`, `mission-industrie.jpg` | Les trois missions types (page Résultats) |
| `etat-neuf.jpg`, `etat-occasion.jpg` | États des conteneurs (page Conteneurs) |

La liste complète est aussi dans `src/assets/photos/LISEZMOI.txt`. Les textes alternatifs sont dans `fr.json` / `en.json` (clés `photoAlt`).

### Le composant `<Container3D>`

```astro
<ContainerScene animation="spin" duration={16} startAngle={-30} class="absolute inset-0">
  <Container3D length={12.03} width={2.35} height={2.39} color="lemon" />
</ContainerScene>
```

- `length`, `width`, `height` : dimensions réelles en mètres ; `scale` : pixels par mètre (20 par défaut).
- `color` : `lemon`, `charcoal`, `silver` (couleurs exactes de la maquette) ou toute couleur CSS (`#1F7A4D`…), dont les nuances sont calculées automatiquement.
- `doorColor` : couleur des portes si elle diffère ; `x`, `y`, `z` : position dans la scène.
- `<ContainerScene>` gère la perspective et l'animation (`spin`, `swing` ou `none`). Les animations s'arrêtent hors écran, onglet caché, et avec « mouvement réduit ».

## Animations (GSAP + ScrollTrigger + Lenis)

Les trois bibliothèques sont chargées dans `src/layouts/BaseLayout.astro` en scripts « defer », depuis cdnjs (GSAP 3.15.0, ScrollTrigger) et jsDelivr (Lenis 1.3.26), avec leur empreinte d'intégrité (SRI) : un fichier modifié sur le CDN serait refusé par le navigateur. Tout le mouvement du site est dans **`src/scripts/site-motion.ts`**, et **toutes les valeurs à régler sont regroupées en haut du fichier** (objet `CONFIG`) : amorti de Lenis, scrub, décalages, durées d'épinglage, vitesses de parallaxe.

- **Lenis** lisse le défilement ; il est synchronisé avec ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` et `gsap.ticker`). Les liens d'ancre passent par Lenis, avec la hauteur de l'en-tête en décalage.
- **Sous 768 px** (`gsap.matchMedia`, l'équivalent actuel de `ScrollTrigger.matchMedia`) : ni épinglage, ni défilement horizontal ; les chiffres clés passent en grille de deux colonnes.
- **Mouvement réduit** : ni Lenis, ni animation au scroll ; tout est visible tout de suite.
- **Sans les CDN** (réseau bloqué) : le site reste complet et lisible, simplement sans animation.
- Les apparitions jouent sur l'opacité (pas sur `visibility`) : liens et champs restent atteignables au clavier avant d'être apparus.
- Pour mettre à jour une bibliothèque : changer la version dans l'URL **et** l'empreinte `integrity` (cdnjs l'affiche à côté de chaque fichier).

## Écran de chargement

À la première page d'une visite, un écran de chargement s'affiche : logo, conteneur jaune qui se remplit, puis l'écran se soulève et l'accueil commence son animation (`src/components/layout/PageLoader.astro`).

- Il reste au moins 0,9 s, et disparaît dès que la page et les polices sont prêtes (2,6 s au plus). En dernier recours, il s'efface seul après 4 s.
- Il ne réapparaît pas pendant la visite (passage FR ↔ EN, pages légales), et jamais avec « mouvement réduit ».
- Sans JavaScript, il s'efface seul et le conteneur de l'accueil est déjà à sa place.
- Impact mesuré : Performance 99 sur mobile (100 sans l'écran), 100 sur ordinateur.

## Bouton WhatsApp flottant

Un bouton WhatsApp rond est affiché en bas à droite de toutes les pages (`src/components/layout/WhatsAppFloat.astro`). Il ouvre une conversation avec le message prérempli de `fr.json` / `en.json` (`contact.whatsappMessage`). Tant que `contact.whatsapp` n'est pas renseigné dans `src/content/site.json`, il mène à la section Contact. Il apparaît après l'écran de chargement et, sur téléphone, s'efface tant que le bandeau cookies est ouvert.

## Demande de devis (Web3Forms)

Le formulaire de la section Contact est une demande de devis : prénom, nom, e-mail, téléphone, société, type d'opération (export, import, les deux), pays d'origine et de destination, service souhaité (les six services du site), type de conteneur (les formats du guide, plus le groupage), marchandise, volume estimé et précisions (1000 caractères, avec compteur). Les champs obligatoires portent une astérisque. Chaque champ a un libellé flottant : il occupe le champ vide, puis remonte en petit au-dessus de la saisie. Deux colonnes sur ordinateur et tablette, une seule sur téléphone.


1. Sur [web3forms.com](https://web3forms.com), saisir l'adresse e-mail qui doit recevoir les demandes : une clé d'accès arrive par e-mail.
2. Renseigner `PUBLIC_WEB3FORMS_KEY` dans `.env` ou chez l'hébergeur, puis rebuilder.
3. Pour changer de destinataire : générer une nouvelle clé avec la nouvelle adresse.

Cette clé est publique par conception (elle apparaît dans la page) ; elle ne permet que d'envoyer des messages vers l'adresse choisie. Le formulaire valide les champs côté navigateur, bloque les robots avec un champ piège (honeypot) et exige la case de consentement. Sans clé, il affiche un message d'erreur et l'explique dans la console.

## Cookies et mesure d'audience (loi 09-08, CNDP)

- Bandeau FR/EN : Tout accepter, Tout refuser, Personnaliser (nécessaires toujours actifs, mesure d'audience, marketing).
- **Aucun script Google n'est chargé avant le consentement.** Si le visiteur refuse ou retire son accord, la mesure est désactivée et les cookies `_ga` sont supprimés.
- Le choix est mémorisé dans `localStorage` (clé `afx-consent`) pendant 6 mois, puis redemandé.
- Le lien « Gérer les cookies » du pied de page rouvre le bandeau.
- Si la politique de cookies change, incrémenter `VERSION` dans `src/scripts/consent.ts` : le bandeau réapparaît pour tous.
- Aucun script marketing n'est installé. Pour en ajouter un plus tard, écouter l'événement `afx:consent` et ne le charger que si `marketing` vaut `true`.

## Envoyer un aperçu au client

```bash
npm run export:apercu
```

Cette commande crée le dossier `apercu-client/` : chaque page (30 au total) y devient **un fichier HTML autonome** (styles, polices, scripts et icônes intégrés), qui s'ouvre d'un double-clic, sans serveur ni connexion. Les photos sont rangées à côté, dans `images/` (une version WebP par photo, 3,3 Mo en tout). Les pages se renvoient entre elles (FR ↔ EN, pages intérieures, pages légales) et les outils de la page Conteneurs fonctionnent hors ligne. L'aperçu est construit en mode `apercu` (fichier `.env.apercu`) : pages en `noindex`, robots.txt fermé. Le dossier `dist/` est ensuite reconstruit normalement.

- Zipper le contenu du dossier (`AFRIEXPORT-apercu.zip`, environ 6,5 Mo) et l'envoyer par e-mail ou WhatsApp ; le client le décompresse **entièrement** (le dossier `images/` doit rester à côté des pages) et ouvre `AFRIEXPORT-apercu-FR.html`.
- Sur ordinateur, tout fonctionne hors ligne, y compris l'animation de l'accueil. Sur téléphone, l'ouverture d'un fichier HTML dépend de l'application : un lien en ligne (Netlify, par exemple) reste plus fiable pour un aperçu mobile.
- Tant que `PUBLIC_WEB3FORMS_KEY` n'est pas renseignée, le formulaire affiche un message d'erreur à l'envoi.

## Déploiement

Dans tous les cas, définir `SITE_URL`, `PUBLIC_WEB3FORMS_KEY` et éventuellement `PUBLIC_GA_ID` **avant** le build.

### Netlify

Relier le dépôt : `netlify.toml` fournit déjà la commande (`npm run build`), le dossier (`dist`), la redirection `/` → `/fr/`, le cache long des fichiers versionnés et les en-têtes de sécurité. Ajouter les variables dans *Site configuration › Environment variables*.

### Vercel

Importer le dépôt : `vercel.json` gère la redirection, le cache et les en-têtes. Ajouter les variables dans *Settings › Environment Variables*.

### Hébergeur marocain (mutualisé Apache / cPanel)

1. En local : remplir `.env`, puis `npm run build`.
2. Envoyer **le contenu** du dossier `dist/` (pas le dossier lui-même) dans `public_html/`, **y compris le fichier caché `.htaccess`**.
3. `.htaccess` force le HTTPS, redirige `/` vers `/fr/`, active la compression et le cache.

### Après la mise en ligne

- Déclarer le site dans Google Search Console et soumettre `https://<domaine>/sitemap-index.xml`.
- Tester un envoi réel du formulaire et vérifier la réception.
- Partager un lien sur WhatsApp ou LinkedIn pour vérifier l'aperçu (images `og-fr.jpg` / `og-en.jpg`).

## SEO et accessibilité en place

- `title` et `description` par langue, canonical, hreflang `fr` / `en` / `x-default`, Open Graph, `sitemap-index.xml` avec les alternatives de langue, `robots.txt`.
- Données structurées schema.org : `Organization`, `ProfessionalService` (avec le lien de chaque service), `WebSite`, `Service` sur chaque page de service, `FAQPage` sur les pages avec questions fréquentes.
- Maillage interne : menu et pied de page vers toutes les pages, liens « Voir le détail » depuis l'accueil, « Les autres services » en bas de chaque service.
- Un seul H1, un H2 par section, H3 pour les cartes. Lien d'évitement, focus visibles, cibles tactiles ≥ 44 px, contraste AA vérifié, libellés sur tous les champs, `prefers-reduced-motion` respecté même s'il change pendant la visite.
- Testé à 375 px, 768 px, 1280 px et 1440 px.

## Version 4 (6 octobre 2026) : refonte GSAP + Lenis

Tout le site est refait d'après un brief inspiré d'un site de transport (mise en page et animations), **avec les contenus d'AFRIEXPORT** et **sa charte en cinq couleurs** : le rouge du brief est remplacé par le jaune (ou le bleu marine quand le jaune ne serait pas lisible sur fond clair).

- **Direction** : fond clair (#EEF0F2), texte bleu marine, accent jaune ; **Inter Tight** (auto-hébergée, `@fontsource-variable/inter-tight`), titres en 300 de `clamp(40px, 6vw, 96px)` à interlignage serré ; **petit label en capitales** (13 px) au-dessus de chaque titre, précédé d'un losange jaune ; **losanges** décoratifs (carrés tournés à 45°, dégradé jaune vers transparent) ; boutons à contour arrondi.
- **En-tête** minimal : logo texte à gauche, menu (avec Contact), langue à droite, lien de la page courante en jaune (texte jaune sur fond sombre, soulignement jaune sur fond clair).
- **Accueil**, dans l'ordre :
  1. **Intro** : label, titre du client sur plusieurs lignes, texte en bas à droite. Les lignes montent de 10 px avec un fondu (déclenchement à « top 60% »), puis le contenu s'efface et remonte au scroll (scrub 0,2).
  2. **Chiffres clés** : section épinglée, six grands chiffres entre deux filets bleu marine, la rangée glisse vers la gauche pendant le défilement ; deux losanges jaunes traversent en sens inverse. Les quatre premiers chiffres sont **fictifs** (`src/content/site.json` → `stats`), les deux derniers décrivent le site (6 services, 11 formats de conteneurs).
  3. **Pourquoi nous** : texte, chiffre « 73 % » sur son coup de pinceau jaune, bouton à contour arrondi, photo d'équipe.
  4. **Bandeau des atouts** : les quatre atouts du client en texte géant en contour, qui glisse avec le scroll.
  5. **Méthode** : section épinglée, photo du terminal vue du ciel sous un voile bleu marine à 80 %, titre révélé ligne par ligne, puis les quatre étapes une par une.
  6. **Services** : titre épinglé à gauche, les six services en liste à droite (badge carré jaune avec icône), puis la section s'efface.
  7. **Conteneurs** : photo d'un camion et grand triangle jaune en parallaxe (deux vitesses), accès au guide.
  8. **Engagements** : deux photos décalées en parallaxe, les quatre engagements en texte sur deux colonnes.
  9. **Demande de devis**, puis le **pied de page bleu marine**, qui s'ouvre sur la grande bande « AFRIEXPORT » (capitales très fines blanches, globe jaune) qui défile seule vers la gauche ; pause au survol et hors de l'écran, immobile avec le mouvement réduit.
- **Pages intérieures** : même charte, label au-dessus de chaque titre, titre d'en-tête révélé ligne par ligne.
- **Retirés** : l'accueil vidéo et sa scène dessinée (`Hero`, `HeroScene`, `hero-scrub.ts` ; la clé `heroVideo` de `site.json` n'est plus utilisée), la galerie de services, les cartes de la méthode, la section Résultats épinglée et le bouton « Demander un rendez-vous » de l'en-tête. Ils restent dans l'historique git.
- **Gardés** : écran de chargement (1re page), voile blanc entre les pages, route maritime du bord droit (désormais pilotée via Lenis), demande de devis, cookies, WhatsApp, guide des conteneurs et ses outils.

## Version 2 : ce qui a changé par rapport à la maquette

La première version reproduisait la maquette à l'identique. Elle a été jugée trop « template », trop sombre et sans impact. La version 2 garde la charte (couleurs, typographie) et tous les contenus du client, mais refait la mise en page :

- **Fond clair** (Whisper White) et une seule section sombre (Résultats), pour le rythme.
- **Accueil cinématique** : film du conteneur jaune qui descend et se pose (à générer), avec les accroches « Exporter une fois, c'est un essai. » et « Exporter chaque mois, c'est un métier. ». En attendant, une scène dessinée en CSS. Les textes de l'accueil sont en très grandes capitales fines (Archivo Thin) : « IMPORT » à gauche et « & EXPORT » à droite, en escalier, puis la phrase du client, l'accroche et les boutons.
- **Bande AFRIEXPORT** en haut du pied de page : le nom en très grandes capitales fines blanches, séparé par le globe jaune du logo, qui défile seul vers la gauche. Pause au survol et hors de l'écran, immobile avec le mouvement réduit ; décorative, masquée aux lecteurs d'écran.
- **Passage entre les pages** : un voile blanc. Au clic sur un lien vers une autre page, il monte depuis le bas en blanchissant l'écran (0,45 s) ; sur la nouvelle page, il se lève vers le haut et la dévoile de bas en haut (0,75 s). La première page de la visite garde son écran de chargement. Rien avec le mouvement réduit, ni pour les ancres de la page en cours, les liens externes, téléphone, e-mail ou nouvel onglet (`src/scripts/page-transition.ts`, voile dans `BaseLayout.astro`).
- **Signe distinctif** : la route maritime sur le bord droit de l'écran, centrée en hauteur (à partir de 1280 px), avec un petit conteneur qui suit la lecture et des escales cliquables. Elle sert aussi de barre de défilement à la souris : on attrape le conteneur pour parcourir la page (il s'aimante aux escales), on clique sur la ligne pour y aller, et le nom de chaque escale s'affiche au survol.
- **Services** (accueil) : galerie en accordéon adaptée du composant « Hover Expand Gallery » de 21st.dev. Six bandes avec le nom du service écrit à l'horizontale ; celle qu'on survole s'ouvre sur sa photo, avec son nom, sa description et le lien vers sa page. Accordéon vertical (ouverture au clic) sous 1280 px, utilisable au clavier.
- **Méthode** (accueil) : adaptée du composant « How It Works » de 21st.dev. Quatre cartes épinglées avec la photo de chaque étape, inclinées en zigzag et reliées par une route en pointillés qui avance doucement, sur un fond ligné ; chaque carte mène à son étape sur la page Méthode. Cartes empilées sous 1024 px.
- **Pourquoi nous** (accueil) : adaptée du composant « Bold Stats » de 21st.dev. Le chiffre réel « 73 % » en très grand, sur un coup de pinceau jaune qui se peint de gauche à droite à son arrivée à l'écran (immédiat avec le mouvement réduit), avec sa phrase (enquête BEI 2025, à faire valider par le client), la photo du port à côté, puis un filet et les quatre arguments sur une ligne. Tout s'empile sur téléphone.
- **Conteneurs** : sélecteur interactif 20 DC / 40 DC / 40 HC (le conteneur 3D change de taille, les chiffres défilent), tableau comparatif, nouvelle donnée « palettes Europe au sol ».
- **Résultats** : quatre grands compteurs. Sur ordinateur (à partir de 1024 px de large et 600 px de haut), la section reste fixe à l'écran pendant qu'on descend, et la rangée de chiffres glisse vers la gauche au rythme du défilement, avec la carte du monde qui glisse plus lentement derrière ; rien ne bouge sans défilement. La course est calculée sur la largeur réelle de la rangée. Téléphone, tablette et mouvement réduit gardent la grille classique.
- **En-têtes photo des pages intérieures** : la photo occupe tout l'écran à l'arrivée.
- **Contact** : titre à gauche, accroche, coordonnées et WhatsApp à droite, puis la demande de devis sur toute la largeur, dans un cadre blanc.
- **Étiquettes** en IBM Plex Mono 500 (auto-hébergée, 15 Ko), comme des étiquettes de fret.
- Titres en poids 500, contraste AA vérifié, texte des champs en 16 px (pas de zoom automatique sur iPhone), polices auto-hébergées (aucune requête vers Google avant consentement).

## Version 3 (5 octobre 2026) : photos et pages intérieures

- **Photos partout** : 20 photos libres de droits, dont des vues du Maroc, sur l'accueil (services, chaque étape de la méthode, pourquoi nous) et sur toutes les pages intérieures.
- **Une page par rubrique** et **une page par service**, en français et en anglais ; le menu mène à ces pages, l'accueil garde son défilement et ses ancres.
- **Conteneurs** : guide complet avec 11 formats, comparateur à l'échelle, calculateur et états détaillés (quatre catégories, tableau, check-list).
- **Résultats** : chiffres expliqués et missions types.
- La route du bord droit se pilote aussi à la souris (glisser le conteneur, cliquer sur la ligne).

## Charte couleur (5 octobre 2026)

Le site n'utilise que cinq couleurs : **blanc** #FFFFFF, **noir** #0B0B0C, **bleu marine** #0F2340, **jaune** #FFC342, **gris métal** #8B949E, plus des nuances plus claires ou plus foncées de ces mêmes couleurs (fonds, traits, texte secondaire lisible, éclairage des conteneurs 3D). Tailwind est limité à cette palette. Les photos gardent leurs couleurs naturelles. Le bouton WhatsApp et les messages d'erreur du formulaire n'utilisent plus de vert ni de rouge : erreurs en noir avec un repère jaune. Tous les textes respectent le contraste AA (5,1:1 au minimum).

## Barre de navigation

Fixe en haut de l'écran, toujours visible et transparente, avec un léger flou derrière (sans couleur, qui s'estompe vers le bas). Version 4 : logo texte à gauche, rubriques au centre dont Contact (à partir de 1180 px de large, sinon menu « burger »), langue à droite. Lien de la page courante en jaune. Sur une section bleu marine ou noire, son texte passe en blanc pour rester lisible (`src/components/layout/Header.astro`).

## Éléments que le client doit encore fournir

1. **Coordonnées** : adresse complète, code postal, ville, téléphone, e-mail de contact, numéro WhatsApp.
2. **Adresse e-mail de réception** du formulaire (pour créer la clé Web3Forms), et validation des champs de la demande de devis (téléphone obligatoire, liste des services et des conteneurs).
3. **Photos** : le site est complet avec des photos libres de droits. Le client peut les remplacer par les siennes (équipe, bureaux, opérations réelles), surtout pour « Pourquoi nous » et l'équipe.
4. **Vrais chiffres** de la section Résultats : les valeurs actuelles (+7, 18 %, 12 pays, +15 %) sont **fictives**, ainsi que la période et le périmètre de mesure (affichés « [à préciser] » sur la page Résultats).
5. **Validation des données conteneurs** : les 11 formats du guide (dimensions, volumes, tares, charges, palettes) et les âges typiques des états sont des valeurs indicatives du marché.
6. **Validation du chiffre cité** dans « Pourquoi nous » (73 % des PME exportent, un tiers de façon régulière, enquête BEI 2025).
7. **Mentions légales** : raison sociale, forme juridique, capital, siège, RC, ICE, IF, patente, directeur de la publication, hébergeur.
8. **Données personnelles** : numéro de déclaration ou d'autorisation CNDP, durée de conservation des demandes, validation des transferts hors Maroc (Web3Forms, hébergeur, Google).
9. **Nom de domaine** (pour `SITE_URL`) et choix de l'hébergeur.
10. **Logo officiel** en vectoriel (SVG), s'il existe : le site reprend pour l'instant le pictogramme globe de la maquette.
11. *Facultatif* : identifiant Google Analytics 4, liens LinkedIn / Facebook / Instagram.
12. **Relecture des textes FR et EN**, et validation juridique des trois pages légales (ce sont des modèles).
13. **La vidéo de l'accueil** : à générer avec Higgsfield (voir le dossier de création). En attendant, la scène dessinée joue le film.
14. **Validation des textes des nouvelles pages** (rédigés à partir du métier, à confirmer par le cabinet) : contenu des six services (prestations, déroulé, livrables, questions), engagements de la méthode, réseau de partenaires.
15. **Durées indicatives** de chaque étape de la méthode (affichées « [… à confirmer] »).
16. **Zones et pays couverts** (page Pourquoi nous) et **secteurs accompagnés** (page Résultats), à valider.
17. **Équipe** : photo et présentation (parcours, spécialités, langues parlées).
18. **Témoignages clients** (deux ou trois, avec l'accord des clients) et, si possible, de vrais cas clients pour remplacer les trois missions types.
