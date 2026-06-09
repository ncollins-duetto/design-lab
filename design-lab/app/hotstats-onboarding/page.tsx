'use client'

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import WarningIcon from '@material-ui/icons/Warning'
import InfoIcon from '@material-ui/icons/Info'
import LinkIcon from '@material-ui/icons/Link'
import AssessmentIcon from '@material-ui/icons/Assessment'
import AppShell from '@/components/AppShell'

const STEPS = [
  { id: 'connect', label: 'Connect HotStats' },
  { id: 'compset', label: 'Select Comp Set' },
  { id: 'validate', label: 'Validate Data' },
  { id: 'schedule', label: 'Schedule Sync' },
]

const COMP_SET_OPTIONS = [
  { id: '1', name: 'Paris 4-Star Hotels', count: 8, cities: 'Paris, Île-de-France' },
  { id: '2', name: 'Mediterranean Coastal', count: 12, cities: 'Nice, Cannes, Monaco' },
  { id: '3', name: 'Alpine Resort Properties', count: 6, cities: 'Chamonix, Megève' },
]

const KPI_SAMPLES = [
  { metric: 'Total RevPAR', value: '€187.42', status: 'valid', comp: '€162.18', diff: '+15.5%' },
  { metric: 'TRevPAR', value: '€142.67', status: 'valid', comp: '€138.42', diff: '+3.1%' },
  { metric: 'GOPPAR', value: '€96.18', status: 'valid', comp: '€89.54', diff: '+7.4%' },
  { metric: 'Occupancy %', value: '78.2%', status: 'valid', comp: '75.1%', diff: '+3.1pp' },
]

const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(4),
    maxWidth: 1000,
    margin: '0 auto',
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
  },
  stepper: {
    background: 'transparent',
    padding: theme.spacing(2, 0, 4, 0),
  },
  stepCard: {
    marginBottom: theme.spacing(3),
    minHeight: 300,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  fieldRow: {
    marginBottom: theme.spacing(3),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  compSetOption: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  compSetOptionSelected: {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: 'rgba(0, 100, 97, 0.05)',
  },
  validationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: 4,
  },
  validIcon: {
    color: '#4caf50',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    gap: theme.spacing(2),
  },
  successIcon: {
    fontSize: 80,
    color: '#4caf50',
  },
  table: {
    marginTop: theme.spacing(2),
  },
  positiveValue: {
    color: '#4caf50',
    fontWeight: 600,
  },
}))

