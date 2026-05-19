'use client'

import React, { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import type { GridReadyEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([AllCommunityModule])
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

  const onGridReady = useCallback((e: GridReadyEvent) => {
    e.api.sizeColumnsToFit()
  }, [])

  return (
    <div
      className="ag-theme-alpine"
      style={{ width: '100%', height: '100%', minHeight: 400 }}
    >
      <style>{`
        .ag-theme-alpine .date-group-header {
          background: #1a4a47 !important;
          color: #fff !important;
          font-weight: 600;
          font-size: 13px;
        }
        .ag-theme-alpine .date-group-header .ag-header-group-cell-label {
          justify-content: center;
        }
        .ag-theme-alpine .date-group-header .ag-column-group-icons {
          color: #fff;
        }
        .ag-theme-alpine .subcolumn-header {
          background: var(--group-color, #e6f2fc);
          font-size: 12px;
          color: #1a2533;
        }
        .ag-theme-alpine .hotel-header {
          background: #e6f2fc;
          font-weight: 700;
          font-size: 13px;
        }
        .ag-theme-alpine .ag-pinned-left-header {
          background: #e6f2fc;
        }
        .ag-theme-alpine .ag-cell-value {
          font-size: 13px;
        }
        .ag-theme-alpine .ag-row {
          border-bottom: 1px solid #eee;
        }
        .ag-theme-alpine .ag-row:hover {
          background: #f5f9ff !important;
        }
      `}</style>
      <AgGridReact
        ref={gridRef}
        theme="legacy"
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
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
