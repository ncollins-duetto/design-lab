import type { ColDef, ColGroupDef } from 'ag-grid-community'
import {
  COL,
  COL_DEFS,
  ColKey,
  formatDateHeader,
  toColId,
} from '@/lib/mock/rates'

// Alternating header background colors per date group, matching the real app
const GROUP_COLORS = ['#e6f2fc', '#e8eaf5']

// Rate columns that are always visible (not metrics — shown even when collapsed)
const ALWAYS_ON_COLS: ColKey[] = [COL.CURRENT, COL.RECOMMENDED, COL.OVERRIDE]

const colMetaByKey = Object.fromEntries(COL_DEFS.map((c) => [c.key, c]))

function hotelColumnDef(): ColDef {
  return {
    colId: 'hotelName',
    field: 'hotelName',
    headerName: 'Hotel',
    pinned: 'left',
    lockPinned: true,
    width: 180,
    suppressMovable: true,
    cellStyle: { background: '#eef4fb', fontWeight: 500 },
    headerClass: 'hotel-header',
  }
}

function buildChildCol(dateIso: string, key: ColKey, groupColor: string, isMetric: boolean): ColDef {
  const meta = colMetaByKey[key]
  return {
    colId: toColId(dateIso, key),
    field: toColId(dateIso, key),
    headerName: meta?.label ?? key,
    width: meta?.width ?? 110,
    columnGroupShow: isMetric ? 'open' : undefined,
    headerClass: 'subcolumn-header',
    cellStyle: { textAlign: 'right' },
    headerStyle: { background: groupColor },
    editable: key === COL.OVERRIDE,
    suppressMovable: true,
  }
}

export function buildColumnDefs(
  dates: string[],
  visibleCols: Set<ColKey>
): (ColDef | ColGroupDef)[] {
  const cols: (ColDef | ColGroupDef)[] = [hotelColumnDef()]

  dates.forEach((dateIso, i) => {
    const groupColor = GROUP_COLORS[i % 2]
    const headerName = formatDateHeader(dateIso)

    // Always-on rate columns (Current, Recommended, Override) — filtered by visibility
    const alwaysOnChildren: ColDef[] = ALWAYS_ON_COLS
      .filter((key) => key === COL.CURRENT || visibleCols.has(key))
      .map((key) => buildChildCol(dateIso, key, groupColor, false))

    // Metric columns (only visible when group is open, filtered by user settings)
    const metricChildren: ColDef[] = COL_DEFS
      .filter((c) => !ALWAYS_ON_COLS.includes(c.key as ColKey) && visibleCols.has(c.key))
      .map((c) => buildChildCol(dateIso, c.key, groupColor, true))

    const group: ColGroupDef = {
      groupId: `${dateIso}_group`,
      headerName,
      marryChildren: true,
      headerClass: 'date-group-header',
      children: [...alwaysOnChildren, ...metricChildren],
    }

    cols.push(group)
  })

  return cols
}
