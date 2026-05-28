'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Checkbox,
  Divider,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AppShell from '@/components/AppShell'
import TableSettingIcon from '@/components/TableSettingIcon'
import { MRX_CELL_ACTIVE } from '@/components/manage-rates/cellRenderers'
import dynamic from 'next/dynamic'
const MultiRatesTable = dynamic(() => import('@/components/manage-rates/MultiRatesTable'), { ssr: false })
import TableSettingsModal, { loadVisibleCols } from '@/components/manage-rates/TableSettingsModal'
import {
  ColKey,
  generateRowData,
  getWeekDates,
  MOCK_PROPERTIES,
  DEFAULT_VISIBLE_COLS,
} from '@/lib/mock/rates'
import { MOCK_PROPERTY_GROUPS } from '@/lib/mock/properties'

const INITIAL_START = '2025-07-17'
const MAX_PROPERTIES = 10

function fmtShort(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

function shiftIso(iso: string, days: number) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const useStyles = makeStyles((theme) => ({
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3, 1),
    background: theme.palette.background.default,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(1),
  },
  pageTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
    color: (theme.palette as any).text?.secondary ?? '#4f5b60',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  dateBtn: {
    height: '2.25rem',
    border: `1px solid ${theme.palette.grey[300]}`,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
      border: `1px solid ${theme.palette.grey[400]}`,
    },
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 3),
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  propertySelect: {
    minWidth: 280,
    fontSize: 14,
    background: theme.palette.background.paper,
    borderRadius: 4,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[400],
    },
  },
  controlsDivider: {
    height: 18,
    margin: theme.spacing(0, 1),
  },
  navButton: {
    fontSize: 13,
    '&:hover': { backgroundColor: 'transparent' },
  },
  tableContainer: {
    flex: 1,
    overflowX: 'auto',
    overflowY: 'auto',
    background: theme.palette.background.paper,
  },
  menuItem: {
    '&.Mui-selected': {
      backgroundColor: 'transparent',
    },
    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  menuItemCheckbox: {
    padding: '0 8px 0 0',
  },
  menuItemText: {
    fontSize: 13,
  },
}))

