'use client'

import React, { useState } from 'react'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import type { ICellRendererParams } from 'ag-grid-community'
import { COL } from '@/lib/mock/rates'

const parseRate = (v: string | number | undefined): number | null => {
  if (v == null || v === '') return null
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? null : n
}

export function RateLockCell(params: ICellRendererParams) {
  const [locked, setLocked] = useState(false)
  const value = params.value ?? ''
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 4 }}>
      <span style={{ flex: 1, textAlign: 'right' }}>{value}</span>
      <span
        onClick={(e) => { e.stopPropagation(); setLocked((l) => !l) }}
        style={{ cursor: 'pointer', color: locked ? '#006461' : '#ccc', display: 'flex', flexShrink: 0 }}
      >
        {locked ? <LockIcon style={{ fontSize: 13 }} /> : <LockOpenIcon style={{ fontSize: 13 }} />}
      </span>
    </span>
  )
}

export function RecommendedCheckboxCell(params: ICellRendererParams) {
  const [accepted, setAccepted] = useState(false)
  const value = params.value ?? ''

  const field = params.colDef?.field ?? ''
  const currentField = field.replace(`_${COL.RECOMMENDED}`, `_${COL.CURRENT}`)
  const current = parseRate(params.data?.[currentField])
  const rec = parseRate(value)
  const isUp = current != null && rec != null && rec > current
  const isDown = current != null && rec != null && rec < current

  return (
    <span style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
      <input
        type="checkbox"
        checked={accepted}
        onChange={() => setAccepted((a) => !a)}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer', flexShrink: 0, accentColor: '#006461', margin: 0 }}
      />
      <span style={{ flex: 1, textAlign: 'right' }}>{value}</span>
      {isUp && <ArrowDropUpIcon style={{ fontSize: 16, color: '#2e7d32', flexShrink: 0 }} />}
      {isDown && <ArrowDropDownIcon style={{ fontSize: 16, color: '#c62828', flexShrink: 0 }} />}
    </span>
  )
}

export function EditableRateInput(params: ICellRendererParams) {
  const [value, setValue] = useState<string>(String(params.value ?? ''))
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder="—"
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid transparent',
        borderRadius: 3,
        background: 'transparent',
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'inherit',
        color: 'inherit',
        outline: 'none',
        padding: '0 4px',
        boxSizing: 'border-box',
      }}
      onFocus={(e) => {
        e.currentTarget.style.border = '1px solid #006461'
        e.currentTarget.style.background = '#fff'
      }}
      onBlur={(e) => {
        e.currentTarget.style.border = '1px solid transparent'
        e.currentTarget.style.background = 'transparent'
      }}
    />
  )
}
