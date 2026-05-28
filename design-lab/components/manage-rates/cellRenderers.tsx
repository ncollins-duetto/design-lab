'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import type { ICellRendererParams, IHeaderParams } from 'ag-grid-community'
import { color2026 } from '@duetto/duetto-components'
import { COL } from '@/lib/mock/rates'

// ─── Shared event bus constants ───────────────────────────────────────────────

// Syncs the Recommended header checkbox with all row cells
const REC_SELECT_ALL = 'mrx:rec-select-all'

// Override cell → recommended cell in same row (deselect + grey value)
const MRX_OVERRIDE_CHANGE = 'mrx:override-change'
// detail: { rowId: string; dateIso: string; hasValue: boolean }

// Any active cell → page level (drives Review & Publish enabled state)
export const MRX_CELL_ACTIVE = 'mrx:cell-active'
// detail: { cellId: string; active: boolean }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseRate = (v: string | number | undefined): number | null => {
  if (v == null || v === '') return null
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? null : n
}

// ISO date is always the first 10 chars of a colId ("2025-07-17_colkey")
const dateIsoFromField = (field: string) => field.slice(0, 10)

// ─── Current rate: value + lock toggle ───────────────────────────────────────

export function RateLockCell(params: ICellRendererParams) {
  const [locked, setLocked] = useState(false)
  const value = params.value ?? ''
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 4 }}>
      <span style={{ flex: 1, textAlign: 'right' }}>{value}</span>
      <span
        onClick={(e) => { e.stopPropagation(); setLocked((l) => !l) }}
        style={{ cursor: 'pointer', color: locked ? color2026.main.blue[700] : '#ccc', display: 'flex', flexShrink: 0 }}
      >
        {locked ? <LockIcon style={{ fontSize: 13 }} /> : <LockOpenIcon style={{ fontSize: 13 }} />}
      </span>
    </span>
  )
}

// ─── Recommended: header with select-all checkbox ────────────────────────────
// Checkbox on the left (aligns with body cell checkboxes).
// "Recommended" label fills the rest, right-aligned (matches body cell values).

export function RecommendedHeaderCell(params: IHeaderParams) {
  const [allChecked, setAllChecked] = useState(false)

  const handleChange = useCallback(() => {
    setAllChecked((prev) => {
      const next = !prev
      window.dispatchEvent(
        new CustomEvent(REC_SELECT_ALL, {
          detail: { colId: params.column.getColId(), checked: next },
        })
      )
      return next
    })
  }, [params.column])

  return (
    <span style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 6 }}>
      <input
        type="checkbox"
        checked={allChecked}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer', accentColor: color2026.main.blue[700], margin: 0, flexShrink: 0 }}
      />
      <span style={{ flex: 1, textAlign: 'right', fontSize: 12, fontWeight: 400 }}>Recommended</span>
    </span>
  )
}

// ─── Recommended: cell ────────────────────────────────────────────────────────
// Green bg when accepted. Value greyed when override is active for this row.
// Dispatches MRX_CELL_ACTIVE so the page can enable Review & Publish.

