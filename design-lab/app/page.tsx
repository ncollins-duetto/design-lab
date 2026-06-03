'use client'

import React, { useState } from 'react'
import Tile from '@/components/Tile'
import { Typography, Box, Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PROJECTS, ALL_TEAMS, TEAM_LABELS, TeamSlug } from '@/lib/folders'

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: '100vh',
    background: theme.palette.background.default,
    padding: theme.spacing(6, 5),
  },
  content: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  chip: {
    fontSize: 14,
    fontWeight: 500,
    height: 36,
    borderRadius: 18,
    '& .MuiChip-label': {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  chipUnselected: {
    '& .MuiChip-label': {
      color: 'rgba(0,0,0,0.55)',
    },
  },
  emptyState: {
    gridColumn: '1 / -1',
    padding: theme.spacing(8, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  emptyTitle: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  emptySubtitle: {
    color: theme.palette.text.hint,
    fontSize: 14,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: theme.spacing(3),
  },
}))

type Filter = 'all' | TeamSlug

export default function Home() {
  const classes = useStyles()
  const [filter, setFilter] = useState<Filter>('all')

  const sorted = [...PROJECTS].sort((a, b) => b.committedAt - a.committedAt)

  const visible = filter === 'all'
    ? sorted
    : sorted.filter((p) => p.team === filter)

  const countFor = (team: TeamSlug) => PROJECTS.filter((p) => p.team === team).length

  return (
    <Box className={classes.page}>
      <Box className={classes.content}>
      <Typography variant="h3" className={classes.title}>
        Duetto Design Lab
      </Typography>
      <Typography variant="subtitle1" className={classes.subtitle}>
        A mock app for high velocity, high fidelity prototyping
      </Typography>

      <Box className={classes.chips}>
        <Chip
          label={`All (${PROJECTS.length})`}
          color={filter === 'all' ? 'primary' : 'default'}
          variant={filter === 'all' ? 'default' : 'outlined'}
          onClick={() => setFilter('all')}
          className={`${classes.chip} ${filter !== 'all' ? classes.chipUnselected : ''}`}
        />
        {ALL_TEAMS.map((team) => (
          <Chip
            key={team}
            label={`${TEAM_LABELS[team]} (${countFor(team)})`}
            color={filter === team ? 'primary' : 'default'}
            variant={filter === team ? 'default' : 'outlined'}
            onClick={() => setFilter(team)}
            className={`${classes.chip} ${filter !== team ? classes.chipUnselected : ''}`}
          />
        ))}
      </Box>

      <Box className={classes.grid}>
        {visible.length > 0 ? visible.map((project) => (
          <Tile
            key={project.slug}
            href={project.href}
            caption={TEAM_LABELS[project.team]}
            heroTitle={project.name}
            footerTitle={project.name}
            footerSub={project.committed}
            description={project.description}
            decoration={project.decoration}
          />
        )) : (
          <Box className={classes.emptyState}>
            <Typography variant="body1" className={classes.emptyTitle}>
              No prototypes yet
            </Typography>
            <Typography className={classes.emptySubtitle}>
              {filter !== 'all' ? `${TEAM_LABELS[filter as TeamSlug]} Team hasn't added any projects yet.` : ''}
            </Typography>
          </Box>
        )}
      </Box>
      </Box>
    </Box>
  )
}
