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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.25),
    padding: theme.spacing(0.5, 0.75, 0.5, 0.25),
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
    paddingLeft: theme.spacing(7.5),
  },
  chevronBtn: {
    padding: 4,
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
  const [expanded, setExpanded] = useState<Set<ColCategory>>(new Set(ALL_CATEGORIES))

  React.useEffect(() => {
    if (open) {
      setStaged(new Set(visibleCols))
      setSearchQuery('')
      setExpanded(new Set(ALL_CATEGORIES))
    }
  }, [open, visibleCols])

  const toggleExpand = useCallback((cat: ColCategory) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }, [])

  const allToggleableCols = useMemo(() => COL_DEFS.filter((c) => !c.alwaysVisible), [])
  const allExpanded = expanded.size === ALL_CATEGORIES.length

  const toggleAllExpanded = useCallback(() => {
    setExpanded(allExpanded ? new Set() : new Set(ALL_CATEGORIES))
  }, [allExpanded])

  const toggleAllCols = useCallback(() => {
    setStaged((prev) => {
      const state = categoryState(allToggleableCols, prev)
      const next = new Set(prev)
      if (state === 'all') {
        allToggleableCols.forEach((m) => next.delete(m.key))
      } else {
        allToggleableCols.forEach((m) => next.add(m.key))
      }
      return next
    })
  }, [allToggleableCols])

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
  const masterState = categoryState(allToggleableCols, staged)
  const rateGroupState = categoryState(RATE_COLS.filter((m) => !m.alwaysVisible), staged)
  const rateExpanded = q ? true : expanded.has('rate' as ColCategory)

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
          {/* Search + master controls */}
          <div className={classes.searchWrapper}>
            <IconButton size="small" className={classes.chevronBtn} onClick={toggleAllExpanded} disabled={!!q}>
              <ExpandMoreIcon
                style={{ fontSize: 18, transition: 'transform 0.15s', transform: allExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
              />
            </IconButton>
            <Checkbox
              className={classes.checkbox}
              checked={masterState === 'all'}
              indeterminate={masterState === 'some'}
              onChange={toggleAllCols}
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

          <div className={classes.columnList}>
            {!hasResults && (
              <Typography className={classes.emptySearch}>
                No columns match &ldquo;{searchQuery}&rdquo;
              </Typography>
            )}

            {/* ── RATE section ─────────────────────────────────────────── */}
            {filteredRateCols.length > 0 && (
              <>
                <div className={classes.row}>
                  <IconButton size="small" className={classes.chevronBtn} onClick={() => toggleExpand('rate' as ColCategory)} disabled={!!q}>
                    <ExpandMoreIcon
                      style={{ fontSize: 18, transition: 'transform 0.15s', transform: rateExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                    />
                  </IconButton>
                  <Checkbox
                    className={classes.checkbox}
                    checked={rateGroupState === 'all'}
                    indeterminate={rateGroupState === 'some'}
                    onChange={() => toggleGroup(RATE_COLS)}
                    size="small"
                    color="primary"
                  />
                  <Typography className={classes.groupLabel}>Rates</Typography>
                </div>
                {rateExpanded && filteredRateCols.map((meta) => (
                  <div key={meta.key} className={`${classes.row} ${classes.childRow}`}>
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
                {filteredMetricCats.map(({ cat, metas }) => {
                  const allCatMetas = COL_DEFS.filter((c) => c.category === cat)
                  const state = categoryState(metas, staged)
                  const isExpanded = q ? true : expanded.has(cat)
                  return (
                    <div key={cat}>
                      {/* Group header row */}
                      <div className={classes.row}>
                        <IconButton
                          size="small"
                          className={classes.chevronBtn}
                          onClick={() => toggleExpand(cat)}
                          disabled={!!q}
                        >
                          <ExpandMoreIcon
                            style={{
                              fontSize: 18,
                              transition: 'transform 0.15s',
                              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                            }}
                          />
                        </IconButton>
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
                      {isExpanded && metas.map((meta) => (
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
