import { useState } from 'react'
import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

export default function CompSetStep() {
  const { state, update } = useOnboarding()
  const [draft, setDraft] = useState('')
  const cs = state.compset

  const add = () => {
    if (!draft.trim()) return
    update('compset', { competitors: [...cs.competitors, draft.trim()] })
    setDraft('')
  }
  const remove = (name: string) => update('compset', { competitors: cs.competitors.filter((c) => c !== name) })

  return (
    <StepShell
      stepId="compset"
      dependencies={['At least 4 competitor properties', 'Properties must be in the same market and class as yours']}
      why={
        <>
          <p>Your competitive set is the group of hotels you’re benchmarked against. Choosing well makes every report meaningful — choose poorly and the numbers won’t feel relevant.</p>
          <p>HotStats anonymises results, so your data is never shown to your competitors and theirs is never shown to you. You only see aggregated benchmark figures.</p>
        </>
      }
      behindScenes={
        <ul>
          <li>Our analysts validate your list against eligibility rules (same market, similar size and class, minimum data coverage).</li>
          <li>If a property doesn’t qualify, we’ll suggest alternatives in the next step.</li>
          <li>You can change your competitive set later, with some restrictions.</li>
        </ul>
      }
    >
      <div className="wf-form">
        <Field label="Add a competitor hotel" hint="Use the official property name including city">
          <div className="wf-row-inline">
            <input
              className="wf-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
              placeholder="e.g. The Grand Continental, Berlin"
            />
            <button type="button" className="wf-btn" onClick={add}>Add</button>
          </div>
        </Field>

        <div className="wf-card">
          <p className="wf-card-title">Your shortlist ({cs.competitors.length})</p>
          {cs.competitors.length === 0 && (
            <p className="wf-empty">No competitors added yet. Add at least 4.</p>
          )}
          <ul className="wf-comp-list">
            {cs.competitors.map((name, i) => (
              <li key={name}>
                <span className="wf-comp-idx">{i + 1}</span>
                <span className="wf-comp-name">{name}</span>
                <button className="wf-link" onClick={() => remove(name)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StepShell>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="wf-field">
      <label className="wf-label">{label}</label>
      {children}
      {hint && <p className="wf-hint">{hint}</p>}
    </div>
  )
}
