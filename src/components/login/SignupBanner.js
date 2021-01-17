import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useHistory } from "react-router-dom"
import Emoji from '../shared/Emoji'

export default function SignupBanner(props) {

    const classes = useStyles()
    const history = useHistory()
  
    return (
  
      <div className={classes.login_div}>
        <h3> Ny på Campuskost? <Emoji symbol="🍼"/>  </h3>  
  
        <Button
          variant="contained"
          color="primary"
          onClick={props.onAction}
        >
          Skapa konto
        </Button>
  
        <p className={classes.info_font}>
          Det är gratis att ha ett konto på Campuskost. <br/>
          Läs mer om vilkor och användardata <a style={{color: 'blue'}} onClick={ () => history.push('/terms') }>här</a>.
        </p>
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