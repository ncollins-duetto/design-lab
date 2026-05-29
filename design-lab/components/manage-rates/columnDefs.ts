import type { ColDef, ColGroupDef } from 'ag-grid-community'
import { color2026 } from '@duetto/duetto-components'
import {
  COL,
  COL_DEFS,
  ColKey,
  formatDateHeader,
  toColId,
} from '@/lib/mock/rates'
import { RateLockCell, RecommendedCheckboxCell, EditableRateInput } from './cellRenderers'

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
    cellStyle: { background: color2026.dataTable.headerBackground, fontWeight: 500 },
    headerClass: 'hotel-header',
  }
}

function buildChildCol(dateIso: string, key: ColKey, isMetric: boolean, groupIndex: number): ColDef {
  const meta = colMetaByKey[key]
  const colId = toColId(dateIso, key)
  const subClass = groupIndex % 2 === 0 ? 'sub-header-even' : 'sub-header-odd'

  let cellRenderer: unknown = undefined
  if (key === COL.CURRENT) cellRenderer = RateLockCell
  else if (key === COL.RECOMMENDED) cellRenderer = RecommendedCheckboxCell
  else if (key === COL.OVERRIDE || key === COL.PROTECT) cellRenderer = EditableRateInput

  const isGroupEdge = key === COL.CURRENT

  return {
    colId,
    field: colId,
    headerName: meta?.label ?? key,
    width: [COL.CURRENT, COL.RECOMMENDED, COL.OVERRIDE, COL.PROTECT].includes(key as any) ? 155 : meta?.width ?? 130,
    columnGroupShow: isMetric ? 'open' : undefined,
    headerClass: ['subcolumn-header', subClass, ...(isGroupEdge ? ['col-group-edge-header'] : [])],
    cellClass: isGroupEdge ? 'col-group-edge' : undefined,
    cellStyle: { textAlign: 'right', padding: '0 4px' },
    cellRenderer,
    suppressMovable: true,
  }
}

export function buildColumnDefs(
  dates: string[],
  visibleCols: Set<ColKey>
): (ColDef | ColGroupDef)[] {
  const cols: (ColDef | ColGroupDef)[] = [hotelColumnDef()]

  dates.forEach((dateIso, groupIndex) => {
    const headerName = formatDateHeader(dateIso)
    const groupClass = groupIndex % 2 === 0 ? 'date-group-even' : 'date-group-odd'

    const alwaysOnChildren: ColDef[] = ALWAYS_ON_COLS
      .filter((key) => key === COL.CURRENT || visibleCols.has(key))
      .map((key) => buildChildCol(dateIso, key, false, groupIndex))

    const metricChildren: ColDef[] = COL_DEFS
      .filter((c) => !ALWAYS_ON_COLS.includes(c.key as ColKey) && visibleCols.has(c.key))
      .map((c) => buildChildCol(dateIso, c.key, true, groupIndex))

    const group: ColGroupDef = {
      groupId: `${dateIso}_group`,
      headerName,
      marryChildren: true,
      headerClass: ['date-group-header', groupClass],
      children: [...alwaysOnChildren, ...metricChildren],
    }

    cols.push(group)
  })

  return cols
}