export default function HotStatsOnboardingPage() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [accountId, setAccountId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [selectedCompSet, setSelectedCompSet] = useState('')
  const [syncTime, setSyncTime] = useState('06:00')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return accountId.trim().length > 0 && apiKey.trim().length > 0
      case 1:
        return selectedCompSet !== ''
      case 2:
        return true
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = async () => {
    setErrors([])
    if (activeStep === 0) {
      setLoading(true)
      // Simulate auth check
      await new Promise((r) => setTimeout(r, 1500))
      setLoading(false)
    }
    setActiveStep((s) => Math.min(s + 1, STEPS.length))
  }

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0))

  return (
    <AppShell
      activeNav="onboarding"
      breadcrumbs={[
        { label: 'Onboarding', href: '/' },
        { label: 'HotStats Onboarding' },
      ]}
      pageTitle="HotStats Onboarding"
    >
      <Box className={classes.page}>
        <Box className={classes.header}>
          <Typography variant="h4" className={classes.title}>
            Connect HotStats Benchmarking
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            Integrate daily KPI data, build your competitive comp set, and surface
            market position against peers. Takes ~5 minutes to set up.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
          {STEPS.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card className={classes.stepCard}>
          <CardContent>
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  HotStats API credentials
                </Typography>
                <Typography variant="body2" className={classes.subtitle} gutterBottom>
                  Paste your HotStats account ID and API key from your partner
                  account settings. We only store these encrypted and use them to
                  pull daily metrics.
                </Typography>
                {errors.length > 0 && (
                  <Alert severity="error" className={classes.alert}>
                    {errors[0]}
                  </Alert>
                )}
                <Divider style={{ margin: '24px 0' }} />
                <Box className={classes.fieldRow}>
                  <TextField
                    label="Account ID"
                    fullWidth
                    variant="outlined"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="e.g., HS-DETT-001"
                    disabled={loading}
                  />
                </Box>
                <Box className={classes.fieldRow}>
                  <TextField
                    label="API Key"
                    fullWidth
                    variant="outlined"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your 32-character API key"
                    disabled={loading}
                  />
                </Box>
                {loading && (
                  <Box className={classes.centerContent}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary">
                      Verifying credentials...
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Select your comp set
                </Typography>
                <Typography variant="body2" className={classes.subtitle} gutterBottom>
                  Choose a HotStats comp set that matches your property's market segment.
                  Comp sets are groups of 5–15 comparable properties in the same market.
                </Typography>
                <Divider style={{ margin: '24px 0' }} />
                {COMP_SET_OPTIONS.map((option) => (
                  <Box
                    key={option.id}
                    className={`${classes.compSetOption} ${
                      selectedCompSet === option.id ? classes.compSetOptionSelected : ''
                    }`}
                    onClick={() => setSelectedCompSet(option.id)}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Radio checked={selectedCompSet === option.id} />
                      <Box flex={1}>
                        <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.count} properties • {option.cities}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            )}

            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Validate KPI data
                </Typography>
                <Typography variant="body2" className={classes.subtitle} gutterBottom>
                  We pulled a 30-day sample from your comp set. Review the metrics below
                  to confirm they match your understanding of the market.
                </Typography>
                <Alert severity="success" className={classes.alert}>
                  <strong>Connected.</strong> All metrics loaded successfully from
                  HotStats.
                </Alert>
                <Divider style={{ margin: '24px 0' }} />
                <TableContainer>
                  <Table className={classes.table} size="small">
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>
                          <strong>Metric</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Your Property</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Comp Set Avg</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>vs. Comp</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {KPI_SAMPLES.map((row) => (
                        <TableRow key={row.metric}>
                          <TableCell>{row.metric}</TableCell>
                          <TableCell align="right" style={{ fontWeight: 600 }}>
                            {row.value}
                          </TableCell>
                          <TableCell align="right">{row.comp}</TableCell>
                          <TableCell align="right" className={classes.positiveValue}>
                            {row.diff}
                          </TableCell>
                          <TableCell align="center">
                            <CheckCircleIcon
                              style={{ color: '#4caf50', fontSize: 20 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {activeStep === 3 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Schedule daily sync
                </Typography>
                <Typography variant="body2" className={classes.subtitle} gutterBottom>
                  Choose a time each day for us to pull the latest KPI data from HotStats.
                  Syncs run even if your property is closed.
                </Typography>
                <Divider style={{ margin: '24px 0' }} />
                <Box className={classes.fieldRow}>
                  <Typography variant="subtitle2" gutterBottom>
                    Sync time (local property time)
                  </Typography>
                  <TextField
                    type="time"
                    value={syncTime}
                    onChange={(e) => setSyncTime(e.target.value)}
                    inputProps={{ step: '300' }}
                  />
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 8 }}>
                    Syncs complete within 15 minutes. Next sync:{' '}
                    <strong>
                      {syncTime} tomorrow
                    </strong>
                  </Typography>
                </Box>
                <Alert severity="info" className={classes.alert}>
                  After setup, KPI data appears in your Scoreboard under the
                  &quot;Benchmarking&quot; tab.
                </Alert>
              </>
            )}

            {activeStep === STEPS.length && (
              <Box className={classes.centerContent}>
                <CheckCircleIcon className={classes.successIcon} />
                <Typography variant="h5">HotStats connected</Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  Daily KPI syncs now scheduled for {syncTime} local time.
                  <br />
                  First sync runs tomorrow. View benchmark data in Scoreboard.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 24 }}
                  onClick={() => {
                    // Navigate to scoreboard
                  }}
                >
                  Go to Scoreboard
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {activeStep < STEPS.length && (
          <Box className={classes.actions}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Save & Next'}
            </Button>
          </Box>
        )}
      </Box>
    </AppShell>
  )
}
