import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

const SEGMENTS = ['Corporate transient', 'Corporate group', 'Leisure', 'MICE / Meetings', 'Government', 'Wholesale', 'Long stay']

export default function PropertyStep() {
  const { state, update } = useOnboarding()
  const p = state.property

  const toggleSegment = (s: string) => {
    const next = p.segments.includes(s) ? p.segments.filter((x) => x !== s) : [...p.segments, s]
    update('property', { ...p, segments: next })
  }

  return (
    <StepShell
      stepId="property"
      dependencies={['Property name', 'City and country', 'Total room count']}
      why={
        <>
          <p>HotStats reports compare you to similar hotels. The details here decide which peer group you appear in and which benchmarks make sense.</p>
        </>
      }
      behindScenes={
        <ul>
          <li>We create a property record in our website manager so your dashboard knows what to show.</li>
          <li>The room count and segments are used to classify your hotel for benchmarking.</li>
          <li>Multiple properties? You’ll be able to add more after launch — start with one.</li>
        </ul>
      }
    >
      <div className="wf-form">
        <Field label="Property name" required>
          <input className="wf-input" value={p.name} onChange={(e) => update('property', { ...p, name: e.target.value })} />
        </Field>
        <Field label="Brand or flag" hint="Leave blank if independent">
          <input className="wf-input" value={p.brand} onChange={(e) => update('property', { ...p, brand: e.target.value })} />
        </Field>
        <div className="wf-row-2">
          <Field label="City" required>
            <input className="wf-input" value={p.city} onChange={(e) => update('property', { ...p, city: e.target.value })} />
          </Field>
          <Field label="Country" required>
            <input className="wf-input" value={p.country} onChange={(e) => update('property', { ...p, country: e.target.value })} />
          </Field>
        </div>
        <div className="wf-row-2">
          <Field label="Number of rooms" required>
            <input className="wf-input" type="number" value={p.rooms} onChange={(e) => update('property', { ...p, rooms: e.target.value })} />
          </Field>
          <Field label="Opening year" hint="Approximate is fine">
            <input className="wf-input" type="number" value={p.openingYear} onChange={(e) => update('property', { ...p, openingYear: e.target.value })} />
          </Field>
        </div>
        <Field label="Main customer segments" hint="Select all that apply">
          <div className="wf-chips">
            {SEGMENTS.map((s) => (
              <button
                type="button"
                key={s}
                className={`wf-chip ${p.segments.includes(s) ? 'is-on' : ''}`}
                onClick={() => toggleSegment(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </StepShell>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="wf-field">
      <label className="wf-label">{label}{required && <span className="wf-req">*</span>}</label>
      {children}
      {hint && <p className="wf-hint">{hint}</p>}
    </div>
  )
}
