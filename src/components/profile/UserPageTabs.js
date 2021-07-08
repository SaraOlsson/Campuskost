import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React from 'react'
import {useTranslation} from 'react-i18next'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function SimpleTabs(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const {t} = useTranslation('common')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
          <Tab label={t('shared.recipes')} {...a11yProps(0)} />
          <Tab label={t('shared.lists')} {...a11yProps(1)} />
          <Tab label={t('shared.followers')} {...a11yProps(2)} />
          <Tab label={t('shared.follows')} {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {props.children[0]}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.children[1]}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {props.children[2]}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {props.children[3]}
      </TabPanel>
    </div>
  )
}
