let currentMarketCode = 'FR';
let currentLang = 'fr';
let currentCategory = 'all';
let cart = [];
let activePdpProduct = null;
let selectedPdpTier = 1;
let cachedSettings = null;

function formatLocalPrice(basePriceEur) {
  const market = window.MARKETS_CONFIG[currentMarketCode];
  const adjustedEur = basePriceEur * market.priceMultiplier;
  const localAmount = (adjustedEur * market.rateFromEur).toFixed(2);
  return market.symbolPosition === 'before'
    ? `${market.symbol}${localAmount}`
    : `${localAmount} ${market.symbol}`;
}

function getAdjustedEurPrice(basePriceEur) {
  const market = window.MARKETS_CONFIG[currentMarketCode];
  return Number((basePriceEur * market.priceMultiplier).toFixed(2));
}

function calculateNetCommissionEur(product, qty = 1, discountFactor = 1.0) {
  const sellingEur = getAdjustedEurPrice(product.basePriceEur * discountFactor) * qty;
  const supplierCost = product.supplierCostEur * qty;
  const stripeFee = sellingEur * 0.02;
  return Number((sellingEur - supplierCost - stripeFee).toFixed(2));
}

function onMarketChange(marketCode) {
  currentMarketCode = marketCode;
  const market = window.MARKETS_CONFIG[marketCode];
  currentLang = market.lang;
  const hdrMarket = document.getElementById('marketSelect');
  if (hdrMarket) hdrMarket.value = marketCode;
  const glassMarket = document.getElementById('glassMarketSelect');
  if (glassMarket) glassMarket.value = marketCode;
  const hdrLang = document.getElementById('langSelect');
  if (hdrLang) hdrLang.value = currentLang;
  const glassLang = document.getElementById('glassLangSelect');
  if (glassLang) glassLang.value = currentLang;
  applyLocalization();
}

function onLanguageChange(lang) {
  currentLang = lang;
  const hdrLang = document.getElementById('langSelect');
  if (hdrLang) hdrLang.value = lang;
  const glassLang = document.getElementById('glassLangSelect');
  if (glassLang) glassLang.value = lang;
  applyLocalization();
}

let currentUniverse = 'sleep';
let currentSearchQuery = '';
let currentSortMode = 'featured';
let currentPriceFilter = 'all';
let currentCatalogPage = 1;
const CATALOG_PAGE_SIZE = 24;

function toggleGlassySidebar(open) {
  const drawer = document.getElementById('glassySidebarDrawer');
  const backdrop = document.getElementById('glassySidebarBackdrop');
  if (!drawer || !backdrop) return;
  if (open) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

// Règles d'isolation stricte par sous-domaine : AUCUN produit d'une autre niche n'apparaît sur un sous-domaine !
const STOREFRONT_PRODUCT_RULES = {
  sleep: {
    'prod-ergo-pillow': 'cervical',
    'prod-sleep-mask-bt': 'blackout',
    'prod-acoustic-earplugs': 'blackout',
    'prod-cryo-migraine': 'migraine',
    'prod-sleep-gummies': 'migraine',
    'bundle-sommeil-ultime': 'bundles'
  },
  ergo: {
    'prod-ortho-cushion': 'seating',
    'prod-lumbar-support': 'seating',
    'prod-neck-massager': 'massage',
    'prod-ortho-insoles': 'feet',
    'bundle-teletravail': 'bundles'
  },
  glow: {
    'prod-led-mask': 'adults',
    'prod-guasha-microcurrent': 'adults',
    'prod-brush-cleaner-pro': 'adults',
    'prod-hyaluronic-serum': 'adults',
    'prod-teen-led-vanity': 'teens',
    'prod-kids-creative-kit': 'kids'
  },
  thermo: {
    'prod-thermo-belt': 'heat',
    'prod-eye-thermo-mask': 'heat',
    'prod-neck-massager': 'heat',
    'prod-cryo-migraine': 'cryo',
    'bundle-thermo-cycle': 'bundles'
  }
};

const CREST_SVG_MOTIFS = {
  sleep: `
    <path d="M35.5 15.5 C26.5 17.5 22 26.8 25 35.5 C28 44.2 37.5 48 45.5 44 C38 49.5 26.5 47.5 21 39.5 C15.5 31.5 18 20 26.5 15 C29.5 13.5 32.5 14 35.5 15.5 Z" fill="url(#hdrGoldGrad)"/>
    <path d="M40 16 L41.3 22.7 L48 24 L41.3 25.3 L40 32 L38.7 25.3 L32 24 L38.7 22.7 Z" fill="#FAF5EA"/>
  `,
  ergo: `
    <path d="M32 9 L34.8 27.2 L53 32 L34.8 36.8 L32 55 L29.2 36.8 L11 32 L29.2 27.2 Z" fill="url(#hdrGoldGrad)"/>
    <circle cx="32" cy="21" r="2.1" fill="#FAF5EA"/>
    <circle cx="32" cy="32" r="2.8" fill="#FAF5EA"/>
    <circle cx="32" cy="43" r="2.1" fill="#FAF5EA"/>
  `,
  glow: `
    <path d="M32 8 L34.6 26.4 L53 20 L37.6 32 L53 44 L34.6 37.6 L32 56 L29.4 37.6 L11 44 L26.4 32 L11 20 L29.4 26.4 Z" fill="url(#hdrGoldGrad)"/>
    <circle cx="32" cy="32" r="3.4" fill="#FAF5EA"/>
  `,
  thermo: `
    <path d="M32 10 L35 27 L52 32 L35 37 L32 54 L29 37 L12 32 L29 27 Z" fill="url(#hdrGoldGrad)"/>
    <path d="M18 28 Q25 20 32 28 T46 28" stroke="#FAF5EA" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M18 36 Q25 28 32 36 T46 36" stroke="#E6C994" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `,
  sport: `
    <polygon points="32,9 49,21 49,43 32,55 15,43 15,21" fill="none" stroke="url(#hdrGoldGrad)" stroke-width="1.8"/>
    <path d="M35 16 L23 33 L32 33 L29 48 L41 31 L32 31 Z" fill="url(#hdrGoldGrad)"/>
  `,
  pets: `
    <circle cx="32" cy="36" r="7.5" fill="url(#hdrGoldGrad)"/>
    <circle cx="21" cy="25" r="3.4" fill="#FAF5EA"/>
    <circle cx="28" cy="20" r="3.6" fill="#FAF5EA"/>
    <circle cx="36" cy="20" r="3.6" fill="#FAF5EA"/>
    <circle cx="43" cy="25" r="3.4" fill="#FAF5EA"/>
  `,
  baby: `
    <path d="M32 13 L35.5 25 L48 25 L38 32.5 L41.5 45 L32 37.5 L22.5 45 L26 32.5 L16 25 L28.5 25 Z" fill="url(#hdrGoldGrad)"/>
    <circle cx="32" cy="31" r="3.2" fill="#FAF5EA"/>
  `,
  home: `
    <circle cx="32" cy="32" r="9" fill="url(#hdrGoldGrad)"/>
    <path d="M32 10 V18 M32 46 V54 M10 32 H18 M46 32 H54 M16.5 16.5 L22 22 M42 42 L47.5 47.5 M47.5 16.5 L42 22 M22 42 L16.5 47.5" stroke="#FAF5EA" stroke-width="1.8" stroke-linecap="round"/>
  `
};

function getProductsForUniverse(uniId) {
  const allowedMap = STOREFRONT_PRODUCT_RULES[uniId];
  return window.PRODUCTS_CATALOG.filter(p => {
    if (allowedMap && allowedMap[p.id]) return true;
    return p.universe === uniId;
  });
}

function getSubCategoryForProduct(prod, uniId) {
  const allowedMap = STOREFRONT_PRODUCT_RULES[uniId];
  if (allowedMap && allowedMap[prod.id]) return allowedMap[prod.id];
  return prod.subCategory || prod.category || 'flagship';
}

function switchUniverse(universeId) {
  currentUniverse = window.OREVA_UNIVERSES?.[universeId] ? universeId : 'sleep';
  currentSearchQuery = '';
  currentCatalogPage = 1;
  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) searchInput.value = '';

  const uniConfig = window.OREVA_UNIVERSES?.[currentUniverse] || window.OREVA_UNIVERSES.sleep;

  if (uniConfig) {
    document.title = uniConfig.pageTitle;
    const brandTitleEl = document.getElementById('activeBrandTitle');
    if (brandTitleEl) brandTitleEl.textContent = 'OREVA';
    const divPillEl = document.getElementById('activeDivisionPill');
    if (divPillEl) divPillEl.textContent = uniConfig.brandDivision.replace('OREVA ', '');
    const motifEl = document.getElementById('headerCrestDynamicMotif');
    if (motifEl) {
      motifEl.innerHTML = CREST_SVG_MOTIFS[currentUniverse] || CREST_SVG_MOTIFS.sleep;
    }
    const subLabel = document.getElementById('activeSubdomainLabel');
    if (subLabel) subLabel.textContent = uniConfig.subdomain;

    const footerBrand = document.getElementById('footerBrandTitle');
    if (footerBrand) footerBrand.textContent = uniConfig.brandDivision;
    const footerUrl = document.getElementById('footerSubdomainUrl');
    if (footerUrl) footerUrl.textContent = `${uniConfig.subdomain} • ${uniConfig.vercelDomain}`;

    const eyeEl = document.getElementById('heroEyebrow');
    if (eyeEl) eyeEl.textContent = uniConfig.eyebrow;
    const titleEl = document.getElementById('heroTitle');
    if (titleEl) titleEl.textContent = uniConfig.title;
    const subEl = document.getElementById('heroSubtitle');
    if (subEl) subEl.textContent = uniConfig.subtitle;

    const heroImg = document.getElementById('heroMainImg');
    if (heroImg && uniConfig.heroImg) heroImg.src = uniConfig.heroImg;
    const heroCardTitle = document.getElementById('heroCardTitle');
    if (heroCardTitle && uniConfig.heroCardTitle) heroCardTitle.textContent = uniConfig.heroCardTitle;
    const heroCardBtn = document.getElementById('heroCardBtn');
    if (heroCardBtn && uniConfig.heroCardProductId) {
      heroCardBtn.onclick = () => openProductDetail(uniConfig.heroCardProductId);
    }

    const secTag = document.getElementById('sectionTag');
    if (secTag) secTag.textContent = uniConfig.sectionTag;
    const secTitle = document.getElementById('sectionTitle');
    if (secTitle) secTitle.textContent = uniConfig.sectionTitle;

    const totalUniProds = getProductsForUniverse(currentUniverse).length;
    const divLabel = `${(uniConfig.divisionName || currentUniverse).toUpperCase()} LAB™`;
    const glassDrawerBadge = document.getElementById('glassDrawerDivisionBadge');
    if (glassDrawerBadge) glassDrawerBadge.textContent = divLabel;
    const stickyGlassBadge = document.getElementById('stickyGlassLabBadge');
    if (stickyGlassBadge) stickyGlassBadge.textContent = divLabel;

    // Onglets de sous-catégories strictement limités au sous-domaine actif avec compteur dynamique
    const tabsWrap = document.getElementById('categoryTabsContainer');
    if (tabsWrap && Array.isArray(uniConfig.subCategories)) {
      tabsWrap.innerHTML = uniConfig.subCategories.map((sc, idx) => {
        const labelText = sc.id === 'all'
          ? `${sc.label.replace(/\s*\(\d+\)/, '')} (${totalUniProds})`
          : sc.label;
        return `<button id="catTab-${sc.id}" class="cat-tab ${idx === 0 ? 'active' : ''}" onclick="filterCategory('${sc.id}')">${labelText}</button>`;
      }).join('');
    }

    renderGlassySidebarCategories(uniConfig);

    // Section Science Clinique dédiée au sous-domaine
    const sciImg = document.getElementById('scienceMainImg');
    if (sciImg && uniConfig.scienceImg) sciImg.src = uniConfig.scienceImg;
    const edBadge = document.getElementById('editorialBadge');
    if (edBadge) edBadge.textContent = uniConfig.editorialBadge;
    const edTitle = document.getElementById('editorialTitle');
    if (edTitle) edTitle.textContent = uniConfig.editorialTitle;
    const edP1 = document.getElementById('editorialP1');
    if (edP1) edP1.textContent = uniConfig.editorialP1;
    const edP2 = document.getElementById('editorialP2');
    if (edP2) edP2.textContent = uniConfig.editorialP2;

    // Avis clients vérifiés 100% dédiés au sous-domaine
    const revWrap = document.getElementById('reviewsGridContainer');
    if (revWrap && Array.isArray(uniConfig.reviews)) {
      revWrap.innerHTML = uniConfig.reviews.map(r => `
        <div class="luxury-card" style="padding:28px;">
          <div class="stars-gold" style="margin-bottom:12px;">★★★★★ <span style="color:#14532D; font-size:0.74rem; font-weight:700; margin-left:8px;">✓ Achat Vérifié • ${r.city}</span></div>
          <h4 style="font-family:var(--font-serif); font-size:1.35rem; margin-bottom:10px;">${r.quote}</h4>
          <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:18px;">${r.body}</p>
          <div style="margin-top:auto; font-size:0.78rem; font-weight:700; color:var(--obsidian);">${r.author}</div>
        </div>
      `).join('');
    }

    // Upsell Panier 100% cohérent avec le sous-domaine actif
    renderStorefrontUpsell(uniConfig.upsellProductId);
  }

  filterCategory('all');
}

