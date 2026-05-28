'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Typography,
  Divider,
  IconButton,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import { color2026 } from '@duetto/duetto-components'
import {
  COL,
  COL_DEFS,
  ColMeta,
  ColKey,
  ColCategory,
  CATEGORY_LABELS,
  ALL_CATEGORIES,
  DEFAULT_VISIBLE_COLS,
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

const RATE_COLS   = COL_DEFS.filter((c) => c.category === 'rate')
const METRIC_CATS = ALL_CATEGORIES.filter((c): c is ColCategory => c !== 'rate')

const useStyles = makeStyles((theme) => ({
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing(0, 3, 2),
  },
  columnsTreePaper: {
    height: '26rem',
    width: '100%',
    marginTop: '1rem',
    marginBottom: '1.5rem',
    borderColor: color2026.main.blue[700],
    borderStyle: 'solid',
    borderWidth: '1px',
    boxSizing: 'border-box' as const,
    boxShadow: 'none',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  searchWrapper: {
    padding: theme.spacing(1, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  columnList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: theme.spacing(0.5, 0),
  },
  // ── Section labels (RATE / METRICS) ──────────────────────────────────────
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(2.5),
  },
  // ── Rows ─────────────────────────────────────────────────────────────────
  row: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 32,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1),
  },
  // indented child rows under a metric group
  childRow: {
    paddingLeft: theme.spacing(4.5),
  },
  checkbox: {
    padding: '4px 6px',
  },
  rowLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
  },
  label: {
    fontSize: 14,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  // ── Default chip — pill, light grey bg, capital D ────────────────────────
  defaultBadge: {
    fontSize: 10,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.action.hover,
    borderRadius: 999,
    padding: '1px 7px',
    lineHeight: 1.6,
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  // ── Empty state ───────────────────────────────────────────────────────────
  emptySearch: {
    textAlign: 'center' as const,
    color: theme.palette.text.secondary,
    fontSize: 13,
    padding: theme.spacing(4),
  },
  actionsContainer: {
    justifyContent: 'flex-end',
  },
}))

// ─── Small helpers ────────────────────────────────────────────────────────────

function DefaultBadge({ classes }: { classes: ReturnType<typeof useStyles> }) {
  return <span className={classes.defaultBadge}>Default</span>
}

