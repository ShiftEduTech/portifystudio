import { MetadataRoute } from 'next';
import { getAllTemplates } from '@/data/templates';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let templates = [];
  try {
     templates = await getAllTemplates();
  } catch (e) {
     console.error('Sitemap fetch error:', e);
  }

  const baseUrl = 'https://portifystudio.com';

  const templateUrls = templates.map((t) => ({
    url: `${baseUrl}/templates/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
       url: `${baseUrl}/about`,
       lastModified: new Date(),
       changeFrequency: 'monthly' as const,
       priority: 0.5,
    },
    ...templateUrls,
  ];
}