function renderStorefrontUpsell(upsellProdId) {
  const upsellBox = document.getElementById('bagUpsellDynamic');
  if (!upsellBox) return;
  const uniProds = getProductsForUniverse(currentUniverse);
  const prod = window.PRODUCTS_CATALOG.find(p => p.id === upsellProdId) || uniProds[0] || window.PRODUCTS_CATALOG[0];
  if (!prod) return;
  const title = prod.title[currentLang] || prod.title.fr;
  upsellBox.innerHTML = `
    <img src="${prod.images[0]}" alt="${title}" style="width:48px; height:48px; border-radius:4px; object-fit:cover;" />
    <div style="flex:1;">
      <div style="font-size:0.8rem; font-weight:700; line-height:1.25;">${title}</div>
      <div style="font-size:0.75rem; color:var(--emerald); font-weight:700;">${formatLocalPrice(prod.basePriceEur)}</div>
    </div>
    <button class="btn-card-add" style="padding:8px 12px; font-size:0.72rem; white-space:nowrap;" onclick="addToCart('${prod.id}', 1)">
      + Ajouter
    </button>
  `;
}

function applyLocalization() {
  const market = window.MARKETS_CONFIG[currentMarketCode];
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;
  const uniConfig = window.OREVA_UNIVERSES?.[currentUniverse] || window.OREVA_UNIVERSES.sleep;

  document.getElementById('announcementBar').textContent = `🎄 OPÉRATION NOËL ${uniConfig.brandDivision} : 2ÈME À -50% • RETOURS JUSQU'AU 15 JANVIER • ${market.warehouseLabel[currentLang]}`;
  const navShop = document.getElementById('navShop');
  if (navShop) navShop.textContent = t.navShop;
  const navScience = document.getElementById('navScience');
  if (navScience) navScience.textContent = t.navScience;

  document.getElementById('heroCardHub').textContent = `HUB LOGISTIQUE : ${market.warehouseCity.toUpperCase()} (${market.deliveryDays.toUpperCase()})`;

  document.getElementById('bagHeaderTitle').textContent = t.cartHeader;
  document.getElementById('upsellHeader').textContent = t.upsellHeader;
  document.getElementById('subtotalLabel').textContent = t.subtotalLabel;
  document.getElementById('shippingLabel').textContent = t.shippingLabel;
  document.getElementById('shippingFree').textContent = t.shippingFree;
  document.getElementById('checkoutBtn').textContent = t.checkoutBtn;

  renderStorefrontUpsell(uniConfig.upsellProductId);
  renderCatalog();
  renderBag();
}

function renderGlassySidebarCategories(uniConfig) {
  if (!uniConfig || !Array.isArray(uniConfig.subCategories)) return;
  const uniProducts = getProductsForUniverse(currentUniverse);
  const html = uniConfig.subCategories.map(sc => {
    let count = 0;
    if (sc.id === 'all') {
      count = uniProducts.length;
    } else if (sc.id === 'bundles') {
      count = uniProducts.filter(p => {
        const sub = getSubCategoryForProduct(p, currentUniverse);
        return sub === 'bundles' || sub === 'teens' || sub === 'kids' || p.category === 'bundles';
      }).length;
    } else {
      count = uniProducts.filter(p => getSubCategoryForProduct(p, currentUniverse) === sc.id).length;
    }
    const cleanLabel = sc.label.replace(/\s*\(\d+\)/, '');
    const isActive = currentCategory === sc.id;
    return `
      <button
        type="button"
        class="glassy-nav-item ${isActive ? 'active' : ''}"
        data-cat="${sc.id}"
        onclick="filterCategory('${sc.id}', true)"
      >
        <span class="glassy-nav-label">${cleanLabel}</span>
        <span class="glassy-nav-count">${count}</span>
      </button>
    `;
  }).join('');

  const drawerList = document.getElementById('glassDrawerCategoriesList');
  if (drawerList) drawerList.innerHTML = html;
  const stickyList = document.getElementById('stickyGlassCategoriesList');
  if (stickyList) stickyList.innerHTML = html;
}

function filterCategory(cat, fromGlassSidebar = false) {
  currentCategory = cat || 'all';
  currentCatalogPage = 1;
  document.querySelectorAll('#collectionSection .cat-tab').forEach(btn => btn.classList.remove('active'));
  const active = document.getElementById(`catTab-${currentCategory}`);
  if (active) active.classList.add('active');

  document.querySelectorAll('.glassy-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === currentCategory);
  });

  if (fromGlassSidebar) {
    toggleGlassySidebar(false);
    document.getElementById('collectionSection')?.scrollIntoView({ behavior: 'smooth' });
  }
  renderCatalog();
}

function onCatalogPriceFilter(priceTier) {
  currentPriceFilter = priceTier || 'all';
  currentCatalogPage = 1;
  document.querySelectorAll('.glassy-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-price') === currentPriceFilter);
  });
  renderCatalog();
}

function onCatalogSearch(query) {
  currentSearchQuery = (query || '').trim().toLowerCase();
  currentCatalogPage = 1;
  const mainInput = document.getElementById('catalogSearchInput');
  if (mainInput && mainInput.value.toLowerCase() !== currentSearchQuery) {
    mainInput.value = query;
  }
  const glassInput = document.getElementById('glassDrawerSearchInput');
  if (glassInput && glassInput.value.toLowerCase() !== currentSearchQuery) {
    glassInput.value = query;
  }
  renderCatalog();
}

