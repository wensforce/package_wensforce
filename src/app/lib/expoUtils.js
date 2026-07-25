/**
 * Utility functions for Expo Arrival feature.
 * Handles date formatting, countdown calculation, filtering, and template substitution.
 */

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

function parseISODateLocal(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Compute expo status from eventStart/eventEnd for the current date.
 * @param {Object} expo - Expo object with eventStart and eventEnd.
 * @param {Date} today - Reference date (default: now).
 * @returns {'upcoming' | 'ongoing' | 'completed'}
 */
export function getExpoDateStatus(expo, today = new Date()) {
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);

  const eventStart = parseISODateLocal(expo.eventStart);
  const eventEnd = parseISODateLocal(expo.eventEnd);
  eventStart.setHours(0, 0, 0, 0);
  eventEnd.setHours(0, 0, 0, 0);

  if (now < eventStart) return 'upcoming';
  if (now <= eventEnd) return 'ongoing';
  return 'completed';
}

/**
 * Extract unique cities from expos list, sorted alphabetically.
 * Only includes expos with status 'upcoming'.
 * @param {Array} expos - Array of expo objects.
 * @returns {Array<string>} Sorted list of unique city names.
 */
export function getAvailableCities(expos) {
  const cities = new Set(
    expos
      .filter((e) => {
        const status = getExpoDateStatus(e);
        return status === 'upcoming' || status === 'ongoing';
      })
      .map((e) => e.city)
  );
  return Array.from(cities).sort();
}

/**
 * Extract unique months from expos list as { month, year, label } objects.
 * Only includes expos with status 'upcoming'.
 * @param {Array} expos - Array of expo objects.
 * @returns {Array<Object>} Sorted list of unique months.
 */
export function getAvailableMonths(expos) {
  const months = new Set();
  expos
    .filter((e) => {
      const status = getExpoDateStatus(e);
      return status === 'upcoming' || status === 'ongoing';
    })
    .forEach((e) => {
      const date = new Date(e.eventStart);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(key);
    });

  return Array.from(months)
    .map((key) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      return {
        month,
        year,
        label: date.toLocaleString('en-IN', {
          month: 'long',
          year: 'numeric',
        }),
        key, // For internal use
      };
    })
    .sort((a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1));
}

/**
 * Filter expos by optional city and month.
 * Filters are AND-ed together; both optional.
 * @param {Array} expos - Array of expo objects.
 * @param {string|null} city - Optional city name to filter by.
 * @param {Object|null} month - Optional { month, year } to filter by.
 * @returns {Array} Filtered expos, sorted by eventStart.
 */
export function filterExpos(expos, city = null, month = null) {
  let filtered = expos.filter((e) => {
    const status = getExpoDateStatus(e);
    return status === 'upcoming' || status === 'ongoing';
  });

  if (city) {
    filtered = filtered.filter((e) => e.city === city);
  }

  if (month) {
    filtered = filtered.filter((e) => {
      const date = new Date(e.eventStart);
      return (
        date.getMonth() + 1 === month.month && date.getFullYear() === month.year
      );
    });
  }

  return filtered.sort(
    (a, b) => new Date(a.eventStart) - new Date(b.eventStart)
  );
}

/**
 * Format a date range as human-readable string, e.g., "29–30 Aug 2026" or "29 Aug – 2 Sep 2026".
 * @param {string} startISO - Start date in ISO format (YYYY-MM-DD).
 * @param {string} endISO - End date in ISO format (YYYY-MM-DD).
 * @returns {string} Formatted date range.
 */
export function formatDateRange(startISO, endISO) {
  const start = new Date(startISO + 'T00:00:00Z');
  const end = new Date(endISO + 'T00:00:00Z');

  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const startMonth = start.toLocaleString('en-IN', {
    month: 'short',
    timeZone: 'UTC',
  });
  const endMonth = end.toLocaleString('en-IN', {
    month: 'short',
    timeZone: 'UTC',
  });
  const year = start.getUTCFullYear();

  if (startMonth === endMonth && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${startDay}–${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
  }
}

/**
 * Calculate countdown from service window to today.
 * Returns { status, label } where:
 * - status: 'upcoming', 'live', 'ended'
 * - label: "14 days to go" | "Happening now" | "Ended"
 * @param {string} serviceStartISO - Service start date (YYYY-MM-DD).
 * @param {string} serviceEndISO - Service end date (YYYY-MM-DD).
 * @param {Date} today - Reference date (default: new Date()).
 * @returns {Object} { status, label }
 */
export function calculateCountdown(serviceStartISO, serviceEndISO, today = new Date()) {
  const serviceStart = new Date(serviceStartISO + 'T00:00:00Z');
  const serviceEnd = new Date(serviceEndISO + 'T23:59:59Z');

  // Normalize today to start of day UTC
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  if (todayUTC > serviceEnd) {
    return { status: 'ended', label: 'Ended' };
  }

  if (todayUTC >= serviceStart && todayUTC <= serviceEnd) {
    return { status: 'live', label: 'Happening now' };
  }

  // Calculate days until serviceStart
  const daysUntil = Math.ceil((serviceStart - todayUTC) / (1000 * 60 * 60 * 24));

  if (daysUntil === 1) {
    return { status: 'upcoming', label: 'Tomorrow' };
  }

  return {
    status: 'upcoming',
    label: `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} to go`,
  };
}

/**
 * Substitute ${expo.venue} token in a text string with the venue name.
 * Also accepts other simple token patterns like ${expo.name}, ${expo.shortName}, etc.
 * @param {string} text - Template text containing ${expo.*} tokens.
 * @param {Object} expo - Expo object with properties to substitute.
 * @returns {string} Text with tokens substituted.
 */
export function substituteExpoTokens(text, expo) {
  if (!text || !expo) return text;
  return text.replace(/\$\{expo\.(\w+)\}/g, (match, key) => {
    return expo[key] || match;
  });
}

/**
 * Format service window as "On the ground DD–DD Mon" style text.
 * Used in detail page header as supporting text.
 * @param {string} serviceStartISO - Service start (YYYY-MM-DD).
 * @param {string} serviceEndISO - Service end (YYYY-MM-DD).
 * @returns {string} Formatted service window text.
 */
export function formatServiceWindow(serviceStartISO, serviceEndISO) {
  return `On the ground ${formatDateRange(serviceStartISO, serviceEndISO)}`;
}

/**
 * Get past, upcoming, or specific status expos.
 * @param {Array} expos - Array of expo objects.
 * @param {string} status - 'upcoming', 'live', 'completed', or 'all'.
 * @returns {Array} Filtered and sorted expos.
 */
export function getExposByStatus(expos, status = 'upcoming') {
  if (status === 'all') return expos;
  return expos.filter((e) => e.status === status);
}

/**
 * Get expos grouped by city.
 * @param {Array} expos - Array of expo objects.
 * @returns {Object} Object with city as key, array of expos as value.
 */
export function groupExposByCity(expos) {
  return expos.reduce((acc, expo) => {
    if (!acc[expo.city]) acc[expo.city] = [];
    acc[expo.city].push(expo);
    return acc;
  }, {});
}

/**
 * Get expos grouped by month.
 * @param {Array} expos - Array of expo objects.
 * @returns {Object} Object with "YYYY-MM" as key, array of expos as value.
 */
export function groupExposByMonth(expos) {
  return expos.reduce((acc, expo) => {
    const date = new Date(expo.eventStart);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(expo);
    return acc;
  }, {});
}
