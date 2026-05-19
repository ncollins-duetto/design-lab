import type { MockProperty, MockPropertyGroup } from './types'

export const MOCK_PROPERTIES: MockProperty[] = [
  { id: 'prop-1', name: 'Grand Hotel Paris', type: 'HOTEL', countryCode: 'FR', cityName: 'Paris' },
  { id: 'prop-2', name: 'Hotel Lumière', type: 'HOTEL', countryCode: 'FR', cityName: 'Paris' },
  { id: 'prop-3', name: 'Le Marais Boutique', type: 'HOTEL', countryCode: 'FR', cityName: 'Paris' },
  { id: 'prop-4', name: 'Berlin Palace', type: 'HOTEL', countryCode: 'DE', cityName: 'Berlin' },
  { id: 'prop-5', name: 'Hotel Mitte', type: 'HOTEL', countryCode: 'DE', cityName: 'Berlin' },
  { id: 'prop-6', name: 'Madrid Suites', type: 'HOTEL', countryCode: 'ES', cityName: 'Madrid' },
  { id: 'prop-7', name: 'Barcelona View', type: 'HOTEL', countryCode: 'ES', cityName: 'Barcelona' },
  { id: 'prop-8', name: 'Amsterdam Canal', type: 'HOTEL', countryCode: 'NL', cityName: 'Amsterdam' },
]

export const MOCK_PROPERTY_GROUPS: MockPropertyGroup[] = [
  {
    id: 'group-fr',
    name: 'France',
    properties: MOCK_PROPERTIES.filter((p) => p.countryCode === 'FR'),
  },
  {
    id: 'group-de',
    name: 'Germany',
    properties: MOCK_PROPERTIES.filter((p) => p.countryCode === 'DE'),
  },
  {
    id: 'group-es',
    name: 'Spain',
    properties: MOCK_PROPERTIES.filter((p) => p.countryCode === 'ES'),
  },
  {
    id: 'group-nl',
    name: 'Netherlands',
    properties: MOCK_PROPERTIES.filter((p) => p.countryCode === 'NL'),
  },
]

// All-properties pseudo-entry for the property picker
export const ALL_PROPERTIES = { id: 'all', name: 'All Properties', type: 'ALL' as const }
