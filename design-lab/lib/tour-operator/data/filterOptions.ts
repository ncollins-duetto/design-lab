export type FilterGroupId = 'operator' | 'room' | 'board' | 'market' | 'pickup';

export type FilterState = Record<FilterGroupId, string[]>;

export const DEFAULT_FILTERS: FilterState = {
  operator: ['all'],
  room: ['all'],
  board: ['all'],
  market: ['all'],
  pickup: ['all'],
};

export const TO_FILTER_MULT: Record<string, number> = {
  all: 1.0,
  sunwing: 0.82,
  tui: 1.18,
  'thomas-cook': 0.71,
  'club-med': 1.08,
  jet2: 0.95,
};

export function toggleFilterValue(current: string[], value: string): string[] {
  if (value === 'all') return ['all'];
  const selected = current.filter((v) => v !== 'all');
  if (selected.includes(value)) {
    const next = selected.filter((v) => v !== value);
    return next.length ? next : ['all'];
  }
  return [...selected, value];
}

export function countActiveFilters(f: FilterState) {
  return (Object.keys(f) as FilterGroupId[]).reduce((n, k) => {
    return n + f[k].filter((v) => v !== 'all').length;
  }, 0);
}

export function primaryFilterValue(values: string[]) {
  const picked = values.filter((v) => v !== 'all');
  return picked.length ? picked[0] : 'all';
}

export const FILTER_SECTIONS: {
  id: FilterGroupId;
  title: string;
  options: { value: string; label: string }[];
}[] = [
  {
    id: 'operator',
    title: 'OPERATOR',
    options: [
      { value: 'all', label: 'All Operators' },
      { value: 'sunwing', label: 'Sunwing' },
      { value: 'tui', label: 'TUI' },
      { value: 'thomas-cook', label: 'Thomas Cook' },
      { value: 'club-med', label: 'Club Med' },
      { value: 'jet2', label: 'Jet2holidays' },
    ],
  },
  {
    id: 'room',
    title: 'ROOM TYPE',
    options: [
      { value: 'all', label: 'All Rooms' },
      { value: 'standard', label: 'Standard' },
      { value: 'superior', label: 'Superior' },
      { value: 'deluxe', label: 'Deluxe' },
      { value: 'suite', label: 'Suite' },
    ],
  },
  {
    id: 'board',
    title: 'MEAL PLAN',
    options: [
      { value: 'all', label: 'All Plans' },
      { value: 'ai', label: 'All Inclusive' },
      { value: 'hb', label: 'Half Board' },
      { value: 'bb', label: 'Bed & Breakfast' },
      { value: 'ro', label: 'Room Only' },
    ],
  },
  {
    id: 'market',
    title: 'SOURCE GEO',
    options: [
      { value: 'all', label: 'All Origins' },
      { value: 'UK', label: 'UK' },
      { value: 'SP', label: 'Spain' },
      { value: 'US', label: 'US' },
      { value: 'MX', label: 'Mexico' },
    ],
  },
];
