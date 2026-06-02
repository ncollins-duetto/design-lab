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
    width: 215,
    maxWidth: 215,
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
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
    width: '215px !important' as any,
    maxWidth: '215px !important' as any,
    minWidth: '0 !important' as any,
    background: '#ffffff',
    border: '1px solid #dde1e2',
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    '& .MuiList-root': {
      padding: '4px 0',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    '& .MuiMenuItem-root': {
      fontFamily: 'Lato, sans-serif',
      fontSize: 14,
      color: '#1c1c1c',
      padding: '8px 12px',
      minHeight: 'unset',
      display: 'block !important' as any,
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
  overlapChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontSize: 11,
    fontWeight: 600,
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

const MOCK_PRICES: Record<string, [string, string]> = {
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

// --- Season multipliers ---
const SEASON_MULTIPLIERS: Record<string, number> = {
  'January 1 - December 31': 1,
  'January 1 - April 30': 0.8,
  'May 1 - September 30': 1.2,
  'October 1 - December 31': 1.1,
}

// --- Season overrides (with year, 4-day example) ---
type SeasonOverride = { label: string; dateRange: string; minMultiplier: number; maxMultiplier: number }
const SEASON_OVERRIDES: Record<string, SeasonOverride[]> = {
  'January 1 - April 30': [
    { label: 'Holiday Peak', dateRange: 'Jan 15 2026 - Jan 31 2026', minMultiplier: 1.25, maxMultiplier: 1.20 },
    { label: 'Spring Break', dateRange: 'Mar 1 2026 - Mar 15 2026', minMultiplier: 1.15, maxMultiplier: 1.10 },
  ],
  'May 1 - September 30': [
    { label: 'Early Summer', dateRange: 'May 15 2026 - Jun 14 2026', minMultiplier: 1.15, maxMultiplier: 1.10 },
    { label: 'Peak Summer', dateRange: 'Jun 15 2026 - Aug 15 2026', minMultiplier: 1.30, maxMultiplier: 1.25 },
    { label: 'Festival Weekend', dateRange: 'Jul 10 2026 - Jul 13 2026', minMultiplier: 1.45, maxMultiplier: 1.40 },
  ],
  'October 1 - December 31': [
    { label: 'Autumn Low', dateRange: 'Oct 1 2026 - Nov 30 2026', minMultiplier: 0.90, maxMultiplier: 0.92 },
    { label: 'Holiday Peak', dateRange: 'Dec 15 2026 - Dec 25 2026', minMultiplier: 1.28, maxMultiplier: 1.22 },
  ],
}

// --- Room type overrides (with year, some overlap with season overrides) ---
type RoomTypeOverride = { label: string; dateRange: string; overlapsSeasonOverride?: string; rooms: Record<string, [string, string]> }
const ROOM_TYPE_OVERRIDES: Record<string, RoomTypeOverride[]> = {
  'January 1 - April 30': [
    {
      label: 'Holiday Peak Room Surcharge',
      dateRange: 'Jan 15 2026 - Jan 31 2026',
      overlapsSeasonOverride: 'Holiday Peak',
      rooms: {
        'Deluxe': ['+€200.00', '+€500.00'],
        'Deluxe 2/3sin vistas': ['+€200.00', '+€500.00'],
        'Deluxe 2/3 vista mar': ['+€250.00', '+€600.00'],
        'Deluxe 4p sin vistas': ['+€180.00', '+€450.00'],
        'Deluxe 4p Vista Mar': ['+€180.00', '+€450.00'],
        'Deluxe Accessible': ['+€180.00', '+€450.00'],
        'Deluxe City View - C2V': ['+€200.00', '+€500.00'],
        'Deluxe Club San Juan': ['+€220.00', '+€550.00'],
        'Deluxe Twin': ['+€180.00', '+€450.00'],
        'Deluxe VM 5p': ['+€180.00', '+€450.00'],
        'Dexint': ['+€150.00', '+€400.00'],
        'Double Dusal Seaview': ['+€250.00', '+€600.00'],
      },
    },
  ],
  'May 1 - September 30': [
    {
      label: 'Peak Summer Room Surcharge',
      dateRange: 'Jun 15 2026 - Aug 15 2026',
      overlapsSeasonOverride: 'Peak Summer',
      rooms: {
        'Deluxe': ['+€300.00', '+€700.00'],
        'Deluxe 2/3sin vistas': ['+€300.00', '+€700.00'],
        'Deluxe 2/3 vista mar': ['+€350.00', '+€800.00'],
        'Deluxe 4p sin vistas': ['+€280.00', '+€650.00'],
        'Deluxe 4p Vista Mar': ['+€280.00', '+€650.00'],
        'Deluxe Accessible': ['+€280.00', '+€650.00'],
        'Deluxe City View - C2V': ['+€300.00', '+€700.00'],
        'Deluxe Club San Juan': ['+€320.00', '+€750.00'],
        'Deluxe Twin': ['+€280.00', '+€650.00'],
        'Deluxe VM 5p': ['+€280.00', '+€650.00'],
        'Dexint': ['+€250.00', '+€600.00'],
        'Double Dusal Seaview': ['+€350.00', '+€800.00'],
      },
    },
    {
      label: 'Festival Room Surcharge',
      dateRange: 'Jul 10 2026 - Jul 13 2026',
      overlapsSeasonOverride: 'Festival Weekend',
      rooms: {
        'Deluxe': ['+€400.00', '+€900.00'],
        'Deluxe 2/3sin vistas': ['+€400.00', '+€900.00'],
        'Deluxe 2/3 vista mar': ['+€450.00', '+€1,000.00'],
        'Deluxe 4p sin vistas': ['+€380.00', '+€850.00'],
        'Deluxe 4p Vista Mar': ['+€380.00', '+€850.00'],
        'Deluxe Accessible': ['+€380.00', '+€850.00'],
        'Deluxe City View - C2V': ['+€400.00', '+€900.00'],
        'Deluxe Club San Juan': ['+€420.00', '+€950.00'],
        'Deluxe Twin': ['+€380.00', '+€850.00'],
        'Deluxe VM 5p': ['+€380.00', '+€850.00'],
        'Dexint': ['+€350.00', '+€800.00'],
        'Double Dusal Seaview': ['+€450.00', '+€1,000.00'],
      },
    },
  ],
  'October 1 - December 31': [
    {
      label: 'Holiday Room Surcharge',
      dateRange: 'Dec 15 2026 - Dec 25 2026',
      overlapsSeasonOverride: 'Holiday Peak',
      rooms: {
        'Deluxe': ['+€250.00', '+€600.00'],
        'Deluxe 2/3sin vistas': ['+€250.00', '+€600.00'],
        'Deluxe 2/3 vista mar': ['+€300.00', '+€700.00'],
        'Deluxe 4p sin vistas': ['+€230.00', '+€550.00'],
        'Deluxe 4p Vista Mar': ['+€230.00', '+€550.00'],
        'Deluxe Accessible': ['+€230.00', '+€550.00'],
        'Deluxe City View - C2V': ['+€250.00', '+€600.00'],
        'Deluxe Club San Juan': ['+€270.00', '+€650.00'],
        'Deluxe Twin': ['+€230.00', '+€550.00'],
        'Deluxe VM 5p': ['+€230.00', '+€550.00'],
        'Dexint': ['+€200.00', '+€500.00'],
        'Double Dusal Seaview': ['+€300.00', '+€700.00'],
      },
    },
  ],
}

export default function MinMaxBoundsPage() {
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

  const seasonMultiplier = SEASON_MULTIPLIERS[selectedSeason] || 1
  const seasonOverrides = SEASON_OVERRIDES[selectedSeason] || []
  const roomTypeOverrides = ROOM_TYPE_OVERRIDES[selectedSeason] || []

  // Main table data — prices change with season
  const rowData = useMemo(() => {
    const rows: Record<string, any>[] = []
    rows.push({
      roomType: 'BAR',
      isBarHeader: true,
      rowClass: 'bar-row',
    })
    filteredRooms.forEach((room) => {
      const basePrices = MOCK_PRICES[room]
      const baseMin = parseFloat(basePrices[0].replace(/[^0-9.]/g, ''))
      const baseMax = parseFloat(basePrices[1].replace(/[^0-9.]/g, ''))
      const min = `€${(baseMin * seasonMultiplier).toFixed(2)}`
      const max = `€${(baseMax * seasonMultiplier).toFixed(2)}`
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

  // Season override grids
  const overrideGrids = useMemo(() => {
    return seasonOverrides.map((so) => {
      const rows: Record<string, any>[] = []
      rows.push({
        roomType: `${so.label}  ·  ${so.dateRange}`,
        isBarHeader: true,
        rowClass: 'bar-row',
      })
      filteredRooms.forEach((room) => {
        const basePrices = MOCK_PRICES[room]
        const baseMin = parseFloat(basePrices[0].replace(/[^0-9.]/g, ''))
        const baseMax = parseFloat(basePrices[1].replace(/[^0-9.]/g, ''))
        const min = `€${(baseMin * so.minMultiplier).toFixed(2)}`
        const max = `€${(baseMax * so.maxMultiplier).toFixed(2)}`
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
    })
  }, [filteredRooms, selectedSeason])

  // Room type override grids
  const roomOverrideGrids = useMemo(() => {
    return roomTypeOverrides.map((rto) => {
      const rows: Record<string, any>[] = []
      rows.push({
        roomType: `${rto.label}  ·  ${rto.dateRange}`,
        isBarHeader: true,
        rowClass: 'bar-row',
      })
      filteredRooms.forEach((room) => {
        const diff = rto.rooms[room] || ['+€0.00', '+€0.00']
        rows.push({
          roomType: room,
          sun: diff[0], mon: diff[0], tue: diff[0], wed: diff[0], thu: diff[0], fri: diff[0], sat: diff[0],
          rowClass: 'min-row',
          isMinRow: true,
        })
        rows.push({
          roomType: '',
          sun: diff[1], mon: diff[1], tue: diff[1], wed: diff[1], thu: diff[1], fri: diff[1], sat: diff[1],
          rowClass: 'max-row',
        })
      })
      return rows
    })
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

  // Build grid rows for a specific season override
  const buildSeasonOverrideGrid = (so: SeasonOverride) => {
    const rows: Record<string, any>[] = []
    rows.push({ roomType: `${so.label}  ·  ${so.dateRange}`, isBarHeader: true, rowClass: 'bar-row' })
    filteredRooms.forEach((room) => {
      const basePrices = MOCK_PRICES[room]
      const baseMin = parseFloat(basePrices[0].replace(/[^0-9.]/g, ''))
      const baseMax = parseFloat(basePrices[1].replace(/[^0-9.]/g, ''))
      const min = `€${(baseMin * so.minMultiplier).toFixed(2)}`
      const max = `€${(baseMax * so.maxMultiplier).toFixed(2)}`
      rows.push({ roomType: room, sun: min, mon: min, tue: min, wed: min, thu: min, fri: min, sat: min, rowClass: 'min-row', isMinRow: true })
      rows.push({ roomType: '', sun: max, mon: max, tue: max, wed: max, thu: max, fri: max, sat: max, rowClass: 'max-row' })
    })
    return rows
  }

  // Build grid rows for a specific room type override
  const buildRoomOverrideGrid = (rto: RoomTypeOverride) => {
    const rows: Record<string, any>[] = []
    rows.push({ roomType: `${rto.label}  ·  ${rto.dateRange}`, isBarHeader: true, rowClass: 'bar-row' })
    filteredRooms.forEach((room) => {
      const diff = rto.rooms[room] || ['+€0.00', '+€0.00']
      rows.push({ roomType: room, sun: diff[0], mon: diff[0], tue: diff[0], wed: diff[0], thu: diff[0], fri: diff[0], sat: diff[0], rowClass: 'min-row', isMinRow: true })
      rows.push({ roomType: '', sun: diff[1], mon: diff[1], tue: diff[1], wed: diff[1], thu: diff[1], fri: diff[1], sat: diff[1], rowClass: 'max-row' })
    })
    return rows
  }

  // Determine which grid to display based on dropdown selection
  const activeGridData = useMemo(() => {
    if (selectedSeason.startsWith('season-override::')) {
      const [, label, dateRange, season] = selectedSeason.split('::')
      const overrides = SEASON_OVERRIDES[season] || []
      const so = overrides.find((o) => o.label === label && o.dateRange === dateRange)
      if (so) return buildSeasonOverrideGrid(so)
    }
    if (selectedSeason.startsWith('room-override::')) {
      const [, label, dateRange, season] = selectedSeason.split('::')
      const overrides = ROOM_TYPE_OVERRIDES[season] || []
      const rto = overrides.find((o) => o.label === label && o.dateRange === dateRange)
      if (rto) return buildRoomOverrideGrid(rto)
    }
    return rowData
  }, [selectedSeason, rowData, filteredRooms])

  // Display label for what's shown
  const activeLabel = useMemo(() => {
    if (selectedSeason.startsWith('season-override::')) {
      const [, label, dateRange] = selectedSeason.split('::')
      return `Season Override: ${label} · ${dateRange}`
    }
    if (selectedSeason.startsWith('room-override::')) {
      const [, label, dateRange, season] = selectedSeason.split('::')
      const overrides = ROOM_TYPE_OVERRIDES[season] || []
      const rto = overrides.find((o) => o.label === label && o.dateRange === dateRange)
      const overlap = rto?.overlapsSeasonOverride
      return `Room Type Override: ${label} · ${dateRange}`
    }
    return null
  }, [selectedSeason])

  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Pricing & Strategy' },
        { label: 'Min/Max Bounds' },
      ]}
    >
      {/* Page Header */}
      <div className={classes.pageHeader}>
        <div>
          <div className={classes.titleRow}>
            <Typography className={classes.pageTitle}>Min/Max Bounds</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              className={classes.editBtn}
            >
              Edit
            </Button>
          </div>
          <Typography style={{ fontSize: 13, color: '#4f5b60', marginTop: 4, visibility: activeLabel ? 'visible' : 'hidden' }}>
            {activeLabel || ' '}
          </Typography>
        </div>
        <Box display="flex" alignItems="center" gridGap={12}>
          <Typography variant="subtitle2" style={{ color: '#4f5b60', whiteSpace: 'nowrap' }}>Seasons & Overrides</Typography>
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
            <MenuItem value="January 1 - April 30">January 1 - April 30</MenuItem>
            <MenuItem value="May 1 - September 30">May 1 - September 30</MenuItem>
            <MenuItem value="October 1 - December 31">October 1 - December 31</MenuItem>
            <MenuItem disabled>Season Override</MenuItem>
            {Object.entries(SEASON_OVERRIDES).flatMap(([season, overrides]) =>
              overrides.map((so) => (
                <MenuItem key={`so-${so.dateRange}`} value={`season-override::${so.label}::${so.dateRange}::${season}`}>
                  {so.label} ({so.dateRange})
                </MenuItem>
              ))
            )}
            <MenuItem disabled>Room Types + Seasons Overrides</MenuItem>
            {Object.entries(ROOM_TYPE_OVERRIDES).flatMap(([season, overrides]) =>
              overrides.map((rto) => (
                <MenuItem key={`rto-${rto.dateRange}`} value={`room-override::${rto.label}::${rto.dateRange}::${season}`}>
                  {rto.label} ({rto.dateRange})
                </MenuItem>
              ))
            )}
          </Select>
        </Box>
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
          {/* AG Grid Table — shows season or selected override */}
          <div className={`ag-theme-alpine ${classes.gridContainer}`}>
            <AgGridReact
              ref={gridRef}
              theme="legacy"
              rowData={activeGridData}
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
