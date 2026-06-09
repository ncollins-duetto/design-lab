import StepShell from '../StepShell'
import { useOnboarding } from '../OnboardingContext'

export default function LaunchStep() {
  const { state } = useOnboarding()
  const property = state.property.name || '[your property]'
  return (
    <StepShell
      stepId="launch"
      why={<p>You’ve given us everything we need to bring {property} live on HotStats. Here’s what happens from here.</p>}
      behindScenes={
        <ul>
          <li>Our data team contacts {state.data.contactName || 'your data contact'} within 1 business day to set up the first file transfer.</li>
          <li>Your competitive set is created in the reporting platform.</li>
          <li>Invitations go out to your team.</li>
          <li>Your first benchmark report is ready within 5 business days of the first data file arriving.</li>
        </ul>
      }
    >
      <div className="wf-card wf-card-lg wf-launch-card">
        <p className="wf-card-title">You’re all set</p>
        <h2 className="wf-launch-title">Submission received</h2>
        <p className="wf-launch-sub">
          We’ve emailed a copy of everything you provided to {state.company.billingEmail || 'your billing contact'} for your records.
        </p>
        <div className="wf-launch-timeline">
          <TimelineItem when="Today" what="Onboarding submitted" />
          <TimelineItem when="Within 1 business day" what="Data team makes contact" />
          <TimelineItem when="Within 3 business days" what="Competitive set activated" />
          <TimelineItem when="Within 5 business days of first data file" what="First report ready" />
        </div>
      </div>
    </StepShell>
  )
}

function TimelineItem({ when, what }: { when: string; what: string }) {
  return (
    <div className="wf-tl-item">
      <div className="wf-tl-when">{when}</div>
      <div className="wf-tl-what">{what}</div>
    </div>
  )
}
