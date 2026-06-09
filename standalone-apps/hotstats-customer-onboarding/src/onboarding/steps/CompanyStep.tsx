import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

export default function CompanyStep() {
  const { state, update } = useOnboarding()
  const c = state.company
  return (
    <StepShell
      stepId="company"
      dependencies={['Legal company name (must match the signed agreement)', 'Billing email that receives invoices', 'Country of registration']}
      why={
        <>
          <p>We use these details to issue your invoice and link the contract you’ve already signed to your live HotStats account.</p>
          <p>If your trading name is different from the legal entity, share both — invoices will show the legal one.</p>
        </>
      }
      behindScenes={
        <ul>
          <li>We match the legal name to your signed agreement.</li>
          <li>An invoice is queued automatically once you finish onboarding.</li>
          <li>Your billing contact gets a confirmation email when the account is created.</li>
        </ul>
      }
    >
      <div className="wf-form">
        <Field label="Legal company name" required hint="As it appears on your contract">
          <input className="wf-input" value={c.legalName} onChange={(e) => update('company', { ...c, legalName: e.target.value })} />
        </Field>
        <Field label="Trading name (if different)">
          <input className="wf-input" value={c.tradingName} onChange={(e) => update('company', { ...c, tradingName: e.target.value })} />
        </Field>
        <Field label="Country of registration" required>
          <input className="wf-input" value={c.country} onChange={(e) => update('company', { ...c, country: e.target.value })} />
        </Field>
        <Field label="Billing email" required hint="Invoices and renewal reminders go here">
          <input className="wf-input" type="email" value={c.billingEmail} onChange={(e) => update('company', { ...c, billingEmail: e.target.value })} />
        </Field>
        <Field label="VAT / tax ID" hint="Optional, but recommended for EU customers">
          <input className="wf-input" value={c.vatNumber} onChange={(e) => update('company', { ...c, vatNumber: e.target.value })} />
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
