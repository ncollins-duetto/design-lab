import { MOCK_PROPERTIES, MOCK_PROPERTY_GROUPS } from './properties'

// ─── Column keys ──────────────────────────────────────────────────────────────

export const COL = {
  // Rate columns (always-on or toggleable, no sub-label)
  CURRENT:    'current',
  RECOMMENDED:'recommended',
  OVERRIDE:   'override',
  PROTECT:    'protect',

  // Demand Occupancy
  DEMAND_OCC_RN:           'demandOccRn',
  DEMAND_OCC_ADJ_PCT:      'demandOccAdjPct',
  DEMAND_OCC_PHYSICAL_PCT: 'demandOccPhysicalPct',

  // Duetto Forecast
  DUETTO_FORECAST_RN:           'duettoForecastRn',
  DUETTO_FORECAST_ADJ_PCT:      'duettoForecastAdjPct',
  DUETTO_FORECAST_PHYSICAL_PCT: 'duettoForecastPhysicalPct',
  DUETTO_FORECAST_REVPAR:       'duettoForecastRevpar',

  // Committed Occupancy
  COMMITTED_OCC_PCT:      'committedOccPct',
  COMMITTED_OCC_STLY:     'committedOccStly',
  COMMITTED_OCC_FINAL_LY: 'committedOccFinalLy',
  COMMITTED_OCC_ADJ_PCT:  'committedOccAdjPct',
  COMMITTED_OCC_ROOM_REV: 'committedOccRoomRev',

  // Pickup (X-Y-Z Days)
  PICKUP_ROOMS_OTB:    'pickupRoomsOtb',
  PICKUP_ADR_COMMIT:   'pickupAdrCommit',
  PICKUP_ROOMS_COMMIT: 'pickupRoomsCommit',
  PICKUP_REV_COMMIT:   'pickupRevCommit',

  // Rooms (Commit)
  ROOMS_COMMIT_RN:       'roomsCommitRn',
  ROOMS_COMMIT_STLY_TBB: 'roomsCommitStlyTbb',
  ROOMS_COMMIT_STLY_DOW: 'roomsCommitStlyDow',

  // OTB
  OTB_ROOMS:       'otbRooms',
  OTB_PHYSICAL_PCT:'otbPhysicalPct',

  // ADR (Commit)
  ADR_COMMIT_TOTAL:     'adrCommitTotal',
  ADR_COMMIT_STLY:      'adrCommitStly',
  ADR_COMMIT_FINAL_LY:  'adrCommitFinalLy',
  ADR_COMMIT_NON_GROUP: 'adrCommitNonGroup',
  ADR_COMMIT_GROUP:     'adrCommitGroup',

  // Inventory
  INVENTORY_OOO:                  'inventoryOoo',
  INVENTORY_REMAINING:            'inventoryRemaining',
  INVENTORY_COMPOSITE_CAP:        'inventoryCompositeCap',
  INVENTORY_COMPOSITE_REMAINING:  'inventoryCompositeRemaining',

  // Expedia
  EXPEDIA_SHOPPED: 'expediaShopped',

  // Competitors
  COMPETITOR_LOW:  'competitorLow',
  COMPETITOR_AVG:  'competitorAvg',
  COMPETITOR_HIGH: 'competitorHigh',

  // Cancellations
  CANCELLATIONS_ROOMS:   'cancellationsRooms',
  CANCELLATIONS_REVENUE: 'cancellationsRevenue',

  // Pushed Rate
  PUSHED_RATE: 'pushedRate',

  // Group Business
  GROUP_BUSINESS_ROOMS:   'groupBusinessRooms',
  GROUP_BUSINESS_REVENUE: 'groupBusinessRevenue',

  // Number of Events
  EVENTS_COUNT: 'eventsCount',

  // Number of Restrictions
  RESTRICTIONS_COUNT: 'restrictionsCount',
} as const

export type ColKey = (typeof COL)[keyof typeof COL]

export const toColId = (dateIso: string, colKey: ColKey) => `${dateIso}_${colKey}`

// ─── Categories ───────────────────────────────────────────────────────────────

