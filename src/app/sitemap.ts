import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pika919.github.io/Portfolio';

  return [
    {
      url: baseUrl,
      lastModified: '2026-10-14',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: '2026-10-14',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work/`,
      lastModified: '2026-10-14',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work/`,
      lastModified: '2026-10-14',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: '2026-10-14',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: '2026-10-14',
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];
}
