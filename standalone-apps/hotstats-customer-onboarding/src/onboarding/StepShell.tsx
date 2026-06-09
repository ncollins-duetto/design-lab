import type { ReactNode } from 'react'
import { useOnboarding } from './OnboardingContext'
import { STEPS, type StepId } from './steps'

interface Props {
  stepId: StepId
  children: ReactNode
  why: ReactNode
  behindScenes: ReactNode
  dependencies?: string[]
  nextLabel?: string
}

export default function StepShell({
  stepId,
  children,
  why,
  behindScenes,
  dependencies,
  nextLabel = 'Save & continue',
}: Props) {
  const { currentStepIndex, next, prev, validate, markComplete } = useOnboarding()
  const step = STEPS[currentStepIndex]
  const errors = validate(stepId)
  const isLast = currentStepIndex === STEPS.length - 1

  const handleNext = () => {
    if (errors.length === 0) {
      markComplete(stepId)
      next()
    }
  }

  return (
    <div className="wf-step-shell">
      <header className="wf-step-header">
        <p className="wf-step-eyebrow">Step {step.number} of {STEPS.length}</p>
        <h1 className="wf-step-title-h1">{step.title}</h1>
        <p className="wf-step-subtitle">{step.subtitle}</p>
      </header>

      <div className="wf-step-grid">
        <section className="wf-step-form">
          {children}
        </section>

        <aside className="wf-step-aside">
          <div className="wf-aside-card">
            <p className="wf-aside-title">Why we need this</p>
            <div className="wf-aside-body">{why}</div>
          </div>
          <div className="wf-aside-card">
            <p className="wf-aside-title">What happens behind the scenes</p>
            <div className="wf-aside-body">{behindScenes}</div>
          </div>
          {dependencies && dependencies.length > 0 && (
            <div className="wf-aside-card">
              <p className="wf-aside-title">Before you can continue, we need</p>
              <ul className="wf-aside-list">
                {dependencies.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {errors.length > 0 && (
        <div className="wf-validation">
          <p className="wf-validation-title">Still missing:</p>
          <ul>
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <footer className="wf-step-footer">
        <button className="wf-btn" onClick={prev} disabled={currentStepIndex === 0}>
          Back
        </button>
        <div className="wf-step-foot-right">
          <button className="wf-btn">Save & exit</button>
          <button
            className="wf-btn wf-btn-primary"
            onClick={handleNext}
            disabled={errors.length > 0 || isLast}
          >
            {isLast ? 'Done' : nextLabel}
          </button>
        </div>
      </footer>
    </div>
  )
}