function onCatalogSort(sortMode) {
  currentSortMode = sortMode || 'featured';
  currentCatalogPage = 1;
  const sel = document.getElementById('catalogSortSelect');
  if (sel && sel.value !== currentSortMode) sel.value = currentSortMode;
  document.querySelectorAll('.glassy-sort-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-sort') === currentSortMode);
  });
  renderCatalog();
}

function goToCatalogPage(pageNum) {
  currentCatalogPage = Math.max(1, pageNum);
  renderCatalog();
  document.getElementById('collectionSection')?.scrollIntoView({ behavior: 'smooth' });
}

function renderCatalog() {
  const grid = document.getElementById('productsGrid');
  const market = window.MARKETS_CONFIG[currentMarketCode];
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;
  const showMarginOverlay = isAdminAuthenticated && document.getElementById('toggleMarginOverlay')?.checked;

  const uniProducts = getProductsForUniverse(currentUniverse);

  let filtered = uniProducts.filter(p => {
    const subCat = getSubCategoryForProduct(p, currentUniverse);
    if (currentCategory !== 'all') {
      if (currentCategory === 'bundles') {
        if (!(subCat === 'bundles' || subCat === 'teens' || subCat === 'kids' || p.category === 'bundles')) return false;
      } else if (subCat !== currentCategory) {
        return false;
      }
    }
    if (currentPriceFilter !== 'all') {
      if (currentPriceFilter === 'under50' && p.basePriceEur >= 50) return false;
      if (currentPriceFilter === '50to90' && (p.basePriceEur < 50 || p.basePriceEur > 90)) return false;
      if (currentPriceFilter === 'over90' && p.basePriceEur <= 90) return false;
    }
    if (currentSearchQuery) {
      const hay = `${p.title?.fr || ''} ${p.title?.en || ''} ${p.subtitle?.fr || ''} ${p.shortDesc?.fr || ''} ${p.sku || ''}`.toLowerCase();
      if (!hay.includes(currentSearchQuery)) return false;
    }
    return true;
  });

  if (currentSortMode === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.basePriceEur - b.basePriceEur);
  } else if (currentSortMode === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.basePriceEur - a.basePriceEur);
  } else if (currentSortMode === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / CATALOG_PAGE_SIZE));
  if (currentCatalogPage > totalPages) currentCatalogPage = totalPages;

  const startIdx = (currentCatalogPage - 1) * CATALOG_PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + CATALOG_PAGE_SIZE);

  const countBadge = document.getElementById('catalogCountBadge');
  if (countBadge) {
    countBadge.textContent = totalCount > 0
      ? `Affichage ${startIdx + 1}–${Math.min(startIdx + CATALOG_PAGE_SIZE, totalCount)} sur ${totalCount} références`
      : '0 référence trouvée';
  }

  const pagBar = document.getElementById('catalogPaginationBar');
  if (pagBar) {
    if (totalPages <= 1) {
      pagBar.innerHTML = '';
    } else {
      let buttonsHtml = `
        <button class="btn-card-detail" style="padding:8px 14px;" ${currentCatalogPage === 1 ? 'disabled style="opacity:0.4;padding:8px 14px;"' : ''} onclick="goToCatalogPage(${currentCatalogPage - 1})">
          ← Page Précédente
        </button>
      `;
      const maxVisible = 7;
      let startP = Math.max(1, currentCatalogPage - 3);
      let endP = Math.min(totalPages, startP + maxVisible - 1);
      if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);

      for (let p = startP; p <= endP; p++) {
        const isCurrent = p === currentCatalogPage;
        buttonsHtml += `
          <button
            onclick="goToCatalogPage(${p})"
            style="padding:8px 13px; border-radius:6px; font-weight:700; font-size:0.82rem; cursor:pointer; border:1px solid ${isCurrent ? 'var(--obsidian)' : 'var(--border-subtle)'}; background:${isCurrent ? 'var(--obsidian)' : '#fff'}; color:${isCurrent ? '#fff' : 'var(--obsidian)'};"
          >${p}</button>
        `;
      }
      buttonsHtml += `
        <button class="btn-card-detail" style="padding:8px 14px;" ${currentCatalogPage === totalPages ? 'disabled style="opacity:0.4;padding:8px 14px;"' : ''} onclick="goToCatalogPage(${currentCatalogPage + 1})">
          Page Suivante (${currentCatalogPage}/${totalPages}) →
        </button>
      `;
      pagBar.innerHTML = buttonsHtml;
    }
  }

  const products = pageItems;

  grid.innerHTML = products.map(prod => {
    const title = prod.title[currentLang] || prod.title.fr;
    const subtitle = prod.subtitle[currentLang] || prod.subtitle.fr;
    const desc = prod.shortDesc[currentLang] || prod.shortDesc.fr;
    const netComm = calculateNetCommissionEur(prod, 1, 1.0);

    const marginHtml = showMarginOverlay
      ? `<div class="partner-margin-pill">
           <span>Coût fournisseur livré : ${prod.supplierCostEur.toFixed(2)} €</span>
           <strong>Votre Marge : +${netComm.toFixed(2)} € net</strong>
         </div>`
      : '';

    return `
      <article class="luxury-card">
        <div class="card-media" onclick="openProductDetail('${prod.id}')">
          <img src="${prod.images[0]}" alt="${title}" loading="lazy" />
          <div class="card-top-badges">
            <span class="badge-editorial">${prod.badge}</span>
            <span class="badge-clinical">${prod.clinicalStat} ${t.clinicalScoreLabel}</span>
          </div>
        </div>
        ${marginHtml}
        <div class="card-content">
          <div class="card-meta-row">
            <div>
              <span class="stars-gold">★★★★★</span>
              <span class="reviews-count">${prod.rating} (${prod.reviewsCount})</span>
            </div>
            <span class="warehouse-tag">✓ Hub ${market.warehouseCity.split('/')[0]}</span>
          </div>
          <h3 class="card-title" onclick="openProductDetail('${prod.id}')">${title}</h3>
          <div class="card-subtitle">${subtitle}</div>
          <p class="card-description">${desc}</p>

          <div class="card-bottom">
            <div class="price-wrap">
              <span class="price-now">${formatLocalPrice(prod.basePriceEur)}</span>
              <span class="price-was">${formatLocalPrice(prod.compareAtEur)}</span>
            </div>
            <div class="card-cta-group">
              <button class="btn-card-detail" onclick="openProductDetail('${prod.id}')">Détails & Duo -50%</button>
              <button class="btn-card-add" onclick="addToCart('${prod.id}', 1)">+ ${t.addToBag}</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openProductDetail(productId) {
  const prod = window.PRODUCTS_CATALOG.find(p => p.id === productId);
  if (!prod) return;
  activePdpProduct = prod;
  selectedPdpTier = 1;

  const market = window.MARKETS_CONFIG[currentMarketCode];
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;

  document.getElementById('pdpMainImg').src = prod.images[0];
  document.getElementById('pdpThumbs').innerHTML = prod.images.map((imgUrl, idx) => `
    <img src="${imgUrl}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="switchPdpImage('${imgUrl}', this)" alt="Vue ${idx + 1}" />
  `).join('');

  document.getElementById('pdpBadge').textContent = prod.badge;
  document.getElementById('pdpRating').textContent = `★★★★★ ${prod.rating} (${prod.reviewsCount} avis vérifiés)`;
  document.getElementById('pdpTitle').textContent = prod.title[currentLang] || prod.title.fr;
  document.getElementById('pdpSubtitle').textContent = prod.subtitle[currentLang] || prod.subtitle.fr;
  document.getElementById('pdpDesc').textContent = prod.shortDesc[currentLang] || prod.shortDesc.fr;

  const highlights = prod.highlights[currentLang] || prod.highlights.fr;
  document.getElementById('pdpHighlights').innerHTML = highlights.map(h => `
    <li style="display:flex; align-items:flex-start; gap:8px;">
      <span style="color:var(--emerald); font-weight:800;">✓</span>
      <span>${h}</span>
    </li>
  `).join('') + `
    <li style="display:flex; align-items:flex-start; gap:8px; color:#B91C1C; font-weight:700; margin-top:4px;">
      <span>🎄</span>
      <span>Bonus Noël : Guide Protocole PDF (15 pages) OFFERT + Retours prolongés jusqu'au 15 Janvier</span>
    </li>
  `;

  document.getElementById('pdpShippingNote').textContent = `🚚 ${t.shippingFrom} ${market.warehouseCity} (${market.deliveryDays} via ${market.carrier}) • Livraison Garantie avant Noël`;
  document.getElementById('pdpSpecs').textContent = prod.specs || '';

  renderPdpTiers();
  document.getElementById('pdpBackdrop').classList.add('open');
}

function switchPdpImage(url, thumbEl) {
  document.getElementById('pdpMainImg').src = url;
  document.querySelectorAll('.pdp-thumb').forEach(el => el.classList.remove('active'));
  thumbEl.classList.add('active');
}

function selectPdpTier(tierQty) {
  selectedPdpTier = tierQty;
  renderPdpTiers();
}

function renderPdpTiers() {
  if (!activePdpProduct) return;
  const prod = activePdpProduct;

  const tiers = [
    { qty: 1, discount: 1.0, label: '1 Unité + Guide PDF Protocole Offert (0€)', tag: '' },
    { qty: 2, discount: 0.75, label: '🎁 DUO NOËL (2 Unités) : 1 Acheté = Le 2ème à -50%', tag: 'OFFRE NOËL LA PLUS CHOISIE' },
    { qty: 3, discount: 0.70, label: '🎄 PACK FAMILLE (3 Unités) : -30% + Pochette Cadeau Offerte', tag: 'MEILLEURE VALEUR' }
  ];

  const activeTierObj = tiers.find(tr => tr.qty === selectedPdpTier) || tiers[0];
  const totalUnitPriceEur = prod.basePriceEur * activeTierObj.discount * activeTierObj.qty;

  document.getElementById('pdpPriceNow').textContent = formatLocalPrice(totalUnitPriceEur);
  document.getElementById('pdpPriceWas').textContent = formatLocalPrice(prod.compareAtEur * activeTierObj.qty);

  const ownerBox = document.getElementById('pdpOwnerBox');
  if (ownerBox) {
    if (isAdminAuthenticated) {
      ownerBox.style.display = 'block';
      const netComm = calculateNetCommissionEur(prod, activeTierObj.qty, activeTierObj.discount);
      const currentSku = cachedSettings?.skuMappings?.[prod.id] || prod.sku;
      ownerBox.innerHTML = `
        <div style="font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:#6EE7B7; margin-bottom:4px;">🔒 DONNÉES PROPRIÉTAIRE (SKU : ${currentSku})</div>
        <div style="display:flex; justify-content:space-between;">
          <span>Fournisseur : <strong>${prod.supplier}</strong></span>
          <span>Votre Commission : <strong style="color:#fff; font-size:0.92rem;">+${netComm.toFixed(2)} € net</strong></span>
        </div>
      `;
    } else {
      ownerBox.style.display = 'none';
    }
  }

  document.getElementById('pdpTiers').innerHTML = tiers.map(tr => {
    const tierPriceEur = prod.basePriceEur * tr.discount * tr.qty;
    const isSelected = tr.qty === selectedPdpTier;
    return `
      <div class="tier-option ${isSelected ? 'selected' : ''}" onclick="selectPdpTier(${tr.qty})">
        <div>
          <strong style="font-size:0.86rem;">${tr.label}</strong>
          ${tr.tag ? `<span class="tier-badge">${tr.tag}</span>` : ''}
        </div>
        <strong style="font-size:0.95rem;">${formatLocalPrice(tierPriceEur)}</strong>
      </div>
    `;
  }).join('');

  document.getElementById('pdpAddBtn').onclick = () => {
    addToCart(prod.id, activeTierObj.qty, activeTierObj.discount);
    closePdp();
  };
}

function closePdp() {
  document.getElementById('pdpBackdrop').classList.remove('open');
}

function addToCart(productId, qty = 1, discountFactor = 1.0) {
  const prod = window.PRODUCTS_CATALOG.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.qty += qty;
    existing.discountFactor = Math.min(existing.discountFactor, discountFactor);
  } else {
    cart.push({ product: prod, qty, discountFactor });
  }
  renderBag();
  toggleBag(true);
}

function updateBagQty(productId, delta) {
  const idx = cart.findIndex(i => i.product.id === productId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  renderBag();
}

function renderBag() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('bagCount').textContent = count;

  const container = document.getElementById('bagItemsContainer');
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:64px 20px;">
        <div style="font-family:var(--font-serif); font-size:1.6rem; margin-bottom:8px;">${t.cartEmptyTitle}</div>
        <p style="font-size:0.84rem; color:var(--text-muted);">${t.cartEmptySub}</p>
      </div>
    `;
    document.getElementById('bagTotalAmount').textContent = formatLocalPrice(0);
    return;
  }

  let totalBaseEur = 0;

  container.innerHTML = cart.map(item => {
    const p = item.product;
    const lineBaseEur = p.basePriceEur * item.discountFactor * item.qty;
    totalBaseEur += lineBaseEur;
    const title = p.title[currentLang] || p.title.fr;

    return `
      <div class="bag-item">
        <img src="${p.images[0]}" alt="${title}" />
        <div>
          <div style="font-weight:700; font-size:0.86rem; line-height:1.3; margin-bottom:4px;">${title}</div>
          <div style="font-size:0.82rem; font-weight:700; color:var(--obsidian);">${formatLocalPrice(lineBaseEur)}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn-card-detail" style="padding:4px 9px;" onclick="updateBagQty('${p.id}', -1)">−</button>
          <strong style="font-size:0.84rem;">${item.qty}</strong>
          <button class="btn-card-detail" style="padding:4px 9px;" onclick="updateBagQty('${p.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('bagTotalAmount').textContent = formatLocalPrice(totalBaseEur);
}

function toggleBag(open) {
  const drawer = document.getElementById('bagDrawer');
  const backdrop = document.getElementById('bagBackdrop');
  if (open) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

// ==================== ESPACE COMPTE CLIENT & CARNET D'ADRESSE ====================
function getSavedCustomerProfile() {
  try {
    const raw = localStorage.getItem('aura_customer_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateHeaderAccountBadge() {
  const prof = getSavedCustomerProfile();
  const labelEl = document.getElementById('accountBtnLabel');
  if (!labelEl) return;
  if (prof && prof.firstName) {
    labelEl.textContent = `${prof.firstName} (Mon Compte)`;
  } else {
    labelEl.textContent = 'Mon Compte';
  }
}

async function openAccountModal() {
  const prof = getSavedCustomerProfile();
  if (prof) {
    document.getElementById('accFirstName').value = prof.firstName || '';
    document.getElementById('accLastName').value = prof.lastName || '';
    document.getElementById('accEmail').value = prof.email || '';
    document.getElementById('accPhone').value = prof.phone || '';
    document.getElementById('accAddress1').value = prof.addressLine1 || '';
    document.getElementById('accAddress2').value = prof.addressLine2 || '';
    document.getElementById('accZip').value = prof.postalCode || '';
    document.getElementById('accCity').value = prof.city || '';
    document.getElementById('accCountry').value = prof.countryCode || currentMarketCode;
    await refreshAccountOrders(prof.email);
  } else {
    document.getElementById('accCountry').value = currentMarketCode;
    document.getElementById('accOrdersList').innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">Créez votre compte ci-dessus ou entrez votre email de commande pour afficher votre historique.</p>`;
  }
  document.getElementById('accountModal').classList.add('open');
}

function closeAccountModal() {
  document.getElementById('accountModal').classList.remove('open');
}

async function saveCustomerAccount(e) {
  e.preventDefault();
  const profile = {
    firstName: document.getElementById('accFirstName').value.trim(),
    lastName: document.getElementById('accLastName').value.trim(),
    email: document.getElementById('accEmail').value.trim(),
    phone: document.getElementById('accPhone').value.trim(),
    addressLine1: document.getElementById('accAddress1').value.trim(),
    addressLine2: document.getElementById('accAddress2').value.trim(),
    postalCode: document.getElementById('accZip').value.trim(),
    city: document.getElementById('accCity').value.trim(),
    countryCode: document.getElementById('accCountry').value
  };

  localStorage.setItem('aura_customer_profile', JSON.stringify(profile));
  updateHeaderAccountBadge();

  await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });

  const fb = document.getElementById('accSaveFeedback');
  fb.textContent = '✓ Compte & adresse sauvegardés !';
  setTimeout(() => { fb.textContent = ''; }, 3500);
  await refreshAccountOrders(profile.email);
}

