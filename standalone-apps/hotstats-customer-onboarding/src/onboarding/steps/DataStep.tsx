import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

const PMS_OPTIONS = ['Opera (Oracle)', 'Mews', 'Cloudbeds', 'Protel', 'StayNTouch', 'Other']
const DELIVERY = [
  { id: 'sftp' as const, label: 'Automated upload (SFTP)', desc: 'Our team sets up secure folder credentials. Files arrive automatically each month.' },
  { id: 'email' as const, label: 'Email a monthly export', desc: 'Send a CSV/Excel to data@hotstats.com once a month.' },
  { id: 'manual' as const, label: 'Upload via the HotStats portal', desc: 'Drop your file in the portal. Best if you’re still deciding on automation.' },
]

export default function DataStep() {
  const { state, update } = useOnboarding()
  const d = state.data

  return (
    <StepShell
      stepId="data"
      dependencies={['Name of your property management system (PMS)', 'How you want to send monthly data', 'A contact in finance or operations who can deliver the file']}
      why={
        <>
          <p>HotStats reports are built from your monthly performance data — room nights, revenue by department, payroll, and so on. We need to know how that data will reach us so reports stay up to date.</p>
        </>
      }
      behindScenes={
        <ul>
          <li>We map your file format to the USALI accounting standard so your figures compare like-for-like with peers.</li>
          <li>Our data team contacts the person you name here to set up the first transfer.</li>
          <li>You can change the delivery method at any time after launch.</li>
        </ul>
      }
    >
      <div className="wf-form">
        <Field label="Which PMS do you use?" required>
          <select className="wf-input" value={d.pms} onChange={(e) => update('data', { ...d, pms: e.target.value })}>
            <option value="">Select…</option>
            {PMS_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        {d.pms === 'Other' && (
          <Field label="Tell us which one">
            <input className="wf-input" value={d.pmsOther} onChange={(e) => update('data', { ...d, pmsOther: e.target.value })} />
          </Field>
        )}
        <Field label="How would you like to send data?" required>
          <div className="wf-radio-group">
            {DELIVERY.map((opt) => (
              <label key={opt.id} className={`wf-radio-card ${d.deliveryMethod === opt.id ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={d.deliveryMethod === opt.id}
                  onChange={() => update('data', { ...d, deliveryMethod: opt.id })}
                />
                <div>
                  <div className="wf-radio-title">{opt.label}</div>
                  <div className="wf-radio-desc">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Field>
        <div className="wf-row-2">
          <Field label="Data contact name" required hint="The person who prepares the monthly file">
            <input className="wf-input" value={d.contactName} onChange={(e) => update('data', { ...d, contactName: e.target.value })} />
          </Field>
          <Field label="Contact email" required>
            <input className="wf-input" type="email" value={d.contactEmail} onChange={(e) => update('data', { ...d, contactEmail: e.target.value })} />
          </Field>
        </div>
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
