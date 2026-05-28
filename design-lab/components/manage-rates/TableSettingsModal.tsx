'use client'

import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, Typography, Divider, IconButton,
  Paper, Grid, TextField, InputAdornment, Chip, makeStyles,
} from '@material-ui/core'
import CloseIcon        from '@material-ui/icons/Close'
import SearchIcon       from '@material-ui/icons/Search'
import ExpandMoreIcon   from '@material-ui/icons/ExpandMore'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { color2026 } from '@duetto/duetto-components'
import {
  COL, COL_DEFS, ColMeta, ColKey, ColCategory,
  CATEGORY_LABELS, ALL_CATEGORIES, DEFAULT_VISIBLE_COLS,
} from '@/lib/mock/rates'

const SETTINGS_KEY = 'design-lab:manage-rates-columns'

export function loadVisibleCols(): Set<ColKey> {
  if (typeof window === 'undefined') return new Set(DEFAULT_VISIBLE_COLS)
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) return new Set(JSON.parse(stored) as ColKey[])
  } catch {}
  return new Set(DEFAULT_VISIBLE_COLS)
}

export function saveVisibleCols(cols: Set<ColKey>) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify([...cols]))
}

interface Props {
  open: boolean
  onClose: () => void
  visibleCols: Set<ColKey>
  onConfirm: (cols: Set<ColKey>) => void
}

// ─── Group model ──────────────────────────────────────────────────────────────

interface Group { id: ColCategory; label: string; metas: ColMeta[] }

const ALL_GROUPS: Group[] = ALL_CATEGORIES
  .map(cat => ({
    id: cat,
    label: cat === 'rate' ? 'Rates' : CATEGORY_LABELS[cat],
    metas: COL_DEFS.filter(c => c.category === cat),
  }))
  .filter(g => g.metas.length > 0)

const INITIAL_ORDER = ALL_GROUPS.map(g => g.id)
const GROUP_BY_ID   = Object.fromEntries(ALL_GROUPS.map(g => [g.id, g])) as Record<ColCategory, Group>

// ─── Metric set presets ───────────────────────────────────────────────────────

interface MetricSet { id: string; label: string; cols: Set<ColKey> }

function setsEqual(a: Set<ColKey>, b: Set<ColKey>): boolean {
  if (a.size !== b.size) return false
  for (const k of a) if (!b.has(k)) return false
  return true
}

const METRIC_SETS: MetricSet[] = [
  {
    id: 'default',
    label: 'Default',
    cols: DEFAULT_VISIBLE_COLS,
  },
  {
    id: 'revenue',
    label: 'Revenue',
    cols: new Set<ColKey>([
      COL.CURRENT,
      COL.ADR_COMMIT_TOTAL,
      COL.COMMITTED_OCC_ROOM_REV,
      COL.DUETTO_FORECAST_REVPAR,
      COL.OTB_ROOMS,
      COL.INVENTORY_REMAINING,
    ]),
  },
  {
    id: 'groups',
    label: 'Groups',
    cols: new Set<ColKey>([
      COL.CURRENT,
      COL.GROUP_BUSINESS_ROOMS,
      COL.GROUP_BUSINESS_REVENUE,
      COL.ADR_COMMIT_GROUP,
      COL.COMMITTED_OCC_ROOM_REV,
      COL.PICKUP_ROOMS_COMMIT,
    ]),
  },
]

// ─── Checkbox state helpers ───────────────────────────────────────────────────

function groupCheckState(
  group: Group, staged: Set<ColKey>
): { checked: boolean; indeterminate: boolean } {
  const toggleable = group.metas.filter(m => !m.alwaysVisible)
  const n = toggleable.filter(m => staged.has(m.key)).length
  if (n === toggleable.length) return { checked: true, indeterminate: false }
  // Rates group always keeps Current — min state is indeterminate, never unchecked
  if (n === 0) return { checked: false, indeterminate: group.id === 'rate' }
  return { checked: false, indeterminate: true }
}

