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
      propertyLabel="All Properties"
    >
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Duetto Prototype Template
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Replace this page with your prototype. See <code>CLAUDE.md</code> for instructions.
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" href="/example">
            View example page
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
