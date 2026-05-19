export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/booking/confirmation/'],
    },
    sitemap: 'https://subscription.wensforce.com/sitemap.xml',
  }
}