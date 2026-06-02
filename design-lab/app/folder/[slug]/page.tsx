'use client'

import { notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { Typography, Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getFolder } from '@/lib/folders'

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
  buttonStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
  },
  cta: {
    minWidth: 320,
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
  },
}))

export default function FolderPage({ params }: { params: { slug: string } }) {
  const classes = useStyles()
  const folder = getFolder(params.slug)
  if (!folder) notFound()

  return (
    <AppShell
      activeNav="pricing-strategy"
      breadcrumbs={[
        { label: 'Pricing & Strategy', href: '/' },
        { label: 'Duetto Design Lab', href: '/' },
        { label: folder.name },
      ]}
    >
      <Box className={classes.pageRoot}>
        <Typography variant="h4" className={classes.pageTitle}>
          {folder.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.pageSub}>
          {folder.projects.length} project{folder.projects.length === 1 ? '' : 's'}
        </Typography>

        <Box className={classes.buttonStack}>
          {folder.projects.map((project) => (
            <Button
              key={project.name}
              variant="contained"
              color="primary"
              size="large"
              href={project.href}
              className={classes.cta}
            >
              {project.name}
            </Button>
          ))}
        </Box>
      </Box>
    </AppShell>
  )
}
