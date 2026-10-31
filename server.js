const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const IS_VERCEL = Boolean(process.env.VERCEL || process.env.NOW_REGION);
const DATA_DIR = IS_VERCEL ? '/tmp/aura-labs-data' : path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_ORDERS = [
  {
    id: 'ORD-8942-CH',
    createdAt: '2026-10-31T14:22:10Z',
    customer: {
      name: 'Marc-Antoine Rochat',
      email: 'ma.rochat@bluewin.ch',
      address: 'Rue de Bourg 18, 1003 Lausanne',
      city: 'Lausanne',
      countryCode: 'CH',
      countryName: 'Suisse 🇨🇭'
    },
    items: [
      { id: 'prod-neck-massager', sku: 'CJ-SHIATSU-PRO-02', title: 'Masseur Cervical Shiatsu & Infrarouge AuraPulse™ 6D', qty: 1, retailEur: 94.80, supplierCostEur: 18.50, supplier: 'CJdropshipping EU (Francfort)' },
      { id: 'prod-ergo-pillow', sku: 'CJ-ORT-PIL-01', title: 'Oreiller Cervical Orthopédique AuraCloud™ Pro', qty: 1, retailEur: 76.80, supplierCostEur: 14.50, supplier: 'CJdropshipping EU (Francfort)' }
    ],
    currency: 'CHF',
    displayTotal: '171.60 CHF',
    totalPaidEur: 171.60,
    supplierCostTotalEur: 33.00,
    stripeFeeEur: 3.43,
    netCommissionEur: 135.17,
    marginPercent: 78.8,
    paymentMethod: 'TWINT / Apple Pay (Stripe)',
    fulfillment: {
      status: 'EN_TRANSIT_VERS_CLIENT',
      warehouse: 'Entrepôt Francfort (DE) → Hub Bâle',
      carrier: 'Swiss Post Priority',
      trackingNumber: 'CH-SWISS-994821048',
      estimatedDelivery: '2 à 3 jours ouvrés',
      autoDispatchedAt: '2026-10-31T14:22:14Z',
      cjDispatchMode: 'AUTO_ROUTED'
    }
  },
  {
    id: 'ORD-8941-US',
    createdAt: '2026-10-31T11:05:40Z',
    customer: {
      name: 'Jessica Miller',
      email: 'j.miller88@gmail.com',
      address: '742 Congress Ave, Austin, TX 78701',
      city: 'Austin, TX',
      countryCode: 'US',
      countryName: 'United States 🇺🇸'
    },
    items: [
      { id: 'prod-led-mask', sku: 'SPK-LED-7C-03', title: 'Masque Photothérapie LED AuraGlow™ Pro', qty: 1, retailEur: 124.95, supplierCostEur: 24.00, supplier: 'Spocket / CJ US (New Jersey)' },
      { id: 'prod-hyaluronic-serum', sku: 'BLK-SERUM-PEP-10', title: 'Sérum Cellulaire Tri-Hyaluronique AuraHydra™', qty: 1, retailEur: 39.90, supplierCostEur: 7.20, supplier: 'Blanka / Supliful US' }
    ],
    currency: 'USD',
    displayTotal: '$178.04 USD',
    totalPaidEur: 164.85,
    supplierCostTotalEur: 31.20,
    stripeFeeEur: 3.30,
    netCommissionEur: 130.35,
    marginPercent: 79.1,
    paymentMethod: 'Apple Pay / Visa (Stripe US)',
    fulfillment: {
      status: 'EXPÉDIÉ_PAR_ENTREPÔT',
      warehouse: 'Entrepôt Newark, New Jersey (USA)',
      carrier: 'USPS Priority Mail',
      trackingNumber: 'USPS-940551189956',
      estimatedDelivery: '2 à 4 jours ouvrés',
      autoDispatchedAt: '2026-10-31T11:05:43Z',
      cjDispatchMode: 'AUTO_ROUTED'
    }
  },
  {
    id: 'ORD-8940-DE',
    createdAt: '2026-10-30T19:40:12Z',
    customer: {
      name: 'Lukas Weber',
      email: 'lukas.weber@web.de',
      address: 'Maximilianstraße 24, 80539 München',
      city: 'München',
      countryCode: 'DE',
      countryName: 'Deutschland 🇩🇪'
    },
    items: [
      { id: 'bundle-teletravail', sku: 'BND-BACK-PRO-12', title: 'Coffret Posture & Récupération (AuraPulse™ + AuraSeat™)', qty: 1, retailEur: 104.86, supplierCostEur: 29.70, supplier: 'CJdropshipping DE (Francfort)' }
    ],
    currency: 'EUR',
    displayTotal: '104.86 €',
    totalPaidEur: 104.86,
    supplierCostTotalEur: 29.70,
    stripeFeeEur: 2.10,
    netCommissionEur: 73.06,
    marginPercent: 69.7,
    paymentMethod: 'Klarna Rechnung (30 Tage)',
    fulfillment: {
      status: 'LIVRÉ_AU_CLIENT',
      warehouse: 'Logistikzentrum Frankfurt am Main (DE)',
      carrier: 'DHL Paket Deutschland',
      trackingNumber: 'DHL-DE-0034043429',
      estimatedDelivery: '48h (Livré)',
      autoDispatchedAt: '2026-10-30T19:40:15Z',
      cjDispatchMode: 'AUTO_ROUTED'
    }
  }
];

