export type MonthMeta = {
  name: string;
  year: number;
  month: number;
  days: number;
  firstDay: number;
  lockedCount: number;
};

export const ALL_MONTHS: MonthMeta[] = [
  { name: 'January 2026', year: 2026, month: 1, days: 31, firstDay: 4, lockedCount: 1 },
  { name: 'February 2026', year: 2026, month: 2, days: 28, firstDay: 0, lockedCount: 2 },
  { name: 'March 2026', year: 2026, month: 3, days: 31, firstDay: 0, lockedCount: 3 },
  { name: 'April 2026', year: 2026, month: 4, days: 30, firstDay: 3, lockedCount: 2 },
  { name: 'May 2026', year: 2026, month: 5, days: 31, firstDay: 5, lockedCount: 1 },
  { name: 'June 2026', year: 2026, month: 6, days: 30, firstDay: 1, lockedCount: 0 },
  { name: 'July 2026', year: 2026, month: 7, days: 31, firstDay: 3, lockedCount: 2 },
  { name: 'August 2026', year: 2026, month: 8, days: 31, firstDay: 6, lockedCount: 4 },
  { name: 'September 2026', year: 2026, month: 9, days: 30, firstDay: 2, lockedCount: 1 },
  { name: 'October 2026', year: 2026, month: 10, days: 31, firstDay: 4, lockedCount: 3 },
  { name: 'November 2026', year: 2026, month: 11, days: 30, firstDay: 0, lockedCount: 2 },
  { name: 'December 2026', year: 2026, month: 12, days: 31, firstDay: 2, lockedCount: 5 },
  { name: 'January 2027', year: 2027, month: 1, days: 31, firstDay: 5, lockedCount: 0 },
  { name: 'February 2027', year: 2027, month: 2, days: 28, firstDay: 1, lockedCount: 0 },
  { name: 'March 2027', year: 2027, month: 3, days: 31, firstDay: 1, lockedCount: 0 },
  { name: 'April 2027', year: 2027, month: 4, days: 30, firstDay: 4, lockedCount: 0 },
  { name: 'May 2027', year: 2027, month: 5, days: 31, firstDay: 6, lockedCount: 0 },
  { name: 'June 2027', year: 2027, month: 6, days: 30, firstDay: 2, lockedCount: 0 },
  { name: 'July 2027', year: 2027, month: 7, days: 31, firstDay: 4, lockedCount: 0 },
  { name: 'August 2027', year: 2027, month: 8, days: 31, firstDay: 0, lockedCount: 0 },
  { name: 'September 2027', year: 2027, month: 9, days: 30, firstDay: 3, lockedCount: 0 },
  { name: 'October 2027', year: 2027, month: 10, days: 31, firstDay: 5, lockedCount: 0 },
  { name: 'November 2027', year: 2027, month: 11, days: 30, firstDay: 1, lockedCount: 0 },
  { name: 'December 2027', year: 2027, month: 12, days: 31, firstDay: 3, lockedCount: 0 },
];

export const HOTEL_CAPACITY = 210;

export const LOCKED_DAYS = new Set(['2-1', '2-23', '3-3', '3-17', '4-8']);

export const PARTIAL_CLOSURE_DAYS = new Set([
  '2-5', '2-12', '2-18', '2-25', '3-4', '3-7', '3-9', '3-11', '3-13', '3-15',
  '3-18', '3-20', '3-22', '3-25', '3-28', '4-5', '4-12', '4-17', '4-20', '4-25',
]);

export const EVENT_DAYS = new Set([
  '1-1', '1-5', '1-12', '2-14', '3-8', '3-17', '4-3', '4-22', '5-1', '6-15',
]);

export const LOW_TO_DAYS: Record<string, { hotel: number; to: number }> = {
  '2-7': { hotel: 87, to: 18 },
  '2-15': { hotel: 82, to: 22 },
  '2-22': { hotel: 91, to: 14 },
  '3-5': { hotel: 85, to: 19 },
  '3-11': { hotel: 79, to: 25 },
  '3-20': { hotel: 88, to: 12 },
  '4-2': { hotel: 84, to: 17 },
  '4-14': { hotel: 90, to: 21 },
  '4-21': { hotel: 78, to: 16 },
};

export const DOW_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DOW_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export type { MetricKey, SegmentKey } from './metricTree';
export { ALL_METRIC_LEAVES, METRIC_TREE, SEGMENT_OPTIONS, DEFAULT_SEGMENTS } from './metricTree';
