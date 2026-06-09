import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

export default function ReviewStep() {
  const { state, update } = useOnboarding()
  const r = state.review

  return (
    <StepShell
      stepId="review"
      dependencies={['Read each entry and confirm', 'Approve to unlock activation']}
      why={
        <>
          <p>Approving locks in your competitive set so reports can start generating. Anything we couldn’t validate is flagged below — you can swap properties before approving.</p>
        </>
      }
      behindScenes={
        <ul>
          <li>Approval triggers comp set creation in our reporting platform.</li>
          <li>Validation status comes from our analyst review against eligibility rules.</li>
          <li>Approving here is recorded as your formal sign-off.</li>
        </ul>
      }
    >
      <div className="wf-card">
        <p className="wf-card-title">Competitive set — review</p>
        {state.compset.competitors.length === 0 && (
          <p className="wf-empty">No competitors selected. Go back to step 5.</p>
        )}
        <ul className="wf-comp-list">
          {state.compset.competitors.map((name, i) => {
            const status = i === 1 ? 'Needs alternative' : 'Validated'
            return (
              <li key={name}>
                <span className="wf-comp-idx">{i + 1}</span>
                <span className="wf-comp-name">{name}</span>
                <span className={`wf-tag ${status === 'Validated' ? 'wf-tag-ok' : 'wf-tag-warn'}`}>{status}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="wf-card" style={{ marginTop: 16 }}>
        <p className="wf-card-title">Notes for our analyst (optional)</p>
        <textarea
          className="wf-input wf-textarea"
          value={r.notes}
          onChange={(e) => update('review', { ...r, notes: e.target.value })}
          placeholder="Anything we should know about your market or peer group?"
        />
      </div>

      <label className="wf-checkbox" style={{ marginTop: 16 }}>
        <input
          type="checkbox"
          checked={r.approved}
          onChange={(e) => update('review', { ...r, approved: e.target.checked })}
        />
        <span>
          I confirm this competitive set and authorise HotStats to activate benchmarking using these properties.
        </span>
      </label>
    </StepShell>
  )
}