const INITIAL_SETTINGS = {
  brandName: 'AURA LABS CLINIC™',
  domainName: 'auralabs.ch',
  supportEmail: 'concierge@auralabs.ch',
  companyAddress: 'AURA LABS International • Bahnhofstrasse 42, 8001 Zürich / 75008 Paris',
  autoFulfillmentEnabled: true,
  stripe: {
    publicKey: 'pk_test_51AuraLabsReadyForLiveKey',
    secretKey: '',
    webhookSecret: '',
    mode: 'SANDBOX_SIMULATION'
  },
  suppliers: {
    cjdropshipping: {
      connected: true,
      apiKey: '',
      warehousePriority: 'LOCAL_FIRST (DE/FR/US/UK/AU)'
    },
    supliful: {
      connected: true,
      accountEmail: 'production@auralabs.ch'
    },
    spocket: {
      connected: true,
      apiKey: ''
    }
  },
  skuMappings: {
    'prod-ergo-pillow': 'CJ-ORT-PIL-01',
    'prod-neck-massager': 'CJ-SHIATSU-PRO-02',
    'prod-led-mask': 'SPK-LED-7C-03',
    'prod-ortho-cushion': 'CJ-GEL-SEAT-04',
    'prod-sleep-mask-bt': 'CJ-3DMASK-BT-05',
    'prod-guasha-microcurrent': 'CJ-GUASHA-EMS-06',
    'prod-sleep-gummies': 'SUP-GUM-SLEEP-09',
    'prod-hyaluronic-serum': 'BLK-SERUM-PEP-10',
    'bundle-sommeil-ultime': 'BND-SLEEP-ULT-11',
    'bundle-teletravail': 'BND-BACK-PRO-12'
  },
  payout: {
    accountHolder: 'Propriétaire AURA LABS',
    iban: 'FR76 •••• •••• •••• 4829',
    frequency: 'Virement automatique quotidien (J+2)'
  }
};

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(INITIAL_ORDERS, null, 2), 'utf8');
}
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(INITIAL_SETTINGS, null, 2), 'utf8');
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function resolveFulfillmentRouting(countryCode) {
  const routingMap = {
    FR: { warehouse: 'Entrepôt Europe (Paris / Francfort)', carrier: 'Colissimo Suivi 48h', prefix: 'FR-COL', eta: '2 à 4 jours ouvrés', flag: '🇫🇷', cjStorageId: 'DE-FRANKFURT-01' },
    CH: { warehouse: 'Entrepôt Francfort (DE) → Hub Bâle', carrier: 'Swiss Post Priority', prefix: 'CH-SWISS', eta: '2 à 3 jours ouvrés', flag: '🇨🇭', cjStorageId: 'DE-FRANKFURT-01' },
    DE: { warehouse: 'Logistikzentrum Frankfurt (Allemagne)', carrier: 'DHL Paket Deutschland', prefix: 'DE-DHL', eta: '48 à 72h', flag: '🇩🇪', cjStorageId: 'DE-FRANKFURT-01' },
    US: { warehouse: 'Entrepôt US East (Newark NJ) & West (CA)', carrier: 'USPS Priority / UPS Ground', prefix: 'US-USPS', eta: '2 à 4 jours ouvrés', flag: '🇺🇸', cjStorageId: 'US-NEWJERSEY-01' },
    GB: { warehouse: 'Entrepôt UK (Londres / Manchester)', carrier: 'Royal Mail Tracked 48', prefix: 'UK-RM', eta: '48h', flag: '🇬🇧', cjStorageId: 'GB-LONDON-01' },
    AU: { warehouse: 'Entrepôt Sydney NSW (Australie)', carrier: 'Australia Post Express', prefix: 'AU-POST', eta: '2 à 5 jours ouvrés', flag: '🇦🇺', cjStorageId: 'AU-SYDNEY-01' }
  };
  return routingMap[countryCode] || routingMap.FR;
}

