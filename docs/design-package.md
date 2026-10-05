# Dossier de création : AFRIEXPORT CONSULTING, version cinématique

Version 1, 2 octobre 2026. Niveau 1 du skill 10k websites : un seul plan de 6 secondes défilé au scroll.
Tout texte entre guillemets dans ce dossier part tel quel sur le site. Les plages de scroll sont des points de départ, validés ensuite par le test des coups de molette.

## 1. L'idée de marque

**« À la bonne place. »** Un conteneur jaune descend et se pose exactement dans sa place sur le quai. C'est ce que fait AFRIEXPORT pour ses clients : le bon marché, le bon partenaire, le bon document, au bon moment.

La recherche donne l'angle : 73 % des PME marocaines exportent, mais un tiers seulement de façon régulière (enquête BEI, 150 PME, 2025). Les freins cités : « la complexité des procédures douanières », « le coût du transport », la difficulté à « établir des partenariats commerciaux ». Le site vend un passage : **d'un export ponctuel à des échanges réguliers.** Chaque section sert cette idée, et toutes mènent à une seule action : parler à un consultant.

Ressenti visé : énergie et efficacité. Phrases courtes, chiffres concrets, mouvements nets.

## 2. Palette (charte du client, éclaircie)

Le site passe d'un fond sombre à un fond clair et lumineux, accordé au plein jour du film. La charte ne change pas.

```css
:root{
  --canvas:#F4F2EE;        /* Whisper White : fond de page, jamais de blanc pur */
  --panel:#FFFFFF;         /* cartes et surfaces posées sur le fond */
  --accent:#FFC342;        /* Ripe Lemon : appel à l'action et rares accents */
  --accent-hover:#FFB41F;
  --accent-muted:rgba(255,195,66,.35);
  --text-secondary:#5A5A5A;/* Graphite */
  --text-primary:#2E2E2E;  /* Charcoal Black */
  --line:#E1E1E1;          /* Silver Cloud */
  --band-dark:#2E2E2E;     /* une seule section sombre (Résultats), pour le rythme */
}
```

Les valeurs exactes du voile sous les textes du film seront calées sur les vraies images, une fois la vidéo validée.

## 3. Typographie

- **Titres** : Helvetica Neue, puis Archivo (charte), poids 500, approche serrée (-0,02 à -0,035 em).
- **Texte courant** : même famille, poids 400.
- **Étiquettes** : IBM Plex Mono 500, en petites capitales espacées. Elle reprend le monde des étiquettes de fret et des codes de conteneurs (« AFXU 2026 01 »). Auto-hébergée, seulement le poids utilisé.

## 4. Le film, plan par plan

**Plan** : plein jour, ciel clair légèrement voilé. Un conteneur maritime jaune, suspendu à quatre câbles tendus, descend lentement et en ligne droite au centre de l'image. Il passe devant des piles de conteneurs gris et blancs, nets au premier plan et flous au loin. Il se pose exactement dans un emplacement vide sur le quai. Les câbles se détendent, une légère poussière se soulève, puis tout s'immobilise.

**Image de départ** : le conteneur en haut du cadre, au centre. Le ciel occupe les deux tiers, et les piles de conteneurs remplissent le bas d'un bord à l'autre. Aucun texte, aucun logo, aucune inscription.

**Fin** : le conteneur posé au centre bas du cadre, avec de la marge au-dessus pour le menu et du ciel calme à gauche et à droite pour les textes.

| Bande | Plage (départ) | Ce que montre la vidéo | Texte (tel quel) | Entrée |
|---|---|---|---|---|
| 1 | 0,00 à 0,28 | Conteneur haut dans le ciel, câbles tendus | FR « Exporter une fois, c'est un essai. » / EN « Exporting once is a test. » | Descente : les mots tombent en place, comme le conteneur |
| 2 | 0,34 à 0,62 | Il passe devant les piles, la vitesse se sent | FR « Exporter chaque mois, c'est un métier. » / EN « Exporting every month is a business. » | Mots qui frappent avec un léger rebond |
| 3 (arrivée) | 0,70 à 1,00 | Il se pose, la poussière retombe, tout s'arrête | Sur-titre FR « Conseil en import-export · Maroc » / EN « Import-export consulting · Morocco ». H1 du client : FR « Développez vos échanges entre le Maroc, l'Afrique et le monde » / EN « Grow your trade between Morocco, Africa and the world ». Texte d'intro et deux boutons du client, inchangés. | Montée mot à mot, puis le texte, puis les boutons |

Hauteur de l'accueil : environ 400 vh de scroll. Les textes 1 et 2 se placent à gauche et à droite du couloir central où descend le conteneur (voile à deux côtés, le centre reste lumineux).

**Coût** : image de départ 2,75 crédits ; vidéo 6 s 1080p au modèle choisi (Kling 3.0 : 10,5 ; Grok Video 1.5 : 48 ; Seedance 2.5 : 72) ; 8 photos dans le même univers, environ 22. Total avec Kling 3.0 et une nouvelle tentative de réserve : environ 46 crédits.

## 5. Accueil fixe (téléphones, mouvement réduit)

L'image de fin du film en fond, avec le sur-titre, le H1, le texte d'intro et les deux boutons de la bande 3. Sur téléphone, aucun fichier vidéo n'est téléchargé.

Tant que la vidéo n'existe pas, l'accueil fixe utilise une scène dessinée en CSS : ciel clair en dégradé et conteneur jaune 3D suspendu. La page est donc complète et belle dès maintenant, même sans le film.

## 6. La page sous le film

Aucune section ne reprend la mise en page de sa voisine.

