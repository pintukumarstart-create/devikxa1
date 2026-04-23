import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  try {
    // Get static pages from Astro's built-in routes
    const staticPages = [
      '/',
      '/services/',
      '/about-us/',
      '/contact-us/',
      '/privacy-policy/',
      '/terms-and-conditions/',
      '/disclaimer/'
    ];

    // Get dynamic services pages
    const servicePages = await getCollection('servicepage');
    const serviceRoutes = servicePages.map(page => `/services/${page.slug}/`);

    // Get any blog posts if you have them
    let blogRoutes: string[] = [];
    try {
      const blogPosts = await getCollection('blog');
      blogRoutes = blogPosts.map(post => `/blog/${post.slug}/`);
    } catch {
      // Blog collection doesn't exist, that's fine
    }

    // Combine all routes
    const allRoutes = [...staticPages, ...serviceRoutes, ...blogRoutes];

    // Generate XML with proper formatting
    const urls = allRoutes.map((route) => {
      const fullUrl = new URL(route, site).href;
      
      // Try to get last modified date
      let lastmod = new Date().toISOString();
      
      // For service pages, check the markdown file
      if (route.startsWith('/services/')) {
        const slug = route.replace('/services/', '');
        const filePath = path.join(process.cwd(), 'src', 'content', 'servicepage', `${slug}.md`);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          lastmod = stats.mtime.toISOString();
        }
      }
      
      // For static pages, check the .astro file
      else if (route !== '/') {
        const filePath = path.join(
          process.cwd(), 
          'src', 
          'pages', 
          route === '/' ? 'index.astro' : `${route.slice(1)}.astro`
        );
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          lastmod = stats.mtime.toISOString();
        }
      }

      // Set priority based on page type
      let priority = '0.5';
      if (route === '/') priority = '1.0';
      else if (route === '/services/') priority = '0.9';
      else if (route === '/contact-us/') priority = '0.8';
      else if (route.startsWith('/services/')) priority = '0.7';

      // Set change frequency
      let changefreq = 'weekly';
      if (route === '/') changefreq = 'daily';
      else if (route.startsWith('/blog/')) changefreq = 'weekly';
      else if (route.startsWith('/services/')) changefreq = 'monthly';

      return `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('');

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        },
      }
    );

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap with just homepage on error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL('/', site).href}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
        },
        status: 200
      }
    );
  }
};