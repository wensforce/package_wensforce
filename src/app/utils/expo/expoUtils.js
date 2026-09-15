/**
 * Utility functions for Expo Arrival feature.
 * Handles date formatting, countdown calculation, filtering, and template substitution.
 */

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

/** Normalize API/form values to YYYY-MM-DD (calendar date, not UTC instant). */
export function toDateOnlyString(value) {
  if (value == null || value === '') return null;
  const match = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function parseISODateLocal(isoDate) {
  const dateStr = toDateOnlyString(isoDate);
  if (!dateStr) return new Date(NaN);
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Compute expo status from eventStart/eventEnd for the current date.
 * @param {Object} expo - Expo object with eventStart and eventEnd.
 * @param {Date} today - Reference date (default: now).
 * @returns {'upcoming' | 'ongoing' | 'completed'}
 */
/** Hub visibility: active expos only (not ended by eventEnd / API flags). */
export function isExpoVisibleOnHub(expo) {
  if (expo?.status === 'cancelled') return false;
  if (expo.isEventEnded === true || expo.isEnded === true) return false;
  if (expo.dateStatus === 'completed') return false;
  const dateStatus = getExpoDateStatus(expo);
  return dateStatus === 'upcoming' || dateStatus === 'ongoing';
}

export function getExpoDateStatus(expo, today = new Date()) {
  const fromApi = expo?.dateStatus;
  if (fromApi === 'upcoming' || fromApi === 'ongoing' || fromApi === 'completed') {
    return fromApi;
  }

  const now = new Date(today);
  now.setHours(0, 0, 0, 0);

  const eventStart = parseISODateLocal(expo.eventStart);
  const eventEnd = parseISODateLocal(expo.eventEnd);
  eventStart.setHours(0, 0, 0, 0);
  eventEnd.setHours(23, 59, 59, 999);

  if (now < eventStart) return 'upcoming';
  if (now <= eventEnd) return 'ongoing';
  return 'completed';
}

function isExpoEndedByDate(expo, today = new Date()) {
  if (typeof expo?.isEventEnded === 'boolean') return expo.isEventEnded;
  if (typeof expo?.isEnded === 'boolean') return expo.isEnded;
  return getExpoDateStatus(expo, today) === 'completed';
}

/**
 * Public UI status: DB cancelled/completed override; otherwise event calendar + countdown label.
 * @returns {{ status: 'upcoming'|'live'|'ended'|'cancelled', label: string, badgeClass: string }}
 */
export function getExpoDisplayStatus(expo, today = new Date()) {
  const dbStatus = expo?.status;

  if (dbStatus === 'cancelled') {
    return {
      status: 'cancelled',
      label: 'Cancelled',
      badgeClass: 'cancelled',
    };
  }
  if (dbStatus === 'completed') {
    return {
      status: 'ended',
      label: 'Ended',
      badgeClass: 'completed',
    };
  }

  if (isExpoEndedByDate(expo, today)) {
    return {
      status: 'ended',
      label: 'Ended',
      badgeClass: 'completed',
    };
  }

  if (expo?.isLive === true) {
    return {
      status: 'live',
      label: 'Happening now',
      badgeClass: 'ongoing',
    };
  }

  const countdown = calculateCountdown(
    expo.eventStart,
    expo.eventEnd,
    today,
  );

  if (countdown.status === 'live') {
    return {
      status: 'live',
      label: 'Happening now',
      badgeClass: 'ongoing',
    };
  }
  if (countdown.status === 'ended') {
    return {
      status: 'ended',
      label: 'Ended',
      badgeClass: 'completed',
    };
  }

  return {
    status: 'upcoming',
    label: countdown.label,
    badgeClass: 'upcoming',
  };
}

/** Short label for compact hub carousel badges. */
export function getExpoHubBadgeLabel(displayStatus) {
  switch (displayStatus.status) {
    case 'live':
      return 'Live Now';
    case 'cancelled':
      return 'Cancelled';
    case 'ended':
      return 'Ended';
    default:
      return 'Upcoming';
  }
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
      .filter((e) => isExpoVisibleOnHub(e))
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
    .filter((e) => isExpoVisibleOnHub(e))
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
  let filtered = expos.filter((e) => isExpoVisibleOnHub(e));

  if (city) {
    filtered = filtered.filter((e) => e.city === city);
  }

  if (month) {
    filtered = filtered.filter((e) => {
      const dateStr = toDateOnlyString(e.eventStart);
      if (!dateStr) return false;
      const [year, m] = dateStr.split('-').map(Number);
      return m === month.month && year === month.year;
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
  const start = parseISODateLocal(startISO);
  const end = parseISODateLocal(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleString('en-IN', { month: 'short' });
  const endMonth = end.toLocaleString('en-IN', { month: 'short' });
  const year = start.getFullYear();

  if (startMonth === endMonth && start.getFullYear() === end.getFullYear()) {
    return `${startDay}–${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
  }
}

/**
 * Countdown for the expo event (same calendar logic as getExpoDateStatus).
 * Service booking may open earlier; "Happening now" is only during event dates.
 * @param {string} eventStartISO - Event start (YYYY-MM-DD or ISO datetime).
 * @param {string} eventEndISO - Event end (YYYY-MM-DD or ISO datetime).
 * @param {Date} today - Reference date (default: new Date()).
 * @returns {{ status: 'upcoming'|'live'|'ended', label: string }}
 */
export function calculateCountdown(eventStartISO, eventEndISO, today = new Date()) {
  const startStr = toDateOnlyString(eventStartISO);
  const endStr = toDateOnlyString(eventEndISO);
  if (!startStr || !endStr) {
    return { status: 'upcoming', label: 'Dates coming soon' };
  }

  const eventStart = parseISODateLocal(startStr);
  const eventEnd = parseISODateLocal(endStr);
  eventStart.setHours(0, 0, 0, 0);
  eventEnd.setHours(23, 59, 59, 999);

  const now = new Date(today);
  now.setHours(0, 0, 0, 0);

  if (now > eventEnd) {
    return { status: 'ended', label: 'Ended' };
  }

  if (now >= eventStart && now <= eventEnd) {
    return { status: 'live', label: 'Happening now' };
  }

  const daysUntil = Math.ceil((eventStart - now) / (1000 * 60 * 60 * 24));

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