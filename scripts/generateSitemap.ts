import fs from 'fs';
import path from 'path';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const routes: SitemapUrl[] = [
  {
    loc: 'https://yourdomain.com/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0
  },
  {
    loc: 'https://yourdomain.com/pricing',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: 'https://yourdomain.com/start-filing',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: 'https://yourdomain.com/calculators',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://yourdomain.com/tax-resources',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  // Calculator pages
  {
    loc: 'https://yourdomain.com/calculators/income-tax',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://yourdomain.com/calculators/hra',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://yourdomain.com/calculators/capital-gains',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  // Tax resource pages
  {
    loc: 'https://yourdomain.com/tax-resources/slabs',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.6
  },
  {
    loc: 'https://yourdomain.com/tax-resources/deductions',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.6
  },
  {
    loc: 'https://yourdomain.com/tax-resources/e-filing',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  }
];

function generateSitemap(): string {
  const urls = routes.map(route => `
  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

const sitemapContent = generateSitemap();
const sitemapPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent);
console.log('✅ Sitemap generated successfully!');