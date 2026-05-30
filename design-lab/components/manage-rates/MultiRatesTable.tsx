'use client'

import React, { useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { makeStyles } from '@material-ui/core/styles'
import { color2026 } from '@duetto/duetto-components'
import { ColKey } from '@/lib/mock/rates'
import { buildColumnDefs } from './columnDefs'

ModuleRegistry.registerModules([AllCommunityModule])

const useStyles = makeStyles({
  '@global': {
    '.ag-theme-alpine .date-group-header': {
      color: `${color2026.text.primary} !important`,
      fontWeight: 600,
      fontSize: 13,
    },
    '.ag-theme-alpine .date-group-header .ag-header-group-cell-label': {
      justifyContent: 'center',
    },
    '.ag-theme-alpine .date-group-header .ag-column-group-icons': {
      color: color2026.text.primary,
    },
    '.ag-theme-alpine .date-group-even': {
      backgroundColor: '#e6f2fc !important',
    },
    '.ag-theme-alpine .date-group-odd': {
      backgroundColor: '#e8eaf5 !important',
    },
    '.ag-theme-alpine .subcolumn-header': {
      fontSize: 12,
      color: color2026.text.primary,
    },
    '.ag-theme-alpine .sub-header-even': {
      backgroundColor: '#f0f7fd !important',
    },
    '.ag-theme-alpine .sub-header-odd': {
      backgroundColor: '#f1f2fa !important',
    },
    '.ag-theme-alpine .hotel-header': {
      background: color2026.dataTable.headerBackground,
      fontWeight: 700,
      fontSize: 13,
    },
    '.ag-theme-alpine .ag-pinned-left-header': {
      background: color2026.dataTable.headerBackground,
      borderRight: '2px solid #e0e0e0 !important',
    },
    '.ag-theme-alpine .ag-pinned-left-cols-container': {
      borderRight: '2px solid #e0e0e0',
    },
    '.ag-theme-alpine .ag-cell.ag-cell-last-left-pinned': {
      borderRight: 'none',
    },
    '.ag-theme-alpine .ag-header-cell-resize': {
      display: 'none',
    },
    '.ag-theme-alpine .ag-header-cell::after': {
      display: 'none !important',
    },
    '.ag-theme-alpine .ag-header-group-cell::after': {
      display: 'none !important',
    },
    '.ag-theme-alpine .ag-cell-value': {
      fontSize: 13,
    },
    '.ag-theme-alpine .ag-cell': {
      borderRight: '1px solid #e0e0e0',
    },
    '.ag-theme-alpine .ag-row': {
      borderBottom: '1px solid #e0e0e0',
    },
    '.ag-theme-alpine .ag-row:hover': {
      background: `${color2026.dataTable.highlight} !important`,
    },
    '.ag-theme-alpine .ag-cell.col-group-edge': {
      borderLeft: '2px solid #e0e0e0',
    },
    '.ag-theme-alpine .col-group-edge-header': {
      borderLeft: '2px solid #e0e0e0 !important',
    },
  },
  container: {
    width: '100%',
    height: '100%',
    minHeight: 400,
  },
})

interface Props {
  dates: string[]
  rowData: Record<string, string | number>[]
  visibleCols: Set<ColKey>
}

export default function MultiRatesTable({ dates, rowData, visibleCols }: Props) {
  const classes = useStyles()
  const gridRef = useRef<AgGridReact>(null)

  const columnDefs = useMemo(
    () => buildColumnDefs(dates, visibleCols),
    [dates, visibleCols]
  )

  return (
    <div className={`ag-theme-alpine ${classes.container}`}>
      <AgGridReact
        ref={gridRef}
        theme="legacy"
        rowData={rowData}
        columnDefs={columnDefs}
        suppressColumnVirtualisation
        suppressRowVirtualisation
        domLayout="autoHeight"
        defaultColDef={{
          resizable: true,
          sortable: false,
          suppressHeaderMenuButton: true,
        }}
      />
    </div>
  )
}
