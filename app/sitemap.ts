import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects';
import { fallbackPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Hourly revalidation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://seedengineering.ae';
  const now = new Date();

  // Primary static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/sectors`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/why-seed`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/careers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // MEP Division & services
    {
      url: `${base}/mep`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/mep/commercial`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/mep/residential`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/mep/hvac`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/mep/electrical-plumbing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/mep/maintenance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/mep/projects`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Pool Division & services
    {
      url: `${base}/pool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/pool/construction`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/pool/renovation`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/pool/maintenance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/pool/projects`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${base}/social-media-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${base}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Dynamic project routes fetched from Supabase
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getAllProjects();
    projectRoutes = projects
      .filter((p) => p.slug && p.is_published !== false)
      .map((p) => ({
        url: `${base}/projects/${encodeURIComponent(p.slug)}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'monthly',
        priority: p.featured ? 0.8 : 0.7,
      }));
  } catch (err) {
    console.error('Sitemap: failed to load dynamic projects from Supabase:', err);
  }

  // Dynamic blog routes
  const blogRoutes: MetadataRoute.Sitemap = fallbackPosts
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${base}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}

