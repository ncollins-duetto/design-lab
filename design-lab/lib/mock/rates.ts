import { MOCK_PROPERTIES, MOCK_PROPERTY_GROUPS } from './properties'

// ─── Column type keys ────────────────────────────────────────────────────────
// Mirrors ColType enum in duetto-frontend/src/containers/Gamechanger/ManageRatesPage/utils/TableUtils.ts
// Only the subset relevant to the multi-property view.

export const COL = {
  // Rate columns (always visible or toggleable — not metrics)
  CURRENT: 'current',
  RECOMMENDED: 'recommended',
  OVERRIDE: 'override',
  PROTECT: 'protect',

  // Occupancy metrics
  COMMITTED_OCCUPANCY: 'committedOccupancy',
  DEMAND_OCCUPANCY: 'demandOccupancy',
  DEMAND_RATIO: 'demandRatio',
  OCCUPANCY: 'occupancy',
  OCCUPANCY_PERCENT: 'occupancyPercent',
  OCCUPANCY_STLY: 'occupancyStly',
  OCCUPANCY_FINAL_LY: 'occupancyFinalLy',

  // Commitment metrics
  COMMIT: 'commit',
  COMMIT_ADR: 'commitAdr',
  COMMIT_ADR_STLY: 'commitAdrStly',
  FINAL_COMMIT_ADR_STLY: 'finalCommitAdrStly',
  PICKUP: 'pickup',

  // Competitor metrics
  COMPETITOR_AVG: 'competitorAvg',
  COMPETITOR_LOW: 'competitorLow',
  COMPETITOR_HIGH: 'competitorHigh',
  SHOPPED_RATE: 'shoppedRate',

  // Forecast metrics
  DUETTO_FORECAST: 'duettoForecastRooms',
  DUETTO_FORECAST_PERCENT: 'duettoForecastPercent',

  // Inventory metrics
  REMAINING: 'remaining',
  REMAINING_ROOMS: 'remainingRooms',
  OUT_OF_ORDER: 'outOfOrderRooms',

  // Revenue metrics
  NON_GROUP_ADR: 'nonGroupAdr',
  GROUP_ADR: 'groupAdr',
  DIFFERENTIAL: 'differential',
} as const

export type ColKey = (typeof COL)[keyof typeof COL]

export const toColId = (dateIso: string, colKey: ColKey) => `${dateIso}_${colKey}`

// ─── Column metadata ─────────────────────────────────────────────────────────

export type ColCategory = 'rate' | 'occupancy' | 'commitment' | 'competitor' | 'forecast' | 'inventory' | 'revenue'

export interface ColMeta {
  key: ColKey
  label: string
  category: ColCategory
  defaultVisible: boolean   // shown on expand without any user settings
  alwaysVisible?: boolean   // cannot be hidden (only Current)
  format: 'currency' | 'percent' | 'integer' | 'decimal'
  width?: number
}