export function RecommendedCheckboxCell(params: ICellRendererParams) {
  const [accepted,      setAccepted]      = useState(false)
  const [overrideActive, setOverrideActive] = useState(false)
  const value = params.value ?? ''

  const field   = params.colDef?.field ?? ''
  const dateIso = dateIsoFromField(field)
  const rowId   = String(params.data?.hotelId ?? '')
  const cellId  = `${rowId}_${field}`

  // Up/down arrow vs current rate
  const currentField = field.replace(`_${COL.RECOMMENDED}`, `_${COL.CURRENT}`)
  const current = parseRate(params.data?.[currentField])
  const rec     = parseRate(value)
  const isUp    = current != null && rec != null && rec > current
  const isDown  = current != null && rec != null && rec < current

  const dispatchActive = useCallback((active: boolean) => {
    window.dispatchEvent(new CustomEvent(MRX_CELL_ACTIVE, { detail: { cellId, active } }))
  }, [cellId])

  const handleChange = useCallback(() => {
    setAccepted((prev) => {
      const next = !prev
      dispatchActive(next)
      return next
    })
  }, [dispatchActive])

  // Select-all listener — scoped by colId so each date column acts independently
  useEffect(() => {
    const colId = field
    const handler = (e: Event) => {
      const { colId: targetId, checked } = (e as CustomEvent<{ colId: string; checked: boolean }>).detail
      if (targetId === colId) {
        setAccepted(checked)
        dispatchActive(checked)
      }
    }
    window.addEventListener(REC_SELECT_ALL, handler)
    return () => window.removeEventListener(REC_SELECT_ALL, handler)
  }, [field, dispatchActive])

  // Override-change listener
  useEffect(() => {
    const handler = (e: Event) => {
      const { rowId: targetRow, dateIso: targetDate, hasValue } =
        (e as CustomEvent<{ rowId: string; dateIso: string; hasValue: boolean }>).detail
      if (targetRow !== rowId || targetDate !== dateIso) return
      if (hasValue) {
        // Deselect + notify page this cell is no longer active
        setAccepted(false)
        dispatchActive(false)
        setOverrideActive(true)
      } else {
        setOverrideActive(false)
      }
    }
    window.addEventListener(MRX_OVERRIDE_CHANGE, handler)
    return () => window.removeEventListener(MRX_OVERRIDE_CHANGE, handler)
  }, [rowId, dateIso, dispatchActive])

  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      width: 'calc(100% + 8px)',
      height: '100%',
      margin: '0 -4px',
      padding: '0 4px',
      gap: 2,
      backgroundColor: accepted ? color2026.semantic.success[50] : 'transparent',
      boxSizing: 'border-box' as const,
    }}>
      <input
        type="checkbox"
        checked={accepted}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer', flexShrink: 0, accentColor: color2026.main.blue[700], margin: 0 }}
      />
      <span style={{
        flex: 1,
        textAlign: 'right',
        color: overrideActive ? (color2026.text.disabled as string) : 'inherit',
        transition: 'color 0.15s',
      }}>
        {value}
      </span>
      {isUp   && !overrideActive && <ArrowDropUpIcon   style={{ fontSize: 16, color: color2026.semantic.success[500], flexShrink: 0 }} />}
      {isDown && !overrideActive && <ArrowDropDownIcon style={{ fontSize: 16, color: color2026.semantic.error[600],   flexShrink: 0 }} />}
    </span>
  )
}

// ─── Pickup: three values (1 / 3 / 5 day) side by side ───────────────────────
// Value stored as "d1|d3|d5" in mock data.

export function PickupCell(params: ICellRendererParams) {
  const raw = String(params.value ?? '')
  const [d1 = '—', d3 = '—', d5 = '—'] = raw.split('|')
  return (
    <span className="pickup-values">
      <span>{d1}</span>
      <span>{d3}</span>
      <span>{d5}</span>
    </span>
  )
}

// ─── Override: input that turns green on blur when filled ─────────────────────
// Filling it greys + deselects the corresponding recommended cell.
// Clearing it restores the recommended cell to normal.

export function EditableRateInput(params: ICellRendererParams) {
  const [value,  setValue]  = useState<string>(String(params.value ?? ''))
  const [active, setActive] = useState(false)

  const field   = params.colDef?.field ?? ''
  const dateIso = dateIsoFromField(field)
  const rowId   = String(params.data?.hotelId ?? '')
  const cellId  = `${rowId}_${field}`

  const handleBlur = useCallback(() => {
    const filled = value.trim() !== ''
    setActive(filled)

    // Tell the recommended cell in this row to grey/restore
    window.dispatchEvent(new CustomEvent(MRX_OVERRIDE_CHANGE, {
      detail: { rowId, dateIso, hasValue: filled },
    }))

    // Tell the page whether this cell is active
    window.dispatchEvent(new CustomEvent(MRX_CELL_ACTIVE, {
      detail: { cellId, active: filled },
    }))
  }, [value, rowId, dateIso, cellId])

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      placeholder=""
      style={{
        width: '100%',
        height: '75%',
        border: `1px solid ${active ? color2026.semantic.success[500] : '#d0d0d0'}`,
        borderRadius: 4,
        background: active ? color2026.semantic.success[50] : '#fff',
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'inherit',
        color: 'inherit',
        outline: 'none',
        padding: '0 6px',
        boxSizing: 'border-box' as const,
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onFocus={(e) => {
        if (!active) e.currentTarget.style.border = `1px solid ${color2026.main.blue[700]}`
      }}
      onBlurCapture={(e) => {
        e.currentTarget.style.border = `1px solid ${active ? color2026.semantic.success[500] : '#d0d0d0'}`
      }}
    />
  )
}
