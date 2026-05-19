'use client'

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import BusinessIcon from '@material-ui/icons/Business'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

// Nav items matching the real Duetto app structure
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'advance', label: 'Advance' },
  { id: 'pricing-strategy', label: 'Pricing & Strategy' },
  { id: 'scoreboard', label: 'Scoreboard' },
  { id: 'command-center', label: 'Command Center' },
]

export interface AppShellProps {
  activeNav?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  pageTitle?: string
  propertyLabel?: string
  children: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    background: (theme.palette as any).header?.background ?? '#0e2124',
    color: '#fff',
    flexShrink: 0,
  },
  primaryBar: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    gap: theme.spacing(0.5),
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    flexShrink: 0,
    '& img': {
      height: 22,
      filter: 'brightness(0) invert(1)',
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'stretch',
    flex: 1,
    gap: 2,
    height: '100%',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    fontSize: 13,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    height: '100%',
    borderBottom: '2px solid transparent',
    transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
    '&:hover': {
      background: (theme.palette as any).header?.navItemHoverBackground ?? 'rgba(255,255,255,0.1)',
    },
  },
  navItemActive: {
    background: (theme.palette as any).header?.navItemActiveBackground ?? '#c4ff45',
    color: (theme.palette as any).header?.navItemActiveText ?? '#0e2124',
    fontWeight: 700,
    '&:hover': {
      background: (theme.palette as any).header?.navItemActiveBackground ?? '#c4ff45',
    },
  },
  utilities: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  utilityBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 4,
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.85)',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
    '& svg': {
      fontSize: 20,
    },
  },
  propertyPicker: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '0 8px',
    height: 32,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(255,255,255,0.2)',
    marginRight: theme.spacing(1),
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
    '& svg': {
      fontSize: 16,
    },
  },
  secondaryBar: {
    background: (theme.palette as any).header?.secondaryBarBackground ?? '#fff',
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '0 16px',
    height: 36,
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
  },
  breadcrumbLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  breadcrumbSep: {
    color: theme.palette.text.disabled,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fontSize: 16,
    },
  },
  breadcrumbCurrent: {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
  content: {
    flex: 1,
    background: theme.palette.background.default,
  },
}))

export default function AppShell({
  activeNav = 'pricing-strategy',
  breadcrumbs = [],
  propertyLabel = 'All Properties',
  children,
}: AppShellProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.primaryBar}>
          <div className={classes.logo}>
            <img src="/duetto-logo.svg" alt="Duetto" />
          </div>
          <nav className={classes.nav}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`${classes.navItem} ${item.id === activeNav ? classes.navItemActive : ''}`}
              >
                {item.label}
              </div>
            ))}
          </nav>
          <div className={classes.utilities}>
            <div className={classes.propertyPicker}>
              <BusinessIcon />
              {propertyLabel}
              <ExpandMoreIcon />
            </div>
            <div className={classes.utilityBtn}><HelpOutlineIcon /></div>
            <div className={classes.utilityBtn}><NotificationsNoneIcon /></div>
            <div className={classes.utilityBtn}><SettingsIcon /></div>
            <div className={classes.utilityBtn}><AccountCircleIcon /></div>
          </div>
        </div>

        {breadcrumbs.length > 0 && (
          <div className={classes.secondaryBar}>
            <div className={classes.breadcrumbs}>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className={classes.breadcrumbSep}>
                      <ChevronRightIcon />
                    </span>
                  )}
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <a href={crumb.href} className={classes.breadcrumbLink}>
                      {crumb.label}
                    </a>
                  ) : (
                    <span className={classes.breadcrumbCurrent}>{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className={classes.content}>
        {children}
      </main>
    </div>
  )
}
