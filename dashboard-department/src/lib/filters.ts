// src/lib/filters.ts — Global filtering/control logic

import type { Tier } from './mock-data';

export type MarketFilter = 'ALL' | 'MY' | 'US';
export type TierFilter = 'ALL' | Tier;
export type SortField = 'composite' | 'price' | 'change' | 'ticker';
export type SortOrder = 'asc' | 'desc';

export interface GlobalFilters {
  market: MarketFilter;
  tier: TierFilter;
  search: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export const defaultFilters: GlobalFilters = {
  market: 'ALL',
  tier: 'ALL',
  search: '',
  sortBy: 'composite',
  sortOrder: 'desc',
};

export function applyGlobalFilters<T extends { market?: string; tier?: string; ticker?: string; name?: string; composite?: number; price?: number; change?: number }>(
  items: T[],
  filters: GlobalFilters,
): T[] {
  let result = [...items];

  if (filters.market !== 'ALL') {
    result = result.filter(item => item.market === filters.market);
  }
  if (filters.tier !== 'ALL') {
    result = result.filter(item => (item as any).tier === filters.tier);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(item =>
      (item.ticker || '').toLowerCase().includes(q) ||
      (item.name || '').toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => {
    const fieldA = a[filters.sortBy] ?? 0;
    const fieldB = b[filters.sortBy] ?? 0;
    const compare = typeof fieldA === 'string'
      ? (fieldA as string).localeCompare(fieldB as string)
      : (fieldA as number) - (fieldB as number);
    return filters.sortOrder === 'desc' ? -compare : compare;
  });

  return result;
}