function toggleGroupCols(group: Group, staged: Set<ColKey>): Set<ColKey> {
  const toggleable = group.metas.filter(m => !m.alwaysVisible)
  const allOn = toggleable.every(m => staged.has(m.key))
  const next  = new Set(staged)
  allOn
    ? toggleable.forEach(m => next.delete(m.key))
    : toggleable.forEach(m => next.add(m.key))
  return next
}

function masterCheckState(
  groups: Group[], staged: Set<ColKey>
): { checked: boolean; indeterminate: boolean } {
  const all = groups.flatMap(g => g.metas.filter(m => !m.alwaysVisible))
  const n   = all.filter(m => staged.has(m.key)).length
  if (n === all.length) return { checked: true, indeterminate: false }
  if (n === 0)          return { checked: false, indeterminate: false }
  return { checked: false, indeterminate: true }
}

function toggleAllCols(groups: Group[], staged: Set<ColKey>): Set<ColKey> {
  const all   = groups.flatMap(g => g.metas.filter(m => !m.alwaysVisible))
  const allOn = all.every(m => staged.has(m.key))
  const next  = new Set(staged)
  allOn ? all.forEach(m => next.delete(m.key)) : all.forEach(m => next.add(m.key))
  return next
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const useStyles = makeStyles(theme => ({
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  content:  { padding: theme.spacing(0, 3, 2) },

  paper: {
    height: '26rem', width: '100%',
    marginTop: '1rem', marginBottom: '1.5rem',
    border: `1px solid ${color2026.main.blue[700]}`,
    boxShadow: 'none', overflow: 'hidden',
    display: 'flex', flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
  },

  // ── Search / controls bar ──────────────────────────────────────────────────
  searchBar: {
    display: 'flex', alignItems: 'center', gap: theme.spacing(0.25),
    padding: theme.spacing(0.5, 0.75, 0.5, 0.25),
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  controlBtn: { padding: 6 },
  checkbox:   { padding: '4px 6px' },

  // ── Scrollable list ────────────────────────────────────────────────────────
  list: { flex: 1, overflowY: 'auto' as const },

  // ── Group row ──────────────────────────────────────────────────────────────
  groupRow: {
    display: 'flex', alignItems: 'center', minHeight: 36,
    paddingLeft: theme.spacing(0.25), paddingRight: theme.spacing(0.5),
    userSelect: 'none' as const,
    '&:hover': { background: theme.palette.action.hover },
  },
  groupRowDragOver: {
    borderTop: `2px solid ${color2026.main.blue[700]}`,
  },
  groupLabel: { fontSize: 14, fontWeight: 600, flex: 1 },
  dragHandle: {
    cursor: 'grab',
    color: theme.palette.text.disabled,
    display: 'flex', alignItems: 'center',
    padding: theme.spacing(0, 0.25),
    '&:active': { cursor: 'grabbing' },
    '&:hover': { color: theme.palette.text.secondary },
  },

  // ── Metric set pills ────────────────────────────────────────────────────────
  metricSetsRow: {
    display: 'flex', alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
  metricSetsLabel: {
    fontSize: 12, fontWeight: 600,
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },

  // ── Child rows ─────────────────────────────────────────────────────────────
  childRow: {
    display: 'flex', alignItems: 'center', minHeight: 32,
    paddingLeft: theme.spacing(7.5), paddingRight: theme.spacing(0.5),
  },
  rowLabel: { display: 'flex', alignItems: 'center', gap: theme.spacing(0.75) },
  label:    { fontSize: 14 },
  badge: {
    fontSize: 10, fontWeight: 500, color: theme.palette.text.secondary,
    background: theme.palette.action.hover, borderRadius: 999,
    padding: '1px 7px', lineHeight: 1.6, whiteSpace: 'nowrap' as const,
  },

  empty:      { textAlign: 'center' as const, color: theme.palette.text.secondary, fontSize: 13, padding: theme.spacing(4) },
  actionsRow: { justifyContent: 'flex-end' },
}))

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function TableSettingsModal({ open, onClose, visibleCols, onConfirm }: Props) {
  const classes = useStyles()

  const [staged,      setStaged]      = useState<Set<ColKey>>(new Set(visibleCols))
  const [searchQuery, setSearchQuery] = useState('')
  const [groupOrder,  setGroupOrder]  = useState<ColCategory[]>(INITIAL_ORDER)
  const [expanded,    setExpanded]    = useState<Set<ColCategory>>(new Set(INITIAL_ORDER))
  const [dragOver,    setDragOver]    = useState<ColCategory | null>(null)
  const dragFrom = useRef<ColCategory | null>(null)

  React.useEffect(() => {
    if (open) {
      setStaged(new Set(visibleCols))
      setSearchQuery('')
    }
  }, [open, visibleCols])

  // ── Derived data ──────────────────────────────────────────────────────────

  const q = searchQuery.toLowerCase().trim()

  const orderedGroups = useMemo(
    () => groupOrder.map(id => GROUP_BY_ID[id]).filter(Boolean),
    [groupOrder]
  )

  const visibleGroups = useMemo(() => {
    if (!q) return orderedGroups
    return orderedGroups.filter(g =>
      g.label.toLowerCase().includes(q) ||
      g.metas.some(m => (m.subLabel ?? m.label).toLowerCase().includes(q))
    )
  }, [orderedGroups, q])

  const filteredMetas = useCallback((group: Group) => {
    if (!q) return group.metas
    return group.metas.filter(m =>
      group.label.toLowerCase().includes(q) ||
      (m.subLabel ?? m.label).toLowerCase().includes(q)
    )
  }, [q])

  const allExpanded   = expanded.size === groupOrder.length
  const master        = masterCheckState(orderedGroups, staged)
  const activePreset  = METRIC_SETS.find(ms => setsEqual(ms.cols, staged))?.id ?? null

  // ── Accordion ─────────────────────────────────────────────────────────────

  const toggleExpand = useCallback((id: ColCategory) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleAllExpanded = useCallback(() => {
    setExpanded(allExpanded ? new Set() : new Set(INITIAL_ORDER))
  }, [allExpanded])

  // ── Column toggles ────────────────────────────────────────────────────────

  const toggle = useCallback((key: ColKey) => {
    setStaged(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  // ── Drag and drop ─────────────────────────────────────────────────────────

  const handleDragStart = useCallback((id: ColCategory) => (e: React.DragEvent) => {
    dragFrom.current = id
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((id: ColCategory) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOver !== id) setDragOver(id)
  }, [dragOver])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null)
  }, [])

  const handleDrop = useCallback((id: ColCategory) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = dragFrom.current
    if (!from || from === id) { setDragOver(null); return }
    setGroupOrder(prev => {
      const next = [...prev]
      const fi = next.indexOf(from)
      const ti = next.indexOf(id)
      if (fi === -1 || ti === -1) return prev
      next.splice(fi, 1)
      next.splice(ti, 0, from)
      // Rate group is always pinned first
      const ri = next.indexOf('rate')
      if (ri > 0) { next.splice(ri, 1); next.unshift('rate') }
      return next
    })
    dragFrom.current = null
    setDragOver(null)
  }, [])

  const handleDragEnd = useCallback(() => {
    dragFrom.current = null
    setDragOver(null)
  }, [])

  // ── Confirm / restore ─────────────────────────────────────────────────────

  const handleConfirm = () => {
    staged.add(COL.CURRENT)
    onConfirm(staged)
    saveVisibleCols(staged)
    onClose()
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle disableTypography>
        <div className={classes.titleRow}>
          <Typography variant="h6">Customize Table</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <Paper className={classes.paper}>

          {/* ── Controls / search bar ──────────────────────────────────── */}
          <div className={classes.searchBar}>
            <IconButton size="small" className={classes.controlBtn} onClick={toggleAllExpanded}>
              <ExpandMoreIcon
                style={{ fontSize: 18, transition: 'transform 0.15s', transform: allExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
              />
            </IconButton>
            <Checkbox
              className={classes.checkbox}
              checked={master.checked}
              indeterminate={master.indeterminate}
              onChange={() => setStaged(toggleAllCols(orderedGroups, staged))}
              size="small"
              color="primary"
            />
            <div style={{ flex: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Search columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                }}
              />
            </div>
          </div>

          {/* ── Column list ───────────────────────────────────────────── */}
          <div className={classes.list}>
            {visibleGroups.length === 0 && (
              <Typography className={classes.empty}>
                No columns match &ldquo;{searchQuery}&rdquo;
              </Typography>
            )}

            {visibleGroups.map(group => {
              const isExpanded = q ? true : expanded.has(group.id)
              const { checked, indeterminate } = groupCheckState(group, staged)
              const metas = filteredMetas(group)

              return (
                <div
                  key={group.id}
                  onDragOver={handleDragOver(group.id)}
                  onDrop={handleDrop(group.id)}
                  onDragLeave={handleDragLeave}
                  className={dragOver === group.id ? classes.groupRowDragOver : ''}
                >
                  {/* Group header */}
                  <div className={classes.groupRow}>
                    <IconButton
                      size="small"
                      className={classes.controlBtn}
                      onClick={() => toggleExpand(group.id)}
                      disabled={!!q}
                    >
                      <ExpandMoreIcon
                        style={{ fontSize: 18, transition: 'transform 0.15s', transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                      />
                    </IconButton>
                    <Checkbox
                      className={classes.checkbox}
                      checked={checked}
                      indeterminate={indeterminate}
                      onChange={() => setStaged(toggleGroupCols(group, staged))}
                      size="small"
                      color="primary"
                    />
                    <Typography className={classes.groupLabel}>{group.label}</Typography>
                    {group.id !== 'rate' && (
                      <div
                        className={classes.dragHandle}
                        draggable
                        onDragStart={handleDragStart(group.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <DragIndicatorIcon style={{ fontSize: 18 }} />
                      </div>
                    )}
                  </div>

                  {/* Child columns */}
                  {isExpanded && metas.map(meta => (
                    <div key={meta.key} className={classes.childRow}>
                      <Checkbox
                        className={classes.checkbox}
                        checked={!!meta.alwaysVisible || staged.has(meta.key)}
                        disabled={!!meta.alwaysVisible}
                        onChange={() => toggle(meta.key)}
                        size="small"
                        color="primary"
                      />
                      <span className={classes.rowLabel}>
                        <Typography className={classes.label}>
                          {meta.subLabel ?? meta.label}
                        </Typography>
                        {(meta.defaultVisible || meta.alwaysVisible) && (
                          <span className={classes.badge}>Default</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </Paper>

        {/* ── Metric set pills ──────────────────────────────────────── */}
        <div className={classes.metricSetsRow}>
          <Typography className={classes.metricSetsLabel}>Metric Sets</Typography>
          {METRIC_SETS.map(ms => (
            <Chip
              key={ms.id}
              label={ms.label}
              size="small"
              clickable
              color={activePreset === ms.id ? 'primary' : 'default'}
              variant={activePreset === ms.id ? 'default' : 'outlined'}
              onClick={() => setStaged(new Set(ms.cols))}
            />
          ))}
        </div>
      </DialogContent>

      <Divider />
      <Grid container className={classes.actionsRow}>
        <Grid item>
          <DialogActions>
            <Button onClick={onClose} color="primary" size="medium">Cancel</Button>
            <Button variant="contained" color="primary" size="medium" onClick={handleConfirm}>Apply</Button>
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  )
}
