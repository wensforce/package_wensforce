/** @returns {{ id: string, name: string }[]} */
export function getExpoPackageSummaries(expo) {
  if (Array.isArray(expo?.packages) && expo.packages.length > 0) {
    return expo.packages.map((p) => ({
      id: p.id,
      name: p.name || p.title || p.id,
    }));
  }
  return (expo?.packageIds ?? []).map((id) => ({ id, name: id }));
}

export function formatExpoPackagesCell(expo, { maxNames = 2 } = {}) {
  const items = getExpoPackageSummaries(expo);
  if (items.length === 0) return "—";
  const names = items.map((p) => p.name);
  if (names.length <= maxNames) return names.join(", ");
  return `${names.slice(0, maxNames).join(", ")} +${names.length - maxNames}`;
}

/** Build id → name map from expo.packages */
export function packageNameMapFromExpo(expo) {
  const map = {};
  getExpoPackageSummaries(expo).forEach((p) => {
    map[p.id] = p.name;
  });
  return map;
}
