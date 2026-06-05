export type HeatmapType = 'stopsales' | 'hotelocc' | 'remaining' | 'mealplan' | 'toforecast';

export type HeatmapCondition = {
  enabled: boolean;
  metric: 'hotel' | 'remainRooms' | 'totalGuests' | 'toOtb';
  op: '>' | '>=' | '<' | '<=';
  value: number;
};

export type HeatmapState = {
  enabled: boolean;
  type: HeatmapType | '';
  greyThreshold: number;
  greenThreshold: number;
  colors: { grey?: string; blue?: string; green?: string };
  condition: HeatmapCondition;
  stopSalesRoomTypes: string[];
};

export const DEFAULT_HEATMAP: HeatmapState = {
  enabled: false,
  type: '',
  greyThreshold: 85,
  greenThreshold: 60,
  colors: {},
  condition: { enabled: false, metric: 'hotel', op: '>', value: 50 },
  stopSalesRoomTypes: [],
};

/** Stop sales: closed / partial / open */
export const HM_STOP_SALES_COLORS = {
  closed: '#D32F2F',
  partial: '#FFB90F',
  open: '#388C3F',
};

/** Hotel occ, remaining rooms, meal plan, TO forecast — grey / blue / green tier keys */
export const HM_METRIC_COLORS = {
  grey: '#D33030',
  blue: '#FDF6F6',
  green: '#2E65E8',
};

export const HEATMAP_TYPE_OPTIONS: {
  key: HeatmapType;
  label: string;
  icon: string;
}[] = [
  { key: 'stopsales', label: 'Stop Sales', icon: 'lock' },
  { key: 'hotelocc', label: 'Hotel Occupancy', icon: 'hotel' },
  { key: 'remaining', label: 'Remaining Rooms', icon: 'meeting_room' },
  { key: 'mealplan', label: 'Meal Plan Guests', icon: 'restaurant' },
  { key: 'toforecast', label: 'TO Forecast', icon: 'trending_up' },
];

export const ROOM_TYPE_OPTIONS = ['Standard', 'Superior', 'Deluxe', 'Suite'];
