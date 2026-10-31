const http = require('http');
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const PORT = process.env.PORT || 3000;
const IS_VERCEL = Boolean(process.env.VERCEL || process.env.NOW_REGION);
const DATA_DIR = IS_VERCEL ? '/tmp/aura-labs-data' : path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_ORDERS = [
  {
    id: 'ORD-8942-CH',
    createdAt: '2026-10-31T14:22:10Z',
    customer: {
      firstName: 'Marc-Antoine',
      lastName: 'Rochat',
      name: 'Marc-Antoine Rochat',
      email: 'ma.rochat@bluewin.ch',
      phone: '+41 79 442 18 90',
      addressLine1: 'Rue de Bourg 18',
      postalCode: '1003',
      city: 'Lausanne',
      address: 'Rue de Bourg 18, 1003 Lausanne',
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
      firstName: 'Jessica',
      lastName: 'Miller',
      name: 'Jessica Miller',
      email: 'j.miller88@gmail.com',
      phone: '+1 (512) 894-2310',
      addressLine1: '742 Congress Ave',
      postalCode: '78701',
      city: 'Austin, TX',
      address: '742 Congress Ave, Austin, TX 78701',
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
      firstName: 'Lukas',
      lastName: 'Weber',
      name: 'Lukas Weber',
      email: 'lukas.weber@web.de',
      phone: '+49 171 8924102',
      addressLine1: 'Maximilianstraße 24',
      postalCode: '80539',
      city: 'München',
      address: 'Maximilianstraße 24, 80539 München',
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

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-8942',
    firstName: 'Marc-Antoine',
    lastName: 'Rochat',
    name: 'Marc-Antoine Rochat',
    email: 'ma.rochat@bluewin.ch',
    phone: '+41 79 442 18 90',
    addressLine1: 'Rue de Bourg 18',
    addressLine2: '3ème étage',
    postalCode: '1003',
    city: 'Lausanne',
    state: 'Vaud',
    countryCode: 'CH',
    updatedAt: '2026-10-31T14:22:10Z'
  },
  {
    id: 'CUST-8941',
    firstName: 'Jessica',
    lastName: 'Miller',
    name: 'Jessica Miller',
    email: 'j.miller88@gmail.com',
    phone: '+1 (512) 894-2310',
    addressLine1: '742 Congress Ave',
    addressLine2: 'Suite 400',
    postalCode: '78701',
    city: 'Austin',
    state: 'TX',
    countryCode: 'US',
    updatedAt: '2026-10-31T11:05:40Z'
  },
  {
    id: 'CUST-8940',
    firstName: 'Lukas',
    lastName: 'Weber',
    name: 'Lukas Weber',
    email: 'lukas.weber@web.de',
    phone: '+49 171 8924102',
    addressLine1: 'Maximilianstraße 24',
    addressLine2: '',
    postalCode: '80539',
    city: 'München',
    state: 'Bayern',
    countryCode: 'DE',
    updatedAt: '2026-10-30T19:40:12Z'
  }
];

const INITIAL_SETTINGS = {
  brandName: 'AURA LABS CLINIC™',
  domainName: 'auralabs.ch',
  supportEmail: 'concierge@auralabs.ch',
  companyAddress: 'AURA LABS International • Bahnhofstrasse 42, 8001 Zürich / 75008 Paris',
  autoFulfillmentEnabled: true,
  adminPassword: 'AURA2026',
  databaseUrl: '',
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
if (!fs.existsSync(CUSTOMERS_FILE)) {
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(INITIAL_CUSTOMERS, null, 2), 'utf8');
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

// ==================== COUCHE DE STOCKAGE VERCEL NEON POSTGRES (`@neondatabase/serverless`) ====================
let _sqlClient = null;
let _schemaInitialized = false;

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;

  try {
    const envLocalPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf8');
      const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
      if (match && match[1]) {
        process.env.DATABASE_URL = match[1];
        return match[1];
      }
    }
  } catch (e) {
    // ignore
  }

  const localSettings = readJson(SETTINGS_FILE, INITIAL_SETTINGS);
  return localSettings?.databaseUrl && localSettings.databaseUrl.startsWith('postgres')
    ? localSettings.databaseUrl
    : '';
}

