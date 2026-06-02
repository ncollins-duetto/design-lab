'use client'

import React, { useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { color2026 } from '@duetto/duetto-components'
import AppShell from '@/components/AppShell'

ModuleRegistry.registerModules([AllCommunityModule])

const useStyles = makeStyles((theme) => ({
  '@global': {
    '.ag-theme-alpine': {
      '--ag-header-background-color': '#ffffff',
      '--ag-header-foreground-color': '#4f5b60',
      '& .ag-header': {
        borderBottom: '1px solid #dde1e2',
      },
      '& .ag-header-cell': {
        background: '#ffffff !important',
        borderRight: 'none !important',
        '&.ag-pinned-left-header': {
          background: '#ffffff !important',
        },
      },
      '& .ag-header-cell-text': {
        fontWeight: 400,
        color: '#4f5b60',
        fontSize: 13,
      },
      '& .ag-cell': {
        borderRight: 'none !important',
        padding: '12px 16px !important',
        fontSize: 13,
        display: 'flex !important',
        alignItems: 'center',
      },
      '& .ag-cell.price-cell': {
        justifyContent: 'flex-end',
        color: '#1c1c1c',
      },
      '& .ag-cell.room-name-cell': {
        justifyContent: 'flex-start',
        color: '#1c1c1c',
        fontWeight: 400,
      },
      '& .ag-cell.bar-header-cell': {
        background: '#053c3c !important',
        color: '#ffffff !important',
        fontWeight: 700,
        fontSize: 13,
        padding: '8px 16px !important',
      },
      '& .ag-pinned-left-cols-container': {
        borderRight: 'none !important',
      },
      '& .ag-cell-last-left-pinned': {
        borderRight: 'none !important',
      },
      '& .ag-pinned-left-header': {
        background: '#ffffff !important',
        borderRight: 'none !important',
      },
      '& .ag-row': {
        borderBottom: 'none !important',
        '&.bar-row': {
          background: '#053c3c !important',
          borderBottom: 'none !important',
        },
        '&.min-row': {
          background: '#ffffff !important',
          borderTop: '1px solid #dde1e2 !important',
        },
        '&.max-row': {
          background: '#eef3f5 !important',
          '& .ag-cell.ag-cell-last-left-pinned': {
            visibility: 'hidden !important',
          },
        },
      },
      '& .ag-row.bar-row:hover': {
        background: '#053c3c !important',
      },
      '& .ag-row.min-row:hover, & .ag-row.max-row:hover': {
        background: '#f0f7fd !important',
      },
    },
  },
  container: {
    display: 'flex',
    height: '100%',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3),
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: (theme.palette as any).text?.primary ?? '#1c1c1c',
  },
  editBtn: {
    minWidth: 'auto',
    padding: theme.spacing(0.5, 1),
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: 240,
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
  },
  sidebarSection: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: (theme.palette as any).text?.primary ?? '#1c1c1c',
    marginBottom: theme.spacing(1),
  },
  sectionLink: {
    fontSize: '0.75rem',
    color: (theme.palette as any).primary?.main ?? '#006461',
    cursor: 'pointer',
    marginBottom: theme.spacing(0.5),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  checkbox: {
    padding: theme.spacing(0.5),
  },
  filterLabel: {
    fontSize: '0.875rem',
    marginLeft: theme.spacing(0.5),
  },
  tableWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: theme.spacing(2, 3),
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  seasonSelect: {
    minWidth: 215,
    fontFamily: 'Lato, sans-serif',
    fontSize: 14,
    fontWeight: 400,
    color: '#1c1c1c',
    background: '#ffffff',
    borderRadius: 4,
    '& .MuiSelect-root': {
      padding: '6px 4px 6px 8px',
      minHeight: 20,
      lineHeight: '20px',
      backgroundColor: '#ffffff',
      borderRadius: 4,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #dde1e2',
      borderRadius: 4,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #dde1e2',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #006461',
    },
    '& .Mui-disabled': {
      backgroundColor: '#f5f5f5',
      color: '#aeb4ba',
    },
    '& .MuiSelect-icon': {
      right: 4,
      color: '#1c1c1c',
      width: 24,
      height: 24,
    },
  },
  selectMenuPaper: {
    marginTop: 4,
    background: '#ffffff',
    border: '1px solid #dde1e2',
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    '& .MuiList-root': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      fontFamily: 'Lato, sans-serif',
      fontSize: 14,
      color: '#1c1c1c',
      padding: '8px 12px',
      minHeight: 'unset',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
      '&.Mui-selected': {
        backgroundColor: '#d7f7ed',
        '&:hover': {
          backgroundColor: '#5ceade',
        },
      },
      '&.Mui-disabled': {
        opacity: 1,
        fontSize: 11,
        fontWeight: 600,
        color: '#4f5b60',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        padding: '8px 12px 4px',
      },
    },
  },
  gridContainer: {
    flex: 1,
    width: '100%',
    minHeight: 400,
  },
}))