**Le signe distinctif : la route.** Sur ordinateur, un fin trait vertical, centré en hauteur sur le bord droit, figure une ligne maritime. Ses escales sont les sections (Accueil, Services, Méthode, Pourquoi, Conteneurs, Résultats, Contact), en étiquettes mono. Un petit conteneur jaune glisse le long du trait pendant la lecture, et un clic sur une escale y amène. À la souris, la route sert aussi de barre de défilement : le conteneur se glisse (il s'aimante aux escales), un clic sur la ligne y amène, le nom de l'escale s'affiche au survol. Masqué sur mobile.

1. **Services**, en liste éditoriale (fini les six cartes) : six lignes numérotées en grand, chacune avec son titre et ses trois mots. La photo du service apparaît en grand au survol ou au focus sur ordinateur, et en vignette sur mobile.
   Titre « Nos services ». Sous-titre FR « Six métiers, un seul interlocuteur. » / EN « Six skills, one point of contact. »
2. **Notre méthode** : une route horizontale à quatre escales sur fond clair, tracée au scroll, avec les quatre étapes du client.
   Sous-titre FR « À chaque étape, vous savez ce qui est fait, par qui, et quand. » / EN « At every step, you know what is done, by whom, and when. »
3. **Pourquoi nous** (reprise le 6 octobre 2026 d'après « Bold Stats » de 21st.dev) : le chiffre réel en très grand avec sa phrase, la photo du port à droite, puis un filet et les quatre arguments du client sur une ligne.
   FR « 73 % des PME marocaines exportent. Un tiers seulement le font de façon régulière. » / EN « 73% of Moroccan SMEs export. Only a third do it regularly. »
   Source en petit : FR « Enquête BEI auprès de 150 PME exportatrices, 2025 » / EN « EIB survey of 150 exporting SMEs, 2025 ».
   Suite : FR « Nous aidons les autres à passer le cap. » / EN « We help the others make the leap. »
4. **Conteneurs**, le moment interactif : un sélecteur 20 DC / 40 DC / 40 HC. Le conteneur 3D jaune s'allonge ou se rehausse en direct, et les chiffres défilent jusqu'à leur valeur (dimensions, volume, charge, palettes). Le visiteur fait lui-même le geste de la marque : choisir la bonne place.
   Titre FR « Le bon conteneur, dès le départ » / EN « The right container from the start » (sur-titre « Conteneurs maritimes · Dimensions »).
   Nouvelle ligne de données FR « Palettes Europe au sol : 11 / 24 / 24 » / EN « Euro pallets on the floor: 11 / 24 / 24 » (indicatif, à valider par le client).
   États « Neuf (One Way) » et « Cargo Worthy (CW) » en deux pastilles sous le sélecteur.
   Avec mouvement réduit, le changement est instantané.
5. **Résultats** : la seule section sombre, pour le rythme. Les quatre chiffres en très grand, avec un compteur qui monte à l'arrivée. Ils restent fictifs tant que le client ne les fournit pas.
6. **Contact** : coordonnées et WhatsApp sur le fond clair de la page à gauche (sans panneau coloré, à la demande du client), formulaire blanc à droite. Textes et champs du client inchangés.
7. **Pied de page** : inchangé, avec les mentions légales et « Gérer les cookies ».

Une touche vivante discrète par section : le trait de la route qui respire, un léger reflet sur le conteneur du sélecteur, une poussière lumineuse très lente dans l'accueil fixe. Tout s'arrête avec le mouvement réduit.

## 7. Couche vectorielle

- La route de la marge gauche et la route de la Méthode, en SVG, tracées au scroll.
- Les étiquettes mono des escales.
- Le petit conteneur jaune, en SVG.
- Tout est décoratif (`aria-hidden`). Avec mouvement réduit, tout s'affiche directement à son état final.

## 8. Règles techniques (skill 10k websites)

- Vidéo chargée en entier en mémoire (Blob), avec un anneau de chargement si elle dépasse 8 Mo, et un minuteur de sécurité.
- Temps affiché lissé indépendamment de la fréquence d'écran, recherches dans la vidéo jamais superposées, écritures dans la page seulement quand une valeur change.
- Bandes de texte réglées en distance de scroll, avec le voile à quatre couches et un contrôle de contraste sur l'image la plus défavorable (3,5:1 minimum).
- Cinq conditions d'accueil fixe identiques en CSS et en JS, réévaluées en direct.
- Page complète sans vidéo.
- Ré-encodage avec une image clé toutes les 8 images.
- Lighthouse maintenu à 90 ou plus.
- Le site reste en Astro (exigence du brief) : le moteur de défilement vit dans un composant.

## 9. Relecture des textes

Tout texte de ce dossier part tel quel. Avant de montrer le site : zéro tiret cadratin, zéro mot creux. Les formules voulues (« Exporter une fois, c'est un essai. ») sont des choix de marque et restent.

## 10. Version 3 (5 octobre 2026) : photos et pages intérieures

À la demande du client (« il n'y a pas de photo »), le site reçoit 20 photos libres de droits (Wikimedia Commons : CC0, CC BY, CC BY-SA, créditées dans les mentions légales), en priorité des vues du Maroc : Tanger Med, port de Casablanca, céramiques de Safi, orangers. Règle de choix : pas de logo de compagnie maritime en gros plan, pas de personnalité reconnaissable, même lumière de plein jour que l'accueil. Chaque élément parallèle a sa photo (les six services, les quatre étapes, les trois missions types).

Les pages intérieures (Services, une page par service, Méthode, Pourquoi nous, Conteneurs, Résultats) reprennent les motifs du site : étiquettes mono, route en pointillés, conteneur jaune, livrables en étiquettes de fret. Les familles de conteneurs sont dessinées à l'échelle en SVG plutôt que photographiées, car toutes les photos disponibles portaient des logos de compagnies.
