import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

export default function Banner(props) {

    const classes = useStyles()
  
    return (
  
      <div className={classes.login_div}>
        <h3> {props.header} {props.emoji}</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={props.onAction}
        >
          {props.buttonText}
        </Button>

        {props.children}
        
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