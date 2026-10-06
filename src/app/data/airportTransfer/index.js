/**
 * Airport Transfer — multi-city page data.
 *
 * To add a city (e.g. Delhi):
 *  1. Create delhi.js (copy mumbai.js). Set `slug`, `name`, `serviceCity`.
 *  2. Plan ids MUST be unique and end with the city slug:
 *       transfer-<tier>-<city>   e.g. "transfer-luxury-arrival-delhi"
 *     (booking + coupons identify a package by id only.)
 *  3. Register it below.
 *
 * Every plan is stamped with `citySlug` and `serviceCity` so the booking page
 * knows which city a package belongs to.
 */

import { mumbai } from "./mumbai";

const withCityPlans = (city) => ({
  ...city,
  plans: (city.plans ?? []).map((plan) => ({
    ...plan,
    citySlug: city.slug,
    serviceCity: city.serviceCity ?? city.name,
  })),
});

export const cities = {
  mumbai: withCityPlans(mumbai),
  // delhi: withCityPlans(delhi),
  // bangalore: withCityPlans(bangalore),
};

/** Flat list of all city plans (booking / enquiry / quiz lookups). */
export const plans = Object.values(cities).flatMap((city) => city.plans);

export function getCities() {
  return Object.values(cities);
}

export function getCitySlugs() {
  return Object.keys(cities);
}

export function getCity(slug) {
  if (!slug) return null;
  return cities[String(slug).toLowerCase()] ?? null;
}
