# AFRIEXPORT CONSULTING, site vitrine FR / EN

Site vitrine bilingue d'AFRIEXPORT CONSULTING, cabinet de conseil en import-export basé au Maroc.
Quinze pages par langue : l'accueil (une page qui défile, avec ancres), les pages Services (une par service), Méthode, Pourquoi nous, Conteneurs, Résultats, et les trois pages légales.

- **Astro 7** (site 100 % statique) + **Tailwind CSS 4** + TypeScript
- Aucun framework JavaScript côté client, seulement de petits scripts
- Direction **cinématique et claire** (version 2, validée le 2 octobre 2026) : accueil où une vidéo avance au scroll, route maritime dans la marge, sélecteur de conteneurs interactif. Toutes les décisions sont dans le dossier de création : [docs/design-package.md](docs/design-package.md)
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
- **Conteneurs** : conteneurs secs en 3D (dont le 45 pieds), cinq familles illustrées à l'échelle, **comparateur** (deux formats au choix, silhouettes à la même échelle, écarts ligne par ligne), tableau des 11 formats filtrable, **calculateur** « quel conteneur pour ma marchandise » (volume, poids ou palettes), **états** (neuf, Cargo Worthy, Wind and Watertight, en l'état) avec tableau comparatif et check-list d'achat, questions.
- **Résultats** : les quatre chiffres expliqués (ce qu'ils mesurent, comment), trois missions types illustrées, témoignages et secteurs (à fournir).

## Résultats mesurés

Lighthouse, build de production, le 5 octobre 2026 (avec les photos) :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| `/fr/` mobile / ordinateur | 98 / 99 | 100 | 100 | 100 |
| `/fr/conteneurs/` mobile / ordinateur | 99 / 100 | 100 | 100 | 100 |
| `/fr/services/etude-de-marche/` mobile | 99 | 100 | 100 | 100 |
| `/fr/methode/` mobile | 100 | 100 | 100 | 100 |
| `/fr/pourquoi-nous/`, `/fr/resultats/`, `/en/services/` mobile | 99 | 100 | 100 | 100 |

LCP entre 1,5 et 2,1 s sur mobile simulé (0,4 s sur ordinateur), CLS 0 partout. La vidéo de l'accueil, quand elle sera branchée, n'est jamais téléchargée sur téléphone ; sur ordinateur, elle arrive en arrière-plan, derrière un anneau de chargement.

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

## L'accueil cinématique (vidéo au scroll)

Tant qu'aucune vidéo n'est configurée, c'est la **scène dessinée en CSS** qui joue le film. Le conteneur jaune porte le sigle AFRIEXPORT ; il descend en 3D en se balançant, pivote pour se présenter de face et **se range dans la place vide du parc, exactement au format de ses voisins** (le parc est dessiné aux proportions réelles des 20 et 40 pieds, et le script mesure la place sur chaque écran). Le câble se détache et un peu de poussière se soulève à l'atterrissage.

- Ordinateur : la descente suit le scroll.
- Téléphone et tablette : il descend tout seul quand le parc arrive à l'écran.
- « Mouvement réduit » ou sans JavaScript : il est directement à sa place.

Quand la vidéo est branchée, elle prend le relais sur ordinateur : elle avance quand on descend et recule quand on remonte. Sur téléphone et avec « mouvement réduit », l'accueil reste fixe (scène dessinée, ou image de fin du film si elle est fournie).

Le moteur (`src/scripts/hero-scrub.ts`) suit le standard du skill 10k websites : vidéo chargée entièrement en mémoire avec anneau de progression, lissage indépendant de la fréquence d'écran, une seule recherche à la fois dans la vidéo, cinq conditions d'accueil fixe identiques en CSS et en JS et réévaluées en direct, page complète même si la vidéo échoue. Il a été vérifié dans Chrome avec une vidéo de test.

**Brancher la vidéo** (après validation du film) :

1. Ré-encoder la vidéo validée avec une image clé toutes les 8 images (indispensable pour un défilement fluide), puis extraire l'affiche et l'image de fin :
   ```bash
   ffmpeg -i brut.mp4 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an public/hero/hero-scrub.mp4
   ffmpeg -i public/hero/hero-scrub.mp4 -frames:v 1 -q:v 2 public/hero/hero-poster.jpg
   ffmpeg -sseof -0.1 -i public/hero/hero-scrub.mp4 -update 1 -frames:v 1 -q:v 2 public/hero/hero-ending.jpg
   ```
2. Renseigner `src/content/site.json` :
   ```json
   "heroVideo": { "src": "/hero/hero-scrub.mp4", "poster": "/hero/hero-poster.jpg", "ending": "/hero/hero-ending.jpg", "bytes": 6200000 }
   ```
   `bytes` est la taille réelle du fichier : elle sert à l'anneau de chargement si l'hébergeur ne l'indique pas.
3. Régler les plages des trois bandes de texte (`data-a` / `data-b` dans `src/components/sections/Hero.astro`) et l'intensité des voiles sur les vraies images, puis vérifier la lisibilité sur l'image la plus défavorable de chaque bande.

## Écran de chargement

À la première page d'une visite, un écran de chargement s'affiche : logo, conteneur jaune qui se remplit, puis l'écran se soulève et l'accueil commence son animation (`src/components/layout/PageLoader.astro`).

- Il reste au moins 0,9 s, et disparaît dès que la page et les polices sont prêtes (2,6 s au plus). En dernier recours, il s'efface seul après 4 s.
- Il ne réapparaît pas pendant la visite (passage FR ↔ EN, pages légales), et jamais avec « mouvement réduit ».
- Sans JavaScript, il s'efface seul et le conteneur de l'accueil est déjà à sa place.
- Impact mesuré : Performance 99 sur mobile (100 sans l'écran), 100 sur ordinateur.

## Bouton WhatsApp flottant

Un bouton WhatsApp rond est affiché en bas à droite de toutes les pages (`src/components/layout/WhatsAppFloat.astro`). Il ouvre une conversation avec le message prérempli de `fr.json` / `en.json` (`contact.whatsappMessage`). Tant que `contact.whatsapp` n'est pas renseigné dans `src/content/site.json`, il mène à la section Contact. Il apparaît après l'écran de chargement et, sur téléphone, s'efface tant que le bandeau cookies est ouvert.

## Formulaire de contact (Web3Forms)

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

## Version 2 : ce qui a changé par rapport à la maquette

La première version reproduisait la maquette à l'identique. Elle a été jugée trop « template », trop sombre et sans impact. La version 2 garde la charte (couleurs, typographie) et tous les contenus du client, mais refait la mise en page :

- **Fond clair** (Whisper White) et une seule section sombre (Résultats), pour le rythme.
- **Accueil cinématique** : film du conteneur jaune qui descend et se pose (à générer), avec les accroches « Exporter une fois, c'est un essai. » et « Exporter chaque mois, c'est un métier. ». En attendant, une scène dessinée en CSS.
- **Signe distinctif** : la route maritime sur le bord droit de l'écran, centrée en hauteur (à partir de 1280 px), avec un petit conteneur qui suit la lecture et des escales cliquables. Elle sert aussi de barre de défilement à la souris : on attrape le conteneur pour parcourir la page (il s'aimante aux escales), on clique sur la ligne pour y aller, et le nom de chaque escale s'affiche au survol.
- **Services** (accueil) : galerie en accordéon adaptée du composant « Hover Expand Gallery » de 21st.dev. Six bandes avec le nom du service écrit à l'horizontale ; celle qu'on survole s'ouvre sur sa photo, avec son nom, sa description et le lien vers sa page. Accordéon vertical (ouverture au clic) sous 1280 px, utilisable au clavier.
- **Méthode** (accueil) : adaptée du composant « How It Works » de 21st.dev. Quatre cartes épinglées avec la photo de chaque étape, inclinées en zigzag et reliées par une route en pointillés qui avance doucement, sur un fond ligné ; chaque carte mène à son étape sur la page Méthode. Cartes empilées sous 1024 px.
- **Pourquoi nous** (accueil) : adaptée du composant « Bold Stats » de 21st.dev. Le chiffre réel « 73 % » en très grand avec sa phrase (enquête BEI 2025, à faire valider par le client), la photo du port à côté, puis un filet et les quatre arguments sur une ligne. Tout s'empile sur téléphone.
- **Conteneurs** : sélecteur interactif 20 DC / 40 DC / 40 HC (le conteneur 3D change de taille, les chiffres défilent), tableau comparatif, nouvelle donnée « palettes Europe au sol ».
- **Résultats** : quatre grands compteurs.
- **Contact** : coordonnées sur le fond clair de la page, formulaire blanc à côté.
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

Fixe en haut de l'écran, toujours visible et transparente, avec un léger flou derrière (sans couleur, qui s'estompe vers le bas) pour que le texte qui passe dessous ne gêne pas le menu. Elle ne bouge pas et ne change pas de fond pendant le défilement. Logo à gauche, rubriques au centre (à partir de 1440 px de large, sinon menu « burger »), langue et « Demander un rendez-vous » à droite. Sur une section bleu marine ou noire, son texte passe en blanc pour rester lisible (`src/components/layout/Header.astro`).

## Éléments que le client doit encore fournir

1. **Coordonnées** : adresse complète, code postal, ville, téléphone, e-mail de contact, numéro WhatsApp.
2. **Adresse e-mail de réception** du formulaire (pour créer la clé Web3Forms).
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
