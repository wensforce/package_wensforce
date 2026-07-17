/**
 * JSON-LD schema generators for Expo Arrival feature.
 * Generates structured data for search engines (Google, etc.).
 */

/**
 * Generate FAQPage JSON-LD schema from FAQ objects.
 * @param {Array<Object>} faqs - Array of FAQ objects with { q, a } properties.
 * @param {Object} context - Additional context { expoName, expoUrl, expoCity }.
 * @returns {Object} JSON-LD schema object.
 */
export function generateFaqSchema(faqs, context = {}) {
  if (!faqs || faqs.length === 0) {
    return {};
  }

  const mainEntity = faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

/**
 * Generate Event JSON-LD schema for an expo event.
 * @param {Object} expo - Expo object.
 * @param {string} baseUrl - Base URL for absolute links (e.g., 'https://subscription.wensforce.com').
 * @returns {Object} JSON-LD schema object.
 */
export function generateEventSchema(expo, baseUrl = 'https://subscription.wensforce.com') {
  if (!expo) return {};

  const startDate = new Date(expo.eventStart + 'T09:00:00+05:30').toISOString();
  const endDate = new Date(expo.eventEnd + 'T18:00:00+05:30').toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: expo.name,
    description: `WENS Force Expo Arrival service for ${expo.name}. Flight-tracked pickup, executive chauffeur, close protection officer, dedicated relationship manager. ${expo.city}, ${expo.venue}.`,
    startDate,
    endDate,
    eventStatus: expo.status === 'upcoming' ? 'EventScheduled' : (expo.status === 'live' ? 'EventMovedOnline' : 'EventPostponed'),
    eventAttendanceMode: 'MixedEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: expo.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: expo.city,
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'WENS Force',
      url: baseUrl,
    },
    image: expo.cardImage ? `${baseUrl}${expo.cardImage}` : undefined,
    url: `${baseUrl}/expo/${expo.slug}`,
  };
}

/**
 * Generate Organization schema for WENS Force.
 * @param {string} baseUrl - Base URL (e.g., 'https://subscription.wensforce.com').
 * @returns {Object} JSON-LD schema object.
 */
export function generateOrganizationSchema(baseUrl = 'https://subscription.wensforce.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WENS Force',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'WENS Force: India\'s only luxury travel + armed protection + VIP darshan subscription service.',
    telephone: '+91-7304607954',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+91-7304607954',
      areaServed: 'IN',
      availableLanguage: ['en-IN', 'hi-IN'],
    },
    sameAs: [
      // Add social media URLs here if available
    ],
  };
}

/**
 * Generate BreadcrumbList schema for navigation.
 * @param {Array<Object>} items - Breadcrumb items with { name, url }.
 * @returns {Object} JSON-LD schema object.
 */
export function generateBreadcrumbSchema(items) {
  if (!items || items.length === 0) return {};

  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}
