import { HOTEL_CAPACITY } from '@/lib/tour-operator/data/calendarData';
import { getOccupancy } from '@/lib/tour-operator/calendar/metrics';

export type WeekDayRef = { year: number; month: number; day: number };

export type WeekDayData = {
  dm: number;
  dd: number;
  hotel: number;
  to: number;
  adr: number;
  toAdr: number;
  toRn: number;
  hnRn: number;
  toRev: number;
  hnRev: number;
  otherPct: number;
  otherRms: number;
  freeRms: number;
  onlinePct: number;
  sdlyH: number;
  lyH: number;
  fcstH: number;
  sdlyA: number;
  lyA: number;
  fcstA: number;
  sdlyRn: number;
  lyRn: number;
  fcstRn: number;
  sdlyR: number;
  lyR: number;
  fcstR: number;
  hRevpar: number;
  toRevpar: number;
  sdlyRevpar: number;
  lyRevpar: number;
  pickup: number;
  hPickup: number;
  avgA: string;
  avgC: string;
  hAvgA: string;
  hAvgC: string;
  totAT: number;
  totCT: number;
  totAH: number;
  totCH: number;
  totG: number;
  hTotG: number;
  avgLos: string;
  hLos: string;
  avgLead: string;
  hLead: string;
  availRooms: number;
  availGuar: number;
  aiPct: number;
  bbPct: number;
  hbPct: number;
  roPct: number;
  toMix: number;
  dirMix: number;
  otaMix: number;
  otherMix: number;
  fR: (val: number) => string;
};

export type WbRowType = 'top' | 'sect' | 'sub';

export type WbRow = {
  type: WbRowType;
  id: string;
  label: string;
  parent?: string;
  dot?: string;
  isRem?: boolean;
  rtIdx?: number;
  rtSub?: string;
  toIdx?: number;
  toBase?: boolean;
  mpKey?: string;
};

const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const RT_NAMES = ['Standard', 'Superior', 'Deluxe', 'Suite', 'Jr. Suite', 'Family'];
const RT_CAPS = [51, 36, 27, 12, 15, 9];
const TO_NAMES = ['Sunshine Tours', 'Global Adv.', 'Beach Hols', 'City Breaks', 'Adventure'];

export const WB_GROUP_ORDER = [
  'g_closeouts',
  'g_daily',
  'g_more',
  'g_meals',
  'g_biz',
  'g_avail',
  'g_torates',
] as const;

export function getWeekDays(year: number, month: number, startDay: number): WeekDayRef[] {
  const days: WeekDayRef[] = [];
  let m = month;
  let d = startDay;
  for (let i = 0; i < 7; i++) {
    days.push({ year, month: m, day: d });
    d++;
    if (d > DAYS_IN_MONTH[m]) {
      d = 1;
      m++;
      if (m > 12) m = 1;
    }
  }
  return days;
}

export function weekRangeLabel(days: WeekDayRef[]): string {
  const m0 = days[0];
  const m6 = days[6];
  const MNAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (m0.month === m6.month) {
    return `${MNAMES[m0.month]} ${m0.day} – ${m6.day}, ${m0.year}`;
  }
  return `${MNAMES[m0.month]} ${m0.day} – ${MNAMES[m6.month]} ${m6.day}, ${m0.year}`;
}

/** Shift the week window start by calendar days (legacy: ±1 day per arrow). */
export function shiftWeekAnchor(month: number, day: number, deltaDays: number) {
  let m = month;
  let d = day + deltaDays;
  while (d < 1) {
    m -= 1;
    if (m < 1) m = 12;
    d += DAYS_IN_MONTH[m];
  }
  while (d > DAYS_IN_MONTH[m]) {
    d -= DAYS_IN_MONTH[m];
    m += 1;
    if (m > 12) m = 1;
  }
  return { month: m, day: d };
}

