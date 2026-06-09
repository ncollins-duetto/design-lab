import './App.css'
import { OnboardingProvider, useOnboarding } from './onboarding/OnboardingContext'
import Stepper from './onboarding/Stepper'
import { STEPS } from './onboarding/steps'
import WelcomeStep from './onboarding/steps/WelcomeStep'
import CompanyStep from './onboarding/steps/CompanyStep'
import PropertyStep from './onboarding/steps/PropertyStep'
import DataStep from './onboarding/steps/DataStep'
import CompSetStep from './onboarding/steps/CompSetStep'
import ReviewStep from './onboarding/steps/ReviewStep'
import TeamStep from './onboarding/steps/TeamStep'
import LaunchStep from './onboarding/steps/LaunchStep'

function Shell() {
  const { currentStepIndex, state } = useOnboarding()
  const step = STEPS[currentStepIndex]
  const completedCount = Object.values(state.completed).filter(Boolean).length
  const pct = Math.round((completedCount / STEPS.length) * 100)

  return (
    <div className="wf-app">
      <aside className="wf-sidebar">
        <div className="wf-logo">[ HotStats ]</div>
        <div className="wf-progress-wrap">
          <div className="wf-progress-label">
            <span>Your onboarding</span>
            <span>{pct}%</span>
          </div>
          <div className="wf-progress-bar"><div className="wf-progress-fill" style={{ width: `${pct}%` }} /></div>
        </div>
        <Stepper />
        <div className="wf-help-box">
          <p className="wf-card-title">Need a hand?</p>
          <p className="wf-help-body">Email <strong>onboarding@hotstats.com</strong> or schedule a 20-minute walkthrough.</p>
        </div>
      </aside>

      <div className="wf-main">
        <header className="wf-header">
          <div>
            <div className="wf-crumbs">Onboarding · {step.shortTitle}</div>
          </div>
          <div className="wf-header-actions">
            <span className="wf-saved">All changes saved</span>
            <div className="wf-avatar">[ A ]</div>
          </div>
        </header>
        <main className="wf-content">
          {step.id === 'welcome' && <WelcomeStep />}
          {step.id === 'company' && <CompanyStep />}
          {step.id === 'property' && <PropertyStep />}
          {step.id === 'data' && <DataStep />}
          {step.id === 'compset' && <CompSetStep />}
          {step.id === 'review' && <ReviewStep />}
          {step.id === 'team' && <TeamStep />}
          {step.id === 'launch' && <LaunchStep />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <OnboardingProvider>
      <Shell />
    </OnboardingProvider>
  )
}