async function refreshAccountOrders(email) {
  const listEl = document.getElementById('accOrdersList');
  if (!email) return;
  try {
    const res = await fetch(`/api/customers?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    const orders = data.orders || [];
    if (orders.length === 0) {
      listEl.innerHTML = `<div style="background:var(--bg-stone); padding:14px; border-radius:6px; font-size:0.82rem;">Aucune commande associée à <strong>${email}</strong> pour le moment. Votre adresse est prête pour votre prochaine commande !</div>`;
      return;
    }
    listEl.innerHTML = orders.map(o => `
      <div style="background:var(--bg-stone); border:1px solid var(--border-subtle); padding:14px; border-radius:6px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:4px;">
          <span>Commande ${o.id} — ${o.displayTotal}</span>
          <span style="color:var(--emerald);">${o.fulfillment.status}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary);">Livraison : ${o.customer.address || o.customer.city}</div>
        <div style="font-size:0.78rem; margin-top:4px;">Suivi : <code>${o.fulfillment.trackingNumber}</code> (${o.fulfillment.carrier})</div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// Checkout Client (3 Étapes : Contact/Compte + Adresse Complète + Paiement)
function openCheckoutModal() {
  if (cart.length === 0) {
    addToCart('bundle-sommeil-ultime', 1, 1.0);
  }
  toggleBag(false);

  const market = window.MARKETS_CONFIG[currentMarketCode];
  document.getElementById('chkMarketLabel').textContent = `${market.name} ${market.flag} (${market.currency})`;
  document.getElementById('chkWarehouseLabel').textContent = `${market.warehouseCity} — Livraison en ${market.deliveryDays} (${market.carrier})`;

  const paySelect = document.getElementById('custPaymentMethod');
  paySelect.innerHTML = market.paymentMethods.map(m => `<option value="${m}">${m}</option>`).join('');

  // Si le client a déjà créé son compte, on pré-remplit son adresse automatiquement
  const savedProf = getSavedCustomerProfile();
  if (savedProf) {
    document.getElementById('custEmail').value = savedProf.email || '';
    document.getElementById('custPhone').value = savedProf.phone || '';
    document.getElementById('custFirstName').value = savedProf.firstName || '';
    document.getElementById('custLastName').value = savedProf.lastName || '';
    document.getElementById('custAddress1').value = savedProf.addressLine1 || '';
    document.getElementById('custAddress2').value = savedProf.addressLine2 || '';
    document.getElementById('custPostalCode').value = savedProf.postalCode || '';
    document.getElementById('custCity').value = savedProf.city || '';
  }

  recalculateCheckoutTotals();

  document.getElementById('checkoutFormWrap').classList.remove('hidden');
  document.getElementById('checkoutSuccessWrap').classList.add('hidden');
  document.getElementById('checkoutModal').classList.add('open');
}

function recalculateCheckoutTotals() {
  let totalBaseEur = 0;
  let totalSupplierEur = 0;
  cart.forEach(i => {
    totalBaseEur += i.product.basePriceEur * i.discountFactor * i.qty;
    totalSupplierEur += i.product.supplierCostEur * i.qty;
  });

  const giftWrapChecked = document.getElementById('chkGiftWrapOption')?.checked;
  const giftLabel = document.getElementById('chkGiftPriceLabel');
  if (giftLabel) {
    giftLabel.textContent = totalBaseEur >= 50 ? 'OFFERTE (0,00 €)' : '+2,90 €';
  }
  if (giftWrapChecked && totalBaseEur < 50) {
    totalBaseEur += 2.90;
    totalSupplierEur += 0.40;
  }

  const paidEur = getAdjustedEurPrice(totalBaseEur);
  const stripeFee = Number((paidEur * 0.02).toFixed(2));
  const netCommission = Number((paidEur - totalSupplierEur - stripeFee).toFixed(2));

  document.getElementById('chkPaidDisplay').textContent = `${formatLocalPrice(totalBaseEur)} (≈ ${paidEur.toFixed(2)} €)`;
  document.getElementById('chkCostDisplay').textContent = `-${totalSupplierEur.toFixed(2)} €`;
  document.getElementById('chkCommissionDisplay').textContent = `+${netCommission.toFixed(2)} € net`;
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('open');
}

async function submitOrder(e) {
  e.preventDefault();
  const market = window.MARKETS_CONFIG[currentMarketCode];
  let totalBaseEur = 0;
  let totalSupplierEur = 0;

  const itemsPayload = cart.map(i => {
    const unitBaseEur = i.product.basePriceEur * i.discountFactor;
    totalBaseEur += unitBaseEur * i.qty;
    totalSupplierEur += i.product.supplierCostEur * i.qty;
    return {
      id: i.product.id,
      sku: cachedSettings?.skuMappings?.[i.product.id] || i.product.sku,
      title: i.product.title.fr,
      qty: i.qty,
      retailEur: getAdjustedEurPrice(unitBaseEur),
      supplierCostEur: i.product.supplierCostEur,
      supplier: i.product.supplier
    };
  });

  if (document.getElementById('chkGiftWrapOption')?.checked) {
    const giftPriceEur = totalBaseEur >= 50 ? 0 : 2.90;
    totalBaseEur += giftPriceEur;
    totalSupplierEur += 0.40;
    itemsPayload.push({
      id: 'gift-wrap-noel',
      sku: 'ORV-GIFT-BOX-NOEL',
      title: '🎁 Pochette Cadeau Satin OREVA LAB™ + Guide PDF 15p Offert',
      qty: 1,
      retailEur: giftPriceEur,
      supplierCostEur: 0.40,
      supplier: 'OREVA LAB Packaging'
    });
  }

  const totalPaidEur = getAdjustedEurPrice(totalBaseEur);

  const customerData = {
    firstName: document.getElementById('custFirstName').value.trim(),
    lastName: document.getElementById('custLastName').value.trim(),
    name: `${document.getElementById('custFirstName').value.trim()} ${document.getElementById('custLastName').value.trim()}`.trim(),
    email: document.getElementById('custEmail').value.trim(),
    phone: document.getElementById('custPhone').value.trim(),
    addressLine1: document.getElementById('custAddress1').value.trim(),
    addressLine2: document.getElementById('custAddress2').value.trim(),
    postalCode: document.getElementById('custPostalCode').value.trim(),
    city: document.getElementById('custCity').value.trim(),
    state: document.getElementById('custState').value.trim(),
    countryCode: currentMarketCode
  };

  if (document.getElementById('chkCreateAccount')?.checked) {
    localStorage.setItem('aura_customer_profile', JSON.stringify(customerData));
    updateHeaderAccountBadge();
  }

  const payload = {
    customer: customerData,
    createAccount: Boolean(document.getElementById('chkCreateAccount')?.checked),
    countryCode: currentMarketCode,
    countryName: market.name,
    currency: market.currency,
    displayTotal: formatLocalPrice(totalBaseEur),
    totalPaidEur,
    supplierCostTotalEur: Number(totalSupplierEur.toFixed(2)),
    paymentMethod: document.getElementById('custPaymentMethod').value,
    items: itemsPayload
  };

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();

  if (data.success) {
    cart = [];
    renderBag();
    if (isAdminAuthenticated) {
      await loadBackofficeData();
      await loadBackofficeCustomers();
    }

    const ord = data.order;
    document.getElementById('orderConfirmationBox').innerHTML = `
      <div><strong>Référence :</strong> <code>${ord.id}</code></div>
      <div><strong>Destinataire :</strong> ${ord.customer.name} (${ord.customer.phone || ord.customer.email})</div>
      <div><strong>Adresse d'expédition enregistrée :</strong> ${ord.customer.address} (${ord.customer.countryName})</div>
      <div><strong>Total réglé :</strong> ${ord.displayTotal} via ${ord.paymentMethod}</div>
      ${isAdminAuthenticated ? `<div style="color:var(--emerald); font-size:0.95rem; margin:6px 0;"><strong>🔒 Votre Commission Nette Créditée : +${ord.netCommissionEur.toFixed(2)} € (${ord.marginPercent}%)</strong></div>` : ''}
      <div style="padding-top:8px; border-top:1px solid var(--border-subtle);">
        <div><strong>Entrepôt d'expédition :</strong> ${ord.fulfillment.warehouse}</div>
        <div><strong>Numéro de suivi :</strong> <code>${ord.fulfillment.trackingNumber}</code> (${ord.fulfillment.estimatedDelivery})</div>
      </div>
    `;

    document.getElementById('checkoutFormWrap').classList.add('hidden');
    document.getElementById('checkoutSuccessWrap').classList.remove('hidden');
  }
}

// ==================== MODULE DE SUIVI DE COMMANDE EN DIRECT ====================
function openTrackingModal() {
  document.getElementById('trackingModal').classList.add('open');
  lookupOrderTracking();
}

function closeTrackingModal() {
  document.getElementById('trackingModal').classList.remove('open');
}

async function lookupOrderTracking(e) {
  if (e) e.preventDefault();
  const query = document.getElementById('trackingQueryInput').value.trim();
  const box = document.getElementById('trackingResultBox');
  box.innerHTML = `<p style="font-size:0.84rem; color:var(--text-muted);">Recherche dans le réseau logistique...</p>`;

  const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (!data.found) {
    box.innerHTML = `
      <div style="background:#FEF2F2; border:1px solid #FECACA; color:#991B1B; padding:14px; border-radius:6px; font-size:0.84rem;">
        Aucune commande trouvée pour <strong>${query}</strong>. Essayez par exemple <code>${data.demoHint}</code>.
      </div>
    `;
    return;
  }

  const o = data.order;
  box.innerHTML = `
    <div style="background:var(--bg-stone); border:1px solid var(--border-subtle); border-radius:8px; padding:18px; font-size:0.84rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <strong>Commande ${o.id}</strong>
        <span style="background:#DCFCE7; color:#14532D; font-weight:700; padding:4px 10px; border-radius:99px; font-size:0.74rem;">${o.fulfillment.status}</span>
      </div>
      <div style="margin-bottom:6px;"><strong>Destinataire :</strong> ${o.customer.name} — ${o.customer.city} (${o.customer.countryName})</div>
      <div style="margin-bottom:6px;"><strong>Hub d'expédition :</strong> ${o.fulfillment.warehouse}</div>
      <div style="margin-bottom:6px;"><strong>Transporteur :</strong> ${o.fulfillment.carrier} • N° Tracking : <code>${o.fulfillment.trackingNumber}</code></div>
      <div style="margin-bottom:14px; color:var(--emerald); font-weight:700;">Délai estimé : ${o.fulfillment.estimatedDelivery}</div>

      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; text-align:center; font-size:0.7rem; padding-top:12px; border-top:1px solid var(--border-subtle);">
        <div style="color:var(--emerald); font-weight:700;">1. Confirmée ✓</div>
        <div style="color:var(--emerald); font-weight:700;">2. Préparée Hub ✓</div>
        <div style="color:var(--emerald); font-weight:700;">3. En Transit ✓</div>
        <div style="color:var(--text-muted); font-weight:600;">4. Livraison finale</div>
      </div>
    </div>
  `;
}

// ==================== PAGES LÉGALES CONFORMES STRIPE ====================
const LEGAL_DOCUMENTS = {
  trial: `
    <span class="section-eyebrow">GARANTIE OREVA LAB™</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Politique d’Essai 30 Nuits & Remboursement Intégral</h2>
    <p style="margin-bottom:12px;">Chez <strong>OREVA LAB™</strong>, nous sommes convaincus que l'adaptation biomécanique cervicale et lombaire nécessite quelques nuits d'utilisation réelle dans votre propre lit.</p>
    <h4 style="color:var(--obsidian); margin:16px 0 6px;">1. Vos 30 Nuits d'Essai à Domicile</h4>
    <p style="margin-bottom:12px;">Vous disposez de <strong>30 jours calendaires</strong> à compter de la réception de votre commande pour tester votre oreiller orthopédique, votre masseur Shiatsu ou votre masque LED.</p>
    <h4 style="color:var(--obsidian); margin:16px 0 6px;">2. Procédure de Retour Simple & Remboursement sous 48h</h4>
    <p style="margin-bottom:12px;">Si vous n'observez pas d'amélioration sur votre sommeil ou votre confort postural, écrivez simplement à <strong>concierge@orevalabs.com</strong> avec votre numéro de commande. Notre équipe vous édite un bon de retour prépayé et procède au remboursement intégral (100%) sur votre moyen de paiement initial sous 48h.</p>
    <h4 style="color:var(--obsidian); margin:16px 0 6px;">3. Garantie Constructeur 2 Ans</h4>
    <p>Tous nos dispositifs électroniques (OrevaPulse™ 6D, OrevaGlow™ LED, OrevaDream™ Audio, OrevaSculpt™ EMS) bénéficient d'une garantie de remplacement à neuf de 24 mois.</p>
  `,
  cgv: `
    <span class="section-eyebrow">CONDITIONS OFFICIELLES</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Conditions Générales de Vente (CGV)</h2>
    <p style="margin-bottom:12px;"><strong>Article 1 — Objet :</strong> Les présentes Conditions Générales de Vente régissent l'ensemble des ventes conclues sur la boutique officielle <strong>OREVA LAB™</strong> (<code>orevalabs.com</code> / <code>orevalab.fr</code>).</p>
    <p style="margin-bottom:12px;"><strong>Article 2 — Prix et Devises :</strong> Les prix sont indiqués toutes taxes comprises (TTC) dans la devise locale sélectionnée par l'acheteur (EUR €, CHF, USD $, GBP £, AUD $). Aucuns frais de douane supplémentaires ne sont facturés à la livraison grâce à notre réseau d'entrepôts locaux.</p>
    <p style="margin-bottom:12px;"><strong>Article 3 — Paiement Sécurisé :</strong> Les règlements sont traités via notre partenaire certifié PCI-DSS Niveau 1 <strong>Stripe</strong> (Carte Bancaire, Apple Pay, TWINT, Klarna 3x sans frais, PayPal).</p>
    <p style="margin-bottom:12px;"><strong>Article 4 — Expédition & Livraison :</strong> Toute commande validée est transmise automatiquement à notre centre logistique le plus proche (Francfort/Paris pour l'UE et la Suisse, Newark NJ pour les USA, Londres pour le UK, Sydney pour l'Australie) pour une livraison suivie en 2 à 5 jours ouvrés.</p>
    <p><strong>Article 5 — Droit de Rétractation :</strong> Conformément à la législation européenne et suisse, et étendu par notre Garantie Commerciale, le client dispose de 30 jours pour demander l'échange ou le remboursement complet.</p>
  `,
  privacy: `
    <span class="section-eyebrow">PROTECTION DES DONNÉES</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Politique de Confidentialité, RGPD & LPD Suisse</h2>
    <p style="margin-bottom:12px;"><strong>1. Collecte strictement nécessaire :</strong> OREVA LAB™ ne collecte que les informations indispensables au traitement et à la livraison de votre commande (Nom, Adresse de livraison, Email de suivi).</p>
    <p style="margin-bottom:12px;"><strong>2. Sécurité Bancaire :</strong> Vos coordonnées bancaires sont chiffrées en SSL 256-bit et traitées directement par Stripe. OREVA LAB™ n'a jamais accès à votre numéro complet de carte bancaire.</p>
    <p style="margin-bottom:12px;"><strong>3. Transmission Logistique :</strong> Vos coordonnées de livraison sont transmises de manière automatisée et sécurisée uniquement à nos centres d'expédition et transporteurs (Swiss Post, DHL, Colissimo, USPS, Royal Mail) aux seules fins d'acheminement de votre colis.</p>
    <p><strong>4. Vos Droits :</strong> Vous pouvez à tout moment demander la consultation ou la suppression de vos données sur simple email à <strong>concierge@orevalabs.com</strong>.</p>
  `,
  mentions: `
    <span class="section-eyebrow">INFORMATIONS ÉDITEUR</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Mentions Légales & Contact Conciergerie</h2>
    <p style="margin-bottom:12px;"><strong>Enseigne commerciale :</strong> OREVA LAB™ — Swiss Biomechanics, Sleep & Photobiomodulation</p>
    <p style="margin-bottom:12px;"><strong>Domaines officiels :</strong> <code>www.orevalabs.com</code> / <code>www.orevalab.fr</code></p>
    <p style="margin-bottom:12px;"><strong>Service Client & Conciergerie 7j/7 :</strong> concierge@orevalabs.com (Temps de réponse moyen : &lt; 4 heures)</p>
    <p style="margin-bottom:12px;"><strong>Centres Logistiques Partenaires :</strong> Francfort-sur-le-Main (DE), Paris (FR), Newark New Jersey (US), Londres (UK), Sydney (AU).</p>
    <p><strong>Avertissement Médical :</strong> Les dispositifs OREVA LAB™ sont des équipements de confort ergonomique, de bien-être postural et d'esthétique cosmétique. Ils ne remplacent pas un avis médical personnalisé en cas de pathologie rachidienne sévère.</p>
  `
};

function openLegalModal(docKey) {
  document.getElementById('legalModalContent').innerHTML = LEGAL_DOCUMENTS[docKey] || LEGAL_DOCUMENTS.cgv;
  document.getElementById('legalModal').classList.add('open');
}

function closeLegalModal() {
  document.getElementById('legalModal').classList.remove('open');
}

// ==================== AUTHENTIFICATION PROPRIÉTAIRE & BACKOFFICE SÉCURISÉ ====================
let cachedCustomers = [];
let isAdminAuthenticated = false;

function getAdminPassword() {
  return localStorage.getItem('aura_admin_password') || '';
}

function getAdminHeaders(extra = {}) {
  const pwd = getAdminPassword();
  return pwd ? { ...extra, 'x-admin-password': pwd } : { ...extra };
}

function applyAdminVisibility() {
  const dock = document.getElementById('ownerFloatingDock');
  const chkBreakdown = document.getElementById('ownerCheckoutBreakdown');
  const chkBtn = document.getElementById('ownerConfirmBackofficeBtn');

  if (isAdminAuthenticated) {
    if (dock) dock.classList.remove('hidden');
    if (chkBreakdown) chkBreakdown.classList.remove('hidden');
    if (chkBtn) chkBtn.classList.remove('hidden');
  } else {
    if (dock) dock.classList.add('hidden');
    if (chkBreakdown) chkBreakdown.classList.add('hidden');
    if (chkBtn) chkBtn.classList.add('hidden');
  }
}

function openAdminLoginModal() {
  if (isAdminAuthenticated) {
    switchView('backoffice');
    return;
  }
  const errEl = document.getElementById('adminLoginError');
  if (errEl) errEl.textContent = '';
  const inp = document.getElementById('adminPasswordInput');
  if (inp) inp.value = '';
  document.getElementById('adminLoginModal').classList.add('open');
}

function closeAdminLoginModal() {
  document.getElementById('adminLoginModal').classList.remove('open');
}

async function submitAdminLogin(e) {
  e.preventDefault();
  const pwd = document.getElementById('adminPasswordInput').value.trim();
  const errEl = document.getElementById('adminLoginError');
  if (!pwd) return;

  try {
    const res = await fetch('/api/settings', {
      headers: { 'x-admin-password': pwd }
    });
    const data = await res.json();
    if (data.isAdmin) {
      localStorage.setItem('aura_admin_password', pwd);
      isAdminAuthenticated = true;
      cachedSettings = data;
      applyAdminVisibility();
      closeAdminLoginModal();
      switchView('backoffice');
    } else {
      errEl.textContent = 'Mot de passe Propriétaire incorrect.';
    }
  } catch (err) {
    errEl.textContent = 'Erreur de vérification du mot de passe.';
  }
}

function logoutAdminSession() {
  localStorage.removeItem('aura_admin_password');
  isAdminAuthenticated = false;
  const marginCheckbox = document.getElementById('toggleMarginOverlay');
  if (marginCheckbox) marginCheckbox.checked = false;
  applyAdminVisibility();
  renderCatalog();
  switchView('storefront');
}

function switchView(view) {
  const storefront = document.getElementById('storefrontView');
  const backoffice = document.getElementById('backofficeView');
  if (view === 'backoffice') {
    if (!isAdminAuthenticated) {
      openAdminLoginModal();
      return;
    }
    storefront.classList.add('hidden');
    backoffice.classList.remove('hidden');
    loadBackofficeData();
    loadBackofficeCustomers();
    loadSettingsForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    backoffice.classList.add('hidden');
    storefront.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function switchBoTab(tabName) {
  ['orders', 'customers', 'catalog', 'keys', 'deploy'].forEach(t => {
    const panel = document.getElementById(`boPanel-${t}`);
    const btn = document.getElementById(`boTab-${t}`);
    if (!panel || !btn) return;
    if (t === tabName) {
      panel.classList.remove('hidden');
      btn.classList.add('active');
      btn.style.color = '#fff';
    } else {
      panel.classList.add('hidden');
      btn.classList.remove('active');
      btn.style.color = '#A1A1AA';
    }
  });
  if (tabName === 'customers') {
    loadBackofficeCustomers();
  }
  if (tabName === 'catalog') {
    renderAdminSubdomainsPanel();
  }
}

function mergeCustomCatalogFromSettings(settingsObj) {
  if (!settingsObj) return;
  if (settingsObj.customSubdomains && typeof settingsObj.customSubdomains === 'object') {
    Object.assign(window.OREVA_UNIVERSES, settingsObj.customSubdomains);
  }
  if (Array.isArray(settingsObj.customProducts) && settingsObj.customProducts.length > 0) {
    const existingIds = new Set(window.PRODUCTS_CATALOG.map(p => p.id));
    settingsObj.customProducts.forEach(cp => {
      if (!existingIds.has(cp.id)) {
        window.PRODUCTS_CATALOG.unshift(cp);
        existingIds.add(cp.id);
      }
    });
  }
}

function renderAdminSubdomainsPanel() {
  const grid = document.getElementById('adminSubdomainsGrid');
  const selectEl = document.getElementById('importTargetUniverse');
  const subCountEl = document.getElementById('adminTotalSubdomainsCount');
  const prodCountEl = document.getElementById('adminTotalCatalogCount');

  const uniKeys = Object.keys(window.OREVA_UNIVERSES || {});
  if (subCountEl) subCountEl.textContent = uniKeys.length;
  if (prodCountEl) prodCountEl.textContent = window.PRODUCTS_CATALOG.length.toLocaleString('fr-FR');

  if (selectEl) {
    selectEl.innerHTML = uniKeys.map(k => {
      const u = window.OREVA_UNIVERSES[k];
      const cnt = getProductsForUniverse(k).length;
      return `<option value="${k}">${u.brandDivision} — ${u.subdomain} (${cnt} produits)</option>`;
    }).join('');
  }

  if (!grid) return;
  const officialVercelSet = new Set(['sleep', 'ergo', 'glow', 'thermo', 'sport', 'pets', 'baby', 'home']);

  grid.innerHTML = uniKeys.map((k, idx) => {
    const u = window.OREVA_UNIVERSES[k];
    const cnt = getProductsForUniverse(k).length;
    const liveUrl = officialVercelSet.has(k)
      ? `https://${k}-orevalab.vercel.app`
      : `https://oreva-lab.vercel.app/?vitrine=${k}`;
    return `
      <div style="background:#18181B; border:1px solid #3F3F46; padding:12px 14px; border-radius:6px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <strong style="color:#fff; font-size:0.84rem;">${idx + 1}. ${u.brandDivision}</strong>
            <span style="background:rgba(16,185,129,0.18); color:#6EE7B7; border:1px solid #10B981; font-size:0.68rem; font-weight:700; padding:2px 7px; border-radius:99px;">${cnt} produits</span>
          </div>
          <div style="font-size:0.73rem; color:#D4B98C; margin:3px 0 8px;">${u.subdomain}</div>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
          <a href="${liveUrl}" target="_blank" style="background:#10B981; color:#052E16; font-weight:700; font-size:0.7rem; padding:5px 9px; border-radius:4px; text-decoration:none;">Ouvrir le Site ↗</a>
          <button onclick="switchUniverse('${k}'); switchView('storefront')" style="background:#27272A; color:#E4E4E7; border:1px solid #3F3F46; font-size:0.7rem; padding:5px 9px; border-radius:4px; cursor:pointer;">Prévisualiser</button>
        </div>
      </div>
    `;
  }).join('');
}

async function submitNewSubdomain(e) {
  e.preventDefault();
  const slug = document.getElementById('newSubSlug')?.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const divisionName = document.getElementById('newSubDivision')?.value.trim();
  const title = document.getElementById('newSubTitle')?.value.trim();
  const heroImg = document.getElementById('newSubHeroImg')?.value.trim();
  const fb = document.getElementById('newSubFeedback');

  if (!slug || !divisionName) return;
  if (fb) fb.textContent = 'Création du sous-domaine et génération des premiers produits...';

  try {
    const res = await fetch('/api/catalog/subdomain', {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ slug, divisionName, title, heroImg })
    });
    const data = await res.json();
    if (data.success && data.subdomain) {
      window.OREVA_UNIVERSES[slug] = data.subdomain;
      // Générer automatiquement 50 premiers produits dédiés à ce nouveau sous-domaine
      await fetch('/api/catalog/import', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          universe: slug,
          keyword: divisionName,
          count: 50,
          supplierCostEur: 12.0,
          basePriceEur: 59.0,
          imageUrl: heroImg || undefined,
          source: 'generator'
        })
      });
      await loadSettingsForm();
      renderAdminSubdomainsPanel();
      if (fb) {
        fb.textContent = `✓ Sous-domaine ${slug}.orevalabs.com créé avec 50 produits dédiés !`;
      }
    }
  } catch (err) {
    if (fb) fb.textContent = 'Erreur lors de la création du sous-domaine.';
  }
}

