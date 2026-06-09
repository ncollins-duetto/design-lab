import StepShell from '../StepShell'
import { STEPS } from '../steps'

export default function WelcomeStep() {
  return (
    <StepShell
      stepId="welcome"
      why={<p>This short tour explains what we’ll ask for and roughly how long each part takes — so you can collect everything in one go.</p>}
      behindScenes={<p>Nothing is submitted yet. You can pause at any step and we’ll save your progress. Most properties go live within 5 business days of finishing onboarding.</p>}
    >
      <div className="wf-card">
        <p className="wf-card-title">What you’ll do</p>
        <ol className="wf-tour-list">
          {STEPS.slice(1).map((s) => (
            <li key={s.id}>
              <strong>{s.shortTitle}</strong>
              <span> — {s.subtitle}. ~{s.estMinutes} min.</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="wf-card" style={{ marginTop: 16 }}>
        <p className="wf-card-title">Have these handy</p>
        <ul className="wf-tour-list">
          <li>Your signed HotStats agreement reference number</li>
          <li>Company billing details (legal entity, VAT/tax ID, billing email)</li>
          <li>Property facts (rooms, opening year, segments served)</li>
          <li>Name + email of someone who can send monthly data files</li>
          <li>A shortlist of competitor hotels you want to benchmark against</li>
        </ul>
      </div>
    </StepShell>
  )
}
