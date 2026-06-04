'use client'

import { useState } from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AppShell from '@/components/AppShell'
import ArrowStepper from '@/components/ArrowStepper/ArrowStepper'
import { StepperModes } from '@/components/ArrowStepper/types/ArrowStepperTypes'

const useStyles = makeStyles((theme) => ({
  stepperBar: {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2, 3),
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}))

const STEPS = [
  { id: 'booking-details', label: 'Booking Details' },
  { id: 'summary', label: 'Summary' },
]

export default function GroupQuoteSummaryPage() {
  const classes = useStyles()
  const [currentStepId, setCurrentStepId] = useState('summary')

  return (
    <AppShell
      activeNav="groups"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Group' },
        { label: 'Quotes' },
      ]}
      defaultPropertyId="prop-1"
    >
      <Box className={classes.stepperBar}>
        <ArrowStepper
          steps={STEPS}
          currentStepId={currentStepId}
          mode={StepperModes.INTERACTIVE}
          onStepClick={setCurrentStepId}
        />
      </Box>
      <Box className={classes.placeholder}>
      </Box>
    </AppShell>
  )
}