async function submitBulkProductImport(e) {
  e.preventDefault();
  const universe = document.getElementById('importTargetUniverse')?.value || 'sleep';
  const count = Number(document.getElementById('importBatchCount')?.value) || 100;
  const keyword = document.getElementById('importKeyword')?.value.trim();
  const supplierCostEur = Number(document.getElementById('importCostEur')?.value) || 11.5;
  const basePriceEur = Number(document.getElementById('importPriceEur')?.value) || 54.0;
  const source = document.getElementById('importSourceMode')?.value || 'cj_live';
  const fb = document.getElementById('importBatchFeedback');

  if (!keyword) return;
  if (fb) fb.textContent = `Importation de +${count} produits vers ${universe}.orevalabs.com en cours...`;

  try {
    const res = await fetch('/api/catalog/import', {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ universe, count, keyword, supplierCostEur, basePriceEur, source })
    });
    const data = await res.json();
    if (data.success) {
      await loadSettingsForm();
      renderAdminSubdomainsPanel();
      renderCatalog();
      if (fb) {
        fb.textContent = `✓ +${data.importedCount} nouvelles références ajoutées dans ${universe}.orevalabs.com (sauvegardées sur Neon Postgres) !`;
      }
    }
  } catch (err) {
    if (fb) fb.textContent = 'Erreur lors de l’importation.';
  }
}

