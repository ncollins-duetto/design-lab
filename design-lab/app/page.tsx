'use client'

import AppShell from '@/components/AppShell'
import Tile from '@/components/Tile'
import { Typography, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FOLDERS } from '@/lib/folders'

const useStyles = makeStyles((theme) => ({
  pageRoot: {
    padding: theme.spacing(4),
    maxWidth: 1280,
    margin: '0 auto',
  },
  pageTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  pageSub: {
    marginBottom: theme.spacing(4),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: theme.spacing(3),
  },
}))

const FOLDER_DECORATION = {
  'strategy-team': 'rates',
  'onboarding-team': 'sales-room',
  'group': 'group',
  'resorts': 'resorts',
  'pricing': 'pricing',
  'detection-exploration': 'exploration',
} as const

export default function Home() {
  const classes = useStyles()
  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Pricing & Strategy', href: '/' },
        { label: 'Duetto Design Lab' },
      ]}
    >
      <Box className={classes.pageRoot}>
        <Typography variant="h4" className={classes.pageTitle}>
          Duetto Design Lab
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.pageSub}>
          Pick a team folder to open its prototypes.
        </Typography>

        <Box className={classes.grid}>
          {FOLDERS.map((folder) => (
            <Tile
              key={folder.slug}
              href={`/folder/${folder.slug}`}
              caption="Team Folder"
              heroTitle={folder.name}
              footerTitle={folder.name}
              footerSub={`${folder.projects.length} project${folder.projects.length === 1 ? '' : 's'} · ${folder.edited}`}
              decoration={FOLDER_DECORATION[folder.slug as keyof typeof FOLDER_DECORATION] ?? 'design-system'}
            />
          ))}
        </Box>
      </Box>
    </AppShell>
  )
}