export const COL_DEFS: ColMeta[] = [
  // Rate columns
  { key: COL.CURRENT,              label: 'Current',             category: 'rate',        defaultVisible: true,  alwaysVisible: true,  format: 'currency', width: 110 },
  { key: COL.RECOMMENDED,          label: 'Recommended',         category: 'rate',        defaultVisible: true,  format: 'currency', width: 130 },
  { key: COL.OVERRIDE,             label: 'Override',            category: 'rate',        defaultVisible: true,  format: 'currency', width: 100 },

  // Metric columns — 5 defaults
  { key: COL.PROTECT,              label: 'Protect (Min)',       category: 'rate',        defaultVisible: true,  format: 'currency', width: 110 },
  { key: COL.COMMITTED_OCCUPANCY,  label: 'Committed Occ.',      category: 'occupancy',   defaultVisible: true,  format: 'integer',  width: 130 },
  { key: COL.PICKUP,               label: 'Pickup',              category: 'commitment',  defaultVisible: true,  format: 'integer',  width: 90 },
  { key: COL.COMMIT_ADR_STLY,      label: 'Commit ADR STLY',     category: 'commitment',  defaultVisible: true,  format: 'currency', width: 130 },
  { key: COL.OCCUPANCY_STLY,       label: 'Occupancy STLY',      category: 'occupancy',   defaultVisible: true,  format: 'percent',  width: 120 },

  // Remaining occupancy metrics
  { key: COL.DEMAND_OCCUPANCY,     label: 'Demand Occupancy',    category: 'occupancy',   defaultVisible: false, format: 'percent',  width: 130 },
  { key: COL.DEMAND_RATIO,         label: 'Demand Ratio',        category: 'occupancy',   defaultVisible: false, format: 'percent',  width: 115 },
  { key: COL.OCCUPANCY,            label: 'Occupancy',           category: 'occupancy',   defaultVisible: false, format: 'integer',  width: 100 },
  { key: COL.OCCUPANCY_PERCENT,    label: 'Occupancy %',         category: 'occupancy',   defaultVisible: false, format: 'percent',  width: 110 },
  { key: COL.OCCUPANCY_FINAL_LY,   label: 'Occupancy Final LY',  category: 'occupancy',   defaultVisible: false, format: 'percent',  width: 140 },

  // Remaining commitment metrics
  { key: COL.COMMIT,               label: 'Commit Rooms',        category: 'commitment',  defaultVisible: false, format: 'integer',  width: 115 },
  { key: COL.COMMIT_ADR,           label: 'Commit ADR',          category: 'commitment',  defaultVisible: false, format: 'currency', width: 110 },
  { key: COL.FINAL_COMMIT_ADR_STLY,label: 'Final Commit ADR STLY', category: 'commitment', defaultVisible: false, format: 'currency', width: 160 },

  // Competitor metrics
  { key: COL.COMPETITOR_AVG,       label: 'Competitor Avg',      category: 'competitor',  defaultVisible: false, format: 'currency', width: 125 },
  { key: COL.COMPETITOR_LOW,       label: 'Competitor Low',      category: 'competitor',  defaultVisible: false, format: 'currency', width: 120 },
  { key: COL.COMPETITOR_HIGH,      label: 'Competitor High',     category: 'competitor',  defaultVisible: false, format: 'currency', width: 125 },
  { key: COL.SHOPPED_RATE,         label: 'Shopped Rate',        category: 'competitor',  defaultVisible: false, format: 'currency', width: 115 },

  // Forecast metrics
  { key: COL.DUETTO_FORECAST,      label: 'Duetto Forecast',     category: 'forecast',    defaultVisible: false, format: 'integer',  width: 130 },
  { key: COL.DUETTO_FORECAST_PERCENT, label: 'Duetto Forecast %', category: 'forecast',  defaultVisible: false, format: 'percent',  width: 140 },

  // Inventory metrics
  { key: COL.REMAINING,            label: 'Remaining',           category: 'inventory',   defaultVisible: false, format: 'integer',  width: 100 },
  { key: COL.REMAINING_ROOMS,      label: 'Remaining Rooms',     category: 'inventory',   defaultVisible: false, format: 'integer',  width: 130 },
  { key: COL.OUT_OF_ORDER,         label: 'Out of Order',        category: 'inventory',   defaultVisible: false, format: 'integer',  width: 110 },

  // Revenue metrics
  { key: COL.NON_GROUP_ADR,        label: 'Non-Group ADR',       category: 'revenue',     defaultVisible: false, format: 'currency', width: 120 },
  { key: COL.GROUP_ADR,            label: 'Group ADR',           category: 'revenue',     defaultVisible: false, format: 'currency', width: 100 },
  { key: COL.DIFFERENTIAL,         label: 'Differential',        category: 'revenue',     defaultVisible: false, format: 'currency', width: 110 },
]

export const CATEGORY_LABELS: Record<ColCategory, string> = {
  rate:        'Rate',
  occupancy:   'Occupancy',
  commitment:  'Commitment',
  competitor:  'Competitor',
  forecast:    'Forecast',
  inventory:   'Inventory',
  revenue:     'Revenue',
}

// The metric-only columns (not rate columns — these only appear on expand)
export const METRIC_COLS = COL_DEFS.filter(
  (c) => c.key !== COL.CURRENT && c.key !== COL.RECOMMENDED && c.key !== COL.OVERRIDE
)