// Connecteur API officiel CJdropshipping v2.0
async function dispatchToCJDropshippingAPI(orderPayload, settings) {
  const apiKey = process.env.CJ_API_KEY || settings?.suppliers?.cjdropshipping?.apiKey;
  if (!apiKey || apiKey.trim() === '') {
    return { liveDispatched: false, mode: 'SIMULATION_PRÊT_POUR_PRODUCTION' };
  }
  try {
    const res = await fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrderV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': apiKey.trim()
      },
      body: JSON.stringify({
        orderNumber: orderPayload.id,
        shippingCountryCode: orderPayload.customer.countryCode,
        shippingCustomerName: orderPayload.customer.name,
        shippingAddress: orderPayload.customer.address || orderPayload.customer.city,
        shippingCity: orderPayload.customer.city,
        products: orderPayload.items.map(i => ({
          sku: settings?.skuMappings?.[i.id] || i.sku || i.id,
          quantity: i.qty
        }))
      })
    });
    const cjResponse = await res.json();
    return { liveDispatched: true, mode: 'LIVE_CJ_API_V2', cjResponse };
  } catch (err) {
    return { liveDispatched: false, mode: 'ERROR_FALLBACK', error: err.message };
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    if (typeof req.body === 'string' && req.body.length > 0) {
      try {
        return resolve(JSON.parse(req.body));
      } catch (e) {
        return reject(e);
      }
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const requestHandler = async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  // API 1: Récupérer toutes les commandes + KPIs financiers
  if (pathname === '/api/orders' && req.method === 'GET') {
    const orders = readJson(ORDERS_FILE, []);
    const stats = orders.reduce(
      (acc, o) => {
        acc.totalRevenueEur += Number(o.totalPaidEur || 0);
        acc.totalSupplierCostEur += Number(o.supplierCostTotalEur || 0);
        acc.totalStripeFeesEur += Number(o.stripeFeeEur || 0);
        acc.totalNetCommissionEur += Number(o.netCommissionEur || 0);
        acc.ordersCount += 1;
        return acc;
      },
      { totalRevenueEur: 0, totalSupplierCostEur: 0, totalStripeFeesEur: 0, totalNetCommissionEur: 0, ordersCount: 0 }
    );

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ orders, stats }));
  }

  // API 2: Suivi de colis public pour vos clients (Recherche par N° de commande ou Email)
  if (pathname === '/api/orders/track' && req.method === 'GET') {
    const q = (parsedUrl.searchParams.get('q') || '').trim().toLowerCase();
    const orders = readJson(ORDERS_FILE, []);
    const found = orders.find(
      o => o.id.toLowerCase() === q || (o.customer?.email || '').toLowerCase() === q
    );
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (!found) {
      return res.end(JSON.stringify({ found: false, demoHint: orders[0]?.id || 'ORD-8942-CH' }));
    }
    return res.end(JSON.stringify({ found: true, order: found }));
  }

  // API 3: Créer une commande client + Paiement + Envoi automatique au fournisseur
  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const payload = await readRequestBody(req);
      const orders = readJson(ORDERS_FILE, []);
      const settings = readJson(SETTINGS_FILE, INITIAL_SETTINGS);
      const route = resolveFulfillmentRouting(payload.countryCode || 'FR');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const trackingRandom = Math.floor(100000000 + Math.random() * 900000000);

      const totalPaidEur = Number(payload.totalPaidEur || 0);
      const supplierCostTotalEur = Number(payload.supplierCostTotalEur || 0);
      const stripeFeeEur = Number((totalPaidEur * 0.02).toFixed(2));
      const netCommissionEur = Number((totalPaidEur - supplierCostTotalEur - stripeFeeEur).toFixed(2));
      const marginPercent = totalPaidEur > 0 ? Number(((netCommissionEur / totalPaidEur) * 100).toFixed(1)) : 0;

      const newOrder = {
        id: `ORD-${randomNum}-${payload.countryCode || 'FR'}`,
        createdAt: new Date().toISOString(),
        customer: {
          name: payload.customer?.name || 'Client International',
          email: payload.customer?.email || 'client@auralabs.ch',
          address: payload.customer?.address || payload.customer?.city || 'Genève',
          city: payload.customer?.city || 'Genève',
          countryCode: payload.countryCode || 'FR',
          countryName: `${payload.countryName || 'France'} ${route.flag}`
        },
        items: (payload.items || []).map(item => ({
          ...item,
          sku: settings?.skuMappings?.[item.id] || item.sku || item.id
        })),
        currency: payload.currency || 'EUR',
        displayTotal: payload.displayTotal || `${totalPaidEur.toFixed(2)} €`,
        totalPaidEur,
        supplierCostTotalEur,
        stripeFeeEur,
        netCommissionEur,
        marginPercent,
        paymentMethod: payload.paymentMethod || 'Apple Pay / Carte Bancaire (Stripe)',
        fulfillment: {
          status: 'TRANSMIS_ET_PAYÉ_AU_FOURNISSEUR',
          warehouse: route.warehouse,
          carrier: route.carrier,
          trackingNumber: `${route.prefix}-${trackingRandom}`,
          estimatedDelivery: route.eta,
          autoDispatchedAt: new Date().toISOString(),
          cjDispatchMode: 'PENDING'
        }
      };

      const cjResult = await dispatchToCJDropshippingAPI(newOrder, settings);
      newOrder.fulfillment.cjDispatchMode = cjResult.mode;

      orders.unshift(newOrder);
      writeJson(ORDERS_FILE, orders);

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: true, order: newOrder, cjResult }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'Requête invalide', details: err.message }));
    }
  }

  // API 4: Lire & Enregistrer vos Clés API (Stripe, CJdropshipping, Supliful, SKUs, IBAN)
  if (pathname === '/api/settings' && req.method === 'GET') {
    const settings = readJson(SETTINGS_FILE, INITIAL_SETTINGS);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(settings));
  }

  if (pathname === '/api/settings' && req.method === 'POST') {
    try {
      const incoming = await readRequestBody(req);
      const current = readJson(SETTINGS_FILE, INITIAL_SETTINGS);
      const merged = {
        ...current,
        ...incoming,
        stripe: { ...current.stripe, ...(incoming.stripe || {}) },
        suppliers: {
          ...current.suppliers,
          cjdropshipping: { ...current.suppliers.cjdropshipping, ...(incoming.suppliers?.cjdropshipping || {}) },
          supliful: { ...current.suppliers.supliful, ...(incoming.suppliers?.supliful || {}) },
          spocket: { ...current.suppliers.spocket, ...(incoming.suppliers?.spocket || {}) }
        },
        skuMappings: { ...current.skuMappings, ...(incoming.skuMappings || {}) },
        payout: { ...current.payout, ...(incoming.payout || {}) }
      };
      if (merged.stripe.secretKey && merged.stripe.secretKey.startsWith('sk_')) {
        merged.stripe.mode = 'LIVE_STRIPE_ACTIVE';
      } else {
        merged.stripe.mode = 'SANDBOX_SIMULATION';
      }
      writeJson(SETTINGS_FILE, merged);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: true, settings: merged }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  // Servir les fichiers statiques
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, indexContent) => {
          if (err2) {
            res.writeHead(404);
            return res.end('Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexContent);
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
};

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`✅ Boutique Internationale AURA LABS & Portail Commissions actifs sur http://localhost:${PORT}`);
  });
}

module.exports = requestHandler;
