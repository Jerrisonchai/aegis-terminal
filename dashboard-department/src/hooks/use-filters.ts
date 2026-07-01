// src/hooks/use-filters.ts
'use client';
import { useState, useMemo } from 'react';
import { type GlobalFilters, defaultFilters, applyGlobalFilters } from '@/lib/filters';

export function useFilters<T extends { market?: string; tier?: string; ticker?: string; name?: string; composite?: number; price?: number; change?: number }>(items: T[]) {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);

  const filtered = useMemo(() => applyGlobalFilters(items, filters), [items, filters]);

  const updateFilter = <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return { filters, filtered, updateFilter, resetFilters };
}
