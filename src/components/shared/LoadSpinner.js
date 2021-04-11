import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import theme from "../../theme"

var Spinner = require('react-spinkit')

function LoadSpinner(props) {

  const classes = useStyles()

  return (
    <div className={classes.spinner}>
      <Spinner name={props.name || "ball-scale-multiple"} 
      color={props.color ? props.color : theme.palette.campuskost.teal} fadeIn="none"/>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  }
}))

export default LoadSpinner
