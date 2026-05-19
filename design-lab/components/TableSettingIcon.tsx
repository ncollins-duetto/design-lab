import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TableChartIcon from '@material-ui/icons/TableChart'
import SettingsIcon from '@material-ui/icons/Settings'

const useStyles = makeStyles({
  root: {
    width: '1.2rem',
    height: '1.2rem',
    position: 'relative',
    paddingLeft: 2,
  },
  table: {
    width: '100%',
    height: '100%',
    clipPath: 'polygon(0px 0px, 100% 0px, 100% 50%, 70% 50%, 70% 100%, 0px 100%)',
  },
  settings: {
    position: 'absolute',
    top: '0.6rem',
    left: '0.75rem',
    width: '55%',
    height: '55%',
    paddingLeft: 2,
  },
})

export default function TableSettingIcon() {
  const classes = useStyles()
  return (
    <span className={classes.root}>
      <TableChartIcon className={classes.table} />
      <SettingsIcon className={classes.settings} />
    </span>
  )
}
