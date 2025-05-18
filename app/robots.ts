import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    Sitemap: `${baseUrl}/sitemap.xml`,
    SITEMAP: `${baseUrl}/sitemap.xml`,
  }
} 