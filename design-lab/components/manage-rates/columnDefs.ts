import type { ColDef, ColGroupDef } from 'ag-grid-community'
import { color2026 } from '@duetto/duetto-components'
import {
  COL,
  COL_DEFS,
  ColMeta,
  ColKey,
  ColCategory,
  CATEGORY_LABELS,
  ALL_CATEGORIES,
  formatDateHeader,
  toColId,
} from '@/lib/mock/rates'
import { RecommendedCheckboxCell, RecommendedHeaderCell, EditableRateInput, PickupCell } from './cellRenderers'

// ─── Hotel pinned column ──────────────────────────────────────────────────────

function hotelColumnDef(): ColDef {
  return {
    colId: 'hotelName',
    field: 'hotelName',
    headerName: 'Hotel',
    pinned: 'left',
    lockPinned: true,
    width: 180,
    suppressMovable: true,
    cellStyle: { background: color2026.dataTable.headerBackground, fontWeight: 500 },
    headerClass: 'hotel-header',
  }
}

// ─── Leaf column builder ──────────────────────────────────────────────────────
// Builds the bottom-level column (sub label row). The main label and date rows
// are handled by the ColGroupDef nesting above this.

function buildLeafCol(dateIso: string, meta: ColMeta, colorClass: string, isFirstGroup = false): ColDef {
  const colId = toColId(dateIso, meta.key)
  // col-group-edge marks the left boundary of each day group with a thicker border.
  // Skip it for the first group — that boundary is the hotel column separator, not a day separator.
  const isGroupEdge = !isFirstGroup && meta.key === COL.CURRENT

  let cellRenderer: unknown = undefined
  if (meta.key === COL.RECOMMENDED)           cellRenderer = RecommendedCheckboxCell
  else if (meta.key === COL.OVERRIDE || meta.key === COL.PROTECT) cellRenderer = EditableRateInput
  else if (meta.category === 'pickup') cellRenderer = PickupCell

  const headerComponent = meta.key === COL.RECOMMENDED ? RecommendedHeaderCell : undefined

  return {
    colId,
    field: colId,
    // Show sub label in the leaf header; fall back to main label for cols without one
    headerName: meta.subLabel ?? meta.label,
    headerComponent,
    headerClass: [
      'leaf-header', colorClass,
      ...(isGroupEdge ? ['col-group-edge-header'] : []),
    ],
    width: meta.width ?? 120,
    cellClass: isGroupEdge ? 'col-group-edge' : undefined,
    cellStyle: { textAlign: 'right', padding: '0 4px' },
    cellRenderer,
    suppressMovable: true,
  }
}

// ─── Public builder ───────────────────────────────────────────────────────────
// Three-level hierarchy: Date group → Main label group → Sub label leaf
//
// Rate columns (no subLabel, always-on) are direct children of the date group —
// AG Grid automatically spans them across the main-label header row.
//
// Metric columns are wrapped in a main-label ColGroupDef per category so the
// main label ("Demand Occupancy", "ADR (Commit)", etc.) appears as its own row.
//
// Categories whose every visible column has no subLabel (Events, Restrictions,
// Pushed Rate) are also direct children — no intermediate group needed.

export function buildColumnDefs(
  dates: string[],
  visibleCols: Set<ColKey>,
): (ColDef | ColGroupDef)[] {
  const cols: (ColDef | ColGroupDef)[] = [hotelColumnDef()]

  dates.forEach((dateIso, groupIndex) => {
    const colorClass = groupIndex % 2 === 0 ? 'date-even' : 'date-odd'

    // ── Rate columns: wrapped in a "Rates" group for header symmetry ─────────
    const rateLeafs: ColDef[] = COL_DEFS
      .filter((c) => c.category === 'rate' && (c.alwaysVisible || visibleCols.has(c.key)))
      .map((c) => buildLeafCol(dateIso, c, colorClass, groupIndex === 0))

    const rateGroup: ColGroupDef = {
      groupId:     `${dateIso}_rates`,
      headerName:  'Rates',
      headerClass: ['main-label-header', colorClass, ...(groupIndex !== 0 ? ['col-group-edge-header'] : [])],
      openByDefault: true,
      children: rateLeafs,
    }

    // ── Metric groups: one ColGroupDef per category ──────────────────────────
    const metricChildren: (ColDef | ColGroupDef)[] = []

    ALL_CATEGORIES
      .filter((cat): cat is ColCategory => cat !== 'rate')
      .forEach((cat) => {
        const catMetas = COL_DEFS.filter((c) => c.category === cat && visibleCols.has(c.key))
        if (!catMetas.length) return

        const hasSubLabels = catMetas.some((m) => m.subLabel)

        if (!hasSubLabels) {
          // No sub labels — direct leaf children (span the main-label row)
          catMetas.forEach((m) => {
            metricChildren.push({
              ...buildLeafCol(dateIso, m, colorClass, groupIndex === 0),
              columnGroupShow: 'open' as const,
            })
          })
        } else {
          // Has sub labels — wrap in a main-label group
          metricChildren.push({
            groupId:    `${dateIso}_${cat}`,
            headerName: CATEGORY_LABELS[cat],
            headerClass: ['main-label-header', colorClass],
            columnGroupShow: 'open' as const,
            openByDefault: true,
            children: catMetas.map((m) => buildLeafCol(dateIso, m, colorClass, groupIndex === 0)),
          } as ColGroupDef)
        }
      })

    cols.push({
      groupId:    `${dateIso}_date`,
      headerName: formatDateHeader(dateIso),
      headerClass: ['date-group-header', colorClass],
      marryChildren: true,
      children: [rateGroup, ...metricChildren],
    } as ColGroupDef)
  })

  return cols
}
