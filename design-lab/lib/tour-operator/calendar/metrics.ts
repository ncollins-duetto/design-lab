import { HOTEL_CAPACITY, LOW_TO_DAYS, type MetricKey } from '@/lib/tour-operator/data/calendarData';
import { metricGroupLabelForKey, metricLeafByKey } from '@/lib/tour-operator/data/metricTree';

export type CellMetrics = {
  hotelOcc: number;
  toOcc: number;
  hotelAdr: number;
  toAdr: number;
  hotelRev: number;
  toRev: number;
  hotelRn: number;
  toRn: number;
  hotelRevpar: number;
  toRevpar: number;
  hotelPickup: number;
  toPickup: number;
  hotelAvgLos: number;
  toAvgLos: number;
  hotelLeadTime: number;
  toLeadTime: number;
  hotelAvgAdults: number;
  toAvgAdults: number;
  hotelAvgChildren: number;
  toAvgChildren: number;
  hotelTotalGuests: number;
  toTotalGuests: number;
  hotelAvailRooms: number;
  toAvailGuaranteed: number;
  toMixPct: number;
  directMixPct: number;
  otaMixPct: number;
  toContractRate: number;
  promotionPct: number;
  baseSegmentRate: number;
};

export function dayKey(month: number, day: number) {
  return `${month}-${day}`;
}

export function getOccupancy(month: number, day: number) {
  const key = dayKey(month, day);
  if (LOW_TO_DAYS[key]) return LOW_TO_DAYS[key];
  const s = month * 31 + day;
  const hotel = 20 + Math.abs((s * 47 + 31 + s * s * 3) % 72);
  const to = Math.max(5, Math.min(hotel, hotel + Math.floor((s * 17 + 7) % 21) - 10));
  return { hotel, to };
}

export function buildCellMetrics(month: number, day: number): CellMetrics {
  const { hotel, to: toRaw } = getOccupancy(month, day);
  const to = Math.min(95, toRaw);
  const s = month * 31 + day;
  const cellAdr = 150 + Math.abs((month * 47 + day * 31) % 130);
  const cellRev = Math.floor((hotel * cellAdr * HOTEL_CAPACITY) / 100 / 1.1);
  const cellRnSold = Math.floor((hotel * HOTEL_CAPACITY) / 100);
  const toRnSold = Math.round((HOTEL_CAPACITY * to) / 100);
  const toAdrVal = Math.max(80, cellAdr - 20 - Math.abs((month * 3 + day * 7) % 15));
  const toRevVal = Math.floor(toRnSold * toAdrVal);
  const hotelRevpar = Math.round((cellRev / HOTEL_CAPACITY) * 10) / 10;
  const toRevpar = Math.round((toRevVal / HOTEL_CAPACITY) * 10) / 10;
  const hotelAvail = HOTEL_CAPACITY - cellRnSold;
  const toAvail = Math.max(0, Math.round(HOTEL_CAPACITY * 0.15) - Math.floor(to / 12));

  return {
    hotelOcc: hotel,
    toOcc: to,
    hotelAdr: cellAdr,
    toAdr: toAdrVal,
    hotelRev: cellRev,
    toRev: toRevVal,
    hotelRn: cellRnSold,
    toRn: toRnSold,
    hotelRevpar,
    toRevpar,
    hotelPickup: 4 + (s % 18),
    toPickup: 2 + (s % 12),
    hotelAvgLos: 2.5 + (s % 5) * 0.3,
    toAvgLos: 2.2 + (s % 4) * 0.35,
    hotelLeadTime: 14 + (s % 45),
    toLeadTime: 21 + (s % 38),
    hotelAvgAdults: 1.6 + (s % 3) * 0.2,
    toAvgAdults: 1.5 + (s % 3) * 0.15,
    hotelAvgChildren: 0.3 + (s % 2) * 0.25,
    toAvgChildren: 0.25 + (s % 2) * 0.2,
    hotelTotalGuests: cellRnSold * 2 + (s % 20),
    toTotalGuests: toRnSold * 2 + (s % 15),
    hotelAvailRooms: hotelAvail,
    toAvailGuaranteed: toAvail,
    toMixPct: 35 + (s % 25),
    directMixPct: 20 + (s % 18),
    otaMixPct: 100 - (35 + (s % 25)) - (20 + (s % 18)),
    toContractRate: toAdrVal - 8,
    promotionPct: 5 + (s % 20),
    baseSegmentRate: cellAdr + 12,
  };
}

