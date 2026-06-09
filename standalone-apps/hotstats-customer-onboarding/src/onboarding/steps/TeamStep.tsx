import { useState } from 'react'
import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

type Role = 'admin' | 'analyst' | 'viewer'

const ROLE_DESC: Record<Role, string> = {
  admin: 'Full access, can invite others, edit billing and competitive set.',
  analyst: 'Can view all reports and create custom views. Cannot manage users.',
  viewer: 'Read-only access to dashboards. Best for executives or stakeholders.',
}

export default function TeamStep() {
  const { state, update } = useOnboarding()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('analyst')

  const add = () => {
    if (!email.trim()) return
    update('team', [...state.team, { email: email.trim(), role }])
    setEmail('')
  }
  const remove = (e: string) => update('team', state.team.filter((m) => m.email !== e))

  return (
    <StepShell
      stepId="team"
      dependencies={['Email of at least one user', 'A role for each invitee']}
      why={
        <>
          <p>Add the people who need to see your HotStats reports. Each person receives an email invitation with their own login — never share credentials.</p>
        </>
      }
      behindScenes={
        <ul>
          <li>Each invitation expires after 7 days; we’ll send reminders.</li>
          <li>You can add, remove or change roles at any time from Settings.</li>
          <li>The first admin (you) is set up automatically using your contract contact.</li>
        </ul>
      }
    >
      <div className="wf-form">
        <Field label="Email">
          <div className="wf-row-inline">
            <input
              className="wf-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@yourcompany.com"
            />
            <select className="wf-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
            </select>
            <button type="button" className="wf-btn" onClick={add}>Invite</button>
          </div>
          <p className="wf-hint">{ROLE_DESC[role]}</p>
        </Field>

        <div className="wf-card">
          <p className="wf-card-title">Invitations to send ({state.team.length})</p>
          {state.team.length === 0 && (
            <p className="wf-empty">No one added yet. You can add yourself if you’re unsure.</p>
          )}
          <ul className="wf-comp-list">
            {state.team.map((m) => (
              <li key={m.email}>
                <span className="wf-comp-name">{m.email}</span>
                <span className="wf-tag wf-tag-ok">{m.role}</span>
                <button className="wf-link" onClick={() => remove(m.email)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StepShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="wf-field">
      <label className="wf-label">{label}</label>
      {children}
    </div>
  )
}
