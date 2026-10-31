// Configuration des Marchés Internationaux, Devises & Entrepôts Locaux
window.MARKETS_CONFIG = {
  FR: {
    code: 'FR',
    name: 'France & Belgique',
    flag: '🇫🇷',
    lang: 'fr',
    currency: 'EUR',
    symbol: '€',
    symbolPosition: 'after',
    rateFromEur: 1.0,
    priceMultiplier: 1.0,
    warehouseCity: 'Paris / Francfort',
    deliveryDays: '2–4 jours ouvrés',
    carrier: 'Colissimo Suivi / Chronopost',
    warehouseLabel: {
      fr: 'LIVRAISON EXPRESS OFFERTE DÈS 50€ • EXPÉDIÉ DEPUIS PARIS / FRANCFORT EN 48–72H',
      en: 'FREE EXPRESS SHIPPING OVER €50 • DISPATCHED FROM PARIS / FRANKFURT IN 48–72H',
      de: 'KOSTENLOSER EXPRESSVERSAND AB 50€ • VERSAND AUS PARIS / FRANKFURT IN 48–72 STD.'
    },
    paymentMethods: ['Apple Pay', 'Carte Bancaire (CB / Visa / Mastercard)', 'Klarna — Payer en 3x sans frais', 'PayPal']
  },
  CH: {
    code: 'CH',
    name: 'Suisse / Schweiz',
    flag: '🇨🇭',
    lang: 'fr',
    currency: 'CHF',
    symbol: 'CHF',
    symbolPosition: 'after',
    rateFromEur: 1.0,
    priceMultiplier: 1.20,
    warehouseCity: 'Hub Bâle / Francfort',
    deliveryDays: '2–3 jours ouvrés',
    carrier: 'Swiss Post Priority',
    warehouseLabel: {
      fr: 'EXPÉDITION PRIORITAIRE SUISSE (SANS FRAIS DE DOUANE) • LIVRÉ EN 2 À 3 JOURS VIA SWISS POST',
      en: 'SWISS PRIORITY SHIPPING (DUTY-FREE) • DELIVERED IN 2–3 DAYS VIA SWISS POST',
      de: 'SCHWEIZER PRIORITÄTSVERSAND (ZOLLFREI) • LIEFERUNG IN 2–3 TAGEN MIT SWISS POST'
    },
    paymentMethods: ['TWINT', 'Apple Pay', 'Klarna Facture 30 jours', 'Visa / Mastercard', 'PostFinance']
  },
  DE: {
    code: 'DE',
    name: 'Deutschland & Österreich',
    flag: '🇩🇪',
    lang: 'de',
    currency: 'EUR',
    symbol: '€',
    symbolPosition: 'after',
    rateFromEur: 1.0,
    priceMultiplier: 1.07,
    warehouseCity: 'Frankfurt am Main',
    deliveryDays: '2–3 Werktage',
    carrier: 'DHL Paket Deutschland',
    warehouseLabel: {
      fr: 'EXPÉDIÉ DEPUIS NOTRE CENTRE LOGISTIQUE DE FRANCFORT • LIVRAISON DHL EN 48H',
      en: 'DISPATCHED FROM OUR FRANKFURT LOGISTICS HUB • 48H DHL DELIVERY',
      de: 'DIREKTVERSAND AUS UNSEREM LOGISTIKZENTRUM FRANKFURT • 48 STD. DHL-LIEFERUNG'
    },
    paymentMethods: ['Klarna Rechnung (In 30 Tagen bezahlen)', 'PayPal', 'Apple Pay', 'Kreditkarte / SEPA']
  },
  US: {
    code: 'US',
    name: 'United States & Canada',
    flag: '🇺🇸',
    lang: 'en',
    currency: 'USD',
    symbol: '$',
    symbolPosition: 'before',
    rateFromEur: 1.08,
    priceMultiplier: 1.05,
    warehouseCity: 'Newark (NJ) & Los Angeles (CA)',
    deliveryDays: '2–4 business days',
    carrier: 'USPS Priority / UPS Ground',
    warehouseLabel: {
      fr: 'EXPÉDIÉ DEPUIS NOS ENTREPÔTS NEW JERSEY & CALIFORNIE • LIVRAISON 2–4 JOURS',
      en: 'FREE PRIORITY SHIPPING • DISPATCHED FROM NEW JERSEY & CALIFORNIA IN 2–4 DAYS',
      de: 'VERSAND AUS NEW JERSEY & KALIFORNIEN • 2–4 TAGE LIEFERUNG'
    },
    paymentMethods: ['Apple Pay', 'Shop Pay / Credit Card', 'Affirm / Klarna 4 Interest-Free Payments', 'PayPal']
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    lang: 'en',
    currency: 'GBP',
    symbol: '£',
    symbolPosition: 'before',
    rateFromEur: 0.86,
    priceMultiplier: 1.06,
    warehouseCity: 'London / Manchester',
    deliveryDays: '48 hours',
    carrier: 'Royal Mail Tracked 48',
    warehouseLabel: {
      fr: 'EXPÉDIÉ DEPUIS LONDRES • LIVRAISON ROYAL MAIL TRACKED 48H',
      en: 'COMPLIMENTARY UK TRACKED DELIVERY • DISPATCHED FROM LONDON IN 48H',
      de: 'VERSAND AUS LONDON • 48 STD. ROYAL MAIL LIEFERUNG'
    },
    paymentMethods: ['Apple Pay', 'Clearpay / Klarna 3x', 'Visa / Mastercard', 'PayPal']
  },
  AU: {
    code: 'AU',
    name: 'Australia & New Zealand',
    flag: '🇦🇺',
    lang: 'en',
    currency: 'AUD',
    symbol: 'A$',
    symbolPosition: 'before',
    rateFromEur: 1.65,
    priceMultiplier: 1.08,
    warehouseCity: 'Sydney NSW',
    deliveryDays: '2–5 business days',
    carrier: 'Australia Post Express',
    warehouseLabel: {
      fr: 'EXPÉDIÉ DEPUIS SYDNEY • LIVRAISON AUSPOST EXPRESS EN 2–5 JOURS',
      en: 'FAST LOCAL DISPATCH FROM OUR SYDNEY WAREHOUSE • 2–5 DAYS AUSPOST EXPRESS',
      de: 'VERSAND AUS SYDNEY • 2–5 TAGE AUSPOST EXPRESS'
    },
    paymentMethods: ['Afterpay 4x', 'Apple Pay', 'Visa / Mastercard', 'PayPal']
  }
};