export function formatMoney(n: number) {
  const v = Math.round(Math.abs(n));
  if (v >= 10000) return `$${Math.round(v / 1000)}k`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `$${v}`;
}

export type CompareMode = 'none' | 'ly' | 'stly' | 'fcst' | 'budget';

export type MetricRow = {
  shortLabel: string;
  value: string;
  tone: 'hotel' | 'to';
  cmp?: { diffStr: string; positive: boolean };
};

function cmpRowSeed(month: number, day: number, rowIdx: number, label: string) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) | 0;
  return Math.abs((month * 37 + day * 19 + rowIdx * 11 + (h % 997)) % 997);
}

function cmpRefMult(
  baseMult: number,
  rowIdx: number,
  month: number,
  day: number,
  label: string,
) {
  const h = cmpRowSeed(month, day, rowIdx, label);
  const wantUp = (rowIdx + Math.floor(h / 31)) % 2 === 0;
  const jitter = 0.9 + (h % 11) * 0.008;
  if (wantUp) {
    if (baseMult < 1) return baseMult * jitter;
    return 0.86 + (h % 13) * 0.006;
  }
  if (baseMult < 1) return 1.03 + (h % 9) * 0.005;
  return baseMult * (1.05 + (h % 7) * 0.006);
}

function cmpRefValue(
  current: number,
  baseMult: number,
  rowIdx: number,
  month: number,
  day: number,
  label: string,
) {
  return current * cmpRefMult(baseMult, rowIdx, month, day, label);
}

export function compareMultiplier(mode: CompareMode, month: number, day: number) {
  if (mode === 'none') return 0;
  const lyF = 0.88 + Math.abs((month * 3 + day * 7) % 12) * 0.008;
  if (mode === 'ly') return lyF;
  if (mode === 'stly') return 0.85 + Math.abs((month * 5 + day * 3) % 10) * 0.006;
  if (mode === 'fcst') return 1.04 + Math.abs((month * 5 + day * 11) % 6) * 0.005;
  return 0.95 + Math.abs((month * 9 + day * 4) % 8) * 0.004;
}

function formatCmpDiff(absDiff: number, isMoney: boolean, isPercent: boolean, isRn: boolean) {
  if (isMoney) return formatMoney(absDiff);
  if (isPercent) return `${Math.round(absDiff)}%`;
  if (isRn) return `${Math.round(absDiff)}`;
  return String(Math.round(absDiff * 10) / 10);
}

type MetricFormat = 'money' | 'percent' | 'rn' | 'decimal';

const METRIC_MAP: Record<
  MetricKey,
  { field: keyof CellMetrics; format: MetricFormat; short: string }
