'use client'

import AppShell from '@/components/AppShell'
import { Typography, Box, Button } from '@material-ui/core'

export default function Home() {
  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Pricing & Strategy', href: '/' },
        { label: 'Your Prototype' },
      ]}
    >
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Duetto Design Lab
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Shared prototype environment. Add your prototype as a route and link to it here.
        </Typography>
        <Box mt={2} display="flex" gridGap={12}>
          <Button variant="contained" color="primary" href="/manage-rates/multi">
            Multi-Property Manage Rates
          </Button>
          <Button variant="contained" color="primary" href="/digital-sales-room">
            Digital Sales Room
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
