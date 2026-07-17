/**
 * Analytics tracking for Expo Arrival feature.
 * Dispatches events to Google Tag Manager (GTM) via window.dataLayer.
 * Follows the same pattern as existing tracking in the app.
 */

/**
 * Fire an expo-related analytics event to GTM.
 * @param {string} eventName - Event name (e.g., 'expo_hub_view', 'expo_filter_change').
 * @param {Object} params - Event parameters (e.g., { expo_slug, filter_city }).
 */
export function fireExpoEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

/**
 * Track expo hub page view.
 * Fired once on hub page (/expo) mount.
 */
export function trackExpoHubView() {
  fireExpoEvent('expo_hub_view', {
    event_category: 'expo_arrival',
    event_label: 'hub_view',
  });
}

/**
 * Track expo hub filter change.
 * Fired when user changes city or month filter.
 * @param {Object} filters - { city, month } filter values (can be null).
 * @param {number} resultCount - Number of expos after filtering.
 */
export function trackExpoFilterChange(filters, resultCount) {
  fireExpoEvent('expo_filter_change', {
    event_category: 'expo_arrival',
    event_label: 'hub_filter_change',
    filter_city: filters.city || 'all',
    filter_month: filters.month ? `${filters.month.year}-${String(filters.month.month).padStart(2, '0')}` : 'all',
    result_count: resultCount,
  });
}

/**
 * Track click on expo card in hub or hero slider.
 * Fired when user clicks "View Packages" on a card.
 * @param {string} expoSlug - Expo slug.
 * @param {string} expoName - Expo name.
 * @param {string} source - 'hub_card' | 'hero_slide' | 'other'.
 */
export function trackExpoCardClick(expoSlug, expoName, source = 'hub_card') {
  fireExpoEvent('expo_card_click', {
    event_category: 'expo_arrival',
    event_label: 'card_click',
    expo_slug: expoSlug,
    expo_name: expoName,
    source,
  });
}

/**
 * Track expo detail page view.
 * Fired once on detail page (/expo/[slug]) mount.
 * @param {string} expoSlug - Expo slug.
 * @param {string} expoName - Expo name.
 * @param {string} city - Expo city.
 */
export function trackExpoDetailView(expoSlug, expoName, city) {
  fireExpoEvent('expo_detail_view', {
    event_category: 'expo_arrival',
    event_label: 'detail_view',
    expo_slug: expoSlug,
    expo_name: expoName,
    expo_city: city,
  });
}

/**
 * Track click on "Book Now" button for a package.
 * Fired when user clicks to navigate to booking page.
 * @param {string} expoSlug - Expo slug.
 * @param {string} expoName - Expo name.
 * @param {string} packageId - Package ID.
 * @param {string} packageName - Package name.
 * @param {number} price - Package price in INR.
 */
export function trackExpoPackageClick(
  expoSlug,
  expoName,
  packageId,
  packageName,
  price
) {
  fireExpoEvent('expo_package_click', {
    event_category: 'expo_arrival',
    event_label: 'package_click',
    expo_slug: expoSlug,
    expo_name: expoName,
    package_id: packageId,
    package_name: packageName,
    value: price,
    currency: 'INR',
  });
}

/**
 * Extend an existing Lead or Purchase event with expo context.
 * Called from BookingPageContent when booking originates from expo page.
 * @param {string} eventName - 'Lead' or 'Purchase'.
 * @param {Object} basePayload - Existing event payload.
 * @param {string} expoSlug - Expo slug (from query param).
 * @param {string} expoName - Expo name (optional, for context).
 * @returns {Object} Extended payload with expo context.
 */
export function extendBookingEventWithExpo(
  eventName,
  basePayload,
  expoSlug,
  expoName = ''
) {
  return {
    ...basePayload,
    expo_slug: expoSlug,
    expo_name: expoName,
    event_source: `expo_${eventName.toLowerCase()}`,
  };
}