export type ColCategory =
  | 'rate'
  | 'demand_occupancy'
  | 'duetto_forecast'
  | 'committed_occ'
  | 'pickup'
  | 'otb'
  | 'adr_commit'
  | 'inventory'
  | 'competitors'
  | 'cancellations'
  | 'group_business'
  | 'events_restrictions'

export const CATEGORY_LABELS: Record<ColCategory, string> = {
  rate:                'Rate',
  demand_occupancy:    'Demand Occupancy',
  duetto_forecast:     'Duetto Forecast',
  committed_occ:       'Committed Occupancy',
  pickup:              'Pickup (1 - 3 - 5)',
  otb:                 'OTB',
  adr_commit:          'ADR (Commit)',
  inventory:           'Inventory',
  competitors:         'Competitors',
  cancellations:       'Cancellations',
  group_business:      'Group Business',
  events_restrictions: 'Events & Restrictions',
}

// ─── Column metadata ──────────────────────────────────────────────────────────

export interface ColMeta {
  key:            ColKey
  label:          string        // main label — used as group header in modal + top line in table header
  subLabel?:      string        // sub label — used as item text in modal + bottom line in table header
  category:       ColCategory
  defaultVisible: boolean
  alwaysVisible?: boolean       // Current rate only
  format:         'currency' | 'percent' | 'integer' | 'decimal'
  width?:         number
}

