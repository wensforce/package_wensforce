const BASE_URL = "https://subscription.wensforce.com";

const PLAN_IDS = ["essential", "executive", "premium", "elite", "sovereign"];

export default function sitemap() {
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const membershipRoutes = PLAN_IDS.map((id) => ({
    url: `${BASE_URL}/membership/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const bookingRoutes = PLAN_IDS.map((id) => ({
    url: `${BASE_URL}/booking/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...membershipRoutes, ...bookingRoutes];
}
