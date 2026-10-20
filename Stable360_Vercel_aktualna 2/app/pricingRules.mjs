export const PRICE_TIERS = {
  owner: [
    { from: 1, to: 1, unitPrice: 4900 },
    { from: 2, to: 3, unitPrice: 4500 },
    { from: 4, to: 7, unitPrice: 3900 },
    { from: 8, to: Number.POSITIVE_INFINITY, unitPrice: 3500 },
  ],
  headRider: [
    { from: 1, to: 1, unitPrice: 4500 },
    { from: 2, to: 3, unitPrice: 4100 },
    { from: 4, to: 7, unitPrice: 3500 },
    { from: 8, to: Number.POSITIVE_INFINITY, unitPrice: 3100 },
  ],
  trainer: [
    { from: 1, to: 5, unitPrice: 1000 },
    { from: 6, to: 15, unitPrice: 900 },
    { from: 16, to: Number.POSITIVE_INFINITY, unitPrice: 800 },
  ],
};

export const BILLING_PRIORITY = ["owner", "headRider", "trainer"];

export const MAX_MONTHLY_TOTAL = {
  owner: 59900,
  headRider: 54900,
  trainer: 24900,
};

export function normalizeHorseCount(value) {
  const count = Number.parseInt(String(value), 10);
  if (!Number.isFinite(count)) return 0;
  return Math.max(0, count);
}

export function calculateSubscription(role, horseCount) {
  const tiers = PRICE_TIERS[role];
  if (!tiers) throw new Error(`Nieznana rola płatnika: ${role}`);

  const count = normalizeHorseCount(horseCount);
  const breakdown = tiers.flatMap((tier) => {
    const lastHorse = Math.min(count, tier.to);
    const quantity = Math.max(0, lastHorse - tier.from + 1);
    return quantity ? [{ ...tier, quantity, total: quantity * tier.unitPrice }] : [];
  });
  const subtotal = count * tiers[0].unitPrice;
  const tierTotal = breakdown.reduce((sum, item) => sum + item.total, 0);
  const maxMonthlyTotal = MAX_MONTHLY_TOTAL[role];
  const monthlyTotal = Math.min(tierTotal, maxMonthlyTotal);

  return {
    count,
    breakdown,
    subtotal,
    tierTotal,
    maxMonthlyTotal,
    capApplied: tierTotal > maxMonthlyTotal,
    largeStableDiscount: Math.max(0, tierTotal - monthlyTotal),
    discountAmount: subtotal - monthlyTotal,
    monthlyTotal,
    averagePerHorse: count ? Math.round(monthlyTotal / count) : 0,
  };
}

export function resolveBillingCategory(relations, horseType = "recreational") {
  const uniqueRelations = new Set(Array.isArray(relations) ? relations : []);
  if (uniqueRelations.has("owner")) return "owner";
  if (uniqueRelations.has("headRider")) return "headRider";
  if (uniqueRelations.has("trainer") && horseType === "recreational") return "trainer";
  return null;
}

export function categorizeUniqueHorses(horses) {
  const uniqueHorses = new Map();

  for (const horse of horses ?? []) {
    if (!horse?.horse_id) continue;
    const existing = uniqueHorses.get(horse.horse_id);
    const relations = [...new Set([...(existing?.relations ?? []), ...(horse.relations ?? [])])];
    const mergedHorse = { ...(existing ?? {}), ...horse, relations };
    uniqueHorses.set(horse.horse_id, {
      ...mergedHorse,
      billingCategory: resolveBillingCategory(relations, mergedHorse.horse_type),
    });
  }

  const items = [...uniqueHorses.values()];
  const counts = Object.fromEntries(BILLING_PRIORITY.map((role) => [
    role,
    items.filter((horse) => horse.billingCategory === role).length,
  ]));

  return { horses: items, counts };
}

export function calculateMultiRoleSubscription(categoryCounts) {
  const categories = Object.fromEntries(BILLING_PRIORITY.map((role) => [
    role,
    calculateSubscription(role, categoryCounts?.[role] ?? 0),
  ]));

  return {
    categories,
    totalCount: BILLING_PRIORITY.reduce((sum, role) => sum + categories[role].count, 0),
    subtotal: BILLING_PRIORITY.reduce((sum, role) => sum + categories[role].subtotal, 0),
    discountAmount: BILLING_PRIORITY.reduce((sum, role) => sum + categories[role].discountAmount, 0),
    monthlyTotal: BILLING_PRIORITY.reduce((sum, role) => sum + categories[role].monthlyTotal, 0),
  };
}

export function priceForHorsePosition(role, position) {
  const tiers = PRICE_TIERS[role];
  if (!tiers || position < 1) return 0;
  return tiers.find((tier) => position >= tier.from && position <= tier.to)?.unitPrice ?? 0;
}

export function formatMoney(grosze) {
  const safeValue = Number.isInteger(grosze) ? grosze : Math.round(Number(grosze) || 0);
  return `${(safeValue / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}

export function canRolePayForHorse(role, horseType) {
  if (role === "manager") return false;
  if (role === "trainer") return horseType === "recreational";
  return role === "owner" || role === "headRider";
}

export function assignActivePayer(horse, payer, { replaceExisting = false } = {}) {
  if (payer.role === "manager") throw new Error("Manager nie może opłacać konia.");
  if (!canRolePayForHorse(payer.role, horse.horse_type)) throw new Error("Ta rola nie może opłacać tego konia.");
  if (horse.payer_user_id && horse.payer_user_id !== payer.userId && !replaceExisting) {
    throw new Error("Koń ma już aktywnego płatnika.");
  }
  return { ...horse, payer_user_id: payer.userId, payer_role: payer.role };
}