export const COL_DEFS: ColMeta[] = [
  // ── Rate (no sub-label) ────────────────────────────────────────────────────
  { key: COL.CURRENT,     label: 'Current',      category: 'rate', defaultVisible: true,  alwaysVisible: true, format: 'currency', width: 110 },
  { key: COL.RECOMMENDED, label: 'Recommended',  category: 'rate', defaultVisible: true,  format: 'currency', width: 130 },
  { key: COL.OVERRIDE,    label: 'Override',     category: 'rate', defaultVisible: true,  format: 'currency', width: 100 },
  { key: COL.PROTECT,     label: 'Protect (Min)',category: 'rate', defaultVisible: false, format: 'currency', width: 110 },

  // ── Demand Occupancy ───────────────────────────────────────────────────────
  { key: COL.DEMAND_OCC_RN,           label: 'Demand Occupancy', subLabel: 'RN',          category: 'demand_occupancy', defaultVisible: false, format: 'integer', width: 170 },
  { key: COL.DEMAND_OCC_ADJ_PCT,      label: 'Demand Occupancy', subLabel: 'Adjusted %',  category: 'demand_occupancy', defaultVisible: true,  format: 'percent', width: 160 },
  { key: COL.DEMAND_OCC_PHYSICAL_PCT, label: 'Demand Occupancy', subLabel: 'Physical %',  category: 'demand_occupancy', defaultVisible: false, format: 'percent', width: 120 },

  // ── Duetto Forecast ────────────────────────────────────────────────────────
  { key: COL.DUETTO_FORECAST_RN,           label: 'Duetto Forecast', subLabel: 'RN',           category: 'duetto_forecast', defaultVisible: false, format: 'integer',  width: 120 },
  { key: COL.DUETTO_FORECAST_ADJ_PCT,      label: 'Duetto Forecast', subLabel: 'Adjusted %',   category: 'duetto_forecast', defaultVisible: false, format: 'percent',  width: 120 },
  { key: COL.DUETTO_FORECAST_PHYSICAL_PCT, label: 'Duetto Forecast', subLabel: 'Physical %',   category: 'duetto_forecast', defaultVisible: false, format: 'percent',  width: 120 },
  { key: COL.DUETTO_FORECAST_REVPAR,       label: 'Duetto Forecast', subLabel: 'Room RevPAR',  category: 'duetto_forecast', defaultVisible: false, format: 'currency', width: 130 },

  // ── Committed Occupancy (merged with Rooms Commit) ────────────────────────
  { key: COL.ROOMS_COMMIT_RN,        label: 'Committed Occupancy', subLabel: 'Rooms',         category: 'committed_occ', defaultVisible: false, format: 'integer',  width: 110 },
  { key: COL.ROOMS_COMMIT_STLY_DOW,  label: 'Committed Occupancy', subLabel: 'STLY (DOW)',    category: 'committed_occ', defaultVisible: false, format: 'integer',  width: 120 },
  { key: COL.COMMITTED_OCC_PCT,      label: 'Committed Occupancy', subLabel: 'Physical %',    category: 'committed_occ', defaultVisible: false, format: 'percent',  width: 110 },
  { key: COL.COMMITTED_OCC_ADJ_PCT,  label: 'Committed Occupancy', subLabel: 'Adjusted %',   category: 'committed_occ', defaultVisible: true,  format: 'percent',  width: 120 },
  { key: COL.COMMITTED_OCC_STLY,     label: 'Committed Occupancy', subLabel: 'STLY (DOW) %', category: 'committed_occ', defaultVisible: true,  format: 'percent',  width: 130 },
  { key: COL.COMMITTED_OCC_FINAL_LY, label: 'Committed Occupancy', subLabel: 'Final LY %',   category: 'committed_occ', defaultVisible: false, format: 'percent',  width: 120 },
  { key: COL.COMMITTED_OCC_ROOM_REV, label: 'Committed Occupancy', subLabel: 'Room Revenue',  category: 'committed_occ', defaultVisible: false, format: 'currency', width: 130 },

  // ── Pickup (X-Y-Z Days) ────────────────────────────────────────────────────
  { key: COL.PICKUP_ROOMS_OTB,    label: 'Pickup (1 - 3 - 5)', subLabel: 'Rooms (OTB)',      category: 'pickup', defaultVisible: true,  format: 'integer',  width: 140 },
  { key: COL.PICKUP_ROOMS_COMMIT, label: 'Pickup (1 - 3 - 5)', subLabel: 'Rooms (Commit)',   category: 'pickup', defaultVisible: false, format: 'integer',  width: 140 },
  { key: COL.PICKUP_ADR_COMMIT,   label: 'Pickup (1 - 3 - 5)', subLabel: 'ADR (Commit)',     category: 'pickup', defaultVisible: false, format: 'currency', width: 200 },
  { key: COL.PICKUP_REV_COMMIT,   label: 'Pickup (1 - 3 - 5)', subLabel: 'Revenue (Commit)', category: 'pickup', defaultVisible: false, format: 'currency', width: 220 },

  // ── OTB ────────────────────────────────────────────────────────────────────
  { key: COL.OTB_ROOMS,        label: 'OTB', subLabel: 'Rooms',       category: 'otb', defaultVisible: false, format: 'integer', width: 100 },
  { key: COL.OTB_PHYSICAL_PCT, label: 'OTB', subLabel: 'Physical %',  category: 'otb', defaultVisible: false, format: 'percent', width: 110 },

  // ── ADR (Commit) ───────────────────────────────────────────────────────────
  { key: COL.ADR_COMMIT_TOTAL,     label: 'ADR (Commit)', subLabel: 'Total ADR',          category: 'adr_commit', defaultVisible: false, format: 'currency', width: 120 },
  { key: COL.ADR_COMMIT_STLY,      label: 'ADR (Commit)', subLabel: 'STLY (DOW) ADR',    category: 'adr_commit', defaultVisible: false, format: 'currency', width: 155 },
  { key: COL.ADR_COMMIT_FINAL_LY,  label: 'ADR (Commit)', subLabel: 'Final LY (DOW) ADR',category: 'adr_commit', defaultVisible: false, format: 'currency', width: 150 },
  { key: COL.ADR_COMMIT_NON_GROUP, label: 'ADR (Commit)', subLabel: 'Non-Group ADR',      category: 'adr_commit', defaultVisible: false, format: 'currency', width: 130 },
  { key: COL.ADR_COMMIT_GROUP,     label: 'ADR (Commit)', subLabel: 'Group ADR',          category: 'adr_commit', defaultVisible: false, format: 'currency', width: 120 },

  // ── Inventory ──────────────────────────────────────────────────────────────
  { key: COL.INVENTORY_OOO,                 label: 'Inventory', subLabel: 'Out of Order Rooms',       category: 'inventory', defaultVisible: false, format: 'integer', width: 140 },
  { key: COL.INVENTORY_REMAINING,           label: 'Inventory', subLabel: 'Remaining Rooms',          category: 'inventory', defaultVisible: false, format: 'integer', width: 140 },
  { key: COL.INVENTORY_COMPOSITE_CAP,       label: 'Inventory', subLabel: 'Composite Capacity',       category: 'inventory', defaultVisible: false, format: 'integer', width: 150 },
  { key: COL.INVENTORY_COMPOSITE_REMAINING, label: 'Inventory', subLabel: 'Composite Remaining Rooms',category: 'inventory', defaultVisible: false, format: 'integer', width: 180 },

  // ── Competitors ────────────────────────────────────────────────────────────
  { key: COL.COMPETITOR_LOW,  label: 'Competitors', subLabel: 'Low',  category: 'competitors', defaultVisible: false, format: 'currency', width: 120 },
  { key: COL.COMPETITOR_AVG,  label: 'Competitors', subLabel: 'Avg',  category: 'competitors', defaultVisible: false, format: 'currency', width: 120 },
  { key: COL.COMPETITOR_HIGH, label: 'Competitors', subLabel: 'High', category: 'competitors', defaultVisible: false, format: 'currency', width: 120 },

  // ── Cancellations ──────────────────────────────────────────────────────────
  { key: COL.CANCELLATIONS_ROOMS,   label: 'Cancellations', subLabel: 'Rooms',   category: 'cancellations', defaultVisible: false, format: 'integer',  width: 120 },
  { key: COL.CANCELLATIONS_REVENUE, label: 'Cancellations', subLabel: 'Revenue', category: 'cancellations', defaultVisible: false, format: 'currency', width: 120 },

  // ── Group Business ─────────────────────────────────────────────────────────
  { key: COL.GROUP_BUSINESS_ROOMS,   label: 'Group Business', subLabel: 'Rooms',   category: 'group_business', defaultVisible: false, format: 'integer',  width: 130 },
  { key: COL.GROUP_BUSINESS_REVENUE, label: 'Group Business', subLabel: 'Revenue', category: 'group_business', defaultVisible: false, format: 'currency', width: 130 },

  // ── Events & Restrictions (merged group) ──────────────────────────────────
  { key: COL.EVENTS_COUNT,       label: 'Events & Restrictions', subLabel: 'Events',       category: 'events_restrictions', defaultVisible: false, format: 'integer', width: 110 },
  { key: COL.RESTRICTIONS_COUNT, label: 'Events & Restrictions', subLabel: 'Restrictions', category: 'events_restrictions', defaultVisible: false, format: 'integer', width: 120 },
]

