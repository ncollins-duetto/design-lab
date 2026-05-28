'use client'

import React, { useMemo, useRef, useCallback, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { color2026 } from '@duetto/duetto-components'
import { ColKey } from '@/lib/mock/rates'
import { buildColumnDefs } from './columnDefs'

ModuleRegistry.registerModules([AllCommunityModule])

interface Props {
  dates: string[]
  rowData: Record<string, string | number>[]
  visibleCols: Set<ColKey>
  collapsed?: boolean
}

export default function MultiRatesTable({ dates, rowData, visibleCols, collapsed = false }: Props) {
  const gridRef = useRef<AgGridReact>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const columnDefs = useMemo(
    () => buildColumnDefs(dates, visibleCols),
    [dates, visibleCols]
  )

  // Open or close every date column group — mirrors clicking the native ">" chevron.
  // Stable ref changes whenever collapsed or dates change, so the effect below
  // re-fires automatically. Also wired to onGridReady for the initial render.
  const applyGroupCollapse = useCallback(() => {
    const api = gridRef.current?.api
    if (!api) return
    dates.forEach((dateIso) => {
      api.setColumnGroupOpened(`${dateIso}_date`, !collapsed)
    })
  }, [collapsed, dates])

  useEffect(() => {
    applyGroupCollapse()
  }, [applyGroupCollapse])

  // Sticky group-header labels: keep date + main-label text pinned to the
  // left edge of the visible area as the user scrolls right within a group.
  const handleBodyScroll = useCallback((event: { direction: string; left: number }) => {
    if (event.direction !== 'horizontal' || !containerRef.current) return
    const scrollLeft = event.left

    const updateSticky = (selector: string) => {
      containerRef.current!.querySelectorAll<HTMLElement>(selector).forEach((cell) => {
        const label = cell.querySelector<HTMLElement>('.ag-header-group-cell-label')
        if (!label) return
        const cellLeft  = parseFloat(cell.style.left)  || 0
        const cellWidth = parseFloat(cell.style.width) || 0
        if (cellWidth === 0) return
        // Mirror CSS sticky behaviour: the label (centered in the cell) stays in
        // its natural position until its centre would cross the viewport left edge,
        // then we translate it just enough to keep it visible.
        // delta > 0  only once the label centre has scrolled past the left edge.
        const textEl    = label.querySelector<HTMLElement>('.ag-header-group-text')
        const textWidth = textEl ? textEl.scrollWidth : 80
        const PAD       = 12   // clear the pinned-column edge + small breathing room
        const delta     = scrollLeft - cellLeft - cellWidth / 2 + textWidth / 2 + PAD
        const maxDelta  = cellWidth / 2 - textWidth / 2 - PAD
        label.style.transform = (delta > 0 && maxDelta > 0)
          ? `translateX(${Math.min(delta, maxDelta)}px)`
          : ''
      })
    }

    updateSticky('.date-group-header')
    updateSticky('.main-label-header')
  }, [])

  return (
    <div
      ref={containerRef}
      className="ag-theme-alpine"
      style={{ width: '100%', height: '100%', minHeight: 400 }}
    >
      <style>{`
        /* ── Unified date-group colours across all three header rows ────────── */
        .ag-theme-alpine .date-even { background-color: #e6f2fc !important; }
        .ag-theme-alpine .date-odd  { background-color: #e8eaf5 !important; }

        /* ── Hide resize-handle visual bars (keep drag zone functional) ────── */
        .ag-theme-alpine {
          --ag-header-column-resize-handle-display: none;
        }

        /* ── Hide expand/collapse chevrons — groups are always open ────────── */
        .ag-theme-alpine .ag-column-group-icons { display: none !important; }

        /* ── Column borders — explicit right border on every header cell ──────
           Matches real app: cell-horizontal-border + header-column-separator  */
        .ag-theme-alpine .ag-header-cell,
        .ag-theme-alpine .ag-header-group-cell {
          border-right: 1px solid #e0e0e0 !important;
        }

        /* ── Resize handle position — match real app ─────────────────────────── */
        .ag-theme-alpine.ag-ltr .ag-header-cell-resize { right: -4px; }

        /* ── Centre ALL group header labels (date + main-label rows) ────────── */
        .ag-theme-alpine .ag-header-group-cell-label { justify-content: center; flex: 1; }
        .ag-theme-alpine .ag-header-group-text       { text-align: center; }

        /* ── Date row — bold 12px, 2px left border on every group after the first.
           Uses border-left (same side as col-group-edge below) so the vertical
           separator aligns perfectly through all header rows and body cells.
           The ~ sibling selector skips the first date group to avoid doubling
           up with the hotel column's right border. ────────────────────────── */
        .ag-theme-alpine .date-group-header { font-size: 12px; }
        .ag-theme-alpine .date-group-header ~ .date-group-header { border-left: 2px solid #e0e0e0 !important; }
        .ag-theme-alpine .date-group-header .ag-header-group-text {
          font-weight: 700;
          color: ${color2026.text.primary};
        }

        /* ── Main-label (metric group) row — bold 12px ──────────────────────── */
        .ag-theme-alpine .main-label-header { font-size: 12px; }
        .ag-theme-alpine .main-label-header .ag-header-group-text {
          font-weight: 700;
          color: ${color2026.text.primary};
        }

        /* ── Sub-label (leaf column) row — regular weight, tighter padding,
           right-aligned to match right-aligned cell data ───────────────── */
        .ag-theme-alpine .leaf-header { font-size: 12px; }
        .ag-theme-alpine .leaf-header .ag-header-cell-label { justify-content: flex-end; }
        .ag-theme-alpine .leaf-header.ag-header-cell {
          padding-left: 6px !important;
          padding-right: 6px !important;
        }
        .ag-theme-alpine .leaf-header .ag-header-cell-text {
          font-weight: 400;
          color: ${color2026.text.primary};
        }

        /* ── Hotel pinned column ─────────────────────────────────────────────── */
        .ag-theme-alpine .hotel-header {
          background: ${color2026.dataTable.headerBackground};
          font-weight: 700;
          font-size: 13px;
        }
        .ag-theme-alpine .ag-pinned-left-header {
          background: ${color2026.dataTable.headerBackground};
          border-right: 2px solid #e0e0e0 !important;
        }
        .ag-theme-alpine .ag-pinned-left-cols-container { border-right: 2px solid #e0e0e0; }
        .ag-theme-alpine .ag-cell.ag-cell-last-left-pinned { border-right: none; }

        /* ── Data cells ──────────────────────────────────────────────────────── */
        .ag-theme-alpine .ag-cell-value { font-size: 13px; }
        .ag-theme-alpine .ag-cell       { border-right: 1px solid #e0e0e0; }
        .ag-theme-alpine .ag-row        { border-bottom: 1px solid #e0e0e0; }
        .ag-theme-alpine .ag-row:hover  { background: ${color2026.dataTable.highlight} !important; }

        /* ── 2px left border at each date-group boundary ─────────────────────── */
        .ag-theme-alpine .ag-cell.col-group-edge { border-left: 2px solid #e0e0e0; }
        .ag-theme-alpine .col-group-edge-header  { border-left: 2px solid #e0e0e0 !important; }

        /* ── Pickup cell: three equal columns, values right-aligned ─────────── */
        .pickup-values {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          width: 100%;
          font-size: 13px;
          font-variant-numeric: tabular-nums;
        }
        .pickup-values span { text-align: right; padding-right: 4px; }
      `}</style>
      <AgGridReact
        ref={gridRef}
        theme="legacy"
        rowData={rowData}
        columnDefs={columnDefs}
        suppressColumnVirtualisation
        suppressRowVirtualisation
        domLayout="autoHeight"
        groupHeaderHeight={28}
        headerHeight={28}
        defaultColDef={{
          resizable: true,
          sortable: false,
          suppressHeaderMenuButton: true,
        }}
        onBodyScroll={handleBodyScroll}
        onGridReady={applyGroupCollapse}
      />
    </div>
  )
}
