export type StepId =
  | 'welcome'
  | 'company'
  | 'property'
  | 'data'
  | 'compset'
  | 'review'
  | 'team'
  | 'launch'

export interface StepDef {
  id: StepId
  number: number
  title: string
  shortTitle: string
  subtitle: string
  estMinutes: number
}

export const STEPS: StepDef[] = [
  { id: 'welcome', number: 1, title: 'Welcome to HotStats', shortTitle: 'Welcome', subtitle: 'A quick tour of what to expect', estMinutes: 2 },
  { id: 'company', number: 2, title: 'Tell us about your company', shortTitle: 'Company & billing', subtitle: 'Legal entity and billing details', estMinutes: 5 },
  { id: 'property', number: 3, title: 'Add your property', shortTitle: 'Property details', subtitle: 'Basic facts about each hotel', estMinutes: 8 },
  { id: 'data', number: 4, title: 'Connect your data', shortTitle: 'Data sources', subtitle: 'How your numbers reach HotStats', estMinutes: 15 },
  { id: 'compset', number: 5, title: 'Choose your competitive set', shortTitle: 'Competitive set', subtitle: 'Who you want to benchmark against', estMinutes: 10 },
  { id: 'review', number: 6, title: 'Review and approve', shortTitle: 'Review comp set', subtitle: 'Confirm before activation', estMinutes: 5 },
  { id: 'team', number: 7, title: 'Invite your team', shortTitle: 'Team & access', subtitle: 'Who can see your reports', estMinutes: 5 },
  { id: 'launch', number: 8, title: 'You’re ready to launch', shortTitle: 'Launch', subtitle: 'What happens next', estMinutes: 1 },
]