// Category order for the modal tree (matches nyle version tab order, rate first)
export const ALL_CATEGORIES: ColCategory[] = [
  'rate',
  'demand_occupancy',
  'duetto_forecast',
  'pickup',
  'committed_occ',
  'otb',
  'adr_commit',
  'inventory',
  'competitors',
  'cancellations',
  'group_business',
  'events_restrictions',
]

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
  const locale = typeof navigator !== 'undefined' ? undefined : 'en-GB'
  return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
}

// ─── Mock data ────────────────────────────────────────────────────────────────

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
  if (format === 'percent')  return `${val.toFixed(1)}%`
  return String(Math.round(val))
}

export function generateRowData(dates: string[]) {
  return MOCK_PROPERTIES.map((hotel) => {
    const base = BASE_RATES[hotel.id] ?? 200
    const cur  = '€'

    const row: Record<string, string | number> = {
      hotelId:   hotel.id,
      hotelName: hotel.name,
    }

    dates.forEach((date) => {
      const s = (salt: number) => seed(hotel.id, date, salt)

      const isFri = new Date(date + 'T00:00:00').getDay() === 5
      const isSat = new Date(date + 'T00:00:00').getDay() === 6
      const wkMult = isFri ? 1.2 : isSat ? 1.15 : 1.0

      // Core rate / occ values used across multiple columns
      const current     = Math.round(base * wkMult * (0.9  + s(1)  * 0.2))
      const recommended = Math.round(current * (0.95 + s(2)  * 0.15))
      const occ         = Math.round(40 + s(3) * 45)   // rooms
      const occPct      = occ                            // reuse as %
      const occStly     = Math.round(38 + s(10) * 48)
      const commitRooms = Math.round(occ * 0.6)
      const pickup      = Math.round(s(11) * 8)
      const adr         = current * (0.9 + s(6) * 0.1)

      const id = (k: ColKey) => toColId(date, k)

      // Rate — ~12% of cells get recommended === current (shows equals icon)
      const equalToCurrent = seed(hotel.id, date, 99) < 0.12
      row[id(COL.CURRENT)]     = fmt(current, 'currency', cur)
      row[id(COL.RECOMMENDED)] = equalToCurrent ? row[id(COL.CURRENT)] : fmt(recommended, 'currency', cur)
      row[id(COL.OVERRIDE)]    = ''
      row[id(COL.PROTECT)]     = fmt(Math.round(current * 0.85), 'currency', cur)

      // Demand Occupancy
      row[id(COL.DEMAND_OCC_RN)]           = fmt(Math.round(occ * (1.05 + s(4) * 0.2)), 'integer')
      row[id(COL.DEMAND_OCC_ADJ_PCT)]      = fmt(occ * (1 + s(4) * 0.3), 'percent')
      row[id(COL.DEMAND_OCC_PHYSICAL_PCT)] = fmt(occ * (0.9 + s(30) * 0.15), 'percent')

      // Duetto Forecast
      row[id(COL.DUETTO_FORECAST_RN)]           = fmt(Math.round(occ * (1.05 + s(8) * 0.15)), 'integer')
      row[id(COL.DUETTO_FORECAST_ADJ_PCT)]      = fmt(0.55 + s(18) * 0.3, 'percent')
      row[id(COL.DUETTO_FORECAST_PHYSICAL_PCT)] = fmt(0.50 + s(31) * 0.28, 'percent')
      row[id(COL.DUETTO_FORECAST_REVPAR)]       = fmt(current * (0.8 + s(32) * 0.15), 'currency', cur)

      // Committed Occupancy
      row[id(COL.COMMITTED_OCC_PCT)]      = fmt(occPct, 'percent')
      row[id(COL.COMMITTED_OCC_STLY)]     = fmt(occStly, 'percent')
      row[id(COL.COMMITTED_OCC_FINAL_LY)] = fmt(occStly * (0.95 + s(13) * 0.1), 'percent')
      row[id(COL.COMMITTED_OCC_ADJ_PCT)]  = fmt(occPct * (0.95 + s(33) * 0.1), 'percent')
      row[id(COL.COMMITTED_OCC_ROOM_REV)] = fmt(commitRooms * adr, 'currency', cur)

      // Pickup — all stored as "d1|d3|d5" so PickupCell can render three values
      const p1 = Math.max(0, Math.round(s(11) * 4))
      const p3 = p1 + Math.max(0, Math.round(s(47) * 4))
      const p5 = p3 + Math.max(0, Math.round(s(48) * 6))
      row[id(COL.PICKUP_ROOMS_OTB)] = `${p1}|${p3}|${p5}`

      const a1 = fmt(adr * (0.93 + s(34) * 0.05), 'currency', cur)
      const a3 = fmt(adr * (0.95 + s(34) * 0.07), 'currency', cur)
      const a5 = fmt(adr * (0.97 + s(34) * 0.09), 'currency', cur)
      row[id(COL.PICKUP_ADR_COMMIT)] = `${a1}|${a3}|${a5}`

      const rc1 = Math.max(0, Math.round(s(49) * 3))
      const rc3 = rc1 + Math.max(0, Math.round(s(50) * 4))
      const rc5 = rc3 + Math.max(0, Math.round(s(51) * 5))
      row[id(COL.PICKUP_ROOMS_COMMIT)] = `${rc1}|${rc3}|${rc5}`

      const rv1 = fmt(rc1 * adr * (0.85 + s(35) * 0.1), 'currency', cur)
      const rv3 = fmt(rc3 * adr * (0.85 + s(35) * 0.1), 'currency', cur)
      const rv5 = fmt(rc5 * adr * (0.85 + s(35) * 0.1), 'currency', cur)
      row[id(COL.PICKUP_REV_COMMIT)] = `${rv1}|${rv3}|${rv5}`

      // Rooms (Commit)
      row[id(COL.ROOMS_COMMIT_RN)]       = fmt(commitRooms, 'integer')
      row[id(COL.ROOMS_COMMIT_STLY_TBB)] = fmt(Math.round(commitRooms * (0.9 + s(36) * 0.2)), 'integer')
      row[id(COL.ROOMS_COMMIT_STLY_DOW)] = fmt(Math.round(commitRooms * (0.85 + s(37) * 0.2)), 'integer')

      // OTB
      row[id(COL.OTB_ROOMS)]        = fmt(occ + pickup, 'integer')
      row[id(COL.OTB_PHYSICAL_PCT)] = fmt((occ + pickup) / 100, 'percent')

      // ADR (Commit)
      row[id(COL.ADR_COMMIT_TOTAL)]     = fmt(adr, 'currency', cur)
      row[id(COL.ADR_COMMIT_STLY)]      = fmt(current * (0.88 + s(12) * 0.1), 'currency', cur)
      row[id(COL.ADR_COMMIT_FINAL_LY)]  = fmt(current * (0.85 + s(14) * 0.12), 'currency', cur)
      row[id(COL.ADR_COMMIT_NON_GROUP)] = fmt(current * (0.95 + s(19) * 0.08), 'currency', cur)
      row[id(COL.ADR_COMMIT_GROUP)]     = fmt(current * (0.85 + s(20) * 0.1), 'currency', cur)

      // Inventory
      row[id(COL.INVENTORY_OOO)]                 = fmt(Math.round(s(9) * 5), 'integer')
      row[id(COL.INVENTORY_REMAINING)]            = fmt(Math.round(100 - occ), 'integer')
      row[id(COL.INVENTORY_COMPOSITE_CAP)]        = fmt(Math.round(100 + s(38) * 20), 'integer')
      row[id(COL.INVENTORY_COMPOSITE_REMAINING)]  = fmt(Math.round((100 - occ) * (0.9 + s(39) * 0.1)), 'integer')

      // Expedia
      row[id(COL.EXPEDIA_SHOPPED)] = fmt(current * (0.92 + s(17) * 0.12), 'currency', cur)

      // Competitors
      row[id(COL.COMPETITOR_LOW)]  = fmt(current * (0.80 + s(15) * 0.10), 'currency', cur)
      row[id(COL.COMPETITOR_AVG)]  = fmt(current * (0.95 + s(7)  * 0.15), 'currency', cur)
      row[id(COL.COMPETITOR_HIGH)] = fmt(current * (1.10 + s(16) * 0.15), 'currency', cur)

      // Cancellations
      row[id(COL.CANCELLATIONS_ROOMS)]   = fmt(Math.round(s(40) * 8), 'integer')
      row[id(COL.CANCELLATIONS_REVENUE)] = fmt(Math.round(s(40) * 8) * adr * (0.8 + s(41) * 0.2), 'currency', cur)

      // Pushed Rate
      row[id(COL.PUSHED_RATE)] = fmt(current * (0.98 + s(42) * 0.04), 'currency', cur)

      // Group Business
      row[id(COL.GROUP_BUSINESS_ROOMS)]   = fmt(Math.round(commitRooms * (0.2 + s(43) * 0.15)), 'integer')
      row[id(COL.GROUP_BUSINESS_REVENUE)] = fmt(Math.round(commitRooms * (0.2 + s(43) * 0.15)) * adr * (0.85 + s(44) * 0.1), 'currency', cur)

      // Events
      row[id(COL.EVENTS_COUNT)] = fmt(Math.round(s(45) * 3), 'integer')

      // Restrictions
      row[id(COL.RESTRICTIONS_COUNT)] = fmt(Math.round(s(46) * 5), 'integer')
    })

    return row
  })
}

export { MOCK_PROPERTIES, MOCK_PROPERTY_GROUPS }