async function loadBackofficeCustomers() {
  if (!isAdminAuthenticated) return;
  try {
    const res = await fetch('/api/customers', { headers: getAdminHeaders() });
    if (!res.ok) return;
    const data = await res.json();
    cachedCustomers = data.customers || [];

    const countEl = document.getElementById('boCustomersCount');
    if (countEl) countEl.textContent = cachedCustomers.length;

    const statusBadge = document.getElementById('dbStorageStatusBadge');
    if (statusBadge) {
      if (data.storageMode === 'NEON_POSTGRES_PERMANENT') {
        statusBadge.textContent = '🟢 CONNECTÉ À NEON POSTGRES PERMANENT (CLOUD)';
        statusBadge.style.background = 'rgba(16,185,129,0.2)';
        statusBadge.style.border = '1px solid #10B981';
        statusBadge.style.color = '#6EE7B7';
      } else {
        statusBadge.textContent = '🟡 STOCKAGE PRÊT (AJOUTEZ NEON POSTGRES OU COLLEZ VOTRE URL CI-DESSOUS)';
        statusBadge.style.background = 'rgba(245,158,11,0.18)';
        statusBadge.style.border = '1px solid #F59E0B';
        statusBadge.style.color = '#FCD34D';
      }
    }

    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    if (cachedCustomers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:#A1A1AA;">Aucun compte client enregistré pour le moment.</td></tr>`;
      return;
    }

    tbody.innerHTML = cachedCustomers.map(c => {
      const fullName = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || '-';
      const street = c.addressLine1 || c.street || '';
      const zip = c.postalCode || c.zip || '';
      const country = c.countryCode || c.country || 'FR';
      return `
      <tr>
        <td><strong style="color:#fff;">${c.id || 'CUS-PRO'}</strong></td>
        <td><strong style="color:#E4E4E7;">${fullName}</strong></td>
        <td>
          <div style="color:#38BDF8; font-weight:600; font-size:0.84rem;">${c.email || '-'}</div>
          <div style="color:#6EE7B7; font-size:0.76rem;">${c.phone || '-'}</div>
        </td>
        <td>
          <div style="color:#E4E4E7; font-size:0.82rem;">${street}</div>
          <div style="color:#A1A1AA; font-size:0.78rem;">${zip} ${c.city || ''}</div>
        </td>
        <td><span style="background:#27272A; color:#E4E4E7; padding:3px 9px; border-radius:4px; font-size:0.75rem; font-weight:600;">${country}</span></td>
        <td style="font-size:0.78rem; color:#A1A1AA;">${c.updatedAt ? new Date(c.updatedAt).toLocaleString('fr-FR') : '-'}</td>
      </tr>
    `;
    }).join('');
  } catch (err) {
    console.error(err);
  }
}

