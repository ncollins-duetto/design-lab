export interface Channel {
  type: 'email' | 'phone' | 'chat' | 'calendar'
  label: string
  value: string
  href?: string
}

const CHANNELS: Channel[] = [
  { type: 'email', label: 'Email', value: 'onboarding@hotstats.com', href: 'mailto:onboarding@hotstats.com' },
]

export default function Communications() {
  return (
    <div className="wf-comms">
      <p className="wf-card-title">Need help?</p>
      <div className="wf-comms-list">
        {CHANNELS.map((ch) => {
          const content = ch.href ? (
            <a href={ch.href} className="wf-comms-link">{ch.value}</a>
          ) : (
            <span className="wf-comms-value">{ch.value}</span>
          )
          return (
            <div key={ch.type} className="wf-comms-item">
              <span className="wf-comms-label">{ch.label}:</span>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
