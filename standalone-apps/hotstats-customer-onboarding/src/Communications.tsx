export interface Channel {
  icon: string
  label: string
  description: string
  href?: string
  action?: string
}

const CHANNELS: Channel[] = [
  {
    icon: '✉',
    label: 'Email support',
    description: 'onboarding@hotstats.com',
    href: 'mailto:onboarding@hotstats.com',
  },
  {
    icon: '📅',
    label: 'Schedule a call',
    description: 'Get a 20-minute walkthrough',
    href: '#',
  },
  {
    icon: '📖',
    label: 'Documentation',
    description: 'Read the guide',
    href: '#',
  },
  {
    icon: '💬',
    label: 'Get help',
    description: 'Contact our team',
    href: '#',
  },
]

export default function Communications() {
  return (
    <div className="wf-communications-section">
      <div className="wf-comm-header">
        <p className="wf-card-title">Get support</p>
        <p className="wf-comm-subtitle">We're here to help</p>
      </div>
      <div className="wf-comm-grid">
        {CHANNELS.map((ch) => (
          <a
            key={ch.label}
            href={ch.href || '#'}
            className="wf-comm-card"
            onClick={(e) => {
              if (!ch.href || ch.href === '#') e.preventDefault()
            }}
          >
            <div className="wf-comm-icon">{ch.icon}</div>
            <div className="wf-comm-body">
              <div className="wf-comm-label">{ch.label}</div>
              <div className="wf-comm-desc">{ch.description}</div>
            </div>
            <div className="wf-comm-arrow">→</div>
          </a>
        ))}
      </div>
    </div>
  )
}
