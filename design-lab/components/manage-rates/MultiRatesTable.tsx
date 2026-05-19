'use client'

import React, { useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { color2026 } from '@duetto/duetto-components'

if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule])
}
import { ColKey } from '@/lib/mock/rates'
import { buildColumnDefs } from './columnDefs'

interface Props {
  dates: string[]
  rowData: Record<string, string | number>[]
  visibleCols: Set<ColKey>
}

export default function MultiRatesTable({ dates, rowData, visibleCols }: Props) {
  const gridRef = useRef<AgGridReact>(null)

  const columnDefs = useMemo(
    () => buildColumnDefs(dates, visibleCols),
    [dates, visibleCols]
  )

  return (
    <div
      className="ag-theme-alpine"
      style={{ width: '100%', height: '100%', minHeight: 400 }}
    >
      <style>{`
        /* Group header row */
        .ag-theme-alpine .date-group-header {
          color: ${color2026.text.primary} !important;
          font-weight: 600;
          font-size: 13px;
        }
        .ag-theme-alpine .date-group-header .ag-header-group-cell-label {
          justify-content: center;
        }
        .ag-theme-alpine .date-group-header .ag-column-group-icons {
          color: ${color2026.text.primary};
        }
        .ag-theme-alpine .date-group-even {
          background-color: #e6f2fc !important;
        }
        .ag-theme-alpine .date-group-odd {
          background-color: #e8eaf5 !important;
        }

        /* Sub-column headers */
        .ag-theme-alpine .subcolumn-header {
          font-size: 12px;
          color: ${color2026.text.primary};
        }
        .ag-theme-alpine .sub-header-even {
          background-color: #f0f7fd !important;
        }
        .ag-theme-alpine .sub-header-odd {
          background-color: #f1f2fa !important;
        }

        /* Hotel pinned column — remove shadow, use a clean border */
        .ag-theme-alpine .hotel-header {
          background: ${color2026.dataTable.headerBackground};
          font-weight: 700;
          font-size: 13px;
        }
        .ag-theme-alpine .ag-pinned-left-header {
          background: ${color2026.dataTable.headerBackground};
          border-right: 2px solid #e0e0e0 !important;
        }
        .ag-theme-alpine .ag-pinned-left-cols-container {
          border-right: 2px solid #e0e0e0;
        }
        .ag-theme-alpine .ag-cell.ag-cell-last-left-pinned {
          border-right: none;
        }

        /* Hide AG Grid's resize handle dividers in headers */
        .ag-theme-alpine .ag-header-cell-resize {
          display: none;
        }
        /* Hide built-in column separator pseudo-elements */
        .ag-theme-alpine .ag-header-cell::after,
        .ag-theme-alpine .ag-header-group-cell::after {
          display: none !important;
        }

        /* Cells */
        .ag-theme-alpine .ag-cell-value {
          font-size: 13px;
        }
        .ag-theme-alpine .ag-cell {
          border-right: 1px solid #e0e0e0;
        }
        .ag-theme-alpine .ag-row {
          border-bottom: 1px solid #e0e0e0;
        }
        .ag-theme-alpine .ag-row:hover {
          background: ${color2026.dataTable.highlight} !important;
        }

        /* 2px left border at each date group boundary */
        .ag-theme-alpine .ag-cell.col-group-edge {
          border-left: 2px solid #e0e0e0;
        }
        .ag-theme-alpine .col-group-edge-header {
          border-left: 2px solid #e0e0e0 !important;
        }
      `}</style>
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
