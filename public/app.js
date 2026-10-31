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
  document.getElementById('langSelect').value = currentLang;
  applyLocalization();
}

function onLanguageChange(lang) {
  currentLang = lang;
  applyLocalization();
}

function applyLocalization() {
  const market = window.MARKETS_CONFIG[currentMarketCode];
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;

  document.getElementById('announcementBar').textContent = market.warehouseLabel[currentLang];
  document.getElementById('navShop').textContent = t.navShop;
  document.getElementById('navBundles').textContent = t.navBundles;
  document.getElementById('navScience').textContent = t.navScience;

  document.getElementById('heroEyebrow').textContent = t.heroEyebrow;
  document.getElementById('heroTitle').textContent = t.heroTitle;
  document.getElementById('heroSubtitle').textContent = t.heroSubtitle;
  document.getElementById('heroCtaPrimary').textContent = t.heroCtaPrimary;
  document.getElementById('heroCtaSecondary').textContent = t.heroCtaSecondary;
  document.getElementById('heroMetric1').textContent = t.heroMetric1;
  document.getElementById('heroMetric2').textContent = t.heroMetric2;
  document.getElementById('heroMetric3').textContent = t.heroMetric3;
  document.getElementById('heroCardHub').textContent = `HUB LOGISTIQUE : ${market.warehouseCity.toUpperCase()} (${market.deliveryDays.toUpperCase()})`;

  document.getElementById('sectionTag').textContent = t.sectionTag;
  document.getElementById('sectionTitle').textContent = t.sectionTitle;

  document.getElementById('catTab-all').textContent = t.filterAll;
  document.getElementById('catTab-sleep').textContent = t.filterSleep;
  document.getElementById('catTab-ergo').textContent = t.filterErgo;
  document.getElementById('catTab-beauty').textContent = t.filterBeauty;
  document.getElementById('catTab-bundles').textContent = t.filterBundles;

  document.getElementById('editorialBadge').textContent = t.editorialBadge;
  document.getElementById('editorialTitle').textContent = t.editorialTitle;
  document.getElementById('editorialP1').textContent = t.editorialP1;
  document.getElementById('editorialP2').textContent = t.editorialP2;

  document.getElementById('bagHeaderTitle').textContent = t.cartHeader;
  document.getElementById('upsellHeader').textContent = t.upsellHeader;
  document.getElementById('subtotalLabel').textContent = t.subtotalLabel;
  document.getElementById('shippingLabel').textContent = t.shippingLabel;
  document.getElementById('shippingFree').textContent = t.shippingFree;
  document.getElementById('checkoutBtn').textContent = t.checkoutBtn;

  renderCatalog();
  renderBag();
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('#collectionSection .cat-tab').forEach(btn => btn.classList.remove('active'));
  const active = document.getElementById(`catTab-${cat}`);
  if (active) active.classList.add('active');
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById('productsGrid');
  const market = window.MARKETS_CONFIG[currentMarketCode];
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;
  const showMarginOverlay = document.getElementById('toggleMarginOverlay')?.checked;

  const products = window.PRODUCTS_CATALOG.filter(p =>
    currentCategory === 'all' ? true : p.category === currentCategory
  );

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
              <button class="btn-card-detail" onclick="openProductDetail('${prod.id}')">Détails</button>
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
  `).join('');

  document.getElementById('pdpShippingNote').textContent = `🚚 ${t.shippingFrom} ${market.warehouseCity} (${market.deliveryDays} via ${market.carrier}) • ${t.guaranteeText}`;
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
  const t = window.I18N_STRINGS[currentLang] || window.I18N_STRINGS.fr;

  const tiers = [
    { qty: 1, discount: 1.0, label: t.qty1Title, tag: '' },
    { qty: 2, discount: 0.85, label: t.qty2Title, tag: t.mostPopular },
    { qty: 3, discount: 0.75, label: t.qty3Title, tag: t.bestValue }
  ];

  const activeTierObj = tiers.find(tr => tr.qty === selectedPdpTier) || tiers[0];
  const totalUnitPriceEur = prod.basePriceEur * activeTierObj.discount * activeTierObj.qty;

  document.getElementById('pdpPriceNow').textContent = formatLocalPrice(totalUnitPriceEur);
  document.getElementById('pdpPriceWas').textContent = formatLocalPrice(prod.compareAtEur * activeTierObj.qty);

  const netComm = calculateNetCommissionEur(prod, activeTierObj.qty, activeTierObj.discount);
  const currentSku = cachedSettings?.skuMappings?.[prod.id] || prod.sku;
  document.getElementById('pdpOwnerBox').innerHTML = `
    <div style="font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:#6EE7B7; margin-bottom:4px;">DONNÉES PARTENAIRE FOURNISSEUR (SKU : ${currentSku})</div>
    <div style="display:flex; justify-content:space-between;">
      <span>Fournisseur : <strong>${prod.supplier}</strong></span>
      <span>Votre Commission : <strong style="color:#fff; font-size:0.92rem;">+${netComm.toFixed(2)} € net</strong></span>
    </div>
  `;

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

  let totalBaseEur = 0;
  let totalSupplierEur = 0;
  cart.forEach(i => {
    totalBaseEur += i.product.basePriceEur * i.discountFactor * i.qty;
    totalSupplierEur += i.product.supplierCostEur * i.qty;
  });

  const paidEur = getAdjustedEurPrice(totalBaseEur);
  const stripeFee = Number((paidEur * 0.02).toFixed(2));
  const netCommission = Number((paidEur - totalSupplierEur - stripeFee).toFixed(2));

  document.getElementById('chkPaidDisplay').textContent = `${formatLocalPrice(totalBaseEur)} (≈ ${paidEur.toFixed(2)} €)`;
  document.getElementById('chkCostDisplay').textContent = `-${totalSupplierEur.toFixed(2)} €`;
  document.getElementById('chkCommissionDisplay').textContent = `+${netCommission.toFixed(2)} € net`;

  document.getElementById('checkoutFormWrap').classList.remove('hidden');
  document.getElementById('checkoutSuccessWrap').classList.add('hidden');
  document.getElementById('checkoutModal').classList.add('open');
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
    await loadBackofficeData();

    const ord = data.order;
    document.getElementById('orderConfirmationBox').innerHTML = `
      <div><strong>Référence :</strong> <code>${ord.id}</code></div>
      <div><strong>Destinataire :</strong> ${ord.customer.name} (${ord.customer.phone || ord.customer.email})</div>
      <div><strong>Adresse d'expédition enregistrée :</strong> ${ord.customer.address} (${ord.customer.countryName})</div>
      <div><strong>Total réglé :</strong> ${ord.displayTotal} via ${ord.paymentMethod}</div>
      <div style="color:var(--emerald); font-size:0.95rem; margin:6px 0;"><strong>Votre Commission Nette Créditée : +${ord.netCommissionEur.toFixed(2)} € (${ord.marginPercent}%)</strong></div>
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
    <span class="section-eyebrow">GARANTIE AURA LABS™</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Politique d’Essai 30 Nuits & Remboursement Intégral</h2>
    <p style="margin-bottom:12px;">Chez <strong>AURA LABS™</strong>, nous sommes convaincus que l'adaptation biomécanique cervicale et lombaire nécessite quelques nuits d'utilisation réelle dans votre propre lit.</p>
    <h4 style="color:var(--obsidian); margin:16px 0 6px;">1. Vos 30 Nuits d'Essai à Domicile</h4>
    <p style="margin-bottom:12px;">Vous disposez de <strong>30 jours calendaires</strong> à compter de la réception de votre commande pour tester votre oreiller orthopédique, votre masseur Shiatsu ou votre masque LED.</p>
    <h4 style="color:var(--obsidian); margin:16px 0 6px;">2. Procédure de Retour Simple & Remboursement sous 48h</h4>
    <p style="margin-bottom:12px;">Si vous n'observez pas d'amélioration sur votre sommeil ou votre confort postural, écrivez simplement à <strong>concierge@auralabs.ch</strong> avec votre numéro de commande. Notre équipe vous édite un bon de retour prépayé et procède au remboursement intégral (100%) sur votre moyen de paiement initial sous 48h.</p>
    <h4 style="color:var(--obsidian); margin:16px 0 6px;">3. Garantie Constructeur 2 Ans</h4>
    <p>Tous nos dispositifs électroniques (AuraPulse™ 6D, AuraGlow™ LED, AuraDream™ Audio, AuraSculpt™ EMS) bénéficient d'une garantie de remplacement à neuf de 24 mois.</p>
  `,
  cgv: `
    <span class="section-eyebrow">CONDITIONS OFFICIELLES</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Conditions Générales de Vente (CGV)</h2>
    <p style="margin-bottom:12px;"><strong>Article 1 — Objet :</strong> Les présentes Conditions Générales de Vente régissent l'ensemble des ventes conclues sur la boutique officielle <strong>AURA LABS™</strong> (<code>auralabs.ch</code> / <code>auralabsclinic.com</code>).</p>
    <p style="margin-bottom:12px;"><strong>Article 2 — Prix et Devises :</strong> Les prix sont indiqués toutes taxes comprises (TTC) dans la devise locale sélectionnée par l'acheteur (EUR €, CHF, USD $, GBP £, AUD $). Aucuns frais de douane supplémentaires ne sont facturés à la livraison grâce à notre réseau d'entrepôts locaux.</p>
    <p style="margin-bottom:12px;"><strong>Article 3 — Paiement Sécurisé :</strong> Les règlements sont traités via notre partenaire certifié PCI-DSS Niveau 1 <strong>Stripe</strong> (Carte Bancaire, Apple Pay, TWINT, Klarna 3x sans frais, PayPal).</p>
    <p style="margin-bottom:12px;"><strong>Article 4 — Expédition & Livraison :</strong> Toute commande validée est transmise automatiquement à notre centre logistique le plus proche (Francfort/Paris pour l'UE et la Suisse, Newark NJ pour les USA, Londres pour le UK, Sydney pour l'Australie) pour une livraison suivie en 2 à 5 jours ouvrés.</p>
    <p><strong>Article 5 — Droit de Rétractation :</strong> Conformément à la législation européenne et suisse, et étendu par notre Garantie Commerciale, le client dispose de 30 jours pour demander l'échange ou le remboursement complet.</p>
  `,
  privacy: `
    <span class="section-eyebrow">PROTECTION DES DONNÉES</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Politique de Confidentialité, RGPD & LPD Suisse</h2>
    <p style="margin-bottom:12px;"><strong>1. Collecte strictement nécessaire :</strong> AURA LABS™ ne collecte que les informations indispensables au traitement et à la livraison de votre commande (Nom, Adresse de livraison, Email de suivi).</p>
    <p style="margin-bottom:12px;"><strong>2. Sécurité Bancaire :</strong> Vos coordonnées bancaires sont chiffrées en SSL 256-bit et traitées directement par Stripe. AURA LABS™ n'a jamais accès à votre numéro complet de carte bancaire.</p>
    <p style="margin-bottom:12px;"><strong>3. Transmission Logistique :</strong> Vos coordonnées de livraison sont transmises de manière automatisée et sécurisée uniquement à nos centres d'expédition et transporteurs (Swiss Post, DHL, Colissimo, USPS, Royal Mail) aux seules fins d'acheminement de votre colis.</p>
    <p><strong>4. Vos Droits :</strong> Vous pouvez à tout moment demander la consultation ou la suppression de vos données sur simple email à <strong>concierge@auralabs.ch</strong>.</p>
  `,
  mentions: `
    <span class="section-eyebrow">INFORMATIONS ÉDITEUR</span>
    <h2 style="font-family:var(--font-serif); font-size:2.1rem; color:var(--obsidian); margin-bottom:16px;">Mentions Légales & Contact Conciergerie</h2>
    <p style="margin-bottom:12px;"><strong>Enseigne commerciale :</strong> AURA LABS CLINIC™ — Swiss Biomechanics, Sleep & Photobiomodulation</p>
    <p style="margin-bottom:12px;"><strong>Domaines officiels :</strong> <code>www.auralabs.ch</code> / <code>www.auralabsclinic.com</code></p>
    <p style="margin-bottom:12px;"><strong>Service Client & Conciergerie 7j/7 :</strong> concierge@auralabs.ch (Temps de réponse moyen : &lt; 4 heures)</p>
    <p style="margin-bottom:12px;"><strong>Centres Logistiques Partenaires :</strong> Francfort-sur-le-Main (DE), Paris (FR), Newark New Jersey (US), Londres (UK), Sydney (AU).</p>
    <p><strong>Avertissement Médical :</strong> Les dispositifs AURA LABS™ sont des équipements de confort ergonomique, de bien-être postural et d'esthétique cosmétique. Ils ne remplacent pas un avis médical personnalisé en cas de pathologie rachidienne sévère.</p>
  `
};

function openLegalModal(docKey) {
  document.getElementById('legalModalContent').innerHTML = LEGAL_DOCUMENTS[docKey] || LEGAL_DOCUMENTS.cgv;
  document.getElementById('legalModal').classList.add('open');
}

function closeLegalModal() {
  document.getElementById('legalModal').classList.remove('open');
}

// ==================== BACKOFFICE : COMMANDES, CLÉS API & DÉPLOIEMENT ====================
function switchView(view) {
  const storefront = document.getElementById('storefrontView');
  const backoffice = document.getElementById('backofficeView');
  if (view === 'backoffice') {
    storefront.classList.add('hidden');
    backoffice.classList.remove('hidden');
    loadBackofficeData();
    loadSettingsForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    backoffice.classList.add('hidden');
    storefront.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function switchBoTab(tabName) {
  ['orders', 'keys', 'deploy'].forEach(t => {
    const panel = document.getElementById(`boPanel-${t}`);
    const btn = document.getElementById(`boTab-${t}`);
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
}

async function loadSettingsForm() {
  try {
    const res = await fetch('/api/settings');
    cachedSettings = await res.json();

    document.getElementById('setStripePublic').value = cachedSettings.stripe?.publicKey || '';
    document.getElementById('setStripeSecret').value = cachedSettings.stripe?.secretKey || '';
    document.getElementById('setPayoutIban').value = cachedSettings.payout?.iban || '';
    document.getElementById('setDomainName').value = cachedSettings.domainName || 'auralabs.ch';
    document.getElementById('setSupportEmail').value = cachedSettings.supportEmail || 'concierge@auralabs.ch';

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
    skuGrid.innerHTML = window.PRODUCTS_CATALOG.map(p => {
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

  const payload = {
    domainName: document.getElementById('setDomainName').value.trim(),
    supportEmail: document.getElementById('setSupportEmail').value.trim(),
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.success) {
    cachedSettings = data.settings;
    const fb = document.getElementById('settingsSaveFeedback');
    fb.textContent = '✓ Configuration et SKUs enregistrés avec succès !';
    setTimeout(() => { fb.textContent = ''; }, 4000);
    loadSettingsForm();
  }
}

async function loadBackofficeData() {
  try {
    const res = await fetch('/api/orders');
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
  applyLocalization();
  loadBackofficeData();
});
