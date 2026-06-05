'use client'

import { useState } from 'react'
import { ThemeProvider as MuiV5ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import ChatIcon from '@material-ui/icons/Chat'
import SettingsIcon from '@material-ui/icons/Settings'
import AppShell from '@/components/AppShell'
import { CalendarApp } from '@/components/tour-operator'
import { CalendarProvider } from '@/lib/tour-operator/context/CalendarContext'
import { appTheme } from '@/lib/tour-operator/theme/theme'

import '@/lib/tour-operator/styles/index.css'
import '@/lib/tour-operator/styles/calendar.css'
import '@/lib/tour-operator/styles/close-out.css'
import '@/lib/tour-operator/styles/weekly-grid.css'

type NavKey = 'dashboard' | 'contacts' | 'comms' | 'configuration'

const SIDE_NAV: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'contacts', label: 'Contacts & Contracts', icon: <PeopleIcon /> },
  { key: 'comms', label: 'Communications & Notes', icon: <ChatIcon /> },
  { key: 'configuration', label: 'Configuration', icon: <SettingsIcon /> },
]

const useSideNavStyles = makeStyles((theme) => ({
  shell: {
    display: 'flex',
    minHeight: 'calc(100vh - 72px)',
    background: theme.palette.background.default,
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: '#ffffff',
    borderRight: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(1),
  },
  navList: {
    padding: 0,
  },
  navItem: {
    padding: theme.spacing(1.25, 2),
    color: theme.palette.text.primary,
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  navItemActive: {
    background: 'rgba(0, 100, 97, 0.08)',
    borderLeftColor: '#006461',
    color: '#006461',
    fontWeight: 600,
    '& .MuiListItemIcon-root': {
      color: '#006461',
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: '#006461',
    },
  },
  navIcon: {
    minWidth: 36,
    color: theme.palette.text.secondary,
  },
  main: {
    flex: 1,
    minWidth: 0,
    overflow: 'auto',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3, 1),
    background: theme.palette.background.default,
  },
  pageTitle: {
    fontWeight: 600,
    lineHeight: 1.4,
    color: theme.palette.text.secondary,
  },
  contentWrapper: {
    padding: theme.spacing(3),
    background: theme.palette.background.default,
    flex: 1,
    minWidth: 0,
    overflow: 'auto',
  },
  calendarCard: {
    background: '#ffffff',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  pageFooter: {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
}))

export default function TourOperatorPage() {
  const classes = useSideNavStyles()
  const [active, setActive] = useState<NavKey>('dashboard')

  return (
    <AppShell
      activeNav="tour-operator"
      breadcrumbs={[
        { label: 'Special Projects', href: '/' },
        { label: 'Tour Operator' },
      ]}
    >
      <div className={classes.shell}>
        <aside className={classes.sidebar}>
          <List className={classes.navList} component="nav">
            {SIDE_NAV.map((item) => (
              <ListItem
                key={item.key}
                button
                onClick={() => setActive(item.key)}
                className={`${classes.navItem} ${active === item.key ? classes.navItemActive : ''}`}
              >
                <ListItemIcon className={classes.navIcon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </aside>

        <main className={classes.main}>
          {active === 'dashboard' ? (
            <>
              <div className={classes.pageHeader}>
                <Typography variant="h6" className={classes.pageTitle}>
                  Tour Operator Calendar
                </Typography>
              </div>

              <div className={classes.contentWrapper}>
                <div className={classes.calendarCard}>
                  <MuiV5ThemeProvider theme={appTheme}>
                    <CssBaseline />
                    <CalendarProvider>
                      <Box
                        component="div"
                        className="calendar-page"
                        sx={{ minHeight: '100%', p: 3 }}
                        id="calendar-root"
                      >
                        <CalendarApp />
                      </Box>
                    </CalendarProvider>
                  </MuiV5ThemeProvider>
                </div>
              </div>

              <div className={classes.pageFooter}>
                Legend: Green = available, Red = sold out, Gray = closed for sales
              </div>
            </>
          ) : (
            <Box sx={{ p: 6, color: 'text.secondary' }}>
              {SIDE_NAV.find((n) => n.key === active)?.label} — coming soon.
            </Box>
          )}
        </main>
      </div>
    </AppShell>
  )
}