export default function ManageRatesMultiPage() {
  const classes = useStyles()
  const router = useRouter()

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(DEFAULT_VISIBLE_COLS)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeCells, setActiveCells] = useState<Set<string>>(new Set())
  const [startDate, setStartDate]     = useState(INITIAL_START)
  const [collapsed, setCollapsed]     = useState(true)

  const dates    = useMemo(() => getWeekDates(startDate, 7), [startDate])
  const dateLabel = useMemo(() => {
    const end = dates[dates.length - 1]
    return `${fmtShort(startDate)} – ${fmtShort(end)}`
  }, [startDate, dates])

  // Track which cells are "active" (accepted recommendation or filled override)
  useEffect(() => {
    const handler = (e: Event) => {
      const { cellId, active } = (e as CustomEvent<{ cellId: string; active: boolean }>).detail
      setActiveCells((prev) => {
        const next = new Set(prev)
        if (active) next.add(cellId)
        else next.delete(cellId)
        return next
      })
    }
    window.addEventListener(MRX_CELL_ACTIVE, handler)
    return () => window.removeEventListener(MRX_CELL_ACTIVE, handler)
  }, [])
  const [selectedPropertyName, setSelectedPropertyName] = useState<string>('All Properties')
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>(
    MOCK_PROPERTIES.slice(0, 10).map((p) => p.id)
  )

  // Rehydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setVisibleCols(loadVisibleCols())
  }, [])

  const rowData = useMemo(
    () => generateRowData(dates).filter((r) => selectedHotelIds.includes(r.hotelId as string)),
    [dates, selectedHotelIds]
  )

  const selectedCount = selectedHotelIds.length

  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Pricing & Strategy', href: '/pricing-strategy' },
        { label: 'Manage Rates' },
      ]}
      defaultPropertyId="all"
      onPropertyChange={(id, name) => {
        const group = MOCK_PROPERTY_GROUPS.find((g) => g.id === id)
        if (group) {
          setSelectedPropertyName(name)
          setSelectedHotelIds(group.properties.map((p) => p.id))
        } else if (id === 'all') {
          setSelectedPropertyName(name)
          setSelectedHotelIds(MOCK_PROPERTIES.map((p) => p.id))
        } else {
          router.push('/manage-rates')
        }
      }}
    >
      {/* Page header */}
      <div className={classes.pageHeader}>
        <div className={classes.titleRow}>
          <Typography className={classes.pageTitle}>
            Manage Rates — {selectedPropertyName}
          </Typography>
        </div>
        <div className={classes.actions}>
          <Button variant="contained" color="primary" disabled={activeCells.size === 0}>
            Review &amp; Publish
          </Button>
          <Button variant="text" startIcon={<TableSettingIcon />} onClick={() => setSettingsOpen(true)}>
            Table settings
          </Button>
          <Button
            variant="outlined"
            endIcon={<CalendarTodayIcon fontSize="small" />}
            className={classes.dateBtn}
          >
            {dateLabel}
          </Button>
        </div>
      </div>

      {/* Property picker + table controls row */}
      <div className={classes.subHeader}>
        <Select
          multiple
          value={selectedHotelIds}
          className={classes.propertySelect}
          variant="outlined"
          IconComponent={ExpandMoreIcon}
          SelectDisplayProps={{ style: { paddingTop: 8, paddingBottom: 8, fontSize: 14 } }}
          renderValue={(selected) => {
            const ids = selected as string[]
            return `${ids.length} ${ids.length === 1 ? 'property' : 'properties'} selected`
          }}
          onChange={(e) => {
            const value = e.target.value as string[]
            if (value.length <= MAX_PROPERTIES) setSelectedHotelIds(value)
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 360,
                background: '#fff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              },
            },
            getContentAnchorEl: null,
            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            transformOrigin: { vertical: 'top', horizontal: 'left' },
            marginThreshold: 0,
          }}
        >
          {MOCK_PROPERTIES.map((prop) => (
            <MenuItem key={prop.id} value={prop.id} dense className={classes.menuItem}>
              <Checkbox
                checked={selectedHotelIds.includes(prop.id)}
                size="small"
                color="primary"
                className={classes.menuItemCheckbox}
              />
              <ListItemText
                primary={prop.name}
                primaryTypographyProps={{ className: classes.menuItemText }}
              />
            </MenuItem>
          ))}
          {selectedHotelIds.length >= MAX_PROPERTIES && (
            <MenuItem disabled dense>
              <Typography variant="caption" color="error">
                Max {MAX_PROPERTIES} properties
              </Typography>
            </MenuItem>
          )}
        </Select>

        {/* Table navigation controls */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            size="small"
            color="primary"
            className={classes.navButton}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? 'Expand all days' : 'Collapse all days'}
          </Button>
          <Divider orientation="vertical" className={classes.controlsDivider} />
          <Button
            size="small"
            color="primary"
            className={classes.navButton}
            startIcon={<ChevronLeftIcon fontSize="small" />}
            onClick={() => setStartDate((d) => shiftIso(d, -7))}
          >
            Previous 7 days
          </Button>
          <Button
            size="small"
            color="primary"
            className={classes.navButton}
            endIcon={<ChevronRightIcon fontSize="small" />}
            onClick={() => setStartDate((d) => shiftIso(d, 7))}
          >
            Next 7 days
          </Button>
        </div>
      </div>

      {/* AG Grid table */}
      <div className={classes.tableContainer}>
        <MultiRatesTable
          dates={dates}
          rowData={rowData}
          visibleCols={visibleCols}
          collapsed={collapsed}
        />
      </div>

      {/* Table Settings modal */}
      <TableSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        visibleCols={visibleCols}
        onConfirm={(cols) => setVisibleCols(cols)}
      />
    </AppShell>
  )
}
