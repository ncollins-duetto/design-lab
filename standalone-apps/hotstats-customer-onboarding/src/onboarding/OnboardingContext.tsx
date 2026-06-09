import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { STEPS, type StepId } from './steps'

interface CompanyData {
  legalName: string
  tradingName: string
  country: string
  billingEmail: string
  vatNumber: string
}
interface PropertyData {
  name: string
  brand: string
  city: string
  country: string
  rooms: string
  openingYear: string
  segments: string[]
}
interface DataSourcesData {
  pms: string
  pmsOther: string
  deliveryMethod: 'sftp' | 'email' | 'manual' | ''
  contactName: string
  contactEmail: string
}
interface CompSetData {
  competitors: string[]
}
interface ReviewData {
  approved: boolean
  notes: string
}
interface TeamMember {
  email: string
  role: 'admin' | 'analyst' | 'viewer'
}

export interface OnboardingState {
  company: CompanyData
  property: PropertyData
  data: DataSourcesData
  compset: CompSetData
  review: ReviewData
  team: TeamMember[]
  completed: Record<StepId, boolean>
}

const initial: OnboardingState = {
  company: { legalName: '', tradingName: '', country: '', billingEmail: '', vatNumber: '' },
  property: { name: '', brand: '', city: '', country: '', rooms: '', openingYear: '', segments: [] },
  data: { pms: '', pmsOther: '', deliveryMethod: '', contactName: '', contactEmail: '' },
  compset: { competitors: [] },
  review: { approved: false, notes: '' },
  team: [],
  completed: {
    welcome: false, company: false, property: false, data: false,
    compset: false, review: false, team: false, launch: false,
  },
}

interface Ctx {
  state: OnboardingState
  currentStepIndex: number
  setStepIndex: (i: number) => void
  next: () => void
  prev: () => void
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void
  markComplete: (id: StepId) => void
  validate: (id: StepId) => string[]
}

const OnboardingCtx = createContext<Ctx | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initial)
  const [currentStepIndex, setStepIndex] = useState(0)

  const validate = (id: StepId): string[] => {
    const errs: string[] = []
    if (id === 'company') {
      if (!state.company.legalName) errs.push('Legal company name')
      if (!state.company.country) errs.push('Country of registration')
      if (!state.company.billingEmail) errs.push('Billing email')
    }
    if (id === 'property') {
      if (!state.property.name) errs.push('Property name')
      if (!state.property.city) errs.push('City')
      if (!state.property.country) errs.push('Country')
      if (!state.property.rooms) errs.push('Number of rooms')
    }
    if (id === 'data') {
      if (!state.data.pms) errs.push('Property management system')
      if (!state.data.deliveryMethod) errs.push('Data delivery method')
      if (!state.data.contactName) errs.push('Finance/operations contact name')
      if (!state.data.contactEmail) errs.push('Contact email')
    }
    if (id === 'compset') {
      if (state.compset.competitors.length < 4) errs.push('Select at least 4 competitor properties')
    }
    if (id === 'review') {
      if (!state.review.approved) errs.push('Confirm and approve the competitive set')
    }
    if (id === 'team') {
      if (state.team.length === 0) errs.push('Invite at least one team member (you can add more later)')
    }
    return errs
  }

  const value = useMemo<Ctx>(() => ({
    state,
    currentStepIndex,
    setStepIndex,
    next: () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1)),
    prev: () => setStepIndex((i) => Math.max(i - 1, 0)),
    update: (key, value) => setState((s) => ({ ...s, [key]: value })),
    markComplete: (id) => setState((s) => ({ ...s, completed: { ...s.completed, [id]: true } })),
    validate,
  }), [state, currentStepIndex])

  return <OnboardingCtx.Provider value={value}>{children}</OnboardingCtx.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingCtx)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider')
  return ctx
}
