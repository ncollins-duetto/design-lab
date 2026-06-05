'use client'

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles'
import Menu from '@material-ui/core/Menu'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import HelpIcon from '@material-ui/icons/Help'
import NotificationsIcon from '@material-ui/icons/Notifications'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import DomainIcon from '@material-ui/icons/Domain'
import LayersIcon from '@material-ui/icons/Layers'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import { MOCK_PROPERTIES, MOCK_PROPERTY_GROUPS, ALL_PROPERTIES } from '@/lib/mock/properties'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', hasDropdown: false },
  { id: 'advance', label: 'Advance', hasDropdown: false },
  { id: 'pricing-strategy', label: 'Pricing & Strategy', hasDropdown: true },
  { id: 'forecasts-budgets', label: 'Forecasts & Budgets', hasDropdown: true },
  { id: 'reports', label: 'Reports', hasDropdown: true },
  { id: 'groups', label: 'Groups', hasDropdown: true },
  { id: 'tour-operator', label: 'Tour Operator', hasDropdown: false },
  { id: 'onboarding', label: 'Onboarding', hasDropdown: false },
]

const PICKER_TEAL = '#006461'

export interface AppShellProps {
  activeNav?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  pageTitle?: string
  defaultPropertyId?: string
  onPropertyChange?: (id: string, name: string) => void
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
    height: 40,
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
      height: 20,
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'stretch',
    flex: 1,
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
    gap: 2,
    borderBottom: '2px solid transparent',
    whiteSpace: 'nowrap',
    '&:hover': {
      background: (theme.palette as any).header?.navItemHoverBackground ?? 'rgba(255,255,255,0.1)',
    },
  },
  navItemActive: {
    background: (theme.palette as any).header?.navItemActiveBackground ?? '#c4ff45',
    color: (theme.palette as any).header?.navItemActiveTextStageDemo ?? '#4f5b60',
    fontWeight: 400,
    '&:hover': {
      background: (theme.palette as any).header?.navItemActiveBackground ?? '#c4ff45',
    },
  },
  navDropdownIcon: {
    fontSize: 16,
    opacity: 0.7,
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
  secondaryBar: {
    background: (theme.palette as any).header?.secondaryBarBackground ?? theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: 32,
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    lineHeight: 1,
    padding: '0 24px',
  },
  breadcrumbLink: {
    color: (theme.palette as any).text?.link ?? '#006461',
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
      width: 12,
      height: 12,
    },
  },
  breadcrumbCurrent: {
    color: theme.palette.grey[700],
    fontWeight: 400,
  },
  propertyPickerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2),
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    borderLeft: `1px solid ${theme.palette.divider}`,
    fontSize: 13,
    fontFamily: 'inherit',
    color: theme.palette.text.primary,
    minWidth: 240,
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  pickerTriggerIcon: {
    fontSize: 18,
    color: PICKER_TEAL,
    flexShrink: 0,
  },
  pickerLabel: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  pickerChevron: {
    fontSize: 20,
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
  allPropertiesRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75, 2),
    cursor: 'pointer',
    gap: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  allPropertiesIcon: {
    fontSize: 18,
    color: PICKER_TEAL,
    flexShrink: 0,
  },
  rowText: {
    fontSize: 13,
    color: theme.palette.text.primary,
  },
  groupRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75, 1, 0.75, 2),
    cursor: 'pointer',
    gap: theme.spacing(1),
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  groupIcon: {
    fontSize: 18,
    color: PICKER_TEAL,
    flexShrink: 0,
  },
  groupLabel: {
    flex: 1,
    fontSize: 13,
    color: theme.palette.text.primary,
  },
  groupChevron: {
    fontSize: 18,
    color: theme.palette.text.secondary,
    transition: 'transform 150ms ease',
  },
  groupChevronOpen: {
    transform: 'rotate(180deg)',
  },
  nestedRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75, 2, 0.75, 5),
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  flatRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75, 2),
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  selectedItem: {
    fontWeight: 600,
    color: PICKER_TEAL,
  },
  content: {
    flex: 1,
    background: theme.palette.background.default,
  },
}))

