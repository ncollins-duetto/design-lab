import type { CSSProperties } from 'react';
import {
  HM_METRIC_COLORS,
  HM_STOP_SALES_COLORS,
  type HeatmapState,
  type HeatmapType,
} from '@/lib/tour-operator/data/heatmapTypes';
import { HOTEL_CAPACITY } from '@/lib/tour-operator/data/calendarData';
import { buildCellMetrics, getOccupancy } from '@/lib/tour-operator/calendar/metrics';

export type HeatmapDayData = {
  hotel: number;
  remainRooms: number;
  totalGuests: number;
  toOtb: number;
  toFcst: number;
  isFullClose: boolean;
  hasPartialClose: boolean;
};

export function buildHeatmapDayData(
  month: number,
  day: number,
  isLocked: boolean,
  isPartial: boolean,
  toPct: number,
): HeatmapDayData {
  const m = buildCellMetrics(month, day);
  const { hotel } = getOccupancy(month, day);
  const toRn = Math.round((HOTEL_CAPACITY * toPct) / 100);
  const toFcst = Math.max(0, toRn + Math.floor((month * 3 + day * 7) % 15) - 7);
  return {
    hotel,
    remainRooms: HOTEL_CAPACITY - m.hotelRn - toRn,
    totalGuests: Math.round(m.hotelRn * 2.1),
    toOtb: toRn,
    toFcst,
    isFullClose: isLocked,
    hasPartialClose: isPartial,
  };
}

function passesCondition(data: HeatmapDayData, state: HeatmapState): boolean {
  if (!state.condition.enabled) return true;
  const { metric, op, value } = state.condition;
  let mval = 0;
  switch (metric) {
    case 'hotel':
      mval = data.hotel;
      break;
    case 'remainRooms':
      mval = data.remainRooms;
      break;
    case 'totalGuests':
      mval = data.totalGuests;
      break;
    case 'toOtb':
      mval = data.toOtb;
      break;
  }
  switch (op) {
    case '>':
      return mval > value;
    case '>=':
      return mval >= value;
    case '<':
      return mval < value;
    case '<=':
      return mval <= value;
    default:
      return true;
  }
}

export function getHeatmapCellClass(
  data: HeatmapDayData,
  state: HeatmapState,
): string {
  if (!state.enabled || !state.type) return '';
  if (!passesCondition(data, state)) return '';

  const type = state.type;
  const gT = state.greyThreshold;
  const gnT = state.greenThreshold;

  const testGrey = () => {
    if (type === 'stopsales') return data.isFullClose;
    if (type === 'hotelocc') return data.hotel >= gT;
    if (type === 'remaining') return data.remainRooms < gT;
    if (type === 'mealplan') return data.totalGuests >= gT;
    if (type === 'toforecast') return data.toOtb - data.toFcst >= gT;
    return false;
  };
  const testGreen = () => {
    if (type === 'stopsales') return !data.isFullClose && !data.hasPartialClose;
    if (type === 'hotelocc') return data.hotel < gnT;
    if (type === 'remaining') return data.remainRooms > gnT;
    if (type === 'mealplan') return data.totalGuests < gnT;
    if (type === 'toforecast') return data.toFcst - data.toOtb >= gnT;
    return false;
  };
  const testBlue = () => {
    if (type === 'stopsales') return data.hasPartialClose && !data.isFullClose;
    const lo = Math.min(gT, gnT);
    const hi = Math.max(gT, gnT);
    if (type === 'hotelocc') return data.hotel >= lo && data.hotel <= hi;
    if (type === 'remaining') return data.remainRooms >= lo && data.remainRooms <= hi;
    if (type === 'mealplan') return data.totalGuests >= lo && data.totalGuests <= hi;
    if (type === 'toforecast') {
      const diff = Math.abs(data.toOtb - data.toFcst);
      return diff >= lo && diff <= hi;
    }
    return false;
  };

  if (type === 'stopsales') {
    if (testGrey()) return 'hm-closed';
    if (testBlue()) return 'hm-partial';
    if (testGreen()) return 'hm-open';
    return '';
  }
  if (testGrey()) return 'hm-grey';
  if (testGreen()) return 'hm-green';
  if (testBlue()) return 'hm-blue';
  return '';
}

export function heatmapCssVars(state: HeatmapState): CSSProperties {
  if (!state.enabled || !state.type) return {};
  const isStop = state.type === 'stopsales';
  const gc = state.colors.grey ?? (isStop ? HM_STOP_SALES_COLORS.closed : HM_METRIC_COLORS.grey);
  const bc = state.colors.blue ?? (isStop ? HM_STOP_SALES_COLORS.partial : HM_METRIC_COLORS.blue);
  const gnc = state.colors.green ?? (isStop ? HM_STOP_SALES_COLORS.open : HM_METRIC_COLORS.green);
  return {
    ['--hm-grey-bg' as string]: `${gc}30`,
    ['--hm-grey-bdr' as string]: gc,
    ['--hm-blue-bg' as string]: isStop ? `${bc}30` : bc,
    ['--hm-blue-bdr' as string]: isStop ? bc : '#e8eaed',
    ['--hm-green-bg' as string]: `${gnc}30`,
    ['--hm-green-bdr' as string]: gnc,
    ['--hm-closed-bg' as string]: `${gc}40`,
    ['--hm-closed-bdr' as string]: gc,
    ['--hm-partial-bg' as string]: `${bc}30`,
    ['--hm-partial-bdr' as string]: bc,
    ['--hm-open-bg' as string]: `${gnc}30`,
    ['--hm-open-bdr' as string]: gnc,
  };
}

export function isStopSalesHeatmapActive(state: HeatmapState): boolean {
  return state.enabled && state.type === 'stopsales';
}

export function heatmapTypeLabel(type: HeatmapType | ''): string {
  if (!type) return 'Heatmap';
  const labels: Record<HeatmapType, string> = {
    stopsales: 'Stop Sales',
    hotelocc: 'Hotel Occ',
    remaining: 'Remaining',
    mealplan: 'Meal Plan',
    toforecast: 'TO Forecast',
  };
  return labels[type] ?? 'Heatmap';
}
