'use client'

import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export type TileDecoration =
  | 'rates'
  | 'sales-room'
  | 'min-max'
  | 'design-system'
  | 'group'
  | 'resorts'
  | 'pricing'
  | 'exploration'
  | 'tour-operator'

export interface TileProps {
  href: string
  caption?: string
  heroTitle: string
  heroSubtitle?: string
  footerTitle: string
  footerSub: string
  description?: string
  decoration: TileDecoration
}

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  card: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    transition: 'box-shadow 150ms ease, transform 150ms ease',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
      transform: 'translateY(-2px)',
    },
  },
  hero: {
    position: 'relative',
    background: '#0e2a2c',
    color: '#c4ff45',
    height: 216,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(3),
    right: theme.spacing(3),
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1.2,
    color: '#c4ff45',
  },
  subtitle: {
    display: 'block',
    fontWeight: 700,
  },
  decorationWrap: {
    position: 'absolute',
    bottom: theme.spacing(2) - 4,
    right: theme.spacing(2),
    width: 160,
    height: 160,
    filter: 'drop-shadow(0 6px 24px rgba(196,255,69,0.25))',
  },
  caption: {
    position: 'absolute',
    left: theme.spacing(3) + 4,
    bottom: 50,
    fontSize: 12,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#c4ff45',
    opacity: 0.7,
    fontWeight: 600,
  },
  logo: {
    position: 'absolute',
    bottom: theme.spacing(2) + 4,
    left: theme.spacing(3),
    height: 22,
    display: 'block',
  },
  footer: {
    padding: theme.spacing(2, 2.5),
    borderTop: `1px solid ${theme.palette.divider}`,
    background: '#fff',
  },
  footerDescription: {
    fontSize: 15,
    color: theme.palette.text.primary,
    lineHeight: 1.5,
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    marginBottom: theme.spacing(0.75),
  },
  footerSub: {
    fontSize: 12,
    color: theme.palette.text.hint,
  },
}))

function Decoration({ kind }: { kind: TileDecoration }) {
  if (kind === 'rates') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-rates" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-rates)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="3">
          <rect x="36" y="46" width="58" height="58" rx="10" />
          <rect x="106" y="76" width="42" height="42" rx="8" />
          <rect x="70" y="118" width="50" height="50" rx="9" />
        </g>
      </svg>
    )
  }
  if (kind === 'sales-room') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-sr" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-sr)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="3">
          <circle cx="78" cy="108" r="42" />
          <circle cx="128" cy="78" r="30" />
          <circle cx="138" cy="124" r="18" />
        </g>
      </svg>
    )
  }
  if (kind === 'group') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-grp" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-grp)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="3">
          <circle cx="80" cy="86" r="22" />
          <circle cx="120" cy="86" r="22" />
          <circle cx="100" cy="124" r="22" />
        </g>
      </svg>
    )
  }
  if (kind === 'resorts') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-res" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-res)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="3">
          <polygon points="50,140 100,60 150,140" />
          <polygon points="80,140 120,80 150,140" />
          <line x1="40" y1="146" x2="160" y2="146" />
        </g>
      </svg>
    )
  }
  if (kind === 'pricing') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-prc" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-prc)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="3" strokeLinecap="round">
          <polyline points="48,150 78,108 108,128 152,60" />
          <polyline points="146,60 152,60 152,80" />
        </g>
      </svg>
    )
  }
  if (kind === 'min-max') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-mm" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-mm)" />
        <g stroke="#c4ff45" strokeWidth="3" strokeLinecap="round" fill="none">
          <line x1="48" y1="140" x2="152" y2="140" />
          <line x1="48" y1="60" x2="152" y2="60" />
          <line x1="48" y1="56" x2="48" y2="144" strokeWidth="2" />
          <line x1="152" y1="56" x2="152" y2="144" strokeWidth="2" />
          <circle cx="80" cy="100" r="8" fill="#c4ff45" />
          <circle cx="120" cy="100" r="8" fill="#c4ff45" />
          <line x1="88" y1="100" x2="112" y2="100" />
        </g>
      </svg>
    )
  }
  if (kind === 'tour-operator') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-to" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-to)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="2.5">
          {/* Hotel building */}
          <rect x="50" y="70" width="70" height="70" rx="4" />
          {/* Door */}
          <rect x="78" y="128" width="12" height="12" rx="1" />
          {/* Windows - row 1 */}
          <rect x="58" y="80" width="10" height="10" rx="1" />
          <rect x="75" y="80" width="10" height="10" rx="1" />
          <rect x="92" y="80" width="10" height="10" rx="1" />
          {/* Windows - row 2 */}
          <rect x="58" y="98" width="10" height="10" rx="1" />
          <rect x="75" y="98" width="10" height="10" rx="1" />
          <rect x="92" y="98" width="10" height="10" rx="1" />
          {/* Windows - row 3 */}
          <rect x="58" y="116" width="10" height="10" rx="1" />
          <rect x="92" y="116" width="10" height="10" rx="1" />
          {/* Roof peak */}
          <polyline points="50,70 85,50 120,70" />
          {/* Palm tree */}
          <line x1="125" y1="130" x2="125" y2="100" strokeLinecap="round" />
          <path d="M 125 100 Q 115 92 110 95" />
          <path d="M 125 100 Q 135 92 140 95" />
          <path d="M 125 105 Q 115 100 110 105" />
          <path d="M 125 105 Q 135 100 140 105" />
        </g>
      </svg>
    )
  }
  if (kind === 'exploration') {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rg-exp" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fbf2e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#rg-exp)" />
        <g fill="none" stroke="#c4ff45" strokeWidth="3">
          <circle cx="92" cy="92" r="32" />
          <line x1="116" y1="116" x2="150" y2="150" strokeLinecap="round" />
        </g>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rg-ds" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#c4ff45" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#7fbf2e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0e2a2c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#rg-ds)" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#c4ff45" strokeWidth="2.5" />
      <path d="M100 40 L100 160 M40 100 L160 100" stroke="#0e2a2c" strokeWidth="14" />
    </svg>
  )
}

export default function Tile(props: TileProps) {
  const classes = useStyles()
  return (
    <a href={props.href} className={classes.link}>
      <Box className={classes.card}>
        <Box className={classes.hero}>
          <span className={classes.title}>
            {props.heroTitle}
            {props.heroSubtitle ? <span className={classes.subtitle}>{props.heroSubtitle}</span> : null}
          </span>
          <Box className={classes.decorationWrap}>
            <Decoration kind={props.decoration} />
          </Box>
          {props.caption ? <span className={classes.caption}>{props.caption} Team</span> : null}
          <img src="/duetto-logo-green.svg" alt="Duetto" className={classes.logo} />
        </Box>
        <Box className={classes.footer}>
          {props.description ? (
            <span className={classes.footerDescription}>{props.description}</span>
          ) : null}
          <span className={classes.footerSub}>{props.footerSub}</span>
        </Box>
      </Box>
    </a>
  )
}