function categoryState(
  metas: ColMeta[],
  staged: Set<ColKey>
): 'all' | 'some' | 'none' {
  const n = metas.filter((m) => staged.has(m.key)).length
  if (n === 0) return 'none'
  if (n === metas.length) return 'all'
  return 'some'
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function TableSettingsModal({ open, onClose, visibleCols, onConfirm }: Props) {
  const classes = useStyles()
  const [staged, setStaged] = useState<Set<ColKey>>(new Set(visibleCols))
  const [searchQuery, setSearchQuery] = useState('')

  React.useEffect(() => {
    if (open) {
      setStaged(new Set(visibleCols))
      setSearchQuery('')
    }
  }, [open, visibleCols])

  // ── Toggles ───────────────────────────────────────────────────────────────

  const toggle = useCallback((key: ColKey) => {
    setStaged((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  const toggleGroup = useCallback((metas: ColMeta[]) => {
    setStaged((prev) => {
      const state = categoryState(metas, prev)
      const next  = new Set(prev)
      if (state === 'all') {
        metas.forEach((m) => { if (!m.alwaysVisible) next.delete(m.key) })
      } else {
        metas.forEach((m) => next.add(m.key))
      }
      return next
    })
  }, [])

  const handleConfirm = () => {
    staged.add(COL.CURRENT)
    onConfirm(staged)
    saveVisibleCols(staged)
    onClose()
  }

  const handleRestore = () => setStaged(new Set(DEFAULT_VISIBLE_COLS))

  // ── Filtered data (respects search) ──────────────────────────────────────

  const q = searchQuery.toLowerCase().trim()

  const filteredRateCols = useMemo(
    () => (q ? RATE_COLS.filter((c) => c.label.toLowerCase().includes(q)) : RATE_COLS),
    [q]
  )

  const filteredMetricCats = useMemo(
    () =>
      METRIC_CATS.reduce<Array<{ cat: ColCategory; metas: ColMeta[] }>>((acc, cat) => {
        const metas = COL_DEFS.filter((c) => c.category === cat)
        const visible = q
          ? metas.filter(
              (c) =>
                (c.subLabel ?? c.label).toLowerCase().includes(q) ||
                c.label.toLowerCase().includes(q)
            )
          : metas
        if (visible.length) acc.push({ cat, metas: visible })
        return acc
      }, []),
    [q]
  )

  const hasResults = filteredRateCols.length > 0 || filteredMetricCats.length > 0

  // ── Row display text ──────────────────────────────────────────────────────

  const rowText = (meta: ColMeta) => meta.subLabel ?? meta.label

  // ─────────────────────────────────────────────────────────────────────────

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
        <Paper className={classes.columnsTreePaper}>
          {/* Search */}
          <div className={classes.searchWrapper}>
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

          <div className={classes.columnList}>
            {!hasResults && (
              <Typography className={classes.emptySearch}>
                No columns match &ldquo;{searchQuery}&rdquo;
              </Typography>
            )}

            {/* ── RATE section ─────────────────────────────────────────── */}
            {filteredRateCols.length > 0 && (
              <>
                <Typography className={classes.sectionLabel}>Rate</Typography>
                {filteredRateCols.map((meta) => (
                  <div key={meta.key} className={classes.row}>
                    <Checkbox
                      className={classes.checkbox}
                      checked={meta.alwaysVisible || staged.has(meta.key)}
                      disabled={!!meta.alwaysVisible}
                      onChange={() => toggle(meta.key)}
                      size="small"
                      color="primary"
                    />
                    <span className={classes.rowLabel}>
                      <Typography className={classes.label}>{meta.label}</Typography>
                      {(meta.defaultVisible || meta.alwaysVisible) && (
                        <DefaultBadge classes={classes} />
                      )}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* ── METRICS section ──────────────────────────────────────── */}
            {filteredMetricCats.length > 0 && (
              <>
                <Typography className={classes.sectionLabel}>Metrics</Typography>
                {filteredMetricCats.map(({ cat, metas }) => {
                  // Use ALL cols in category (not just filtered) for group toggle state
                  const allCatMetas = COL_DEFS.filter((c) => c.category === cat)
                  const state = categoryState(metas, staged)
                  return (
                    <div key={cat}>
                      {/* Group header row */}
                      <div className={classes.row}>
                        <Checkbox
                          className={classes.checkbox}
                          checked={state === 'all'}
                          indeterminate={state === 'some'}
                          onChange={() => toggleGroup(allCatMetas)}
                          size="small"
                          color="primary"
                        />
                        <Typography className={classes.groupLabel}>
                          {CATEGORY_LABELS[cat]}
                        </Typography>
                      </div>
                      {/* Child rows — indented */}
                      {metas.map((meta) => (
                        <div key={meta.key} className={`${classes.row} ${classes.childRow}`}>
                          <Checkbox
                            className={classes.checkbox}
                            checked={staged.has(meta.key)}
                            onChange={() => toggle(meta.key)}
                            size="small"
                            color="primary"
                          />
                          <span className={classes.rowLabel}>
                            <Typography className={classes.label}>{rowText(meta)}</Typography>
                            {meta.defaultVisible && <DefaultBadge classes={classes} />}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </Paper>
      </DialogContent>

      <Divider />
      <Grid container className={classes.actionsContainer}>
        <Grid item>
          <DialogActions>
            <Button onClick={onClose} color="primary" size="medium">
              Cancel
            </Button>
            <Button variant="outlined" color="primary" size="medium" onClick={handleRestore}>
              Restore Default
            </Button>
            <Button variant="contained" color="primary" size="medium" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  )
}
