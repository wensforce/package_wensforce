const BASE_URL = 'https://subscription.wensforce.com';

const WELCOME_INDIA_PLAN_IDS = ['touch-red-carpet', 'comfortable-arrival', 'maharani-maharaja', 'arrive-in-style', 'arrival-in-grandeur', 'ultimate-convoy-matrix', 'end-to-end-concierge'];
const AIRPORT_CONCIERGE_PLAN_IDS = ['fearless-arrival', 'luxury-arrival', 'aerobridge-welcome', 'doorstep-essential', 'signature-plane-to-doorstep', 'secure-signature', 'sovereign-arrival', 'ultimate-convoy-package']
const PLAN_IDS = ['essential', 'executive', 'premium', 'elite', 'sovereign', ...WELCOME_INDIA_PLAN_IDS, ...AIRPORT_CONCIERGE_PLAN_IDS];

export default function sitemap() {
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const membershipRoutes = PLAN_IDS.map((id) => ({
    url: `${BASE_URL}/membership/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const bookingRoutes = PLAN_IDS.map((id) => ({
    url: `${BASE_URL}/booking/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...membershipRoutes, ...bookingRoutes];
}
