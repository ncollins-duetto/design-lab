export type TeamSlug =
  | 'strategy-team'
  | 'onboarding-team'
  | 'group'
  | 'resorts'
  | 'pricing'
  | 'detection-exploration'
  | 'special-projects'

export const ALL_TEAMS: TeamSlug[] = [
  'strategy-team',
  'onboarding-team',
  'group',
  'resorts',
  'pricing',
  'detection-exploration',
  'special-projects',
]

// Short labels — no "Team" suffix
export const TEAM_LABELS: Record<TeamSlug, string> = {
  'strategy-team': 'Strategy',
  'onboarding-team': 'Onboarding',
  'group': 'Group',
  'resorts': 'Resorts',
  'pricing': 'Pricing',
  'detection-exploration': 'Detection',
  'special-projects': 'Special Projects',
}

export type Project = {
  slug: string
  name: string
  href: string
  team: TeamSlug
  description: string
  committedAt: number   // Unix ms — used for sort order
  committed: string     // Human-readable label
  decoration: 'rates' | 'sales-room' | 'min-max' | 'tour-operator'
}

const NOW = Date.now()
const HOURS = 3600 * 1000
const DAYS  = 24 * HOURS

export const PROJECTS: Project[] = [
  {
    slug: 'quote-summary',
    name: 'Group Quote Summary',
    href: '/quote-summary',
    team: 'group',
    description: 'Summary view for group quotes, with an interactive step flow between Booking Details and Summary.',
    committedAt: NOW - 1 * HOURS,
    committed: 'Committed 1 hour ago',
    decoration: 'sales-room',
  },
  {
    slug: 'min-max-bounds',
    name: 'Min/Max Bounds',
    href: '/min-max-bounds',
    team: 'strategy-team',
    description: 'New approach to setting rate floor and ceiling overrides by season and room type.',
    committedAt: NOW - 18 * HOURS,
    committed: 'Committed 18 hours ago',
    decoration: 'rates',
  },
  {
    slug: 'min-max-option-2',
    name: 'Min/Max Option 2',
    href: '/min-max-option-2',
    team: 'strategy-team',
    description: 'Alternative bounds UI exploring dropdown-driven season and room type override selection.',
    committedAt: NOW - 18 * HOURS,
    committed: 'Committed 18 hours ago',
    decoration: 'rates',
  },
  {
    slug: 'digital-sales-room',
    name: 'Digital Sales Room',
    href: '/digital-sales-room',
    team: 'onboarding-team',
    description: 'Guided onboarding flow for new hotel accounts, from setup through to a shareable sales proposal.',
    committedAt: NOW - 3 * DAYS,
    committed: 'Committed 3 days ago',
    decoration: 'sales-room',
  },
  {
    slug: 'tour-operator',
    name: 'Tour Operator',
    href: '/tour-operator',
    team: 'special-projects',
    description: 'Tour operator demand calendar — monthly and weekly views with metrics, segments, heatmap, and close-out flows.',
    committedAt: NOW - 1 * HOURS,
    committed: 'Committed 1 hour ago',
    decoration: 'tour-operator',
  },
  {
    slug: 'manage-rates-multi',
    name: 'Multi-Property Manage Rates',
    href: '/manage-rates/multi',
    team: 'strategy-team',
    description: 'Redesigned rates table across multiple properties, with grouped metrics and per-day column expansion.',
    committedAt: NOW - 14 * DAYS,
    committed: 'Committed 2 weeks ago',
    decoration: 'rates',
  },
]

// Legacy folder structure — kept for /folder/[slug] route compatibility
export type Folder = {
  slug: string
  name: string
  edited: string
  projects: Project[]
}

export const FOLDERS: Folder[] = [
  {
    slug: 'strategy-team',
    name: 'Strategy Team',
    edited: 'Edited 18 hours ago',
    projects: PROJECTS.filter((p) => p.team === 'strategy-team'),
  },
  {
    slug: 'onboarding-team',
    name: 'Onboarding Team',
    edited: 'Edited 3 days ago',
    projects: PROJECTS.filter((p) => p.team === 'onboarding-team'),
  },
]

export function getFolder(slug: string): Folder | undefined {
  return FOLDERS.find((f) => f.slug === slug)
}
