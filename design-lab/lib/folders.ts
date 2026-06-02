export type Project = {
  name: string
  href: string
  heroTitle: string
  heroLine2?: string
  year?: string
  edited: string
  decoration: 'rates' | 'sales-room'
}

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
    edited: 'Edited just now',
    projects: [
      {
        name: 'Multi-Property Manage Rates',
        href: '/manage-rates/multi',
        heroTitle: 'Duetto',
        heroLine2: 'Manage Rates',
        edited: 'Edited just now',
        decoration: 'rates',
      },
    ],
  },
  {
    slug: 'onboarding-team',
    name: 'Onboarding Team',
    edited: 'Edited just now',
    projects: [
      {
        name: 'Digital Sales Room',
        href: '/digital-sales-room',
        heroTitle: 'Duetto',
        heroLine2: 'Sales Room',
        edited: 'Edited just now',
        decoration: 'sales-room',
      },
    ],
  },
  {
    slug: 'group',
    name: 'Group',
    edited: 'Edited just now',
    projects: [],
  },
  {
    slug: 'resorts',
    name: 'Resorts',
    edited: 'Edited just now',
    projects: [],
  },
  {
    slug: 'pricing',
    name: 'Pricing',
    edited: 'Edited just now',
    projects: [],
  },
  {
    slug: 'detection-exploration',
    name: 'Detection/Exploration',
    edited: 'Edited just now',
    projects: [],
  },
]

export function getFolder(slug: string): Folder | undefined {
  return FOLDERS.find((f) => f.slug === slug)
}