function getSql() {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return null;
  if (!_sqlClient) {
    _sqlClient = neon(dbUrl);
  }
  return _sqlClient;
}

async function ensurePostgresSchema() {
  const sql = getSql();
  if (!sql || _schemaInitialized) return Boolean(sql);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS aura_orders (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        payload JSONB NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS aura_customers (
        email TEXT PRIMARY KEY,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        payload JSONB NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS aura_settings (
        id TEXT PRIMARY KEY,
        payload JSONB NOT NULL
      )
    `;

    // Seed initial data if tables are empty
    const existingOrders = await sql`SELECT COUNT(*)::int AS cnt FROM aura_orders`;
    if (existingOrders[0]?.cnt === 0) {
      for (const ord of INITIAL_ORDERS) {
        await sql`
          INSERT INTO aura_orders (id, created_at, payload)
          VALUES (${ord.id}, ${ord.createdAt}, ${JSON.stringify(ord)}::jsonb)
          ON CONFLICT (id) DO NOTHING
        `;
      }
      for (const cust of INITIAL_CUSTOMERS) {
        await sql`
          INSERT INTO aura_customers (email, updated_at, payload)
          VALUES (${cust.email.toLowerCase()}, ${cust.updatedAt}, ${JSON.stringify(cust)}::jsonb)
          ON CONFLICT (email) DO NOTHING
        `;
      }
      await sql`
        INSERT INTO aura_settings (id, payload)
        VALUES ('global', ${JSON.stringify(INITIAL_SETTINGS)}::jsonb)
        ON CONFLICT (id) DO NOTHING
      `;
    }
    _schemaInitialized = true;
    return true;
  } catch (err) {
    console.error('Neon Postgres fallback to local JSON:', err.message);
    return false;
  }
}

async function storageGetOrders() {
  if (await ensurePostgresSchema()) {
    const sql = getSql();
    const rows = await sql`SELECT payload FROM aura_orders ORDER BY created_at DESC`;
    return rows.map(r => r.payload);
  }
  return readJson(ORDERS_FILE, INITIAL_ORDERS);
}

async function storageSaveOrder(newOrder) {
  const orders = readJson(ORDERS_FILE, INITIAL_ORDERS);
  orders.unshift(newOrder);
  writeJson(ORDERS_FILE, orders);

  if (await ensurePostgresSchema()) {
    const sql = getSql();
    await sql`
      INSERT INTO aura_orders (id, created_at, payload)
      VALUES (${newOrder.id}, ${newOrder.createdAt}, ${JSON.stringify(newOrder)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload
    `;
  }
}

async function storageGetCustomers() {
  if (await ensurePostgresSchema()) {
    const sql = getSql();
    const rows = await sql`SELECT payload FROM aura_customers ORDER BY updated_at DESC`;
    return rows.map(r => r.payload);
  }
  return readJson(CUSTOMERS_FILE, INITIAL_CUSTOMERS);
}

async function storageUpsertCustomer(record) {
  const customers = readJson(CUSTOMERS_FILE, INITIAL_CUSTOMERS);
  const emailLower = (record.email || '').toLowerCase();
  const idx = customers.findIndex(c => (c.email || '').toLowerCase() === emailLower);
  if (idx !== -1) {
    customers[idx] = { ...customers[idx], ...record };
  } else {
    customers.unshift(record);
  }
  writeJson(CUSTOMERS_FILE, customers);

  if (await ensurePostgresSchema()) {
    const sql = getSql();
    await sql`
      INSERT INTO aura_customers (email, updated_at, payload)
      VALUES (${emailLower}, NOW(), ${JSON.stringify(record)}::jsonb)
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW(), payload = EXCLUDED.payload
    `;
  }
}

async function storageGetSettings() {
  if (await ensurePostgresSchema()) {
    const sql = getSql();
    const rows = await sql`SELECT payload FROM aura_settings WHERE id = 'global'`;
    if (rows.length > 0) return rows[0].payload;
  }
  return readJson(SETTINGS_FILE, INITIAL_SETTINGS);
}

async function storageSaveSettings(merged) {
  writeJson(SETTINGS_FILE, merged);
  if (merged.databaseUrl && merged.databaseUrl.startsWith('postgres')) {
    _sqlClient = null;
    _schemaInitialized = false;
  }
  if (await ensurePostgresSchema()) {
    const sql = getSql();
    await sql`
      INSERT INTO aura_settings (id, payload)
      VALUES ('global', ${JSON.stringify(merged)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload
    `;
  }
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
        shippingPhone: orderPayload.customer.phone || '',
        shippingAddress: orderPayload.customer.addressLine1 || orderPayload.customer.address || '',
        shippingAddress2: orderPayload.customer.addressLine2 || '',
        shippingZip: orderPayload.customer.postalCode || '',
        shippingCity: orderPayload.customer.city,
        shippingProvince: orderPayload.customer.state || orderPayload.customer.city,
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

function isAdminAuthorized(req, settings) {
  const provided = (req.headers['x-admin-password'] || '').trim();
  const expected = (process.env.ADMIN_PASSWORD || settings?.adminPassword || 'AURA2026').trim();
  return Boolean(provided && provided === expected);
}

const requestHandler = async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  // API 1: Récupérer toutes les commandes + KPIs financiers (RÉSERVÉ PROPRIÉTAIRE ADMIN)
  if (pathname === '/api/orders' && req.method === 'GET') {
    const settings = await storageGetSettings();
    if (!isAdminAuthorized(req, settings)) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'Accès réservé au propriétaire (Mot de passe requis)' }));
    }
    const orders = await storageGetOrders();
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
    return res.end(JSON.stringify({ orders, stats, storageMode: getSql() ? 'NEON_POSTGRES_PERMANENT' : 'LOCAL_FALLBACK' }));
  }

  // API 2: Suivi de colis public pour vos clients
  if (pathname === '/api/orders/track' && req.method === 'GET') {
    const q = (parsedUrl.searchParams.get('q') || '').trim().toLowerCase();
    const orders = await storageGetOrders();
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
      const settings = await storageGetSettings();
      const route = resolveFulfillmentRouting(payload.countryCode || 'FR');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const trackingRandom = Math.floor(100000000 + Math.random() * 900000000);

      const totalPaidEur = Number(payload.totalPaidEur || 0);
      const supplierCostTotalEur = Number(payload.supplierCostTotalEur || 0);
      const stripeFeeEur = Number((totalPaidEur * 0.02).toFixed(2));
      const netCommissionEur = Number((totalPaidEur - supplierCostTotalEur - stripeFeeEur).toFixed(2));
      const marginPercent = totalPaidEur > 0 ? Number(((netCommissionEur / totalPaidEur) * 100).toFixed(1)) : 0;

      const fullAddress = [
        payload.customer?.addressLine1 || payload.customer?.address,
        payload.customer?.addressLine2,
        `${payload.customer?.postalCode || ''} ${payload.customer?.city || ''}`.trim(),
        payload.customer?.state
      ].filter(Boolean).join(', ');

      const newOrder = {
        id: `ORD-${randomNum}-${payload.countryCode || 'FR'}`,
        createdAt: new Date().toISOString(),
        customer: {
          firstName: payload.customer?.firstName || '',
          lastName: payload.customer?.lastName || '',
          name: payload.customer?.name || `${payload.customer?.firstName || ''} ${payload.customer?.lastName || ''}`.trim() || 'Client International',
          email: payload.customer?.email || 'client@auralabs.ch',
          phone: payload.customer?.phone || '',
          addressLine1: payload.customer?.addressLine1 || payload.customer?.address || '',
          addressLine2: payload.customer?.addressLine2 || '',
          postalCode: payload.customer?.postalCode || '',
          city: payload.customer?.city || 'Genève',
          state: payload.customer?.state || '',
          address: fullAddress,
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

      await storageSaveOrder(newOrder);

      if (payload.customer?.email) {
        await storageUpsertCustomer({
          id: `CUST-${randomNum}`,
          firstName: newOrder.customer.firstName,
          lastName: newOrder.customer.lastName,
          name: newOrder.customer.name,
          email: payload.customer.email,
          phone: newOrder.customer.phone,
          addressLine1: newOrder.customer.addressLine1,
          addressLine2: newOrder.customer.addressLine2,
          postalCode: newOrder.customer.postalCode,
          city: newOrder.customer.city,
          state: newOrder.customer.state,
          countryCode: newOrder.customer.countryCode,
          updatedAt: new Date().toISOString()
        });
      }

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: true, order: newOrder, cjResult }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'Requête invalide', details: err.message }));
    }
  }

  // API 3bis: Espace Compte Client & Liste Complète des Clients pour le Backoffice
  if (pathname === '/api/customers' && req.method === 'GET') {
    const email = (parsedUrl.searchParams.get('email') || '').trim().toLowerCase();
    const customers = await storageGetCustomers();
    const orders = await storageGetOrders();
    const storageMode = getSql() ? 'NEON_POSTGRES_PERMANENT' : 'LOCAL_FALLBACK';

    if (!email) {
      const settings = await storageGetSettings();
      if (!isAdminAuthorized(req, settings)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Accès réservé au propriétaire (Mot de passe requis)' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ customers, totalCustomers: customers.length, storageMode }));
    }

    const customer = customers.find(c => (c.email || '').toLowerCase() === email) || null;
    const customerOrders = orders
      .filter(o => (o.customer?.email || '').toLowerCase() === email)
      .map(o => ({
        id: o.id,
        createdAt: o.createdAt,
        displayTotal: o.displayTotal,
        customer: { address: o.customer?.address, city: o.customer?.city },
        fulfillment: o.fulfillment
      }));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ customer, orders: customerOrders, storageMode }));
  }

  if (pathname === '/api/customers' && req.method === 'POST') {
    try {
      const payload = await readRequestBody(req);
      const customers = await storageGetCustomers();
      const orders = await storageGetOrders();
      const emailLower = (payload.email || '').trim().toLowerCase();
      if (!emailLower) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Email requis' }));
      }
      const existing = customers.find(c => (c.email || '').toLowerCase() === emailLower);
      const record = {
        id: existing ? existing.id : `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: payload.firstName || existing?.firstName || '',
        lastName: payload.lastName || existing?.lastName || '',
        name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || payload.name || existing?.name || '',
        email: payload.email.trim(),
        phone: payload.phone || existing?.phone || '',
        addressLine1: payload.addressLine1 || existing?.addressLine1 || '',
        addressLine2: payload.addressLine2 || existing?.addressLine2 || '',
        postalCode: payload.postalCode || existing?.postalCode || '',
        city: payload.city || existing?.city || '',
        state: payload.state || existing?.state || '',
        countryCode: payload.countryCode || existing?.countryCode || 'FR',
        updatedAt: new Date().toISOString()
      };
      await storageUpsertCustomer(record);
      const customerOrders = orders.filter(o => (o.customer?.email || '').toLowerCase() === emailLower);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: true, customer: record, orders: customerOrders }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  // API 4: Lire & Enregistrer vos Clés API + URL Neon Postgres (PROTÉGÉ PAR MOT DE PASSE ADMIN)
  if (pathname === '/api/settings' && req.method === 'GET') {
    const settings = await storageGetSettings();
    const isAdmin = isAdminAuthorized(req, settings);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (!isAdmin) {
      return res.end(JSON.stringify({
        isAdmin: false,
        brandName: settings.brandName,
        domainName: settings.domainName,
        supportEmail: settings.supportEmail,
        skuMappings: settings.skuMappings
      }));
    }
    return res.end(JSON.stringify({
      ...settings,
      isAdmin: true,
      storageMode: getSql() ? 'NEON_POSTGRES_PERMANENT' : 'LOCAL_FALLBACK'
    }));
  }

  if (pathname === '/api/settings' && req.method === 'POST') {
    try {
      const current = await storageGetSettings();
      if (!isAdminAuthorized(req, current)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Accès refusé : Mot de passe Propriétaire invalide.' }));
      }
      const incoming = await readRequestBody(req);
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
      await storageSaveSettings(merged);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: true, settings: merged, storageMode: getSql() ? 'NEON_POSTGRES_PERMANENT' : 'LOCAL_FALLBACK' }));
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
