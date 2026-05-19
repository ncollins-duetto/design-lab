'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Checkbox,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import PublishIcon from '@material-ui/icons/Publish'
import TuneIcon from '@material-ui/icons/Tune'
import DateRangeIcon from '@material-ui/icons/DateRange'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AppShell from '@/components/AppShell'
import MultiRatesTable from '@/components/manage-rates/MultiRatesTable'
import TableSettingsModal, { loadVisibleCols } from '@/components/manage-rates/TableSettingsModal'
import {
  ColKey,
  generateRowData,
  getWeekDates,
  MOCK_PROPERTIES,
  MOCK_PROPERTY_GROUPS,
} from '@/lib/mock/rates'

const START_DATE = '2025-07-17'
const DATES = getWeekDates(START_DATE, 7)
const DATE_LABEL = '07/17/2025 – 07/23/2025'
const MAX_PROPERTIES = 10

const useStyles = makeStyles((theme) => ({
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: '#fff',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  publishBtn: {
    background: '#006461',
    color: '#fff',
    fontWeight: 600,
    '&:hover': { background: '#004d4a' },
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tableSettingsBtn: {
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    fontWeight: 400,
    fontSize: 13,
  },
  dateBtn: {
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    fontWeight: 400,
    fontSize: 13,
  },
  subHeader: {
    padding: theme.spacing(1.5, 3),
    background: '#fff',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  propertySelect: {
    minWidth: 200,
    fontSize: 14,
    '& .MuiSelect-root': {
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
  tableContainer: {
    flex: 1,
    overflowX: 'auto',
    overflowY: 'auto',
    padding: theme.spacing(0),
    background: '#fff',
  },
  selectedCount: {
    fontSize: 13,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1),
  },
}))

export default function ManageRatesMultiPage() {
  const classes = useStyles()

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(DEFAULT_VISIBLE_COLS)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>(
    MOCK_PROPERTIES.slice(0, 10).map((p) => p.id)
  )

  // Rehydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setVisibleCols(loadVisibleCols())
  }, [])

  const rowData = useMemo(
    () => generateRowData(DATES).filter((r) => selectedHotelIds.includes(r.hotelId as string)),
    [selectedHotelIds]
  )

  const selectedCount = selectedHotelIds.length

  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Pricing & Strategy', href: '/' },
        { label: 'Manage Rates' },
      ]}
      propertyLabel={
        selectedCount === MOCK_PROPERTIES.length
          ? 'All Properties'
          : `${selectedCount} properties selected`
      }
    >
      {/* Page header */}
      <div className={classes.pageHeader}>
        <div className={classes.titleRow}>
          <Typography variant="h5" style={{ fontWeight: 600, fontSize: 20 }}>
            Manage Rates
          </Typography>
        </div>
        <div className={classes.actions}>
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            className={classes.publishBtn}
            disableElevation
          >
            Review &amp; Publish
          </Button>
          <Button
            variant="outlined"
            startIcon={<TuneIcon style={{ fontSize: 16 }} />}
            className={classes.tableSettingsBtn}
            onClick={() => setSettingsOpen(true)}
          >
            Table settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<DateRangeIcon style={{ fontSize: 16 }} />}
            className={classes.dateBtn}
          >
            {DATE_LABEL}
          </Button>
        </div>
      </div>

      {/* Property picker row */}
      <div className={classes.subHeader}>
        <Select
          multiple
          value={selectedHotelIds}
          className={classes.propertySelect}
          variant="outlined"
          IconComponent={ExpandMoreIcon}
          renderValue={(selected) => {
            const ids = selected as string[]
            if (ids.length === MOCK_PROPERTIES.length) return 'All Properties'
            return `${ids.length} properties selected`
          }}
          onChange={(e) => {
            const value = e.target.value as string[]
            if (value.length <= MAX_PROPERTIES) setSelectedHotelIds(value)
          }}
          MenuProps={{ PaperProps: { style: { maxHeight: 360 } } }}
        >
          {MOCK_PROPERTY_GROUPS.map((group) => [
            <MenuItem key={`group-${group.id}`} disabled style={{ opacity: 1 }}>
              <Typography variant="caption" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                {group.name}
              </Typography>
            </MenuItem>,
            ...group.properties.map((prop) => (
              <MenuItem key={prop.id} value={prop.id} dense>
                <Checkbox
                  checked={selectedHotelIds.includes(prop.id)}
                  size="small"
                  color="primary"
                  style={{ padding: '0 8px 0 0' }}
                />
                <ListItemText primary={prop.name} primaryTypographyProps={{ style: { fontSize: 13 } }} />
              </MenuItem>
            )),
          ])}
          {selectedHotelIds.length >= MAX_PROPERTIES && (
            <MenuItem disabled dense>
              <Typography variant="caption" color="error">
                Max {MAX_PROPERTIES} properties
              </Typography>
            </MenuItem>
          )}
        </Select>
      </div>

      {/* AG Grid table */}
      <div className={classes.tableContainer}>
        <MultiRatesTable
          dates={DATES}
          rowData={rowData}
          visibleCols={visibleCols}
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
