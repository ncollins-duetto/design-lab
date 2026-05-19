'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import {
  COL,
  COL_DEFS,
  ColKey,
  CATEGORY_LABELS,
  DEFAULT_VISIBLE_COLS,
  METRIC_COLS,
  ColCategory,
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

const RATE_TOGGLEABLE: ColKey[] = [COL.RECOMMENDED, COL.OVERRIDE]

const METRIC_CATEGORIES: ColCategory[] = [
  'rate', 'occupancy', 'commitment', 'competitor', 'forecast', 'inventory', 'revenue',
]

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: 13,
    marginBottom: theme.spacing(1),
  },
  content: {
    minWidth: 380,
    maxHeight: 480,
    overflowY: 'auto',
    padding: theme.spacing(0, 3, 2),
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    height: 32,
  },
  lockedRow: {
    opacity: 0.5,
  },
  checkbox: {
    padding: '4px 8px',
  },
  label: {
    fontSize: 14,
  },
  actions: {
    padding: theme.spacing(1.5, 2),
    gap: theme.spacing(1),
  },
  restoreBtn: {
    marginRight: 'auto',
  },
}))

export default function TableSettingsModal({ open, onClose, visibleCols, onConfirm }: Props) {
  const classes = useStyles()
  const [staged, setStaged] = useState<Set<ColKey>>(new Set(visibleCols))

  // Reset staged state when modal opens
  React.useEffect(() => {
    if (open) setStaged(new Set(visibleCols))
  }, [open, visibleCols])

  const toggle = (key: ColKey) => {
    setStaged((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const handleConfirm = () => {
    // Always keep Current
    staged.add(COL.CURRENT)
    onConfirm(staged)
    saveVisibleCols(staged)
    onClose()
  }

  const handleRestore = () => {
    setStaged(new Set(DEFAULT_VISIBLE_COLS))
  }

  // Group metric columns by category for display
  const metricsByCategory = METRIC_CATEGORIES.reduce<Record<string, typeof METRIC_COLS>>(
    (acc, cat) => {
      const cols = METRIC_COLS.filter((c) => c.category === cat)
      if (cols.length) acc[cat] = cols
      return acc
    },
    {}
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle disableTypography>
        <div className={classes.title}>
          <Typography variant="h6">Table Settings</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <Typography className={classes.subtitle}>Customize Table Columns</Typography>
        <Divider />
      </DialogTitle>

      <DialogContent className={classes.content}>
        {/* Current — always locked */}
        <div className={`${classes.row} ${classes.lockedRow}`}>
          <Checkbox
            className={classes.checkbox}
            checked
            disabled
            size="small"
            color="primary"
          />
          <Typography className={classes.label}>Current</Typography>
        </div>

        {/* Toggleable rate columns */}
        {RATE_TOGGLEABLE.map((key) => {
          const meta = COL_DEFS.find((c) => c.key === key)!
          return (
            <div key={key} className={classes.row}>
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={staged.has(key)}
                    onChange={() => toggle(key)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography className={classes.label}>{meta.label}</Typography>}
              />
            </div>
          )
        })}

        <Divider style={{ marginTop: 8 }} />

        {/* Metric columns grouped by category */}
        {Object.entries(metricsByCategory).map(([cat, cols]) => (
          <div key={cat}>
            <Typography className={classes.sectionLabel}>
              {CATEGORY_LABELS[cat as ColCategory]}
            </Typography>
            {cols.map((meta) => (
              <div key={meta.key} className={classes.row}>
                <FormControlLabel
                  control={
                    <Checkbox
                      className={classes.checkbox}
                      checked={staged.has(meta.key)}
                      onChange={() => toggle(meta.key)}
                      size="small"
                      color="primary"
                    />
                  }
                  label={<Typography className={classes.label}>{meta.label}</Typography>}
                />
              </div>
            ))}
          </div>
        ))}
      </DialogContent>

      <Divider />
      <DialogActions className={classes.actions}>
        <Button className={classes.restoreBtn} onClick={handleRestore}>
          Restore Default
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
