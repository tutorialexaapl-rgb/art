/**
 * Post-build prerendering script.
 *
 * Generates static HTML files for all public pages so Googlebot sees
 * proper title, description, canonical, H1, main content, and JSON-LD
 * structured data without executing JavaScript.
 *
 * Static pages are generated from hardcoded metadata.
 * Dynamic pages (artists, commissions, blog posts) are fetched from
 * the Supabase REST API at build time.
 *
 * Usage: node scripts/prerender.mjs
 * Runs automatically as part of `npm run build`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// ─── Config ──────────────────────────────────────────────────────────────────

const SITE_URL = 'https://artiors.pl';
const BRAND = 'Artiors';
const LOCALE = 'pl-PL';
const OG_LOCALE = 'pl_PL';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// UWAGTA: musi być identyczne z src/lib/seo/seo-config.ts CORE_INTENTS — synchronizuj ręcznie przy każdej zmianie
const CORE_INTENTS = [
  'obrazy ręcznie malowane na zamówienie',
  'obrazy na zamówienie',
  'obrazy na zamówienie online',
  'ręcznie malowany obraz na zamówienie online',
  'zamów obraz online',
  'zamów obraz',
  'zleć obraz',
  'zlecenia dla artystów',
  'zlecenia malarskie',
  'artyści na zamówienie',
];

// ─── Env ─────────────────────────────────────────────────────────────────────

function parseEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = value;
  }
  return env;
}

const env = parseEnv(path.join(projectRoot, '.env'));
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[prerender] Missing Supabase env vars - skipping dynamic pages.');
}

// ─── Supabase REST helper ────────────────────────────────────────────────────

async function supabaseSelect(table, select, filters = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  const params = new URLSearchParams();
  params.set('select', select);
  for (const [key, value] of Object.entries(filters)) {
    // If the value starts with a Supabase operator (in., gt., lt., gte., lte.,
    // neq., like., ilike., is., not., etc.), use it directly as the filter.
    // Otherwise default to eq.
    const knownOps = ['in.', 'gt.', 'lt.', 'gte.', 'lte.', 'neq.', 'like.', 'ilike.', 'is.', 'not.', 'cs.', 'cd.', 'ova.', 'ovr.', 'sl.', 'sr.', 'nxr.', 'nxl.', 'adj.'];
    const isOperator = knownOps.some((op) => value.startsWith(op));
    if (isOperator) {
      params.set(key, value);
    } else {
      params.set(key, `eq.${value}`);
    }
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`[prerender] Supabase ${table} returned ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn(`[prerender] Supabase ${table} fetch failed:`, err.message);
    return [];
  }
}

// ─── HTML helpers ────────────────────────────────────────────────────────────

function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clamp(text, max) {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + '…';
}

function buildHead({ title, description, canonicalPath, robots = 'index, follow', ogType = 'website', ogImage, keywords = [], schema = [] }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const image = ogImage || DEFAULT_OG_IMAGE;
  const titleStr = title.includes(BRAND) ? title : `${title} | ${BRAND}`;

  const metaTags = [
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `<meta name="theme-color" content="#1c1917" />`,
    `<title>${escapeHtml(titleStr)}</title>`,
    `<meta name="description" content="${escapeHtml(clamp(description, 155))}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta name="robots" content="${robots}" />`,
    keywords.length > 0 ? `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}" />` : '',
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${BRAND}" />`,
    `<meta property="og:locale" content="${OG_LOCALE}" />`,
    `<meta property="og:title" content="${escapeHtml(titleStr)}" />`,
    `<meta property="og:description" content="${escapeHtml(clamp(description, 155))}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    ogType === 'article' ? `<meta property="og:image:width" content="1200" />` : '',
    ogType === 'article' ? `<meta property="og:image:height" content="630" />` : '',
    `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(titleStr)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(clamp(description, 155))}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:url" content="${escapeHtml(canonical)}" />`,
  ].filter(Boolean);

  const schemaScripts = schema
    .filter(Boolean)
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  return `    ${metaTags.join('\n    ')}${schemaScripts ? '\n    ' + schemaScripts : ''}`;
}

function buildPage({ title, description, canonicalPath, robots, ogType, ogImage, keywords, schema, bodyContent }) {
  const head = buildHead({ title, description, canonicalPath, robots, ogType, ogImage, keywords, schema });

  return `<!doctype html>
<html lang="pl">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" /></noscript>
    <link rel="dns-prefetch" href="https://images.pexels.com" />
    <link rel="preconnect" href="https://images.pexels.com" crossorigin />
${head}
  </head>
  <body>
    <div id="root">${bodyContent}</div>
    <script type="module" src="/assets/index.js"></script>
  </body>
</html>`;
}

// ─── Body content builders ───────────────────────────────────────────────────

function staticBody(h1, paragraphs = []) {
  const content = paragraphs
    .filter(Boolean)
    .map((p) => `      <p>${escapeHtml(p)}</p>`)
    .join('\n');
  return `\n      <h1>${escapeHtml(h1)}</h1>\n${content}\n    `;
}

function artistBody(artist) {
  const styles = Array.isArray(artist.styles) ? artist.styles.join(', ') : '';
  const techniques = Array.isArray(artist.techniques) ? artist.techniques.join(', ') : '';
  const parts = [
    `<h1>${escapeHtml(artist.artist_name)} - artysta malarz</h1>`,
    artist.bio ? `<p>${escapeHtml(artist.bio)}</p>` : '',
    styles ? `<p><strong>Style:</strong> ${escapeHtml(styles)}</p>` : '',
    techniques ? `<p><strong>Techniki:</strong> ${escapeHtml(techniques)}</p>` : '',
    artist.location ? `<p><strong>Lokalizacja:</strong> ${escapeHtml(artist.location)}</p>` : '',
  ].filter(Boolean);
  return '\n      ' + parts.join('\n      ') + '\n    ';
}

function commissionBody(c) {
  const dims = c.width_cm && c.height_cm ? `${c.width_cm}×${c.height_cm} cm` : '';
  const budget = c.budget_min && c.budget_max
    ? c.budget_min === c.budget_max ? `${c.budget_min} zł` : `${c.budget_min}–${c.budget_max} zł`
    : '';
  const parts = [
    `<h1>${escapeHtml(c.title)}</h1>`,
    c.public_summary ? `<p>${escapeHtml(c.public_summary)}</p>` : '',
    c.style ? `<p><strong>Styl:</strong> ${escapeHtml(c.style)}</p>` : '',
    c.medium ? `<p><strong>Technika:</strong> ${escapeHtml(c.medium)}</p>` : '',
    dims ? `<p><strong>Wymiary:</strong> ${escapeHtml(dims)}</p>` : '',
    budget ? `<p><strong>Budżet:</strong> ${escapeHtml(budget)}</p>` : '',
    c.deadline ? `<p><strong>Termin:</strong> ${escapeHtml(c.deadline)}</p>` : '',
    c.location ? `<p><strong>Lokalizacja:</strong> ${escapeHtml(c.location)}</p>` : '',
  ].filter(Boolean);
  return '\n      ' + parts.join('\n      ') + '\n    ';
}

function blogBody(post) {
  const contentHtml = renderBlogContent(post.content);
  const parts = [
    `<h1>${escapeHtml(post.title)}</h1>`,
    `<p><strong>Autor:</strong> ${escapeHtml(post.author || BRAND)}</p>`,
    post.published_at ? `<p><strong>Data publikacji:</strong> ${escapeHtml(post.published_at.split('T')[0])}</p>` : '',
    post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : '',
    contentHtml,
  ].filter(Boolean);
  return '\n      ' + parts.join('\n      ') + '\n    ';
}

function renderBlogContent(content) {
  if (!content || !Array.isArray(content)) return '';
  const blocks = content.slice(0, 20).map((block) => {
    if (!block || typeof block !== 'object') return '';
    switch (block.type) {
      case 'paragraph':
      case 'text':
        return block.text ? `<p>${escapeHtml(block.text)}</p>` : '';
      case 'heading':
      case 'header':
        return block.text ? `<h2>${escapeHtml(block.text)}</h2>` : '';
      case 'quote':
      case 'blockquote':
        return block.text ? `<blockquote><p>${escapeHtml(block.text)}</p></blockquote>` : '';
      case 'list':
        if (Array.isArray(block.items)) {
          const items = block.items.map((i) => `<li>${escapeHtml(typeof i === 'string' ? i : i.text || '')}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        return '';
      case 'image':
        return block.url ? `<figure><img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.alt || block.caption || '')}" /><figcaption>${escapeHtml(block.caption || '')}</figcaption></figure>` : '';
      default:
        return block.text ? `<p>${escapeHtml(block.text)}</p>` : '';
    }
  }).filter(Boolean);
  return blocks.join('\n      ');
}

// ─── Schema builders ─────────────────────────────────────────────────────────

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: SITE_URL,
    description: 'Obrazy ręcznie malowane na zamówienie. Platforma łącząca zlecających z artystami malarzami w Polsce.',
    areaServed: { '@type': 'Country', name: 'Polska' },
    knowsAbout: ['malarstwo', 'obrazy na zamówienie', 'sztuka współczesna'],
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE_URL,
    description: 'Obrazy ręcznie malowane na zamówienie',
    inLanguage: LOCALE,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/zlecenia?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

function artistSchema(artist) {
  const sameAs = [];
  if (artist.website) sameAs.push(artist.website.startsWith('http') ? artist.website : `https://${artist.website}`);
  if (artist.instagram) {
    const h = artist.instagram.replace('@', '');
    sameAs.push(h.startsWith('http') ? h : `https://instagram.com/${h}`);
  }
  const knowsAbout = [
    ...(Array.isArray(artist.styles) ? artist.styles : []),
    ...(Array.isArray(artist.techniques) ? artist.techniques : []),
    'malarstwo',
  ];
  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'VisualArtist'],
    name: artist.artist_name,
    description: artist.bio || undefined,
    url: `${SITE_URL}/artysci/${artist.slug}`,
    image: artist.avatar_url || undefined,
    jobTitle: 'Artysta malarz',
    address: artist.location ? { '@type': 'PostalAddress', addressLocality: artist.location } : undefined,
    knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

function commissionSchema(c) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c.title,
    description: c.public_summary || undefined,
    url: `${SITE_URL}/zlecenia/${c.slug}`,
    genre: c.style || undefined,
    material: c.medium || undefined,
    size: c.width_cm && c.height_cm ? `${c.width_cm}×${c.height_cm} cm` : undefined,
    spatialCoverage: c.location ? { '@type': 'Place', name: c.location } : undefined,
    datePublished: c.created_at || undefined,
    dateModified: c.updated_at || undefined,
    inLanguage: LOCALE,
    provider: { '@type': 'Organization', name: BRAND },
    isAccessibleForFree: true,
  };
}

function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.description || undefined,
    image: post.featured_image || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: { '@type': 'Person', name: post.author || post.author_name || BRAND },
    publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-default.jpg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    inLanguage: LOCALE,
  };
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// ─── Static page definitions ─────────────────────────────────────────────────

const STATIC_PAGES = [
  {
    path: '/',
    title: 'Obrazy Ręcznie Malowane na Zamówienie',
    description: 'Zamów ręcznie malowany obraz od artysty. Opisz wizję, dodaj inspiracje i otrzymaj oferty od zweryfikowanych malarzy. Rejestracja i publikacja darmowe.',
    h1: 'Obrazy Ręcznie Malowane na Zamówienie',
    paragraphs: ['Platforma łącząca zlecających z artystami malarzami w Polsce. Zleć obraz dopasowany do Twojego wnętrza, wybierz artystę i otrzymaj unikatowe dzieło z certyfikatem autentyczności.'],
    schema: [organizationSchema(), websiteSchema()],
  },
  {
    path: '/obrazy-na-zamowienie',
    title: 'Obrazy Ręcznie Malowane na Zamówienie',
    description: 'Obrazy Ręcznie Malowane na Zamówienie — zleć obraz dopasowany do wnętrza. Opisz pomysł, dodaj inspiracje, wybierz artystę. Rejestracja i publikacja darmowe.',
    h1: 'Obrazy na Zamówienie',
    paragraphs: ['Zleć obraz ręcznie malowany dopasowany do Twojego wnętrza. Wybierz styl, wymiary i paletę, dodaj inspiracje i otrzymaj oferty od zweryfikowanych artystów.'],
    schema: [breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Obrazy na zamówienie', path: '/obrazy-na-zamowienie' }])],
  },
  {
    path: '/zamow-obraz',
    title: 'Zamów Obraz Ręcznie Malowany',
    description: 'Zamów obraz ręcznie malowany - opisz swoje potrzeby, dodaj inspiracje i opublikuj zlecenie. Artyści odpowiedzą ofertami.',
    h1: 'Zamów obraz ręcznie malowany',
    paragraphs: ['Opisz swój pomysł na obraz, dodaj inspiracje, ustal budżet i termin. Artyści na platformie odpowiedzą ofertami z wyceną i propozycją realizacji.'],
    schema: [],
  },
  {
    path: '/zlec-obraz',
    title: 'Zleć Wykonanie Obrazu Artyście — Jak Zlecić Obraz Krok po Kroku',
    description: 'Zleć obraz artyście - krok po kroku: opisz zlecenie, podaj wymiary, wybierz kolory, dodaj inspiracje, wybierz artystę. FAQ: cena, czas, płatność. Rejestracja darmowa.',
    h1: 'Zleć obraz - jak zlecić obraz krok po kroku',
    paragraphs: ['Przewodnik krok po kroku przez proces zlecania obrazu - od opisu zlecenia, przez wybór artysty, po realizację i odbiór gotowego dzieła.'],
    schema: [breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Obrazy na zamówienie', path: '/obrazy-na-zamowienie' }, { name: 'Zleć obraz', path: '/zlec-obraz' }])],
  },
  {
    path: '/zlecenia',
    title: 'Aktualne Zlecenia na Obrazy',
    description: 'Przeglądaj aktualne zlecenia na obrazy ręcznie malowane. Znajdź zlecenie dopasowane do Twojego stylu i złóż ofertę.',
    h1: 'Aktualne zlecenia na obrazy',
    paragraphs: ['Przeglądaj otwarte zlecenia na ręcznie malowane obrazy. Filtruj po stylu, budżecie i terminie. Artyści mogą składać oferty bezpośrednio do zleceń.'],
    schema: [],
  },
  {
    path: '/zlecenia-dla-artystow',
    title: 'Zlecenia dla Artystów i Malarzy — Zlecenia Malarskie Online',
    description: 'Zlecenia dla artystów malarzy: przeglądaj otwarte zlecenia malarskie, składaj oferty, komunikuj się ze zlecającymi i realizuj obrazy na zamówienie. Rejestracja darmowa.',
    h1: 'Zlecenia dla artystów i malarzy',
    paragraphs: ['Marketplace zleceń malarskich dla artystów. Przeglądaj otwarte zlecenia, składaj oferty, komunikuj się ze zlecającymi i realizuj obrazy na zamówienie.'],
    schema: [
      breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Dla artystów', path: '/dla-artystow' }, { name: 'Zlecenia dla artystów', path: '/zlecenia-dla-artystow' }]),
      { '@context': 'https://schema.org', '@type': 'Service', name: 'Zlecenia dla artystów i malarzy', description: 'Marketplace zleceń malarskich dla artystów.', url: `${SITE_URL}/zlecenia-dla-artystow`, serviceType: 'Zlecenia malarskie', provider: { '@type': 'Organization', name: BRAND }, areaServed: { '@type': 'Country', name: 'Polska' } },
    ],
  },
  {
    path: '/artysci',
    title: 'Artyści Malarze na Zamówienie',
    description: 'Przeglądaj profile artystów malarzy. Zobacz portfolio, style i techniki, i zleć obraz u wybranego twórcy.',
    h1: 'Artyści malarze na zamówienie',
    paragraphs: ['Poznaj zweryfikowanych artystów malarzy. Przeglądaj portfolio, style, techniki i specjalizacje. Zleć obraz bezpośrednio u wybranego twórcy.'],
    schema: [],
  },
  {
    path: '/jak-to-dziala',
    title: 'Jak Zlecić Obraz — Przewodnik Krok po Kroku',
    description: 'Dowiedz się, jak działa platforma. Od publikacji zlecenia, przez oferty artystów, po realizację projektu i płatności.',
    h1: 'Jak to działa - zlecanie obrazów krok po kroku',
    paragraphs: ['Przewodnik po platformie - od publikacji zlecenia, przez oferty artystów, po realizację projektu i płatności w dwóch etapach.'],
    schema: [],
  },
  {
    path: '/cennik',
    title: 'Cennik — Ile Kosztuje Obraz na Zamówienie',
    description: 'Zobacz opłaty i prowizje platformy. Przejrzyste ceny dla zlecających i artystów. Rejestracja i publikacja zleceń są darmowe.',
    h1: 'Cennik platformy',
    paragraphs: ['Przejrzyste opłaty i prowizje. Rejestracja i publikacja zleceń są darmowe. Płacisz tylko za obraz, gdy akceptujesz ofertę artysty.'],
    schema: [],
  },
  {
    path: '/faq',
    title: 'FAQ — Najczęstsze Pytania o Obrazy na Zamówienie',
    description: 'Najczęściej zadawane pytania o zlecanie obrazów, oferty, płatności i bezpieczeństwo na platformie.',
    h1: 'FAQ - najczęstsze pytania',
    paragraphs: ['Najczęściej zadawane pytania o zlecanie obrazów, oferty artystów, płatności i bezpieczeństwo na platformie.'],
    schema: [],
  },
  {
    path: '/kontakt',
    title: 'Kontakt',
    description: 'Skontaktuj się z zespołem platformy. Masz pytania, propozycje lub potrzebujesz pomoc? Napisz do nas.',
    h1: 'Kontakt',
    paragraphs: ['Skontaktuj się z zespołem platformy Artiors. Odpowiadamy na pytania dotyczące zlecania obrazów, współpracy z artystami i funkcjonowania platformy.'],
    schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: `Kontakt - ${BRAND}`, url: `${SITE_URL}/kontakt`, inLanguage: LOCALE }],
  },
  {
    path: '/dla-zlecajacych',
    title: 'Zleć Obraz Artyście',
    description: 'Zleć obraz odpowiadający Twojej wizji. Opublikuj zlecenie, otrzymaj oferty od sprawdzonych artystów i wybierz idealnego twórcę.',
    h1: 'Zleć obraz artyście',
    paragraphs: ['Zleć obraz odpowiadający Twojej wizji. Opublikuj zlecenie, otrzymaj oferty od sprawdzonych artystów i wybierz idealnego twórcę.'],
    schema: [],
  },
  {
    path: '/dla-artystow',
    title: 'Zlecenia dla Artystów Malarzy',
    description: 'Znajdź zlecenia na obrazy dopasowane do Twojego stylu. Otrzymuj zlecenia, składaj oferty i buduj portfolio na platformie.',
    h1: 'Zlecenia dla Artystów Malarzy',
    paragraphs: ['Znajdź zlecenia na obrazy dopasowane do Twojego stylu. Otrzymuj zlecenia, składaj oferty i buduj portfolio na platformie.'],
    schema: [],
  },
  {
    path: '/obrazy-do-salonu',
    title: 'Obrazy do Salonu na Zamówienie',
    description: 'Zleć obraz do salonu ręcznie malowany — dopasowany do stylu, kolorów i wymiarów wnętrza. Otrzymaj oferty od artystów.',
    h1: 'Obrazy do Salonu na Zamówienie',
    paragraphs: ['Zleć obraz do salonu ręcznie malowany - dopasowany do stylu, kolorów i wymiarów wnętrza. Otrzymaj oferty od artystów.'],
    schema: [],
  },
  {
    path: '/obrazy-do-sypialni',
    title: 'Obrazy do Sypialni na Zamówienie',
    description: 'Zleć obraz do sypialni ręcznie malowany — spokojna paleta, intymna atmosfera. Dopasowany do przestrzeni i nastroju.',
    h1: 'Obrazy do Sypialni na Zamówienie',
    paragraphs: ['Zleć obraz do sypialni ręcznie malowany - spokojna paleta, intymna atmosfera. Dopasowany do przestrzeni i nastroju.'],
    schema: [],
  },
  {
    path: '/obrazy-do-biura',
    title: 'Obrazy do Biura na Zamówienie',
    description: 'Zleć obraz do biura ręcznie malowany — profesjonalny, inspirujący. Dopasowany do przestrzeni pracy i wizerunku firmy.',
    h1: 'Obrazy do Biura na Zamówienie',
    paragraphs: ['Zleć obraz do biura ręcznie malowany - profesjonalny, inspirujący. Dopasowany do przestrzeni pracy i wizerunku firmy.'],
    schema: [],
  },
  {
    path: '/obrazy-do-hotelu',
    title: 'Obrazy do Hotelu na Zamówienie',
    description: 'Zleć obrazy do hotelu — serie dopasowane do pokoi, lobby i stref gastronomicznych. Ręcznie malowane, unikatowe.',
    h1: 'Obrazy do Hotelu na Zamówienie',
    paragraphs: ['Zleć obrazy do hotelu - serie dopasowane do pokoi, lobby i stref gastronomicznych. Ręcznie malowane, unikatowe.'],
    schema: [],
  },
  {
    path: '/blog',
    title: 'Blog — Porady i Inspiracje',
    description: 'Porady, inspiracje i przewodniki o obrazach ręcznie malowanych na zamówienie. Dowiedz się, jak zlecić obraz i wybrać artystę.',
    h1: 'Blog — Porady i Inspiracje',
    paragraphs: ['Porady, inspiracje i przewodniki o obrazach ręcznie malowanych na zamówienie. Dowiedz się, jak zlecić obraz, wybrać artystę i dopasować dzieło do wnętrza.'],
    schema: [{ '@context': 'https://schema.org', '@type': 'Blog', name: `Blog - ${BRAND}`, url: `${SITE_URL}/blog`, description: 'Porady i inspiracje o obrazach na zamówienie.', inLanguage: LOCALE, publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-default.jpg` } } }],
  },
  {
    path: '/regulamin',
    title: 'Regulamin',
    description: 'Warunki korzystania z platformy - zasady publikacji zleceń, składania ofert, płatności i realizacji projektów.',
    h1: 'Regulamin',
    paragraphs: ['Warunki korzystania z platformy Artiors - zasady publikacji zleceń, składania ofert, płatności i realizacji projektów.'],
    schema: [],
  },
  {
    path: '/polityka-prywatnosci',
    title: 'Polityka Prywatności',
    description: 'Jak przetwarzamy Twoje dane osobowe zgodnie z RODO. Zakres danych, cele przetwarzania i prawa użytkownika.',
    h1: 'Polityka Prywatności',
    paragraphs: ['Zakres przetwarzania danych osobowych, cele przetwarzania i prawa użytkownika zgodnie z RODO.'],
    schema: [],
  },
  {
    path: '/zasady-dla-artystow',
    title: 'Zasady dla Artystów',
    description: 'Reguły obowiązujące artystów — weryfikacja, komentarze, oferty, realizacja i płatności na platformie.',
    h1: 'Zasady dla Artystów',
    paragraphs: ['Reguły obowiązujące artystów na platformie - weryfikacja, komentarze, oferty, realizacja i płatności.'],
    schema: [],
  },
  {
    path: '/zasady-dla-zlecajacych',
    title: 'Zasady dla Zlecających',
    description: 'Reguły obowiązujące zlecających — publikacja zleceń, prywatność, oferty, płatności i odpowiedzialność.',
    h1: 'Zasady dla Zlecających',
    paragraphs: ['Reguły obowiązujące zlecających na platformie - publikacja zleceń, prywatność, oferty, płatności i odpowiedzialność.'],
    schema: [],
  },
];

// ─── Obrazy kategorie (style) ────────────────────────────────────────────────

const OBRAZY_KATEGORIE = [
  { slug: 'abstrakcyjne', name: 'Obrazy Abstrakcyjne', h1: 'Obrazy Abstrakcyjne na Zamówienie', description: 'Zleć obraz abstrakcyjny ręcznie malowany - dopasowany do Twojego wnętrza. Wybierz artystę, określ paletę i wymiary.' },
  { slug: 'pejzaze', name: 'Obrazy Pejzaże', h1: 'Pejzaże na Zamówienie — Obrazy Ręcznie Malowane', description: 'Zleć pejzaż ręcznie malowany - górski, morski, miejski. Wybierz artystę, określ scenerię i wymiary obrazu.' },
  { slug: 'portrety', name: 'Portrety na Zamówienie', h1: 'Portrety na Zamówienie — Ręcznie Malowane', description: 'Zleć portret ręcznie malowany - portret rodziny, dziecka, zwierzęcia. Wybierz artystę portrecistę i technikę.' },
  { slug: 'nowoczesne', name: 'Obrazy Nowoczesne', h1: 'Obrazy Nowoczesne na Zamówienie', description: 'Zleć nowoczesny obraz ręcznie malowany - dopasowany do współczesnego wnętrza. Geometryczne, minimalne, graficzne.' },
  { slug: 'minimalistyczne', name: 'Obrazy Minimalistyczne', h1: 'Obrazy Minimalistyczne na Zamówienie', description: 'Zleć minimalistyczny obraz ręcznie malowany - stonowana paleta, prosta kompozycja. Idealne do skandynawskiego wnętrza.' },
];

// ─── Blog kategorie ──────────────────────────────────────────────────────────

const BLOG_KATEGORIE = [
  { slug: 'obrazy-na-zamowienie', title: 'Obrazy na Zamówienie — Przewodniki i Poradniki', name: 'Obrazy na Zamówienie', description: 'Wszystko o obrazach na zamówienie: jak zlecić, ile kosztują, jak wybrać artystę i jak ustalić budżet na ręcznie malowane dzieło.' },
  { slug: 'obrazy-do-wnetrz', title: 'Obrazy do Wnętrz — Jak Dopasować Obraz do Przestrzeni', name: 'Obrazy do Wnętrz', description: 'Jak dobrać obraz do salonu, sypialni, biura lub hotelu. Skala, paleta, kompozycja i styl - poradniki dla zlecających i architektów wnętrz.' },
  { slug: 'style-malarskie', title: 'Style Malarskie — Przewodnik po Technikach i Kierunkach', name: 'Style Malarskie', description: 'Abstrakcja, realizm, impresjonizm, minimalizm - poznaj style malarskie i wybierz technikę odpowiednią dla Twojego obrazu.' },
  { slug: 'jak-zamowic-obraz', title: 'Jak Zamówić Obraz — Przewodnik Krok po Kroku', name: 'Jak Zamówić Obraz', description: 'Kompletny przewodnik: od pomysłu, przez opis zlecenia, wybór artysty, płatność zaliczki, po odbiór gotowego obrazu.' },
  { slug: 'zlecenia-dla-artystow', title: 'Zlecenia dla Artystów — Jak Znaleźć i Realizować Zlecenia Malarskie', name: 'Zlecenia dla Artystów', description: 'Marketplace zleceń dla artystów malarzy: jak przeglądać zlecenia, składać oferty, komunikować się ze zlecającymi i realizować projekty.' },
  { slug: 'poradniki-dla-artystow', title: 'Poradniki dla Artystów — Portfolio, Wycena, Kariera', name: 'Poradniki dla Artystów', description: 'Praktyczne porady dla artystów malarzy: budowanie portfolio, wycena prac, komunikacja ze zlecającymi, budowanie marki osobistej.' },
];

// ─── File writing ────────────────────────────────────────────────────────────

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

function writePage(routePath, html) {
  if (routePath === '/') {
    writeFile(path.join(distDir, 'index.html'), html);
    return;
  }
  writeFile(path.join(distDir, routePath, 'index.html'), html);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('[prerender] dist/ directory not found. Run `vite build` first.');
    process.exit(1);
  }

  // Find the actual JS bundle name
  const assetsDir = path.join(distDir, 'assets');
  let jsBundle = '/assets/index.js';
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const jsFile = files.find((f) => f.endsWith('.js') && f.startsWith('index-'));
    if (jsFile) jsBundle = `/assets/${jsFile}`;
  }

  let pageCount = 0;

  // 1. Static pages
  console.log('[prerender] Generating static pages...');
  for (const page of STATIC_PAGES) {
    const html = buildPage({
      title: page.title,
      description: page.description,
      canonicalPath: page.path,
      keywords: [],
      schema: page.schema,
      bodyContent: staticBody(page.h1, page.paragraphs),
    }).replace('/assets/index.js', jsBundle);

    writePage(page.path, html);
    pageCount++;
  }

  // 2. Obrazy kategorie
  console.log('[prerender] Generating obrazy kategorie...');
  for (const kat of OBRAZY_KATEGORIE) {
    const routePath = `/obrazy/${kat.slug}`;
    const html = buildPage({
      title: kat.name,
      description: kat.description,
      canonicalPath: routePath,
      keywords: [],
      schema: [breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Obrazy na zamówienie', path: '/obrazy-na-zamowienie' }, { name: kat.name, path: routePath }])],
      bodyContent: staticBody(kat.h1, [kat.description]),
    }).replace('/assets/index.js', jsBundle);
    writePage(routePath, html);
    pageCount++;
  }

  // 3. Blog kategorie
  console.log('[prerender] Generating blog kategorie...');
  for (const cat of BLOG_KATEGORIE) {
    const routePath = `/blog/kategoria/${cat.slug}`;
    const html = buildPage({
      title: cat.title,
      description: cat.description,
      canonicalPath: routePath,
      keywords: [],
      schema: [breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Blog', path: '/blog' }, { name: cat.name, path: routePath }])],
      bodyContent: staticBody(cat.title, [cat.description]),
    }).replace('/assets/index.js', jsBundle);
    writePage(routePath, html);
    pageCount++;
  }

  // 4. Artist profiles
  console.log('[prerender] Fetching artist profiles from Supabase...');
  const artists = await supabaseSelect(
    'artist_profiles',
    'slug,artist_name,bio,styles,techniques,location,avatar_url,is_verified,website,instagram,updated_at',
    { approval_status: 'approved' },
  );
  console.log(`[prerender] Found ${artists.length} approved artists`);
  for (const artist of artists) {
    if (!artist.slug) continue;
    const routePath = `/artysci/${artist.slug}`;
    const schema = [
      artistSchema(artist),
      breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Artyści', path: '/artysci' }, { name: artist.artist_name, path: routePath }]),
    ];
    const descParts = [
      artist.bio ? clamp(artist.bio, 100) : '',
      Array.isArray(artist.styles) && artist.styles.length > 0 ? `Style: ${artist.styles.join(', ')}.` : '',
      Array.isArray(artist.techniques) && artist.techniques.length > 0 ? `Techniki: ${artist.techniques.join(', ')}.` : '',
      artist.location ? `Lokalizacja: ${artist.location}.` : '',
    ].filter(Boolean);
    const description = descParts.join(' ') || `${artist.artist_name} tworzy ręcznie malowane obrazy na zamówienie online. Zleć obraz bezpośrednio u wybranego twórcy.`;
    const html = buildPage({
      title: `${artist.artist_name} — Artysta Malarz`,
      description,
      canonicalPath: routePath,
      ogType: 'profile',
      ogImage: artist.avatar_url,
      keywords: [artist.artist_name, ...(artist.styles || []), ...(artist.techniques || []), 'artysta malarz', 'zleć obraz', artist.location, ...CORE_INTENTS].filter(Boolean),
      schema,
      bodyContent: artistBody(artist),
    }).replace('/assets/index.js', jsBundle);
    writePage(routePath, html);
    pageCount++;
  }

  // 5. Commission details
  console.log('[prerender] Fetching commissions from Supabase...');
  const commissions = await supabaseSelect(
    'commission_requests',
    'slug,title,public_summary,style,medium,width_cm,height_cm,budget_min,budget_max,status,deadline,location,room_type,mood,created_at,updated_at',
    { status: 'in.("published","offers_open","in_progress","completed")' },
  );
  console.log(`[prerender] Found ${commissions.length} public commissions`);
  for (const c of commissions) {
    if (!c.slug) continue;
    const routePath = `/zlecenia/${c.slug}`;
    const dims = c.width_cm && c.height_cm ? `${c.width_cm}×${c.height_cm} cm` : '';
    const budget = c.budget_min && c.budget_max
      ? c.budget_min === c.budget_max ? `${c.budget_min} zł` : `${c.budget_min}–${c.budget_max} zł`
      : '';
    const descParts = [
      `Ręcznie malowany obraz na zamówienie: ${c.title}.`,
      c.public_summary || '',
      c.style ? `Styl: ${c.style}.` : '',
      dims ? `Wymiary: ${dims}.` : '',
      budget ? `Budżet: ${budget}.` : '',
    ].filter(Boolean);
    const titleParts = [c.title, dims].filter(Boolean).join(' ');
    const schema = [
      commissionSchema(c),
      breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Zlecenia', path: '/zlecenia' }, { name: c.title, path: routePath }]),
    ];
    const html = buildPage({
      title: `${titleParts} — Zlecenie dla Artysty`,
      description: clamp(descParts.join(' '), 155),
      canonicalPath: routePath,
      ogType: 'article',
      keywords: [c.title, c.style, c.medium, 'zlecenie na obraz', 'zleć obraz', dims, ...CORE_INTENTS].filter(Boolean),
      schema,
      bodyContent: commissionBody(c),
    }).replace('/assets/index.js', jsBundle);
    writePage(routePath, html);
    pageCount++;
  }

  // 6. Blog posts
  console.log('[prerender] Fetching blog posts from Supabase...');
  const blogPosts = await supabaseSelect(
    'blog_posts',
    'slug,title,excerpt,content,featured_image,author,published_at,updated_at,seo_title,seo_description,canonical,noindex,status',
    { status: 'published' },
  );
  console.log(`[prerender] Found ${blogPosts.length} published blog posts`);
  for (const post of blogPosts) {
    if (!post.slug || post.noindex) continue;
    const routePath = `/blog/${post.slug}`;
    const title = post.seo_title || post.title;
    const description = post.seo_description || post.excerpt || '';
    const schema = [
      articleSchema({
        ...post,
        author_name: post.author,
        description: post.excerpt || post.description || '',
      }),
      breadcrumbSchema([{ name: 'Strona główna', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: routePath }]),
    ];
    const html = buildPage({
      title,
      description: clamp(description, 155),
      canonicalPath: routePath,
      ogType: 'article',
      ogImage: post.featured_image,
      keywords: [post.title, 'obrazy na zamówienie', 'blog'],
      schema,
      bodyContent: blogBody(post),
    }).replace('/assets/index.js', jsBundle);
    writePage(routePath, html);
    pageCount++;
  }

  // 7. 404 page
  console.log('[prerender] Generating 404 page...');
  const notFoundHtml = buildPage({
    title: 'Strona Nie Znaleziona (404)',
    description: 'Strona, której szukasz, nie istnieje. Wróć do strony głównej platformy Artiors.',
    canonicalPath: '/404',
    robots: 'noindex, follow',
    keywords: [],
    schema: [],
    bodyContent: staticBody('Strona nie znaleziona', ['Strona, której szukasz, nie istnieje lub została przeniesiona. Wróć do strony głównej platformy Artiors, aby przeglądać obrazy na zamówienie, artystów i zlecenia.']),
  }).replace('/assets/index.js', jsBundle);
  writeFile(path.join(distDir, '404.html'), notFoundHtml);
  pageCount++;

  console.log(`[prerender] Done! Generated ${pageCount} prerendered pages.`);
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
