'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  LOCKED_DAYS,
  PARTIAL_CLOSURE_DAYS,
} from '@/lib/tour-operator/data/calendarData';
import {
  DEFAULT_FILTERS,
  TO_FILTER_MULT,
  countActiveFilters,
  primaryFilterValue,
  type FilterState,
} from '@/lib/tour-operator/data/filterOptions';
import { DEFAULT_HEATMAP, type HeatmapState } from '@/lib/tour-operator/data/heatmapTypes';
import { getOccupancy } from '@/lib/tour-operator/calendar/metrics';

export type WeekAnchor = { month: number; day: number };

type CalendarContextValue = {
  filters: FilterState;
  filterDraft: FilterState;
  setFilterDraft: React.Dispatch<React.SetStateAction<FilterState>>;
  applyFilters: () => void;
  resetFilters: () => void;
  activeFilterCount: number;
  toMultiplier: number;

  heatmap: HeatmapState;
  heatmapDraft: HeatmapState;
  setHeatmapDraft: React.Dispatch<React.SetStateAction<HeatmapState>>;
  applyHeatmap: () => void;
  resetHeatmap: () => void;

  lockedDays: Set<string>;
  partialDays: Set<string>;
  lockDay: (key: string) => void;
  unlockDay: (key: string) => void;
  setPartial: (key: string, partial: boolean) => void;
  isLocked: (key: string) => boolean;
  isPartial: (key: string) => boolean;

  closeOutOpen: boolean;
  setCloseOutOpen: (open: boolean) => void;

  weekAnchor: WeekAnchor;
  setWeekAnchor: (anchor: WeekAnchor) => void;
  openWeekView: (month: number, day: number) => void;

  getFilteredOccupancy: (month: number, day: number) => { hotel: number; to: number };
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterDraft, setFilterDraft] = useState<FilterState>(DEFAULT_FILTERS);

  const [heatmap, setHeatmap] = useState<HeatmapState>(DEFAULT_HEATMAP);
  const [heatmapDraft, setHeatmapDraft] = useState<HeatmapState>(DEFAULT_HEATMAP);

  const [lockedDays, setLockedDays] = useState<Set<string>>(() => new Set(LOCKED_DAYS));
  const [partialDays, setPartialDays] = useState<Set<string>>(
    () => new Set(PARTIAL_CLOSURE_DAYS),
  );

  const [closeOutOpen, setCloseOutOpen] = useState(false);
  const [weekAnchor, setWeekAnchor] = useState<WeekAnchor>({ month: 3, day: 9 });

  const operatorKey = primaryFilterValue(filters.operator);
  const toMultiplier = TO_FILTER_MULT[operatorKey] ?? 1;

  const getFilteredOccupancy = useCallback(
    (month: number, day: number) => {
      const { hotel, to: toRaw } = getOccupancy(month, day);
      const to = Math.min(95, Math.round(toRaw * toMultiplier));
      return { hotel, to };
    },
    [toMultiplier],
  );

  const applyFilters = () => setFilters({ ...filterDraft });
  const resetFilters = () => {
    setFilterDraft(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  };

  const applyHeatmap = () => setHeatmap({ ...heatmapDraft, enabled: !!heatmapDraft.type });
  const resetHeatmap = () => {
    setHeatmapDraft(DEFAULT_HEATMAP);
    setHeatmap(DEFAULT_HEATMAP);
  };

  const lockDay = (key: string) => {
    setLockedDays((prev) => new Set(prev).add(key));
    setPartialDays((prev) => {
      const n = new Set(prev);
      n.delete(key);
      return n;
    });
  };

  const unlockDay = (key: string) => {
    setLockedDays((prev) => {
      const n = new Set(prev);
      n.delete(key);
      return n;
    });
  };

  const setPartial = (key: string, partial: boolean) => {
    if (partial) {
      setPartialDays((prev) => new Set(prev).add(key));
      setLockedDays((prev) => {
        const n = new Set(prev);
        n.delete(key);
        return n;
      });
    } else {
      setPartialDays((prev) => {
        const n = new Set(prev);
        n.delete(key);
        return n;
      });
    }
  };

  const isLocked = (key: string) => lockedDays.has(key);
  const isPartial = (key: string) => partialDays.has(key) && !lockedDays.has(key);

  const openWeekView = (month: number, day: number) => setWeekAnchor({ month, day });

  const value = useMemo<CalendarContextValue>(
    () => ({
      filters,
      filterDraft,
      setFilterDraft,
      applyFilters,
      resetFilters,
      activeFilterCount: countActiveFilters(filters),
      toMultiplier,
      heatmap,
      heatmapDraft,
      setHeatmapDraft,
      applyHeatmap,
      resetHeatmap,
      lockedDays,
      partialDays,
      lockDay,
      unlockDay,
      setPartial,
      isLocked,
      isPartial,
      closeOutOpen,
      setCloseOutOpen,
      weekAnchor,
      setWeekAnchor,
      openWeekView,
      getFilteredOccupancy,
    }),
    [
      filters,
      filterDraft,
      heatmap,
      heatmapDraft,
      lockedDays,
      partialDays,
      closeOutOpen,
      weekAnchor,
      toMultiplier,
      getFilteredOccupancy,
    ],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}
