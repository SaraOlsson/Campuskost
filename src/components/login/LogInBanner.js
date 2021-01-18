import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

export default function LogInBanner(props) {

    const classes = useStyles()
  
    return (
  
      <div className={classes.login_div}>
        <h3> Har du redan ett konto? </h3>
        <Button
          variant="contained"
          color="primary"
          onClick={props.onAction}
        >
          Logga in
        </Button>
      </div>
  
    )
  }

  const useStyles = makeStyles({
    login_div: {
      background: '#f5f5f5',
      padding: '1em',
      margin: '0.5em',
      borderRadius: '15px'
    },
    info_font: {
      fontStyle: 'italic',
      fontSize: 'small'
    }
  })