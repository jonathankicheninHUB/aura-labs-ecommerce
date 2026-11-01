/**
 * OREVA® LUXURY & CONVERSION EFFECTS ENGINE (12-IN-1)
 * ----------------------------------------------------------------------------
 * 1. Spotlight Cursor Glow (--mouse-x / --mouse-y)
 * 2. Liquid Glass Mobile Bottom App Dock (active state sync)
 * 3. Prismatic 18k Shimmer Sweep
 * 4. Full Liquid Glass Bag & Modals
 * 5. 3D Perspective Card Tilt + Specular Glare
 * 6. Magnetic Luxury CTA Buttons
 * 7. Cinematic Scroll Reveal (IntersectionObserver)
 * 8. Interactive Clinical Before / After Touch & Drag Slider
 * 9. Sticky Glass Quick-Buy Bar on Scroll
 * 10. Subdomain-Isolated Live Social Proof Glass Toast
 * 11. Gamified 3-Tier Luxury Progress Bar in Shopping Bag
 * 12. 1-Click Obsidian Night / Alabaster Day Theme Switcher
 */

(function () {
  let stickyBarDismissed = false;
  let socialProofTimer = null;
  let revealObserver = null;

  // Données Avant/Après par Sous-Domaine (100% isolé par niche)
  const BEFORE_AFTER_CONFIG = {
    sleep: {
      beforeBadge: 'SANS PROTOCOLE • NUIT FRAGMENTÉE',
      beforeTitle: 'Cervicales désalignées & pollution lumineuse',
      beforeMetric: '4 à 6 micro-réveils / nuit • Raideur matinale',
      afterBadge: 'AVEC OREVA SLEEP LAB™ • SOMMEIL PROFOND',
      afterTitle: 'Alignement lordose 15° & obscurité totale 0 Lux',
      afterMetric: '+62% de sommeil paradoxal REM dès 7 nuits'
    },
    ergo: {
      beforeBadge: 'POSTURE ASSISE CLASSIQUE (8H/JOUR)',
      beforeTitle: 'Compression du coccyx & pincement lombaire L4-L5',
      beforeMetric: 'Pression intervertébrale élevée • Fatigue dorsale',
      afterBadge: 'AVEC OREVA ERGO LAB™ • DÉCOMPRESSION',
      afterTitle: 'Décharge coccygienne en U & soutien lordose actif',
      afterMetric: '-78% de tension sciatique & lombaire dès la 1ère semaine'
    },
    glow: {
      beforeBadge: 'SOINS TOPIQUES SEULS (CRÈMES CLASSIQUES)',
      beforeTitle: 'Pénétration superficielle & teint terne',
      beforeMetric: 'Action limitée à la couche cornée • Stagnation lymphatique',
      afterBadge: 'AVEC OREVA GLOW LAB™ • PHOTOBIOMODULATION',
      afterTitle: 'Spectre clinique 633nm + 830nm & micro-courant',
      afterMetric: '94% peau plus ferme, lumineuse et repulpée en 4 semaines'
    },
    thermo: {
      beforeBadge: 'RÉCUPÉRATION PASSIVE APRÈS L’EFFORT',
      beforeTitle: 'Stase veineuse, jambes lourdes & raideurs articulaires',
      beforeMetric: 'Élimination lente de l’acide lactique (48h+)',
      afterBadge: 'AVEC OREVA THERMO LAB™ • PRESSO & INFRAROUGE',
      afterTitle: 'Drainage pneumatique séquentiel & chaleur profonde',
      afterMetric: 'Sensation de jambes légères & détente en 20 minutes'
    },
    sport: {
      beforeBadge: 'ÉCHAUFFEMENT & RÉCUPÉRATION STANDARDS',
      beforeTitle: 'Noeuds myofasciaux & courbatures prolongées (DOMS)',
      beforeMetric: 'Amplitude articulaire réduite • Risque de surcharge',
      afterBadge: 'AVEC OREVA SPORT LAB™ • BIOMÉCANIQUE PRO',
      afterTitle: 'Percussion profonde 16mm & électrostimulation EMS',
      afterMetric: 'Récupération neuromusculaire 2,4× plus rapide'
    },
    pets: {
      beforeBadge: 'COUSSIN STANDARD PLAT EN FIBRES',
      beforeTitle: 'Points de pression sur les hanches & anxiété',
      beforeMetric: 'Sommeil agité • Articulations froides au sol',
      afterBadge: 'AVEC OREVA PETS LAB™ • ORTHOPÉDIE VÉTÉRINAIRE',
      afterTitle: 'Mousse mémoire haute densité & rebord apaisant 360°',
      afterMetric: 'Posture articulaire soulagée & calme immédiat'
    },
    baby: {
      beforeBadge: 'ENVIRONNEMENT SONORE & LUMINEUX INSTABLE',
      beforeTitle: 'Bruits domestiques brusques & réveils fréquents',
      beforeMetric: 'Endormissement long • Sommeil léger interrompu',
      afterBadge: 'AVEC OREVA BABY LAB™ • SANCTUAIRE PÉDIATRIQUE',
      afterTitle: 'Fréquences roses apaisantes & veilleuse ambrée douce',
      afterMetric: 'Endormissement 2× plus serein pour bébé et les parents'
    },
    home: {
      beforeBadge: 'AIR INTÉRIEUR CONFINÉ & LUMIÈRE ARTIFICIELLE',
      beforeTitle: 'Particules fines, allergènes & baisse d’énergie',
      beforeMetric: 'Air intérieur 5× plus pollué • Fatigue visuelle',
      afterBadge: 'AVEC OREVA HOME LAB™ • SANCTUAIRE PURIFIÉ',
      afterTitle: 'Filtration HEPA H13 99,97% & spectre solaire 10 000 Lux',
      afterMetric: 'Air purifié en 12 min & vitalité circadienne restaurée'
    }
  };

  const SOCIAL_PROOF_CITIES = [
    { name: 'Camille L.', city: 'Genève', flag: '🇨🇭', time: 'il y a 2 min' },
    { name: 'Marc-Antoine D.', city: 'Paris 8e', flag: '🇫🇷', time: 'il y a 4 min' },
    { name: 'Éléonore V.', city: 'Lausanne', flag: '🇨🇭', time: 'il y a 6 min' },
    { name: 'Julien R.', city: 'Lyon', flag: '🇫🇷', time: 'il y a 9 min' },
    { name: 'Sophie M.', city: 'Bruxelles', flag: '🇧🇪', time: 'il y a 11 min' },
    { name: 'Alexandre K.', city: 'Zürich', flag: '🇨🇭', time: 'il y a 14 min' },
    { name: 'Chloé B.', city: 'Bordeaux', flag: '🇫🇷', time: 'il y a 17 min' }
  ];

  // ==========================================================================
  // 12. MODE SOMBRE / CLAIR "OBSIDIAN NIGHT & ALABASTER DAY"
  // ==========================================================================
  window.toggleOrevaTheme = function () {
    const isNight = document.body.classList.toggle('theme-obsidian-night');
    try {
      localStorage.setItem('oreva_theme_mode', isNight ? 'night' : 'day');
    } catch (e) {}
    updateThemeButtonsUI(isNight);
  };

  function initThemeMode() {
    let saved = null;
    try {
      saved = localStorage.getItem('oreva_theme_mode');
    } catch (e) {}
    const isNight = saved === 'night';
    if (isNight) {
      document.body.classList.add('theme-obsidian-night');
    }
    updateThemeButtonsUI(isNight);
  }

  function updateThemeButtonsUI(isNight) {
    const icon = isNight ? '☀️' : '🌙';
    const label = isNight ? 'Mode Jour' : 'Mode Nuit';
    const hdrBtn = document.getElementById('themeToggleBtn');
    if (hdrBtn) {
      hdrBtn.innerHTML = `<span style="font-size:0.95rem;">${icon}</span><span class="theme-btn-text">${label}</span>`;
      hdrBtn.title = isNight ? 'Passer en mode Albâtre Jour' : 'Passer en mode Obsidienne Nuit';
    }
    const drawerBtn = document.getElementById('glassDrawerThemeBtn');
    if (drawerBtn) {
      drawerBtn.innerHTML = `<span>${icon} Thème : <strong>${isNight ? 'Obsidian Night (Sombre)' : 'Alabaster Day (Clair)'}</strong></span><span>Changer →</span>`;
    }
  }

  // ==========================================================================
  // 1 & 5. SPOTLIGHT CURSOR GLOW + 3D PERSPECTIVE CARD TILT (DESKTOP)
  // ==========================================================================
  function initSpotlightAnd3DTilt() {
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.luxury-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calcul d'inclinaison 3D douce (max 4.5 deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.2;
      const rotateY = ((x - centerX) / centerX) * 4.2;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.luxury-card');
      if (!card) return;
      const related = e.relatedTarget;
      if (related && card.contains(related)) return;
      card.style.transform = '';
    }, { passive: true });
  }

  // ==========================================================================
  // 6. BOUTONS MAGNÉTIQUES LUXE (MAGNETIC HOVER)
  // ==========================================================================
  function initMagneticButtons() {
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

    const selectors = '#heroCtaPrimary, #heroCtaSecondary, .bag-button, .glass-sidebar-trigger-btn';
    document.querySelectorAll(selectors).forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ==========================================================================
  // 7. SCROLL REVEAL CINÉMATIQUE (INTERSECTION OBSERVER)
  // ==========================================================================
  window.refreshOrevaScrollReveal = function () {
    if (!('IntersectionObserver' in window)) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('oreva-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    }

    document.querySelectorAll('.luxury-card:not(.oreva-revealed), .pillar-box:not(.oreva-revealed), .metric-item:not(.oreva-revealed)').forEach((el, idx) => {
      el.classList.add('oreva-reveal-item');
      el.style.transitionDelay = `${Math.min(idx % 6, 5) * 45}ms`;
      revealObserver.observe(el);
    });
  };

  // ==========================================================================
  // 8. COMPARATEUR CLINIQUE AVANT / APRÈS INTERACTIF (TACTILE & SOURIS)
  // ==========================================================================
  window.updateBeforeAfterSlider = function (val) {
    const pct = Math.max(5, Math.min(95, Number(val) || 50));
    const beforeLayer = document.getElementById('baBeforeLayer');
    const handle = document.getElementById('baDividerHandle');
    if (beforeLayer) {
      beforeLayer.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    }
    if (handle) {
      handle.style.left = `${pct}%`;
    }
  };

  window.syncBeforeAfterWithUniverse = function (universeKey) {
    const uKey = universeKey || window.currentUniverse || 'sleep';
    const uniConfig = window.OREVA_UNIVERSES?.[uKey] || window.OREVA_UNIVERSES?.sleep;
    const baCfg = BEFORE_AFTER_CONFIG[uKey] || BEFORE_AFTER_CONFIG.sleep;

    const afterImg = document.getElementById('baAfterImg');
    const beforeImg = document.getElementById('baBeforeImg');
    if (afterImg && uniConfig?.heroImg) afterImg.src = uniConfig.heroImg;
    if (beforeImg && uniConfig?.scienceImg) beforeImg.src = uniConfig.scienceImg;

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el && txt) el.textContent = txt;
    };
    setTxt('baBeforeBadge', baCfg.beforeBadge);
    setTxt('baBeforeTitle', baCfg.beforeTitle);
    setTxt('baBeforeMetric', baCfg.beforeMetric);
    setTxt('baAfterBadge', baCfg.afterBadge);
    setTxt('baAfterTitle', baCfg.afterTitle);
    setTxt('baAfterMetric', baCfg.afterMetric);
  };

  // ==========================================================================
  // 9. BARRE D'ACHAT FLOTTANTE "STICKY QUICK-BUY GLASS BAR" AU SCROLL
  // ==========================================================================
  window.dismissStickyQuickBuy = function () {
    stickyBarDismissed = true;
    const bar = document.getElementById('stickyQuickBuyBar');
    if (bar) bar.classList.remove('visible');
  };

  window.syncStickyQuickBuyBar = function () {
    const bar = document.getElementById('stickyQuickBuyBar');
    if (!bar) return;
    const uKey = typeof currentUniverse !== 'undefined' ? currentUniverse : 'sleep';
    const uniProds = typeof getProductsForUniverse === 'function' ? getProductsForUniverse(uKey) : [];
    const flagship = uniProds[0] || (window.PRODUCTS_CATALOG && window.PRODUCTS_CATALOG[0]);
    if (!flagship) return;

    const lang = typeof currentLang !== 'undefined' ? currentLang : 'fr';
    const title = flagship.title?.[lang] || flagship.title?.fr || 'Produit Phare OREVA®';
    const priceStr = typeof formatLocalPrice === 'function' ? formatLocalPrice(flagship.basePriceEur) : `${flagship.basePriceEur} €`;

    const imgEl = document.getElementById('stickyQbImg');
    const titleEl = document.getElementById('stickyQbTitle');
    const priceEl = document.getElementById('stickyQbPrice');
    const btnEl = document.getElementById('stickyQbAddBtn');

    if (imgEl) imgEl.src = flagship.images[0];
    if (titleEl) titleEl.textContent = title;
    if (priceEl) priceEl.textContent = priceStr;
    if (btnEl) {
      btnEl.onclick = () => {
        if (typeof addToCart === 'function') addToCart(flagship.id, 1, 1.0);
      };
    }
  };

  function initScrollListeners() {
    window.addEventListener('scroll', () => {
      const bar = document.getElementById('stickyQuickBuyBar');
      if (!bar || stickyBarDismissed) return;
      if (window.scrollY > 640) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 10. SOCIAL PROOF GLASS TOAST (100% ISOLÉ AU SOUS-DOMAINE ACTIF)
  // ==========================================================================
  let currentToastProdId = null;

  function triggerSocialProofToast() {
    const toast = document.getElementById('socialProofGlassToast');
    if (!toast || document.hidden) return;

    const uKey = typeof currentUniverse !== 'undefined' ? currentUniverse : 'sleep';
    const uniProds = typeof getProductsForUniverse === 'function' ? getProductsForUniverse(uKey) : [];
    if (!uniProds.length) return;

    const prod = uniProds[Math.floor(Math.random() * Math.min(uniProds.length, 18))];
    const buyer = SOCIAL_PROOF_CITIES[Math.floor(Math.random() * SOCIAL_PROOF_CITIES.length)];
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'fr';
    const title = prod.title?.[lang] || prod.title?.fr;

    currentToastProdId = prod.id;
    const imgEl = document.getElementById('spToastImg');
    const buyerEl = document.getElementById('spToastBuyer');
    const prodEl = document.getElementById('spToastProduct');
    const timeEl = document.getElementById('spToastTime');

    if (imgEl) imgEl.src = prod.images[0];
    if (buyerEl) buyerEl.textContent = `${buyer.name} (${buyer.city} ${buyer.flag})`;
    if (prodEl) prodEl.textContent = title;
    if (timeEl) timeEl.textContent = `✓ Achat vérifié • ${buyer.time}`;

    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 6200);
  }

  window.openSocialProofProduct = function () {
    if (currentToastProdId && typeof openProductDetail === 'function') {
      openProductDetail(currentToastProdId);
    }
  };

  window.closeSocialProofToast = function (e) {
    if (e) e.stopPropagation();
    const toast = document.getElementById('socialProofGlassToast');
    if (toast) toast.classList.remove('visible');
  };

  // ==========================================================================
  // 11. JAUGE LUMINEUSE DE CADEAUX DÉBLOQUÉS DANS LE PANIER (GAMIFICATION)
  // ==========================================================================
  window.updateBagGamificationBar = function () {
    const fillEl = document.getElementById('bagRewardProgressFill');
    const msgEl = document.getElementById('bagRewardStatusText');
    const step1 = document.getElementById('bagStepPdf');
    const step2 = document.getElementById('bagStepSatin');
    const step3 = document.getElementById('bagStepDuo');
    const mobileDockCount = document.getElementById('mobileDockBagCount');

    const cartArr = typeof cart !== 'undefined' && Array.isArray(cart) ? cart : [];
    const totalQty = cartArr.reduce((s, i) => s + i.qty, 0);
    const totalEur = cartArr.reduce((s, i) => s + (i.product.basePriceEur * i.discountFactor * i.qty), 0);

    if (mobileDockCount) {
      mobileDockCount.textContent = totalQty;
    }

    if (!fillEl || !msgEl) return;

    let pct = 15;
    if (totalQty === 0) {
      pct = 12;
      msgEl.innerHTML = `🎁 <strong>Guide PDF 15p Offert</strong> dès le 1er article + <strong>Pochette Satin Noël</strong> dès 50 €`;
    } else if (totalEur < 50) {
      pct = 55;
      const missing = Math.max(1, Math.ceil(50 - totalEur));
      msgEl.innerHTML = `✓ <strong>Guide PDF Débloqué !</strong> Plus que <strong>${missing} €</strong> pour la Pochette Satin Noël Offerte`;
    } else if (totalQty < 2) {
      pct = 82;
      msgEl.innerHTML = `🎉 <strong>Guide PDF + Livraison Express + Pochette Satin DÉBLOQUÉS !</strong> (Ajoutez un 2ème article pour -50%)`;
    } else {
      pct = 100;
      msgEl.innerHTML = `👑 <strong>PALIER MAXIMAL DÉBLOQUÉ :</strong> Livraison Express + Guide PDF + Pochette Satin + Offre Duo Noël !`;
    }

    fillEl.style.width = `${pct}%`;
    if (step1) step1.classList.toggle('unlocked', totalQty >= 1);
    if (step2) step2.classList.toggle('unlocked', totalEur >= 50);
    if (step3) step3.classList.toggle('unlocked', totalQty >= 2);
  };

  // ==========================================================================
  // HOOK AUTOMATIQUE SUR LES FONCTIONS EXISTANTES DE APP.JS
  // ==========================================================================
  function hookIntoAppLifecycle() {
    if (typeof window.renderCatalog === 'function') {
      const origRenderCatalog = window.renderCatalog;
      window.renderCatalog = function () {
        origRenderCatalog.apply(this, arguments);
        window.refreshOrevaScrollReveal();
        window.syncStickyQuickBuyBar();
      };
    }

    if (typeof window.renderBag === 'function') {
      const origRenderBag = window.renderBag;
      window.renderBag = function () {
        origRenderBag.apply(this, arguments);
        window.updateBagGamificationBar();
      };
    }

    if (typeof window.switchStorefrontUniverse === 'function') {
      const origSwitchUni = window.switchStorefrontUniverse;
      window.switchStorefrontUniverse = function (uKey) {
        origSwitchUni.apply(this, arguments);
        window.syncBeforeAfterWithUniverse(uKey);
        window.syncStickyQuickBuyBar();
      };
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemeMode();
    hookIntoAppLifecycle();
    initSpotlightAnd3DTilt();
    initMagneticButtons();
    initScrollListeners();

    setTimeout(() => {
      window.syncBeforeAfterWithUniverse(typeof currentUniverse !== 'undefined' ? currentUniverse : 'sleep');
      window.syncStickyQuickBuyBar();
      window.updateBagGamificationBar();
      window.refreshOrevaScrollReveal();
    }, 180);

    // Premier toast Social Proof après 9 secondes, puis toutes les 26 secondes
    setTimeout(triggerSocialProofToast, 9000);
    socialProofTimer = setInterval(triggerSocialProofToast, 26000);
  });
})();