async function saveNeonDatabaseUrl(e) {
  e.preventDefault();
  const dbUrlInput = document.getElementById('setNeonDbUrl');
  const databaseUrl = dbUrlInput ? dbUrlInput.value.trim() : '';
  const fb = document.getElementById('neonDbFeedback');
  if (!databaseUrl) {
    if (fb) {
      fb.style.color = '#F87171';
      fb.textContent = 'Veuillez coller une URL postgresql:// valide.';
    }
    return;
  }

  try {
    if (fb) {
      fb.style.color = '#38BDF8';
      fb.textContent = 'Connexion et initialisation des tables Neon Postgres en cours...';
    }
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ databaseUrl })
    });
    const data = await res.json();
    if (data.success) {
      if (fb) {
        fb.style.color = '#6EE7B7';
        fb.textContent = '✓ Base Neon Postgres connectée ! Les tables (aura_customers, aura_orders, aura_settings) sont actives.';
      }
      await loadBackofficeCustomers();
      await loadBackofficeData();
    }
  } catch (err) {
    if (fb) {
      fb.style.color = '#F87171';
      fb.textContent = 'Erreur de connexion à la base : vérifiez votre URL postgresql://';
    }
  }
}

function exportCustomersCsv() {
  if (!cachedCustomers || cachedCustomers.length === 0) {
    alert('Aucun client à exporter pour le moment.');
    return;
  }
  const headers = ['ID_Client', 'Nom_Complet', 'Email', 'Telephone', 'Rue_Numero', 'Code_Postal', 'Ville', 'Pays', 'Date_Inscription'];
  const rows = cachedCustomers.map(c => {
    const fullName = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim();
    const street = c.addressLine1 || c.street || '';
    const zip = c.postalCode || c.zip || '';
    const country = c.countryCode || c.country || '';
    return [
      c.id || 'CUS-PRO',
      `"${fullName.replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${street.replace(/"/g, '""')}"`,
      `"${zip.replace(/"/g, '""')}"`,
      `"${(c.city || '').replace(/"/g, '""')}"`,
      country,
      c.updatedAt || ''
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aura-labs-clients-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function loadSettingsForm() {
  try {
    const res = await fetch('/api/settings', { headers: getAdminHeaders() });
    cachedSettings = await res.json();
    mergeCustomCatalogFromSettings(cachedSettings);
    isAdminAuthenticated = Boolean(cachedSettings.isAdmin);
    applyAdminVisibility();

    if (!isAdminAuthenticated) return;

    renderAdminSubdomainsPanel();

    document.getElementById('setStripePublic').value = cachedSettings.stripe?.publicKey || '';
    document.getElementById('setStripeSecret').value = cachedSettings.stripe?.secretKey || '';
    document.getElementById('setPayoutIban').value = cachedSettings.payout?.iban || '';
    document.getElementById('setDomainName').value = cachedSettings.domainName || 'orevalabs.com';
    document.getElementById('setSupportEmail').value = cachedSettings.supportEmail || 'concierge@orevalabs.com';
    const adminPwdEl = document.getElementById('setAdminPassword');
    if (adminPwdEl) adminPwdEl.value = cachedSettings.adminPassword || 'AURA2026';

    document.getElementById('setCjApiKey').value = cachedSettings.suppliers?.cjdropshipping?.apiKey || '';
    document.getElementById('setSpocketKey').value = cachedSettings.suppliers?.spocket?.apiKey || '';
    document.getElementById('setSuplifulEmail').value = cachedSettings.suppliers?.supliful?.accountEmail || '';

    const badge = document.getElementById('stripeModeBadge');
    if (cachedSettings.stripe?.mode === 'LIVE_STRIPE_ACTIVE') {
      badge.textContent = '✓ STRIPE LIVE ACTIF';
    } else {
      badge.textContent = 'MODE SIMULATION (COLLEZ VOS CLÉS POUR ACTIVER)';
    }

    const skuGrid = document.getElementById('skuMappingGrid');
    skuGrid.innerHTML = window.PRODUCTS_CATALOG.slice(0, 24).map(p => {
      const currentSku = cachedSettings.skuMappings?.[p.id] || p.sku;
      return `
        <div style="background:#18181B; border:1px solid #27272A; padding:10px 14px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div style="font-size:0.8rem; color:#E4E4E7; flex:1;">
            <strong>${p.title.fr}</strong><br/>
            <span style="color:#71717A; font-size:0.72rem;">Coût livré : ${p.supplierCostEur.toFixed(2)} € • ${p.supplier.split('(')[0]}</span>
          </div>
          <input type="text" data-sku-prod="${p.id}" value="${currentSku}" style="width:155px; background:#090A0F; border:1px solid #3F3F46; color:#6EE7B7; font-family:monospace; font-size:0.78rem; padding:7px 10px; border-radius:4px;" />
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
  }
}

async function saveBackofficeSettings(e) {
  e.preventDefault();
  const skuInputs = document.querySelectorAll('[data-sku-prod]');
  const skuMappings = {};
  skuInputs.forEach(inp => {
    skuMappings[inp.getAttribute('data-sku-prod')] = inp.value.trim();
  });

  const newAdminPwd = document.getElementById('setAdminPassword')?.value.trim() || 'AURA2026';

  const payload = {
    domainName: document.getElementById('setDomainName').value.trim(),
    supportEmail: document.getElementById('setSupportEmail').value.trim(),
    adminPassword: newAdminPwd,
    stripe: {
      publicKey: document.getElementById('setStripePublic').value.trim(),
      secretKey: document.getElementById('setStripeSecret').value.trim()
    },
    payout: {
      iban: document.getElementById('setPayoutIban').value.trim()
    },
    suppliers: {
      cjdropshipping: {
        apiKey: document.getElementById('setCjApiKey').value.trim()
      },
      spocket: {
        apiKey: document.getElementById('setSpocketKey').value.trim()
      },
      supliful: {
        accountEmail: document.getElementById('setSuplifulEmail').value.trim()
      }
    },
    skuMappings
  };

  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('aura_admin_password', newAdminPwd);
    cachedSettings = data.settings;
    const fb = document.getElementById('settingsSaveFeedback');
    fb.textContent = '✓ Configuration, SKUs et Mot de Passe enregistrés avec succès !';
    setTimeout(() => { fb.textContent = ''; }, 4000);
    loadSettingsForm();
  }
}

async function loadBackofficeData() {
  if (!isAdminAuthenticated) return;
  try {
    const res = await fetch('/api/orders', { headers: getAdminHeaders() });
    if (!res.ok) return;
    const { orders, stats } = await res.json();

    document.getElementById('dockCommissionTotal').textContent = `+${stats.totalNetCommissionEur.toFixed(2)} €`;
    document.getElementById('kpiNetCommission').textContent = `+${stats.totalNetCommissionEur.toFixed(2)} €`;
    document.getElementById('kpiTotalRevenue').textContent = `${stats.totalRevenueEur.toFixed(2)} €`;
    document.getElementById('kpiSupplierCost').textContent = `-${stats.totalSupplierCostEur.toFixed(2)} €`;
    document.getElementById('kpiOrdersCount').textContent = stats.ordersCount;

    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong style="color:#fff;">${o.id}</strong><br/><span style="font-size:0.75rem; color:#71717A;">${new Date(o.createdAt).toLocaleString('fr-FR')}</span></td>
        <td>
          <strong style="color:#E4E4E7;">${o.customer.name}</strong>
          ${o.customer.phone ? `<span style="font-size:0.73rem; color:#6EE7B7;">(${o.customer.phone})</span>` : ''}<br/>
          <span style="font-size:0.78rem; color:#A1A1AA;">${o.customer.address || o.customer.city} • ${o.customer.countryName}</span>
        </td>
        <td>${o.items.map(i => `<div style="font-size:0.8rem; color:#D4D4D8;">• ${i.qty}× ${i.title} <code style="color:#6EE7B7; font-size:0.72rem;">[${i.sku || i.id}]</code></div>`).join('')}</td>
        <td><strong style="color:#fff;">${o.displayTotal}</strong><br/><span style="font-size:0.74rem; color:#71717A;">${o.paymentMethod}</span></td>
        <td style="color:#F87171; font-weight:600;">-${Number(o.supplierCostTotalEur).toFixed(2)} €</td>
        <td>
          <span style="background:rgba(16,185,129,0.18); border:1px solid #10B981; color:#6EE7B7; font-weight:700; padding:5px 11px; border-radius:6px; display:inline-block;">
            +${Number(o.netCommissionEur).toFixed(2)} € (${o.marginPercent}%)
          </span>
        </td>
        <td>
          <div style="font-size:0.78rem; color:#38BDF8; font-weight:600;">${o.fulfillment.warehouse}</div>
          <div style="font-size:0.75rem; color:#A1A1AA;">${o.fulfillment.carrier} • <code>${o.fulfillment.trackingNumber}</code></div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateHeaderAccountBadge();
  await loadSettingsForm();

  // Détection automatique et stricte du sous-domaine parmi les 8 officiels + tous vos sous-domaines personnalisés !
  const host = (window.location.hostname || '').toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const vitrineParam = (urlParams.get('vitrine') || urlParams.get('store') || '').toLowerCase();

  let detectedUni = 'sleep';
  if (vitrineParam && window.OREVA_UNIVERSES?.[vitrineParam]) {
    detectedUni = vitrineParam;
  } else {
    const allSlugs = Object.keys(window.OREVA_UNIVERSES || {});
    for (const slug of allSlugs) {
      if (host.startsWith(`${slug}.`) || host.startsWith(`${slug}-`)) {
        detectedUni = slug;
        break;
      }
    }
  }

  switchUniverse(detectedUni);
  applyLocalization();

  if (isAdminAuthenticated) {
    renderAdminSubdomainsPanel();
    loadBackofficeData();
    loadBackofficeCustomers();
  }
  if (urlParams.get('admin') === '1') {
    openAdminLoginModal();
  }
});