window.I18N_STRINGS = {
  fr: {
    navShop: 'Collection',
    navScience: 'Technologie Clinique',
    navBundles: 'Coffrets & Packs (-25%)',
    navReviews: 'Résultats Clients',
    heroEyebrow: 'INGÉNIERIE BIOMÉCANIQUE SUISSE & RÉCUPÉRATION CELLULAIRE',
    heroTitle: 'La science du sommeil profond et d’un corps sans douleur.',
    heroSubtitle: 'Des dispositifs orthopédiques et de photobiomodulation conçus avec des cliniciens du sommeil. Expédiés en 48h depuis nos centres locaux à Paris, Francfort, Genève, New York et Londres.',
    heroCtaPrimary: 'Explorer la Collection',
    heroCtaSecondary: 'Découvrir les Coffrets (-25%)',
    heroMetric1: 'Clients équipés dans 14 pays',
    heroMetric2: 'Réduction des tensions cervicales dès 7 nuits',
    heroMetric3: 'Essai à domicile 30 nuits — Satisfait ou remboursé',
    sectionTag: 'COLLECTION CLINIQUE 2026',
    sectionTitle: 'Conçus pour transformer vos nuits et votre posture.',
    filterAll: 'Toute la Collection',
    filterSleep: 'Sommeil & Récupération',
    filterErgo: 'Posture & Décompression',
    filterBeauty: 'Photothérapie & Soins',
    filterBundles: 'Coffrets Signature (-25%)',
    quickView: 'Découvrir & Commander',
    addToBag: 'Ajouter au Panier',
    clinicalScoreLabel: 'Efficacité clinique constatée',
    qty1Title: '1 Unité — Cure Découverte',
    qty2Title: 'Duo Pack (2 Unités) — Économisez 15%',
    qty3Title: 'Pack Famille (3 Unités) — Économisez 25%',
    mostPopular: 'LE PLUS CHOISI',
    bestValue: 'MEILLEURE OFFRE',
    shippingFrom: 'En stock • Expédié depuis',
    guaranteeText: 'Essai 30 nuits sans risque • Retour gratuit • Garantie 2 ans',
    cartHeader: 'Votre Sélection',
    cartEmptyTitle: 'Votre panier est vide',
    cartEmptySub: 'Découvrez nos dispositifs orthopédiques et de sommeil profond.',
    upsellHeader: 'COMPLÉTEZ VOTRE ROUTINE (-30% EN AJOUT RAPIDE)',
    subtotalLabel: 'Sous-total',
    shippingLabel: 'Expédition Express Suivie',
    shippingFree: 'OFFERTE',
    checkoutBtn: 'Commander Maintenant',
    editorialBadge: 'PROTOCOLE CERTIFIÉ EN LABORATOIRE',
    editorialTitle: 'Pourquoi 94% de nos utilisateurs ne reviennent jamais à un oreiller ou siège classique.',
    editorialP1: 'Nous passons un tiers de notre vie à dormir et plus de 8 heures par jour assis. Pourtant, la literie et le mobilier traditionnels écrasent les disques intervertébraux et perturbent le rythme circadien.',
    editorialP2: 'Chaque dispositif AURA LABS™ combine mousse viscoélastique à mémoire cellulaire haute densité, décompression axiale et photobiomodulation LED médicale (630nm / 850nm).'
  },
  en: {
    navShop: 'Shop Collection',
    navScience: 'Clinical Science',
    navBundles: 'Signature Bundles (-25%)',
    navReviews: 'Verified Results',
    heroEyebrow: 'SWISS BIOMECHANICAL ENGINEERING & CELLULAR RECOVERY',
    heroTitle: 'The science of restorative sleep and a pain-free body.',
    heroSubtitle: 'Clinical-grade orthopedic and photobiomodulation devices developed with sleep specialists. Dispatched within 24h from our local hubs in New Jersey, London, Frankfurt, Paris & Sydney.',
    heroCtaPrimary: 'Shop the Collection',
    heroCtaSecondary: 'Explore Bundles (Save 25%)',
    heroMetric1: 'Customers across 14 countries',
    heroMetric2: 'Reduction in neck & lumbar tension within 7 nights',
    heroMetric3: '30-Night At-Home Trial — Money-Back Guarantee',
    sectionTag: '2026 CLINICAL COLLECTION',
    sectionTitle: 'Engineered to upgrade your sleep, posture & longevity.',
    filterAll: 'All Products',
    filterSleep: 'Deep Sleep & Recovery',
    filterErgo: 'Posture & Decompression',
    filterBeauty: 'LED Light Therapy & Skin',
    filterBundles: 'Signature Bundles (-25%)',
    quickView: 'View Details & Buy',
    addToBag: 'Add to Bag',
    clinicalScoreLabel: 'Clinically reported efficacy',
    qty1Title: '1 Unit — Standard Edition',
    qty2Title: 'Duo Pack (2 Units) — Save 15%',
    qty3Title: 'Family Pack (3 Units) — Save 25%',
    mostPopular: 'MOST POPULAR',
    bestValue: 'BEST VALUE',
    shippingFrom: 'In Stock • Ships from',
    guaranteeText: '30-Night Risk-Free Trial • Free Returns • 2-Year Warranty',
    cartHeader: 'Your Bag',
    cartEmptyTitle: 'Your bag is empty',
    cartEmptySub: 'Explore our clinical sleep, posture and LED therapy devices.',
    upsellHeader: 'COMPLETE YOUR PROTOCOL (30% OFF ONE-CLICK ADD)',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Priority Tracked Shipping',
    shippingFree: 'FREE',
    checkoutBtn: 'Proceed to Secure Checkout',
    editorialBadge: 'CLINICALLY VALIDATED PROTOCOL',
    editorialTitle: 'Why 94% of our members never go back to conventional pillows or seating.',
    editorialP1: 'You spend a third of your life sleeping and over 8 hours a day sitting. Standard bedding and chairs compress spinal discs and disrupt natural circadian recovery.',
    editorialP2: 'Every AURA LABS™ device integrates high-density memory cell architecture, axial spinal decompression, and medical-grade 630nm/850nm LED photobiomodulation.'
  },
  de: {
    navShop: 'Kollektion',
    navScience: 'Klinische Technologie',
    navBundles: 'Spar-Sets (-25%)',
    navReviews: 'Erfahrungen',
    heroEyebrow: 'SCHWEIZER BIOMECHANIK & ZELLULÄRE REGENERATION',
    heroTitle: 'Die Wissenschaft für tiefen Schlaf und einen schmerzfreien Rücken.',
    heroSubtitle: 'Orthopädische und lichttherapeutische Systeme, entwickelt mit Schlafmedizinern. Direktversand innerhalb von 24 Std. aus unserem Logistikzentrum in Frankfurt, Basel & Wien.',
    heroCtaPrimary: 'Kollektion entdecken',
    heroCtaSecondary: 'Spar-Sets ansehen (-25%)',
    heroMetric1: 'Zufriedene Kunden in 14 Ländern',
    heroMetric2: 'Weniger Nacken- & Rückenschmerzen nach 7 Nächten',
    heroMetric3: '30 Tage Probeschlafen — Geld-zurück-Garantie',
    sectionTag: 'KLINISCHE KOLLEKTION 2026',
    sectionTitle: 'Entwickelt für tiefere Erholung und gesunde Körperhaltung.',
    filterAll: 'Alle Produkte',
    filterSleep: 'Tiefschlaf & Erholung',
    filterErgo: 'Ergonomie & Wirbelsäule',
    filterBeauty: 'LED-Lichttherapie & Haut',
    filterBundles: 'Signature Spar-Sets (-25%)',
    quickView: 'Details & Bestellen',
    addToBag: 'In den Warenkorb',
    clinicalScoreLabel: 'Klinisch bestätigte Wirksamkeit',
    qty1Title: '1 Stück — Einzelkauf',
    qty2Title: 'Partner-Set (2 Stück) — 15% Sparen',
    qty3Title: 'Familien-Set (3 Stück) — 25% Sparen',
    mostPopular: 'MEISTGEWÄHLT',
    bestValue: 'BESTES ANGEBOT',
    shippingFrom: 'Auf Lager • Versand aus',
    guaranteeText: '30 Tage risikofrei testen • Kostenlose Retoure • 2 Jahre Garantie',
    cartHeader: 'Ihr Warenkorb',
    cartEmptyTitle: 'Ihr Warenkorb ist leer',
    cartEmptySub: 'Entdecken Sie unsere orthopädischen Schlaf- und Regenerationssysteme.',
    upsellHeader: 'ERGÄNZEN SIE IHRE ROUTINE (-30% SOFORT-RABATT)',
    subtotalLabel: 'Zwischensumme',
    shippingLabel: 'DHL Express / Priority Versand',
    shippingFree: 'KOSTENLOS',
    checkoutBtn: 'Sicher zur Kasse (Klarna / PayPal / Karte)',
    editorialBadge: 'KLINISCH GEPRÜFTE TECHNOLOGIE',
    editorialTitle: 'Warum 94% unserer Kunden nie wieder zu herkömmlichen Kissen zurückkehren.',
    editorialP1: 'Wir verbringen ein Drittel unseres Lebens im Schlaf und über 8 Stunden täglich im Sitzen. Herkömmliche Matratzen und Stühle belasten die Bandscheiben.',
    editorialP2: 'Jedes AURA LABS™ System kombiniert hochdichten viskoelastischen Memory-Schaum, axiale Dekompression und medizinische 630nm/850nm Lichttherapie.'
  }
};