function formatRev(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(val / 1000)}k`;
}

export function buildWeekDayData(month: number, day: number): WeekDayData {
  const dm = month;
  const dd = day;
  const { hotel, to } = getOccupancy(dm, dd);
  const adr = 150 + Math.abs((dm * 47 + dd * 31) % 130);
  const v = Math.abs((dm * 127 + dd * 53 + dm * dd * 7 + dd * dd * 3) % 100);
  const toAdr = Math.max(80, adr - 20 - Math.abs((dm * 3 + dd * 7) % 15));
  const toRn = Math.round((HOTEL_CAPACITY * to) / 100);
  const hnRn = Math.round((HOTEL_CAPACITY * hotel) / 100);
  const toRev = Math.floor(toRn * toAdr);
  const hnRev = Math.floor(hnRn * adr);
  const otherPct = Math.max(0, hotel - to);
  const otherRms = Math.round((HOTEL_CAPACITY * otherPct) / 100);
  const freeRms = HOTEL_CAPACITY - toRn - otherRms;
  const onlinePct = Math.max(30, Math.min(80, 45 + Math.abs((dm * 13 + dd * 7) % 35)));
  const sdlyH = Math.max(5, hotel - 9);
  const lyH = Math.max(5, hotel - 6);
  const fcstH = Math.min(100, hotel + 4);
  const sdlyA = adr - 8;
  const lyA = adr - 4;
  const fcstA = adr + 6;
  const sdlyRn = Math.round(toRn * 0.88);
  const lyRn = Math.round(toRn * 0.93);
  const fcstRn = Math.round(toRn * 1.06);
  const sdlyR = Math.floor(Math.round((HOTEL_CAPACITY * sdlyH) / 100) * sdlyA);
  const lyR = Math.floor(hnRev * 0.95);
  const fcstR = Math.floor(hnRev * 1.06);
  const hRevpar = Math.round((adr * hotel) / 100);
  const toRevpar = Math.round((toAdr * to) / 100);
  const sdlyRevpar = Math.max(40, hRevpar - 8);
  const lyRevpar = Math.max(40, hRevpar - 4);
  const pickup = Math.max(0, Math.floor(((v % 25) + 5) * (to / Math.max(1, hotel))));
  const hPickup = Math.floor((v % 25) + 5);
  const avgA = (1.8 + (v % 3) * 0.1).toFixed(1);
  const avgC = (0.3 + (v % 2) * 0.1).toFixed(1);
  const hAvgA = (parseFloat(avgA) + 0.3).toFixed(1);
  const hAvgC = (parseFloat(avgC) + 0.1).toFixed(1);
  const totAT = Math.round(toRn * parseFloat(avgA));
  const totCT = Math.round(toRn * parseFloat(avgC));
  const totAH = Math.round(hnRn * parseFloat(hAvgA));
  const totCH = Math.round(hnRn * parseFloat(hAvgC));
  const totG = Math.round(toRn * (parseFloat(avgA) + parseFloat(avgC)));
  const hTotG = Math.round(hnRn * (parseFloat(hAvgA) + parseFloat(hAvgC)));
  const avgLos = `${(2.8 + (v % 5) * 0.3).toFixed(1)}n`;
  const hLos = `${(2.8 + (v % 5) * 0.3 + 0.4).toFixed(1)}n`;
  const avgLead = `${18 + (v % 60)}d`;
  const hLead = `${18 + (v % 60) + 12}d`;
  const availRooms = Math.max(0, HOTEL_CAPACITY - hnRn - Math.floor(hotel * 0.02));
  const availGuar = Math.floor(8 + (v % 5));
  const aiPct = Math.max(45, Math.min(68, 55 + ((dm * 7 + dd * 3) % 14)));
  const bbPct = Math.max(14, Math.min(28, 20 + ((dm * 11 + dd * 5) % 11)));
  const hbPct = Math.max(6, Math.min(16, 10 + ((dm * 5 + dd * 7) % 9)));
  const roPct = 100 - aiPct - bbPct - hbPct;
  const toMix = 28 + Math.abs((dm * 7 + dd * 5) % 25);
  const dirMix = 30 + Math.abs((dm * 5 + dd * 9) % 20);
  const otaMix = 20 + Math.abs((dm * 9 + dd * 3) % 18);
  const otherMix = Math.max(0, 100 - toMix - dirMix - otaMix);

  return {
    dm,
    dd,
    hotel,
    to,
    adr,
    toAdr,
    toRn,
    hnRn,
    toRev,
    hnRev,
    otherPct,
    otherRms,
    freeRms,
    onlinePct,
    sdlyH,
    lyH,
    fcstH,
    sdlyA,
    lyA,
    fcstA,
    sdlyRn,
    lyRn,
    fcstRn,
    sdlyR,
    lyR,
    fcstR,
    hRevpar,
    toRevpar,
    sdlyRevpar,
    lyRevpar,
    pickup,
    hPickup,
    avgA,
    avgC,
    hAvgA,
    hAvgC,
    totAT,
    totCT,
    totAH,
    totCH,
    totG,
    hTotG,
    avgLos,
    hLos,
    avgLead,
    hLead,
    availRooms,
    availGuar,
    aiPct,
    bbPct,
    hbPct,
    roPct,
    toMix,
    dirMix,
    otaMix,
    otherMix,
    fR: formatRev,
  };
}

export function buildWbRows(): WbRow[] {
  const grp: Record<string, WbRow[]> = {
    g_closeouts: [
      { type: 'top', id: 'g_closeouts', label: 'Close Outs' },
      { type: 'sub', id: 'co_rooms', label: 'Room Types', dot: '#6b7280', parent: 'g_closeouts' },
      { type: 'sub', id: 'co_boards', label: 'Board Types', dot: '#6b7280', parent: 'g_closeouts' },
      { type: 'sub', id: 'co_tos', label: 'Tour Operators', dot: '#6b7280', parent: 'g_closeouts' },
    ],
    g_daily: [
      { type: 'top', id: 'g_daily', label: 'Daily Metrics' },
      { type: 'sect', id: 'occ', label: 'Occupancy', parent: 'g_daily' },
      { type: 'sub', id: 'occ_tdh', label: 'Travel Distribution Hubs', dot: '#004948', parent: 'occ' },
      { type: 'sub', id: 'occ_other', label: 'Other Segments', dot: '#52d9ce', parent: 'occ' },
      { type: 'sub', id: 'occ_rem', label: 'Total Hotel Occupancy', dot: '#445e0d', parent: 'occ', isRem: true },
      { type: 'sect', id: 'onoff', label: 'Online / Offline', parent: 'g_daily' },
      { type: 'sub', id: 'onoff_on', label: 'Online', dot: '#004948', parent: 'onoff' },
      { type: 'sub', id: 'onoff_off', label: 'Offline', dot: '#52d9ce', parent: 'onoff' },
      { type: 'sect', id: 'adr', label: 'ADR', parent: 'g_daily' },
      { type: 'sub', id: 'adr_t', label: 'TO', dot: '#004948', parent: 'adr' },
      { type: 'sub', id: 'adr_hotel', label: 'Hotel', dot: '#52d9ce', parent: 'adr' },
      { type: 'sect', id: 'rev', label: 'Revenue', parent: 'g_daily' },
      { type: 'sub', id: 'rev_t', label: 'TO', dot: '#004948', parent: 'rev' },
      { type: 'sub', id: 'rev_hotel', label: 'Hotel', dot: '#52d9ce', parent: 'rev' },
    ],
    g_more: [
      { type: 'top', id: 'g_more', label: 'More Metrics' },
      { type: 'sect', id: 'rn', label: 'RN Sold', parent: 'g_more' },
      { type: 'sub', id: 'rn_t', label: 'TO', dot: '#004948', parent: 'rn' },
      { type: 'sub', id: 'rn_hotel', label: 'Hotel', dot: '#52d9ce', parent: 'rn' },
      { type: 'sect', id: 'revpar_s', label: 'RevPAR', parent: 'g_more' },
      { type: 'sub', id: 'revpar_t', label: 'TO', dot: '#004948', parent: 'revpar_s' },
      { type: 'sub', id: 'revpar_h', label: 'Hotel', dot: '#52d9ce', parent: 'revpar_s' },
      { type: 'sect', id: 'pickup_0', label: 'Pickup', parent: 'g_more' },
      { type: 'sub', id: 'pickup_0_t', label: 'TO', dot: '#004948', parent: 'pickup_0' },
      { type: 'sub', id: 'pickup_0_h', label: 'Hotel', dot: '#52d9ce', parent: 'pickup_0' },
      { type: 'sect', id: 'avga_s', label: 'Average Adults', parent: 'g_more' },
      { type: 'sub', id: 'avga_t', label: 'TO', dot: '#004948', parent: 'avga_s' },
      { type: 'sub', id: 'avga_h', label: 'Hotel', dot: '#52d9ce', parent: 'avga_s' },
      { type: 'sect', id: 'los_s', label: 'Average LOS', parent: 'g_more' },
      { type: 'sub', id: 'los_t', label: 'TO', dot: '#004948', parent: 'los_s' },
      { type: 'sub', id: 'los_h', label: 'Hotel', dot: '#52d9ce', parent: 'los_s' },
      { type: 'sect', id: 'lead_s', label: 'Lead Time', parent: 'g_more' },
      { type: 'sub', id: 'lead_t', label: 'TO', dot: '#004948', parent: 'lead_s' },
      { type: 'sub', id: 'lead_h', label: 'Hotel', dot: '#52d9ce', parent: 'lead_s' },
      { type: 'sect', id: 'avail_s', label: 'Avail Rooms', parent: 'g_more' },
      { type: 'sect', id: 'availg_s', label: 'Avail Guar.', parent: 'g_more' },
    ],
    g_meals: [
      { type: 'top', id: 'g_meals', label: 'Meal Plans' },
      ...(['ai', 'bb', 'hb', 'ro'] as const).flatMap((key) => {
        const label =
          key === 'ai' ? 'All Inclusive' : key === 'bb' ? 'Bed & Breakfast' : key === 'hb' ? 'Half Board' : 'Room Only';
        return [
          { type: 'sect' as const, id: `mp_${key}`, label, parent: 'g_meals', mpKey: key },
          { type: 'sub' as const, id: `mp_${key}_t`, label: 'TO', dot: '#004948', parent: `mp_${key}`, mpKey: key },
          { type: 'sub' as const, id: `mp_${key}_h`, label: 'Hotel', dot: '#52d9ce', parent: `mp_${key}`, mpKey: key },
        ];
      }),
      { type: 'sect', id: 'mp_sum', label: 'Summary', parent: 'g_meals' },
    ],
    g_biz: [
      { type: 'top', id: 'g_biz', label: 'Business Mix' },
      { type: 'sect', id: 'biz', label: 'Business Mix', parent: 'g_biz' },
      { type: 'sub', id: 'biz_to', label: 'TO', dot: '#004948', parent: 'biz' },
      { type: 'sub', id: 'biz_dir', label: 'Direct', dot: '#52d9ce', parent: 'biz' },
      { type: 'sub', id: 'biz_ota', label: 'OTA', dot: '#D97706', parent: 'biz' },
      { type: 'sub', id: 'biz_other', label: 'Other', dot: '#9ca3af', parent: 'biz' },
    ],
    g_avail: [
      { type: 'top', id: 'g_avail', label: 'Room Availability' },
      ...RT_NAMES.flatMap((name, i) => [
        { type: 'sect' as const, id: `avrt${i}`, label: name, parent: 'g_avail', rtIdx: i },
        { type: 'sub' as const, id: `avrt${i}_to`, label: 'TO Sold', dot: '#004948', parent: `avrt${i}`, rtIdx: i, rtSub: 'to' },
        { type: 'sub' as const, id: `avrt${i}_av`, label: 'Total Hotel Occupancy', dot: '#445e0d', parent: `avrt${i}`, rtIdx: i, rtSub: 'avail', isRem: true },
      ]),
    ],
    g_torates: [
      { type: 'top', id: 'g_torates', label: 'Travel Co. Rates' },
      ...TO_NAMES.map((name, i) => ({
        type: 'sect' as const,
        id: `torate${i}`,
        label: name,
        parent: 'g_torates',
        toIdx: i,
      })),
      { type: 'sect', id: 'torate_base', label: 'Base Rate', parent: 'g_torates', toBase: true },
    ],
  };

  return WB_GROUP_ORDER.flatMap((key) => grp[key] ?? []);
}

/** Legacy Daily B: top-level groups open; inner sections collapsed. */
export function defaultWbCollapsed(rows: WbRow[]): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const r of rows) {
    if (r.type === 'sect') out[r.id] = true;
  }
  return out;
}

export function wbSetAllCollapsed(rows: WbRow[], collapse: boolean): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const r of rows) {
    if (r.type === 'top' || r.type === 'sect') out[r.id] = collapse;
  }
  return out;
}

export function isRowHidden(row: WbRow, collapsed: Record<string, boolean>, rowMap: Map<string, WbRow>) {
  if (!row.parent) return false;
  if (collapsed[row.parent]) return true;
  const par = rowMap.get(row.parent);
  if (par?.parent && collapsed[par.parent]) return true;
  return false;
}

export { RT_CAPS, RT_NAMES, TO_NAMES };