export default function AppShell({
  activeNav = 'pricing-strategy',
  breadcrumbs = [],
  defaultPropertyId,
  onPropertyChange,
  children,
}: AppShellProps) {
  const classes = useStyles()
  const [selectedId, setSelectedId] = useState<string>(defaultPropertyId ?? MOCK_PROPERTIES[0].id)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const getLabel = (id: string) => {
    if (id === 'all') return ALL_PROPERTIES.name
    const group = MOCK_PROPERTY_GROUPS.find((g) => g.id === id)
    if (group) return group.name
    return MOCK_PROPERTIES.find((p) => p.id === id)?.name ?? ALL_PROPERTIES.name
  }

  const selectedLabel = getLabel(selectedId)

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      next.has(groupId) ? next.delete(groupId) : next.add(groupId)
      return next
    })
  }

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setAnchorEl(null)
    onPropertyChange?.(id, getLabel(id))
  }

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.primaryBar}>
          <div className={classes.logo}>
            <img src="/duetto-logo-green.svg" alt="Duetto" />
          </div>
          <nav className={classes.nav}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`${classes.navItem} ${item.id === activeNav ? classes.navItemActive : ''}`}
              >
                {item.label}
                {item.hasDropdown && <ExpandMoreIcon className={classes.navDropdownIcon} />}
              </div>
            ))}
          </nav>
          <div className={classes.utilities}>
            <div className={classes.utilityBtn}><NotificationsIcon /></div>
            <div className={classes.utilityBtn}><HelpIcon /></div>
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
                      <NavigateNextRoundedIcon />
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

            <button
              className={classes.propertyPickerBtn}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <DomainIcon className={classes.pickerTriggerIcon} />
              <span className={classes.pickerLabel}>{selectedLabel}</span>
              <ExpandMoreIcon className={classes.pickerChevron} />
            </button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              marginThreshold={0}
              PaperProps={{ style: { width: anchorEl?.offsetWidth, maxHeight: 400 } }}
              MenuListProps={{ disablePadding: true }}
            >
              {/* All Properties */}
              <div className={classes.allPropertiesRow} onClick={() => handleSelect('all')}>
                <AllInclusiveIcon className={classes.allPropertiesIcon} />
                <span className={`${classes.rowText} ${selectedId === 'all' ? classes.selectedItem : ''}`}>
                  All Properties
                </span>
              </div>

              {/* Accordion groups */}
              {MOCK_PROPERTY_GROUPS.map((group) => {
                const isOpen = expandedGroups.has(group.id)
                return (
                  <React.Fragment key={group.id}>
                    <div className={classes.groupRow} onClick={() => { handleSelect(group.id); toggleGroup(group.id) }}>
                      <LayersIcon className={classes.groupIcon} />
                      <span className={classes.groupLabel}>{group.name}</span>
                      <ExpandMoreIcon
                        className={`${classes.groupChevron} ${isOpen ? classes.groupChevronOpen : ''}`}
                      />
                    </div>
                    <Collapse in={isOpen} unmountOnExit>
                      {group.properties.map((prop) => (
                        <div key={prop.id} className={classes.nestedRow} onClick={() => handleSelect(prop.id)}>
                          <span className={`${classes.rowText} ${selectedId === prop.id ? classes.selectedItem : ''}`}>
                            {prop.name}
                          </span>
                        </div>
                      ))}
                    </Collapse>
                  </React.Fragment>
                )
              })}

              {/* All individual hotels */}
              <Divider />
              {MOCK_PROPERTIES.map((prop) => (
                <div key={prop.id} className={classes.flatRow} onClick={() => handleSelect(prop.id)}>
                  <span className={`${classes.rowText} ${selectedId === prop.id ? classes.selectedItem : ''}`}>
                    {prop.name}
                  </span>
                </div>
              ))}
            </Menu>
          </div>
        )}
      </header>

      <main className={classes.content}>
        {children}
      </main>
    </div>
  )
}