> = {
  hocc: { field: 'hotelOcc', format: 'percent', short: 'Occ' },
  tocc: { field: 'toOcc', format: 'percent', short: 'Occ' },
  hadr: { field: 'hotelAdr', format: 'money', short: 'ADR' },
  tadr: { field: 'toAdr', format: 'money', short: 'ADR' },
  hrev: { field: 'hotelRev', format: 'money', short: 'Rev' },
  trev: { field: 'toRev', format: 'money', short: 'Rev' },
  hrn: { field: 'hotelRn', format: 'rn', short: 'RN' },
  trn: { field: 'toRn', format: 'rn', short: 'RN' },
  hrevpar: { field: 'hotelRevpar', format: 'money', short: 'RevPAR' },
  trevpar: { field: 'toRevpar', format: 'money', short: 'RevPAR' },
  hpickup: { field: 'hotelPickup', format: 'rn', short: 'PU' },
  tpickup: { field: 'toPickup', format: 'rn', short: 'PU' },
  havgLos: { field: 'hotelAvgLos', format: 'decimal', short: 'LOS' },
  tavgLos: { field: 'toAvgLos', format: 'decimal', short: 'LOS' },
  hleadTime: { field: 'hotelLeadTime', format: 'rn', short: 'LT' },
  tleadTime: { field: 'toLeadTime', format: 'rn', short: 'LT' },
  havgAdults: { field: 'hotelAvgAdults', format: 'decimal', short: 'AD' },
  tavgAdults: { field: 'toAvgAdults', format: 'decimal', short: 'AD' },
  havgChildren: { field: 'hotelAvgChildren', format: 'decimal', short: 'CHD' },
  tavgChildren: { field: 'toAvgChildren', format: 'decimal', short: 'CHD' },
  htotalGuests: { field: 'hotelTotalGuests', format: 'rn', short: 'PAX' },
  ttotalGuests: { field: 'toTotalGuests', format: 'rn', short: 'PAX' },
  havailRooms: { field: 'hotelAvailRooms', format: 'rn', short: 'AR' },
  tavailGuaranteed: { field: 'toAvailGuaranteed', format: 'rn', short: 'AG' },
  toMixPct: { field: 'toMixPct', format: 'percent', short: 'TO Mix' },
  directMixPct: { field: 'directMixPct', format: 'percent', short: 'Direct' },
  otaMixPct: { field: 'otaMixPct', format: 'percent', short: 'OTA' },
  toContractRate: { field: 'toContractRate', format: 'money', short: 'TO Rate' },
  promotionPct: { field: 'promotionPct', format: 'percent', short: 'Promo' },
  baseSegmentRate: { field: 'baseSegmentRate', format: 'money', short: 'Base' },
};

function formatMetricValue(raw: number, format: MetricFormat) {
  switch (format) {
    case 'money':
      return formatMoney(raw);
    case 'percent':
      return `${Math.round(raw)}%`;
    case 'rn':
      return String(Math.round(raw));
    case 'decimal':
      return raw % 1 === 0 ? String(Math.round(raw)) : raw.toFixed(1);
    default:
      return String(raw);
  }
}

export function buildMetricRows(
  metrics: CellMetrics,
  selected: MetricKey[],
  compare: CompareMode = 'none',
  month = 1,
  day = 1,
): MetricRow[] {
  const mult = compareMultiplier(compare, month, day);

  return selected.map((key, rowIdx) => {
    const map = METRIC_MAP[key];
    const raw = metrics[map.field];
    const isPercent = map.format === 'percent';
    const isMoney = map.format === 'money';
    const isRn = map.format === 'rn';
    const value = formatMetricValue(raw, map.format);

    let cmp: MetricRow['cmp'];
    if (mult && !Number.isNaN(raw)) {
      const ref = cmpRefValue(raw, mult, rowIdx, month, day, map.short);
      const diff = raw - ref;
      if (diff !== 0) {
        cmp = {
          diffStr: formatCmpDiff(Math.abs(diff), isMoney, isPercent, isRn),
          positive: diff > 0,
        };
      }
    }

    const leaf = metricLeafByKey(key);
    const shortLabel = leaf?.label === 'Hotel' || leaf?.label === 'Tour Operator'
      ? map.short
      : leaf?.label.slice(0, 8) ?? map.short;

    return {
      shortLabel,
      value,
      tone: key.startsWith('t') || key.startsWith('to') ? 'to' : 'hotel',
      cmp,
    };
  });
}

export function toRooms(pct: number) {
  return Math.round((HOTEL_CAPACITY * pct) / 100);
}

export function isToday(month: number, day: number) {
  return month === 3 && day === 9;
}

export function metricLabelForKeys(keys: MetricKey[]) {
  if (keys.length === 0) return 'Cell Metrics';
  const groups = [...new Set(keys.map((k) => metricGroupLabelForKey(k)))];
  if (groups.length === 1) return groups[0];
  if (keys.length <= 2) return groups.join(', ');
  return `${keys.length} metrics`;
}