// Catalogue Produits avec Vraies Photographies Studio & Lifestyle HD, Galerie Multi-Vues & Données Cliniques
window.PRODUCTS_CATALOG = [
  {
    id: 'prod-ergo-pillow',
    sku: 'CJ-ORT-PIL-01',
    category: 'sleep',
    badge: 'BEST-SELLER #1',
    clinicalStat: '96%',
    supplier: 'CJdropshipping Local Hub (DE / FR / US / UK)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['DE', 'FR', 'CH', 'US', 'GB', 'AU'],
    supplierCostEur: 14.50,
    basePriceEur: 64.00,
    compareAtEur: 95.00,
    rating: 4.9,
    reviewsCount: 1842,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Oreiller Cervical Orthopédique AuraCloud™ Pro',
      en: 'AuraCloud™ Pro Orthopedic Cervical Pillow',
      de: 'AuraCloud™ Pro Orthopädisches HWS-Nackenkissen'
    },
    subtitle: {
      fr: 'Mémoire de forme haute densité • Alignement des 7 vertèbres cervicales',
      en: 'High-Density Viscoelastic Foam • 7-Vertebrae Cervical Alignment',
      de: 'Hochdichter Memory-Schaum • Entlastung der 7 Halswirbel'
    },
    shortDesc: {
      fr: 'Conçu avec des chiropracteurs suisses pour épouser la courbure naturelle de la nuque, éliminer les tensions des trapèzes et libérer les voies respiratoires.',
      en: 'Engineered with orthopedic specialists to cradle your neck’s natural curve, eliminate morning shoulder stiffness, and open airways for deeper REM sleep.',
      de: 'Mit Orthopäden entwickelt, um die natürliche Krümmung der Halswirbelsäule zu stützen, Nackenstarre am Morgen zu beseitigen und den Tiefschlaf zu fördern.'
    },
    highlights: {
      fr: [
        'Mousse biomécanique certifiée OEKO-TEX® Standard 100 (zéro affaissement)',
        'Double hauteur ergonomique : s’adapte au sommeil sur le côté, le dos ou le ventre',
        'Housse thermorégulatrice en fibres d’eucalyptus TENCEL™ (-2°C de fraîcheur)'
      ],
      en: [
        'OEKO-TEX® Standard 100 zero-gravity memory cell foam',
        'Dual-contour wing design for side, back & stomach sleepers',
        'Cooling TENCEL™ eucalyptus fiber washable cover (-2°C thermal regulation)'
      ],
      de: [
        'OEKO-TEX® Standard 100 zertifizierter High-Density Memory-Schaum',
        'Zwei ergonomische Höhen für Seiten-, Rücken- und Bauchschläfer',
        'Kühlender, waschbarer Bezug aus TENCEL™ Eukalyptusfasern'
      ]
    },
    specs: 'Dimensions : 62 × 38 × 12/10 cm • Densité : 55 kg/m³ • Housse déhoussable & lavable à 40°C'
  },
  {
    id: 'prod-neck-massager',
    sku: 'CJ-SHIATSU-PRO-02',
    category: 'ergo',
    badge: 'ÉLU PRODUIT DE L’ANNÉE',
    clinicalStat: '94%',
    supplier: 'CJdropshipping / BigBuy (Entrepôts DE / US / UK)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['DE', 'FR', 'CH', 'US', 'GB', 'AU'],
    supplierCostEur: 18.50,
    basePriceEur: 79.00,
    compareAtEur: 129.00,
    rating: 4.9,
    reviewsCount: 1290,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Masseur Cervical Shiatsu & Infrarouge AuraPulse™ 6D',
      en: 'AuraPulse™ 6D Cordless Shiatsu & Infrared Neck Massager',
      de: 'AuraPulse™ 6D Kabelloses Shiatsu- & Infrarot-Massagegerät'
    },
    subtitle: {
      fr: 'Pétrissage bionique profond • Thérapie thermique 42°C • Sans fil',
      en: 'Bionic Deep-Tissue Kneading • 42°C Soothing Infrared Heat • Cordless',
      de: 'Bionische Tiefengewebsmassage • 42°C Infrarotwärme • Kabellos'
    },
    shortDesc: {
      fr: 'Ses 6 têtes bioniques reproduisent fidèlement la pression des pouces d’un kinésithérapeute pour dénouer les nœuds musculaires de la nuque, des trapèzes et des lombaires en 10 minutes.',
      en: 'Six bionic nodes replicate the exact thumb pressure of a physical therapist, combined with 42°C therapeutic heat to dissolve deep knots in your neck, trapezius, and lower back.',
      de: 'Sechs bionische Massageköpfe simulieren den präzisen Daumendruck eines Physiotherapeuten, kombiniert mit 42°C Tiefenwärme zur Lösung hartnäckiger Verspannungen.'
    },
    highlights: {
      fr: [
        'Mécanisme bionique 6D silencieux (< 35 dB) à double sens de rotation',
        'Diffusion de chaleur infrarouge constante à 42°C qui relâche les fascias',
        'Sangles mains-libres & autonomie 7 séances par charge USB-C'
      ],
      en: [
        'Whisper-quiet (< 35 dB) 6D bionic mechanism with dual-direction kneading',
        '42°C constant infrared heat boosts local blood circulation',
        'Hands-free ergonomic buckle straps + 140-minute USB-C battery'
      ],
      de: [
        'Flüsterleises (< 35 dB) 6D-Bionik-Uhrwerk mit Richtungswechsel',
        'Konstante 42°C Infrarot-Tiefenwärme fördert die Durchblutung',
        'Freihändiges Gurtsystem + starker USB-C Akku für bis zu 7 Anwendungen'
      ]
    },
    specs: 'Poids : 1,1 kg • Batterie : 2500 mAh USB-C • Arrêt intelligent après 10 min • Cuir vegan médical'
  },
  {
    id: 'prod-led-mask',
    sku: 'SPK-LED-7C-03',
    category: 'beauty',
    badge: 'TECHNOLOGIE CLINIQUE LED',
    clinicalStat: '92%',
    supplier: 'Spocket / CJdropshipping (Entrepôts US / DE / FR)',
    supplierUrl: 'https://spocket.co',
    warehouses: ['US', 'DE', 'FR', 'CH', 'GB', 'AU'],
    supplierCostEur: 24.00,
    basePriceEur: 119.00,
    compareAtEur: 189.00,
    rating: 4.9,
    reviewsCount: 945,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Masque Photothérapie LED Rouge & Infrarouge AuraGlow™ Pro',
      en: 'AuraGlow™ Pro Red & Near-Infrared LED Light Therapy Mask',
      de: 'AuraGlow™ Pro Rotlicht- & Nahinfrarot LED-Gesichtsmaske'
    },
    subtitle: {
      fr: '630nm Rouge + 850nm Proche-Infrarouge + 460nm Bleu • Silicone Médical',
      en: '630nm Red + 850nm Near-Infrared + 460nm Blue • Flexible Medical Silicone',
      de: '630nm Rotlicht + 850nm Nahinfrarot + 460nm Blaulicht • Medizinisches Silikon'
    },
    shortDesc: {
      fr: 'La puissance des cabines dermatologiques chez vous : relance la synthèse de collagène et d’élastine en profondeur, lisse les ridules et unifie le teint en 10 minutes par séance.',
      en: 'Clinical dermatological photobiomodulation at home: stimulates deep cellular ATP and collagen synthesis, firms skin elasticity, and calms inflammation in 10 minutes a day.',
      de: 'Dermatologische Lichttherapie für zu Hause: aktiviert die zelluläre Kollagensynthese, glättet feine Linien und klärt Unreinheiten in nur 10 Minuten pro Sitzung.'
    },
    highlights: {
      fr: [
        '132 diodes LED de grade médical (Irradiance optimale 35 mW/cm²)',
        'Silicone souple ultra-léger épousant chaque millimètre du visage',
        'Protections oculaires intégrées + Télécommande rechargeable sans fil'
      ],
      en: [
        '132 clinical-grade LEDs delivering 35 mW/cm² optimal irradiance',
        'Ultra-lightweight flexible liquid silicone for full facial contour contact',
        'Built-in eye shields + cordless rechargeable remote controller'
      ],
      de: [
        '132 medizinische LEDs mit optimaler Bestrahlungsstärke (35 mW/cm²)',
        'Ultraleichtes, flexibles Flüssigsilikon für perfekten Hautkontakt',
        'Integrierter Augenschutz + kabellose Akku-Fernbedienung'
      ]
    },
    specs: 'Spectres : 630nm (Rouge), 850nm (NIR), 460nm (Bleu), 590nm (Ambre) • Certifié CE / RoHS / FCC'
  },
  {
    id: 'prod-ortho-cushion',
    sku: 'CJ-GEL-SEAT-04',
    category: 'ergo',
    badge: 'N°1 TÉLÉTRAVAIL & AUTO',
    clinicalStat: '95%',
    supplier: 'CJdropshipping / AutoDS (Entrepôts DE / FR / US / UK)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['DE', 'FR', 'CH', 'US', 'GB', 'AU'],
    supplierCostEur: 11.20,
    basePriceEur: 54.00,
    compareAtEur: 85.00,
    rating: 4.8,
    reviewsCount: 2150,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Coussin d’Assise Orthopédique Gel & Coccyx AuraSeat™',
      en: 'AuraSeat™ Orthopedic Sciatica & Tailbone Gel Seat Cushion',
      de: 'AuraSeat™ Orthopädisches Gel-Sitzkissen für Steißbein & Ischias'
    },
    subtitle: {
      fr: 'Découpe en U zéro pression • Gel thermorégulateur • Anti-sciatique',
      en: 'Zero-Pressure U-Cutout • Cooling Gel Layer • Sciatica & Lower Back Relief',
      de: 'Druckfreier U-Ausschnitt • Kühlendes Gel • Gegen Ischias & Rückenschmerzen'
    },
    shortDesc: {
      fr: 'Transforme n’importe quelle chaise de bureau ou siège auto en assise ergonomique médicale : le coccyx flotte au-dessus de la découpe en U, supprimant toute compression vertébrale.',
      en: 'Instantly upgrades any office chair or car seat into an orthopedic throne: your tailbone floats above the rear U-cutout, eliminating spinal compression during 8+ hour workdays.',
      de: 'Verwandelt jeden Bürostuhl oder Autositz in einen ergonomischen Gesundheitssitz: Das Steißbein schwebt frei über dem U-Ausschnitt, sodass die Wirbelsäule komplett entlastet wird.'
    },
    highlights: {
      fr: [
        'Décharge immédiate du nerf sciatique, du coccyx et du bas du dos',
        'Insert en gel rafraîchissant + mousse mémoire haute résilience',
        'Dessous en micro-silicone antidérapant et poignée de transport intégrée'
      ],
      en: [
        'Immediate pressure relief for sciatica, tailbone, and pelvic alignment',
        'Cooling gel matrix infused into high-resilience memory foam',
        'Non-slip micro-dot grip base + built-in carry handle'
      ],
      de: [
        'Sofortige Druckentlastung bei Ischias, Bandscheiben & Steißbeinschmerzen',
        'Kühlende Gel-Schicht kombiniert mit formstabilem Memory-Schaum',
        'Rutschfeste Unterseite mit Tragegriff für Büro, Auto und Reisen'
      ]
    },
    specs: 'Dimensions : 46 × 36 × 8 cm • Capacité : jusqu’à 140 kg • Housse mesh 3D lavable'
  },
  {
    id: 'prod-sleep-mask-bt',
    sku: 'CJ-3DMASK-BT-05',
    category: 'sleep',
    badge: 'SOMMEIL PROFOND & VOYAGE',
    clinicalStat: '93%',
    supplier: 'CJdropshipping / Spocket (Entrepôts US / DE / UK / AU)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['US', 'DE', 'FR', 'CH', 'GB', 'AU'],
    supplierCostEur: 7.80,
    basePriceEur: 39.00,
    compareAtEur: 65.00,
    rating: 4.9,
    reviewsCount: 2640,
    images: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Masque de Sommeil 3D Occultant & Audio Bluetooth AuraDream™',
      en: 'AuraDream™ 3D Blackout Sleep Mask with Ultra-Thin Bluetooth Audio',
      de: 'AuraDream™ 3D-Schlafmaske (100% Dunkelheit) mit Bluetooth-Audio'
    },
    subtitle: {
      fr: 'Obscurité 100% sans pression oculaire • Écouteurs extra-plats 3mm',
      en: '100% Total Blackout • Zero Eye Pressure • 3mm Flat Side-Sleeper Speakers',
      de: '100% Abdunkelung ohne Augendruck • 3mm flache Seitenschläfer-Lautsprecher'
    },
    shortDesc: {
      fr: 'Plongez dans le noir absolu tout en écoutant des fréquences binaurales, des bruits blancs ou vos podcasts. Les dômes oculaires 3D permettent de cligner des yeux librement.',
      en: 'Experience pitch-black darkness anywhere while streaming white noise, binaural beats, or audiobooks. Deep 3D eye domes let you blink freely with zero pressure on eyelashes.',
      de: 'Erleben Sie absolute Dunkelheit kombiniert mit beruhigendem White Noise oder Hörbüchern. Tiefe 3D-Augenkammern lassen vollen Freiraum für Augen und Wimpern.'
    },
    highlights: {
      fr: [
        'Pont nasal breveté bloquant 100% de la lumière extérieure',
        'Haut-parleurs feutrés de 3 mm d’épaisseur (imperceptibles sur le côté)',
        'Bluetooth 5.4 basse consommation — 14 heures d’écoute continue'
      ],
      en: [
        'Patented nose-wing baffle blocks 100% of ambient light',
        '3mm felt-wrapped speakers undetectable even when sleeping on your side',
        'Bluetooth 5.4 + 14-hour battery life with auto sleep timer'
      ],
      de: [
        'Patentierter Nasensteg blockiert 100% des Umgebungslichts',
        'Nur 3 mm flache Lautsprecher – selbst in Seitenlage nicht spürbar',
        'Bluetooth 5.4 + 14 Stunden Akkulaufzeit mit Abschaltautomatik'
      ]
    },
    specs: 'Poids plume : 85 g • Charge USB-C en 1h30 • Modules audio amovibles pour lavage'
  },
  {
    id: 'prod-guasha-microcurrent',
    sku: 'CJ-GUASHA-EMS-06',
    category: 'beauty',
    badge: 'LIFTING & DRAINAGE',
    clinicalStat: '91%',
    supplier: 'CJdropshipping / Syncee (Entrepôts US / DE / FR)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['US', 'DE', 'FR', 'CH', 'GB', 'AU'],
    supplierCostEur: 9.50,
    basePriceEur: 49.00,
    compareAtEur: 79.00,
    rating: 4.8,
    reviewsCount: 1380,
    images: [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Sculpteur Facial Micro-Courant EMS & LED Rouge AuraSculpt™',
      en: 'AuraSculpt™ EMS Microcurrent & Red Light Facial Lifting Wand',
      de: 'AuraSculpt™ EMS-Mikrostrom & Rotlicht Gesichts-Lifting Gua Sha'
    },
    subtitle: {
      fr: 'Drainage lymphatique thermique 42°C • Tonification de l’ovale du visage',
      en: '42°C Thermal Lymphatic Drainage • Jawline & Neck Contouring',
      de: '42°C Thermische Lymphdrainage • Straffung von Kieferlinie & Hals'
    },
    shortDesc: {
      fr: 'Réinvente le Gua Sha ancestral avec la technologie clinique : les micro-courants EMS tonifient les muscles peauciers tandis que la chaleur et la LED 630nm décongestionnent le visage en 5 minutes.',
      en: 'Elevates traditional Gua Sha with clinical bio-technology: gentle EMS microcurrents tone facial muscles while 42°C warmth and 630nm red light depuff and sculpt your jawline.',
      de: 'Verbindet traditionelles Gua Sha mit moderner Medizintechnik: Sanfter EMS-Mikrostrom trainiert die Gesichtsmuskulatur, während 42°C Wärme und Rotlicht Schwellungen reduzieren.'
    },
    highlights: {
      fr: [
        'Synergie 4-en-1 : Micro-courant EMS + LED Rouge 630nm + Chaleur 42°C + Vibrations',
        'Courbure ergonomique épousant les pommettes, la mâchoire et le cou',
        'Multiplie par 3 l’absorption de vos sérums à l’acide hyaluronique'
      ],
      en: [
        '4-in-1 Synergy: EMS Microcurrent + 630nm Red LED + 42°C Heat + Sonic Ion',
        'Precision-engineered edge hugs cheekbones, jawline, and neck',
        'Triples skin absorption of hyaluronic acid and peptide serums'
      ],
      de: [
        '4-in-1 Synergie: EMS-Mikrostrom + 630nm Rotlicht + 42°C Wärme + Schall',
        'Ergonomische Kontur für Wangenknochen, Kieferlinie und Dekolleté',
        'Verdreifacht die Aufnahme von Hyaluron- und Peptid-Seren'
      ]
    },
    specs: '3 niveaux d’intensité • Tête plaquée rhodium hypoallergénique • Charge USB-C'
  },
  {
    id: 'prod-sleep-gummies',
    sku: 'SUP-GUM-SLEEP-09',
    category: 'sleep',
    badge: 'FORMULE BOTANIQUE SUISSE',
    clinicalStat: '94%',
    supplier: 'Supliful Marque Blanche (Entrepôts US / UK / EU)',
    supplierUrl: 'https://supliful.com',
    warehouses: ['US', 'GB', 'DE', 'FR', 'CH'],
    supplierCostEur: 8.50,
    basePriceEur: 36.00,
    compareAtEur: 49.00,
    rating: 4.9,
    reviewsCount: 1120,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Complexe Nuit Profonde AuraRest™ (Ashwagandha KSM-66® & Magnésium)',
      en: 'AuraRest™ Deep Sleep Botanical Complex (Ashwagandha KSM-66® & Magnesium)',
      de: 'AuraRest™ Tiefschlaf-Komplex (Ashwagandha KSM-66®, L-Theanin & Magnesium)'
    },
    subtitle: {
      fr: '60 Gummies Vegan Sans Sucres • Endormissement rapide sans accoutumance',
      en: '60 Sugar-Free Vegan Gummies • Non-Habit Forming • Zero Morning Grogginess',
      de: '60 Zuckerfreie Vegane Gummies • Kein Gewöhnungseffekt • Erholt aufwachen'
    },
    shortDesc: {
      fr: 'Une synergie neuro-apaisante associant Ashwagandha KSM-66®, L-Théanine, Bisglycinate de Magnésium et Mélatonine végétale pour abaisser le cortisol du soir en 20 minutes.',
      en: 'A neuro-calming formulation combining KSM-66® Ashwagandha, L-Theanine, Magnesium Bisglycinate, and plant-derived melatonin to lower evening cortisol within 20 minutes.',
      de: 'Eine neuro-beruhigende Formel aus KSM-66® Ashwagandha, L-Theanin und Magnesiumbisglycinat, die das abendliche Stresshormon Cortisol in 20 Minuten senkt.'
    },
    highlights: {
      fr: [
        'Réduit le temps d’endormissement de 62% dès la première semaine',
        'Zéro somnolence au réveil • 100% Vegan, Sans Gluten, Arôme Mûre Sauvage',
        'Fabriqué en laboratoire certifié GMP / ISO (Étiquette à votre marque)'
      ],
      en: [
        'Reduces time to fall asleep by 62% from the very first week',
        'Zero morning grogginess • 100% Vegan, Sugar-Free Wild Blackberry flavor',
        'Manufactured in GMP & FDA-registered facilities under your private label'
      ],
      de: [
        'Verkürzt die Einschlafzeit um 62% bereits in der ersten Woche',
        'Keine Müdigkeit am Morgen • 100% Vegan, zuckerfrei, Waldbeer-Geschmack',
        'Hergestellt in GMP- & ISO-zertifizierten Laboren'
      ]
    },
    specs: 'Flacon de 60 gummies (Cure de 30 nuits) • Posologie : 2 gummies 30 min avant le coucher'
  },
  {
    id: 'prod-hyaluronic-serum',
    sku: 'BLK-SERUM-PEP-10',
    category: 'beauty',
    badge: 'SOIN CONDUCTEUR LED & EMS',
    clinicalStat: '97%',
    supplier: 'Blanka / Supliful Marque Blanche (US / EU / UK)',
    supplierUrl: 'https://blankabrand.com',
    warehouses: ['US', 'CA', 'GB', 'DE', 'FR', 'CH'],
    supplierCostEur: 7.20,
    basePriceEur: 38.00,
    compareAtEur: 55.00,
    rating: 4.9,
    reviewsCount: 1410,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608248597359-0e6d526a6c58?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Sérum Cellulaire Tri-Hyaluronique & Peptides de Cuivre AuraHydra™',
      en: 'AuraHydra™ Tri-Molecular Hyaluronic & Copper Peptide Cellular Serum',
      de: 'AuraHydra™ Tri-Molekulares Hyaluron & Kupfer-Peptid Zell-Serum'
    },
    subtitle: {
      fr: 'Acide Hyaluronique 2% + Peptides de Cuivre GHK-Cu + Niacinamide (30 ml)',
      en: '2% Pure Hyaluronic Acid + GHK-Cu Copper Peptides + Niacinamide (30 ml)',
      de: '2% Reine Hyaluronsäure + GHK-Cu Kupferpeptide + Niacinamid (30 ml)'
    },
    shortDesc: {
      fr: 'Formulé spécifiquement pour décupler les résultats de la photothérapie LED et des micro-courants EMS tout en repulpant instantanément la barrière hydrolipidique.',
      en: 'Specifically formulated to amplify LED phototherapy and EMS microcurrent conductivity while instantly plumping fine lines and reinforcing the skin barrier.',
      de: 'Speziell entwickelt, um die Ergebnisse der LED-Lichttherapie und die EMS-Leitfähigkeit zu maximieren und feine Linien sofort sichtbar aufzupolstern.'
    },
    highlights: {
      fr: [
        '3 poids moléculaires d’acide hyaluronique pour une hydratation sur 3 couches',
        'Peptides de Cuivre GHK-Cu stimulants la régénération dermique',
        'Sans parfum, non comédogène, flacon en verre dépoli 30 ml'
      ],
      en: [
        'Three molecular weights of Hyaluronic Acid for multi-depth hydration',
        'Clinical GHK-Cu Copper Peptides accelerate dermal regeneration',
        'Fragrance-free, vegan, housed in a 30ml frosted UV-protective glass dropper'
      ],
      de: [
        'Drei Molekulargewichte Hyaluronsäure für Tiefenhydratation',
        'Klinische GHK-Cu Kupferpeptide fördern die Hautregeneration',
        'Parfümfrei, vegan, in einer 30 ml UV-geschützten Glas-Pipettenflasche'
      ]
    },
    specs: 'Contenance : 30 ml (1 fl. oz.) • pH physiologique 5.5 • Testé sous contrôle dermatologique'
  },
  {
    id: 'bundle-sommeil-ultime',
    sku: 'BND-SLEEP-ULT-11',
    category: 'bundles',
    badge: 'COFFRET SIGNATURE -25%',
    clinicalStat: '98%',
    supplier: 'CJdropshipping + Supliful (Expédition Groupée Automatique)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['DE', 'FR', 'CH', 'US', 'GB', 'AU'],
    supplierCostEur: 22.30,
    basePriceEur: 79.00,
    compareAtEur: 129.00,
    rating: 5.0,
    reviewsCount: 840,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Coffret "Sanctuaire du Sommeil" : Oreiller AuraCloud™ Pro + Masque 3D Audio AuraDream™',
      en: 'The Deep Sleep Sanctuary Set: AuraCloud™ Pro Pillow + AuraDream™ 3D Audio Mask',
      de: 'Das Tiefschlaf-Set: AuraCloud™ Pro Nackenkissen + AuraDream™ 3D-Audio-Schlafmaske'
    },
    subtitle: {
      fr: 'Le protocole complet d’alignement cervical et d’isolation sensorielle (-25%)',
      en: 'Complete Cervical Alignment & Sensory Blackout Protocol (Save 25%)',
      de: 'Komplett-Protokoll für HWS-Ausrichtung & 100% Sinnes-Entspannung (-25%)'
    },
    shortDesc: {
      fr: 'Notre coffret le plus plébiscité : associe le soutien orthopédique de l’oreiller AuraCloud™ Pro à l’obscurité sonore 3D du masque AuraDream™ pour des nuits ininterrompues.',
      en: 'Our #1 highest-rated sleep transformation protocol: combines the orthopedic support of the AuraCloud™ Pro Pillow with the 3D audio blackout of AuraDream™.',
      de: 'Unser bestbewertetes Schlaf-System: kombiniert die orthopädische Stützkraft des AuraCloud™ Pro Kissens mit der 3D-Audio-Abdunkelung der AuraDream™ Maske.'
    },
    highlights: {
      fr: [
        'Inclus : 1× Oreiller Orthopédique AuraCloud™ Pro + 1× Masque 3D Bluetooth AuraDream™',
        'Économie immédiate de 25% + Expédition Express Prioritaire Offerte',
        'Garantie 30 nuits d’essai sur l’ensemble du coffret'
      ],
      en: [
        'Includes: 1× AuraCloud™ Pro Orthopedic Pillow + 1× AuraDream™ 3D Bluetooth Mask',
        'Instant 25% Bundle Savings + Complimentary Priority Tracked Shipping',
        'Backed by our 30-Night Risk-Free Sleep Guarantee'
      ],
      de: [
        'Enthält: 1× AuraCloud™ Pro Orthopädisches Kissen + 1× AuraDream™ 3D Bluetooth-Maske',
        '25% Set-Vorteil + Kostenloser Priority-Expressversand',
        'Inklusive 30 Tage Probeschlafen-Garantie'
      ]
    },
    specs: 'Coffret complet livré en emballage cadeau premium AURA LABS™'
  },
  {
    id: 'bundle-teletravail',
    sku: 'BND-BACK-PRO-12',
    category: 'bundles',
    badge: 'COFFRET CLINIQUE DOS -25%',
    clinicalStat: '97%',
    supplier: 'CJdropshipping Local Hub (DE / FR / US / UK)',
    supplierUrl: 'https://cjdropshipping.com',
    warehouses: ['DE', 'FR', 'CH', 'US', 'GB', 'AU'],
    supplierCostEur: 29.70,
    basePriceEur: 98.00,
    compareAtEur: 159.00,
    rating: 5.0,
    reviewsCount: 730,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85'
    ],
    title: {
      fr: 'Coffret "Posture & Récupération" : Masseur Shiatsu AuraPulse™ 6D + Coussin Gel AuraSeat™',
      en: 'Spinal Relief & Recovery Set: AuraPulse™ 6D Shiatsu Massager + AuraSeat™ Gel Cushion',
      de: 'Rücken- & Nacken-Komplettset: AuraPulse™ 6D Shiatsu-Massagegerät + AuraSeat™ Sitzkissen'
    },
    subtitle: {
      fr: 'Décharge lombaire la journée + Décontraction Shiatsu 42°C le soir (-25%)',
      en: 'All-Day Sciatica Relief at Your Desk + Evening 42°C Shiatsu Recovery (Save 25%)',
      de: 'Druckfreies Sitzen im Büro + 42°C Shiatsu-Tiefenentspannung am Abend (-25%)'
    },
    shortDesc: {
      fr: 'L’alliance ultime contre les douleurs du travail sédentaire : protégez votre coccyx et vos lombaires toute la journée, puis relâchez vos cervicales en 10 minutes le soir.',
      en: 'The ultimate clinical duo against desk-job back pain: protect your tailbone and lumbar spine all day, then melt away neck tension in 10 minutes every evening.',
      de: 'Das ultimative Duo gegen Sitzbeschwerden: Schützen Sie tagsüber Steißbein und Lendenwirbel und lösen Sie abends Nackenverspannungen in 10 Minuten.'
    },
    highlights: {
      fr: [
        'Inclus : 1× Masseur Shiatsu Sans Fil AuraPulse™ 6D + 1× Coussin Orthopédique AuraSeat™',
        'Économie immédiate de 25% + Expédition Express Prioritaire Offerte',
        'Recommandé pour le télétravail, les longs trajets et les douleurs sciatiques'
      ],
      en: [
        'Includes: 1× AuraPulse™ 6D Cordless Massager + 1× AuraSeat™ Orthopedic Cushion',
        'Instant 25% Bundle Savings + Free Priority Express Delivery',
        'Ideal for remote professionals, drivers, and chronic lower back tension'
      ],
      de: [
        'Enthält: 1× AuraPulse™ 6D Massagegerät + 1× AuraSeat™ Orthopädisches Sitzkissen',
        '25% Set-Ersparnis + Kostenloser DHL Priority-Versand',
        'Ideal für Homeoffice, Vielfahrer und chronische Rückenbeschwerden'
      ]
    },
    specs: 'Coffret thérapeutique complet • Garantie internationale 2 ans'
  }
];
