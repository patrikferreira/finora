import { billingCycle, Cycle } from "../AppTypes";

type Entry = {
  id?: string;
  description: string;
  amount: number | null;
  category?: string;
  cycle?: Cycle;
};

export type CategoryTotal = {
  category: string;
  amount: number;
};

export function filterByView<T extends Entry>(
  items: T[] | undefined,
  view: billingCycle,
): T[] {
  if (!items) return [];
  return view === "totaly" ? items : items.filter((i) => i.cycle === view);
}

export function viewAmount(item: Entry, view: billingCycle): number {
  const amount = Number(item.amount) || 0;
  return view === "totaly" && item.cycle === "monthly" ? amount * 12 : amount;
}

export function sumAmounts(items: Entry[], view: billingCycle): number {
  return items.reduce((sum, item) => sum + viewAmount(item, view), 0);
}

export function totalsByCategory(
  items: Entry[],
  view: billingCycle,
): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const item of items) {
    const category = item.category || "other";
    totals.set(category, (totals.get(category) ?? 0) + viewAmount(item, view));
  }

  return Array.from(totals, ([category, amount]) => ({ category, amount }))
    .filter((total) => total.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

function resolveCurrency(currency?: string | null): string {
  return currency?.trim() || "USD";
}

export function formatCurrency(
  amount: number,
  currency?: string | null,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: resolveCurrency(currency),
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(
  amount: number,
  currency?: string | null,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: resolveCurrency(currency),
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}