// Default visible column keys (what the user sees before changing anything)
export const DEFAULT_VISIBLE_COLS = new Set<ColKey>(
  COL_DEFS.filter((c) => c.defaultVisible || c.alwaysVisible).map((c) => c.key)
)

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function getWeekDates(startIso: string, count = 7): string[] {
  const dates: string[] = []
  const start = new Date(startIso + 'T00:00:00')
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export function formatDateHeader(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
}

// ─── Mock data generation ─────────────────────────────────────────────────────

const BASE_RATES: Record<string, number> = {
  'prop-1': 190, 'prop-2': 175, 'prop-3': 210,
  'prop-4': 185, 'prop-5': 195, 'prop-6': 165,
  'prop-7': 200, 'prop-8': 180,
}

const seed = (hotelId: string, dateIso: string, salt: number) => {
  const h = [...hotelId, ...dateIso].reduce((a, c) => a + c.charCodeAt(0), salt)
  return ((h * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
}

const fmt = (val: number, format: ColMeta['format'], currency = '€') => {
  if (format === 'currency') return `${currency}${val.toFixed(2)}`
  if (format === 'percent') return `${val.toFixed(1)}%`
  return String(Math.round(val))
}

export function generateRowData(dates: string[]) {
  return MOCK_PROPERTIES.map((hotel) => {
    const base = BASE_RATES[hotel.id] ?? 200
    const currency = hotel.countryCode === 'NL' ? '€' : hotel.countryCode === 'DE' ? '€' : '€'

    const row: Record<string, string | number> = {
      hotelId: hotel.id,
      hotelName: hotel.name,
    }

    dates.forEach((date, di) => {
      const s = (salt: number) => seed(hotel.id, date, salt)

      // Rate values
      const isFriday = new Date(date + 'T00:00:00').getDay() === 5
      const isSaturday = new Date(date + 'T00:00:00').getDay() === 6
      const weekendMult = isFriday ? 1.2 : isSaturday ? 1.15 : 1.0
      const current = Math.round(base * weekendMult * (0.9 + s(1) * 0.2))
      const recommended = Math.round(current * (0.95 + s(2) * 0.15))
      const protect = Math.round(current * 0.85)
      const occ = Math.round(40 + s(3) * 45)
      const occStly = Math.round(38 + s(10) * 48)
      const commitRooms = Math.round(occ * 0.6)
      const pickup = Math.round(s(11) * 8)

      row[toColId(date, COL.CURRENT)]             = fmt(current, 'currency', currency)
      row[toColId(date, COL.RECOMMENDED)]         = fmt(recommended, 'currency', currency)
      row[toColId(date, COL.OVERRIDE)]            = ''   // editable, starts empty
      row[toColId(date, COL.PROTECT)]             = fmt(protect, 'currency', currency)
      row[toColId(date, COL.COMMITTED_OCCUPANCY)] = fmt(commitRooms, 'integer')
      row[toColId(date, COL.PICKUP)]              = fmt(pickup, 'integer')
      row[toColId(date, COL.COMMIT_ADR_STLY)]     = fmt(current * (0.88 + s(12) * 0.1), 'currency', currency)
      row[toColId(date, COL.OCCUPANCY_STLY)]      = fmt(occStly, 'percent')
      row[toColId(date, COL.DEMAND_OCCUPANCY)]    = fmt(occ * (1 + s(4) * 0.3), 'percent')
      row[toColId(date, COL.DEMAND_RATIO)]        = fmt(0.6 + s(5) * 0.35, 'percent')
      row[toColId(date, COL.OCCUPANCY)]           = fmt(occ, 'integer')
      row[toColId(date, COL.OCCUPANCY_PERCENT)]   = fmt(occ, 'percent')
      row[toColId(date, COL.OCCUPANCY_FINAL_LY)]  = fmt(occStly * (0.95 + s(13) * 0.1), 'percent')
      row[toColId(date, COL.COMMIT)]              = fmt(commitRooms, 'integer')
      row[toColId(date, COL.COMMIT_ADR)]          = fmt(current * (0.9 + s(6) * 0.1), 'currency', currency)
      row[toColId(date, COL.FINAL_COMMIT_ADR_STLY)] = fmt(current * (0.85 + s(14) * 0.12), 'currency', currency)
      row[toColId(date, COL.COMPETITOR_AVG)]      = fmt(current * (0.95 + s(7) * 0.15), 'currency', currency)
      row[toColId(date, COL.COMPETITOR_LOW)]      = fmt(current * (0.8 + s(15) * 0.1), 'currency', currency)
      row[toColId(date, COL.COMPETITOR_HIGH)]     = fmt(current * (1.1 + s(16) * 0.15), 'currency', currency)
      row[toColId(date, COL.SHOPPED_RATE)]        = fmt(current * (0.92 + s(17) * 0.12), 'currency', currency)
      row[toColId(date, COL.DUETTO_FORECAST)]     = fmt(Math.round(occ * (1.05 + s(8) * 0.15)), 'integer')
      row[toColId(date, COL.DUETTO_FORECAST_PERCENT)] = fmt(0.55 + s(18) * 0.3, 'percent')
      row[toColId(date, COL.REMAINING)]           = fmt(Math.round(100 - occ), 'integer')
      row[toColId(date, COL.REMAINING_ROOMS)]     = fmt(Math.round((100 - occ) * 0.85), 'integer')
      row[toColId(date, COL.OUT_OF_ORDER)]        = fmt(Math.round(s(9) * 5), 'integer')
      row[toColId(date, COL.NON_GROUP_ADR)]       = fmt(current * (0.95 + s(19) * 0.08), 'currency', currency)
      row[toColId(date, COL.GROUP_ADR)]           = fmt(current * (0.85 + s(20) * 0.1), 'currency', currency)
      row[toColId(date, COL.DIFFERENTIAL)]        = fmt((recommended - current) * (0.8 + s(21) * 0.4), 'currency', currency)
    })

    return row
  })
}

export { MOCK_PROPERTIES, MOCK_PROPERTY_GROUPS }
