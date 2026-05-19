/**
 * Mock types that mirror the shapes of real Duetto GQL types.
 * Keep these in sync with duetto-frontend/src/generated/ as fields evolve.
 * Only include fields that prototypes actually use — don't copy entire schemas.
 */

// Mirrors graphql.d.ts PropertyType enum
export type PropertyType = 'HOTEL' | 'GROUP' | 'ALL'

// Mirrors graphql.d.ts Property type
export interface MockProperty {
  id: string
  name: string
  type: PropertyType
  countryCode?: string
  cityName?: string
}

// Mirrors graphql.d.ts PropertyGroup / picker tree structure
export interface MockPropertyGroup {
  id: string
  name: string
  properties: MockProperty[]
}

// Shared date range used across most prototype pages
export interface MockDateRange {
  startDate: string // ISO date string YYYY-MM-DD
  endDate: string
}

// Day-of-week index (0 = Sunday … 6 = Saturday)
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const DAYS: DayIndex[] = [0, 1, 2, 3, 4, 5, 6]
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Restriction types used across Pricing & Strategy pages
export type RestrictionType = 'CTS' | 'CTA' | 'CTD' | 'MinSA' | 'MinST' | 'MaxSA' | 'MaxST'

export interface RestrictionDef {
  label: string
  hasValue: boolean // true = requires a numeric value (e.g. MinSA: 2), false = boolean toggle
}

export const RESTRICTION_DEFS: Record<RestrictionType, RestrictionDef> = {
  CTS: { label: 'Closed to Stay', hasValue: false },
  CTA: { label: 'Closed to Arrival', hasValue: false },
  CTD: { label: 'Closed to Departure', hasValue: false },
  MinSA: { label: 'Min Stay Arrival', hasValue: true },
  MinST: { label: 'Min Stay Through', hasValue: true },
  MaxSA: { label: 'Max Stay Arrival', hasValue: true },
  MaxST: { label: 'Max Stay Through', hasValue: true },
}