const MOCK_ROOM_TYPES = [
  'Deluxe',
  'Deluxe 2/3sin vistas',
  'Deluxe 2/3 vista mar',
  'Deluxe 4p sin vistas',
  'Deluxe 4p Vista Mar',
  'Deluxe Accessible',
  'Deluxe City View - C2V',
  'Deluxe Club San Juan',
  'Deluxe Twin',
  'Deluxe VM 5p',
  'Dexint',
  'Double Dusal Seaview',
]

const MOCK_PRICES = {
  'Deluxe': ['€1,800.00', '€5,000.00'],
  'Deluxe 2/3sin vistas': ['€1,800.00', '€5,000.00'],
  'Deluxe 2/3 vista mar': ['€2,000.00', '€5,400.00'],
  'Deluxe 4p sin vistas': ['€1,830.00', '€5,500.00'],
  'Deluxe 4p Vista Mar': ['€1,830.00', '€5,500.00'],
  'Deluxe Accessible': ['€1,830.00', '€5,500.00'],
  'Deluxe City View - C2V': ['€1,830.00', '€5,500.00'],
  'Deluxe Club San Juan': ['€1,830.00', '€5,500.00'],
  'Deluxe Twin': ['€1,830.00', '€5,500.00'],
  'Deluxe VM 5p': ['€1,830.00', '€5,500.00'],
  'Dexint': ['€1,830.00', '€5,500.00'],
  'Double Dusal Seaview': ['€1,830.00', '€5,500.00'],
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MinMaxOption2Page() {
  const classes = useStyles()
  const gridRef = useRef<AgGridReact>(null)
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set(MOCK_ROOM_TYPES))
  const [selectedSeason, setSelectedSeason] = useState('January 1 - December 31')

  const filteredRooms = useMemo(
    () => MOCK_ROOM_TYPES.filter((r) => selectedRooms.has(r)),
    [selectedRooms]
  )

  const toggleRoom = (room: string) => {
    const newSelected = new Set(selectedRooms)
    if (newSelected.has(room)) {
      newSelected.delete(room)
    } else {
      newSelected.add(room)
    }
    setSelectedRooms(newSelected)
  }

  const getSeasonPrices = (baseMin: string, baseMax: string): [string, string] => {
    // Parse price value
    const minVal = parseFloat(baseMin.replace(/[^0-9.]/g, ''))
    const maxVal = parseFloat(baseMax.replace(/[^0-9.]/g, ''))

    // Apply season multiplier
    let multiplier = 1
    if (selectedSeason === 'January 1 - April 31') {
      multiplier = 0.8
    } else if (selectedSeason === 'May 1 - September 31') {
      multiplier = 1.2
    } else if (selectedSeason === 'October 1 - December 31') {
      multiplier = 1.1
    }

    const newMin = (minVal * multiplier).toFixed(2)
    const newMax = (maxVal * multiplier).toFixed(2)
    return [`€${newMin}`, `€${newMax}`]
  }

  const rowData = useMemo(() => {
    const rows: Record<string, any>[] = []
    rows.push({
      roomType: 'BAR',
      isBarHeader: true,
      rowClass: 'bar-row',
    })
    filteredRooms.forEach((room) => {
      const basePrices = MOCK_PRICES[room as keyof typeof MOCK_PRICES]
      const [min, max] = getSeasonPrices(basePrices[0], basePrices[1])
      rows.push({
        roomType: room,
        sun: min, mon: min, tue: min, wed: min, thu: min, fri: min, sat: min,
        rowClass: 'min-row',
        isMinRow: true,
      })
      rows.push({
        roomType: '',
        sun: max, mon: max, tue: max, wed: max, thu: max, fri: max, sat: max,
        rowClass: 'max-row',
      })
    })
    return rows
  }, [filteredRooms, selectedSeason])

  const columnDefs = useMemo<any[]>(
    () => [
      {
        field: 'roomType',
        headerName: '',
        pinned: 'left',
        width: 220,
        cellClassRules: {
          'bar-header-cell': (p: any) => p.data?.isBarHeader,
          'room-name-cell': (p: any) => !p.data?.isBarHeader,
        },
        colSpan: (p: any) => (p.data?.isBarHeader ? 8 : 1),
        rowSpan: (p: any) => (p.data?.isMinRow ? 2 : 1),
      },
      { field: 'sun', headerName: 'Sun', width: 120, cellClass: 'price-cell' },
      { field: 'mon', headerName: 'Mon', width: 120, cellClass: 'price-cell' },
      { field: 'tue', headerName: 'Tue', width: 120, cellClass: 'price-cell' },
      { field: 'wed', headerName: 'Wed', width: 120, cellClass: 'price-cell' },
      { field: 'thu', headerName: 'Thu', width: 120, cellClass: 'price-cell' },
      { field: 'fri', headerName: 'Fri', width: 120, cellClass: 'price-cell' },
      { field: 'sat', headerName: 'Sat', width: 120, cellClass: 'price-cell' },
    ],
    []
  )

  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Pricing & Strategy' },
        { label: 'Min/Max Option 2' },
      ]}
    >
      {/* Page Header */}
      <div className={classes.pageHeader}>
        <div className={classes.titleRow}>
          <Typography className={classes.pageTitle}>Min/Max Option 2</Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            className={classes.editBtn}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={classes.mainContent}>
        {/* Left Sidebar - Filters */}
        <div className={classes.sidebar}>
          <div className={classes.sidebarSection}>
            <Typography className={classes.sectionTitle}>Segments/Surates</Typography>
            <Typography className={classes.sectionLink}>Deselect All</Typography>
            {['BAR', 'AAA', 'Dynamic 15% surates', 'PREPAIDRATE', 'BAR RATE', 'PROMO'].map(
              (item) => (
                <div key={item} className={classes.filterItem}>
                  <Checkbox
                    checked={true}
                    size="small"
                    color="primary"
                    className={classes.checkbox}
                  />
                  <Typography className={classes.filterLabel}>{item}</Typography>
                </div>
              )
            )}
            {['Casino8 ($0-$34)', 'GROUP', 'Business Groups', 'Direct Client very long segment name', 'PROMO2', 'Seg 15', 'testnew'].map(
              (item) => (
                <div key={item} className={classes.filterItem}>
                  <Checkbox
                    checked={true}
                    size="small"
                    color="primary"
                    className={classes.checkbox}
                  />
                  <Typography className={classes.filterLabel}>{item}</Typography>
                </div>
              )
            )}
          </div>

          <div className={classes.sidebarSection}>
            <Typography className={classes.sectionTitle}>Room Types</Typography>
            <Typography className={classes.sectionLink}>Deselect All</Typography>
            {MOCK_ROOM_TYPES.map((room) => (
              <div key={room} className={classes.filterItem}>
                <Checkbox
                  checked={selectedRooms.has(room)}
                  onChange={() => toggleRoom(room)}
                  size="small"
                  color="primary"
                  className={classes.checkbox}
                />
                <Typography className={classes.filterLabel}>{room}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Table Area */}
        <div className={classes.tableWrapper}>
          {/* Table Header with Season Selector */}
          <div className={classes.tableHeader}>
            <Box display="flex" justifyContent="flex-end" alignItems="center" gridGap={12}>
              <Typography variant="subtitle2" style={{ color: '#4f5b60' }}>Seasons & Overrides</Typography>
              <Select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value as string)}
                className={classes.seasonSelect}
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                MenuProps={{
                  classes: { paper: classes.selectMenuPaper },
                  getContentAnchorEl: null,
                  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                  transformOrigin: { vertical: 'top', horizontal: 'left' },
                }}
              >
                <MenuItem disabled>Season</MenuItem>
                <MenuItem value="January 1 - December 31">January 1 - December 31</MenuItem>
                <MenuItem value="January 1 - April 31">January 1 - April 31</MenuItem>
                <MenuItem value="May 1 - September 31">May 1 - September 31</MenuItem>
                <MenuItem value="October 1 - December 31">October 1 - December 31</MenuItem>
              </Select>
            </Box>
          </div>

          {/* AG Grid Table */}
          <div className={`ag-theme-alpine ${classes.gridContainer}`}>
            <AgGridReact
              ref={gridRef}
              theme="legacy"
              rowData={rowData}
              columnDefs={columnDefs}
              suppressColumnVirtualisation
              suppressRowVirtualisation
              suppressRowTransform
              domLayout="autoHeight"
              getRowClass={(params) => params.data?.rowClass || ''}
              defaultColDef={{
                resizable: true,
                sortable: false,
                suppressHeaderMenuButton: true,
              }}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
