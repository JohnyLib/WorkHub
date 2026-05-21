import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://workbridge.uk'
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/jobs', '/jobs/', '/masters', '/masters/'],
      disallow: ['/my', '/my/', '/admin', '/login', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
