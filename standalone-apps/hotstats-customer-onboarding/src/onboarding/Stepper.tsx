import { STEPS } from './steps'
import { useOnboarding } from './OnboardingContext'

export default function Stepper() {
  const { currentStepIndex, setStepIndex, state } = useOnboarding()
  return (
    <ol className="wf-stepper">
      {STEPS.map((s, i) => {
        const status =
          i === currentStepIndex ? 'active'
            : state.completed[s.id] ? 'done'
            : i < currentStepIndex ? 'visited'
            : 'todo'
        return (
          <li
            key={s.id}
            className={`wf-step wf-step-${status}`}
            onClick={() => setStepIndex(i)}
            role="button"
            tabIndex={0}
          >
            <div className="wf-step-num">
              {status === 'done' ? '✓' : s.number}
            </div>
            <div className="wf-step-body">
              <div className="wf-step-title">{s.shortTitle}</div>
              <div className="wf-step-meta">~{s.estMinutes} min</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
