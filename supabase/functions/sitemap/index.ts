import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SITE_URL = 'https://atelier.pl';
const MAX_URLS_PER_SITEMAP = 50000;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } },
);

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlEntry(url: SitemapUrl): string {
  let entry = '  <url>\n';
  entry += `    <loc>${escapeXml(url.loc)}</loc>\n`;
  if (url.lastmod) {
    entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
  }
  if (url.changefreq) {
    entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
  }
  entry += `    <priority>${url.priority}</priority>\n`;
  entry += '  </url>';
  return entry;
}

function buildSitemap(urls: SitemapUrl[]): string {
  const body = urls.map(buildUrlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function buildSitemapIndex(sitemaps: { loc: string; lastmod: string }[]): string {
  const entries = sitemaps.map((s) =>
    `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Static pages sitemap ──────────────────────────────────────────────────

async function getPagesSitemap(): Promise<string> {
  const staticPages: SitemapUrl[] = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/obrazy-na-zamowienie`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_URL}/zamow-obraz`, changefreq: 'monthly', priority: '0.9' },
    { loc: `${SITE_URL}/zlec-obraz`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/zlecenia`, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/zlecenia-dla-artystow`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${SITE_URL}/artysci`, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.7' },
    { loc: `${SITE_URL}/jak-to-dziala`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/cennik`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/faq`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/kontakt`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_URL}/dla-zlecajacych`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/dla-artystow`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/regulamin`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${SITE_URL}/polityka-prywatnosci`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${SITE_URL}/zasady-dla-artystow`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${SITE_URL}/zasady-dla-zlecajacych`, changefreq: 'yearly', priority: '0.3' },
    // Obrazy do wnętrz
    { loc: `${SITE_URL}/obrazy-do-salonu`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy-do-sypialni`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy-do-biura`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy-do-hotelu`, changefreq: 'weekly', priority: '0.7' },
    // Obrazy kategorie (style)
    { loc: `${SITE_URL}/obrazy/abstrakcyjne`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy/pejzaze`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy/portrety`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy/nowoczesne`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/obrazy/minimalistyczne`, changefreq: 'weekly', priority: '0.7' },
  ];

  // Blog kategorie
  const blogCategories = [
    'obrazy-na-zamowienie',
    'obrazy-do-wnetrz',
    'style-malarskie',
    'jak-zamowic-obraz',
    'zlecenia-dla-artystow',
    'poradniki-dla-artystow',
  ];
  for (const cat of blogCategories) {
    staticPages.push({
      loc: `${SITE_URL}/blog/kategoria/${cat}`,
      changefreq: 'weekly',
      priority: '0.6',
    });
  }

  return buildSitemap(staticPages);
}

// ─── Artists sitemap ───────────────────────────────────────────────────────

async function getArtistsSitemap(): Promise<string> {
  const { data, error } = await supabase
    .from('artist_profiles')
    .select('slug, updated_at')
    .eq('approval_status', 'approved')
    .not('slug', 'is', null)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return buildSitemap([]);
  }

  const urls: SitemapUrl[] = data
    .filter((a: { slug: string | null }) => a.slug)
    .map((a: { slug: string; updated_at: string }) => ({
      loc: `${SITE_URL}/artysci/${a.slug}`,
      lastmod: a.updated_at ? a.updated_at.split('T')[0] : undefined,
      changefreq: 'weekly',
      priority: '0.7',
    }));

  return buildSitemap(urls.slice(0, MAX_URLS_PER_SITEMAP));
}

// ─── Commissions sitemap ───────────────────────────────────────────────────

async function getCommissionsSitemap(): Promise<string> {
  const { data, error } = await supabase
    .from('commission_requests')
    .select('slug, updated_at, status')
    .in('status', ['published', 'offers_open', 'in_progress', 'completed'])
    .not('slug', 'is', null)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return buildSitemap([]);
  }

  const urls: SitemapUrl[] = data
    .filter((c: { slug: string | null }) => c.slug)
    .map((c: { slug: string; updated_at: string; status: string }) => ({
      loc: `${SITE_URL}/zlecenia/${c.slug}`,
      lastmod: c.updated_at ? c.updated_at.split('T')[0] : undefined,
      changefreq: c.status === 'completed' ? 'monthly' : 'weekly',
      priority: c.status === 'completed' ? '0.4' : '0.6',
    }));

  return buildSitemap(urls.slice(0, MAX_URLS_PER_SITEMAP));
}

// ─── Blog sitemap ──────────────────────────────────────────────────────────

async function getBlogSitemap(): Promise<string> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, noindex, status')
    .eq('status', 'published')
    .eq('noindex', false)
    .not('slug', 'is', null)
    .order('published_at', { ascending: false });

  if (error || !data) {
    return buildSitemap([]);
  }

  const urls: SitemapUrl[] = data
    .filter((b: { slug: string | null; noindex: boolean }) => b.slug && !b.noindex)
    .map((b: { slug: string; updated_at: string }) => ({
      loc: `${SITE_URL}/blog/${b.slug}`,
      lastmod: b.updated_at ? b.updated_at.split('T')[0] : undefined,
      changefreq: 'monthly',
      priority: '0.5',
    }));

  return buildSitemap(urls.slice(0, MAX_URLS_PER_SITEMAP));
}

// ─── Sitemap index ─────────────────────────────────────────────────────────

function getSitemapIndex(): string {
  const now = today();
  const sitemaps = [
    { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-artists.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-commissions.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-blog.xml`, lastmod: now },
  ];
  return buildSitemapIndex(sitemaps);
}

// ─── Main handler ──────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Handle sub-path routing: /sitemap, /sitemap/pages, etc.
    // The edge function is mounted at /functions/v1/sitemap
    // We also support query param ?type= for flexibility
    const queryType = url.searchParams.get('type');
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] ?? '';

    let xml: string;
    let isIndex = false;

    // Query param takes priority, then path segment, then default to index
    const requested = queryType || lastSegment || 'index';

    switch (requested) {
      case 'sitemap.xml':
      case 'index':
        isIndex = true;
        xml = getSitemapIndex();
        break;
      case 'sitemap-pages.xml':
      case 'pages':
        xml = await getPagesSitemap();
        break;
      case 'sitemap-artists.xml':
      case 'artists':
        xml = await getArtistsSitemap();
        break;
      case 'sitemap-commissions.xml':
      case 'commissions':
        xml = await getCommissionsSitemap();
        break;
      case 'sitemap-blog.xml':
      case 'blog':
        xml = await getBlogSitemap();
        break;
      default:
        isIndex = true;
        xml = getSitemapIndex();
    }

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': isIndex
          ? 'application/xml; charset=utf-8'
          : 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
