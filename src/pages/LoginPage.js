import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import Banner from '../components/login/Banner'
import LoginContainer from '../components/login/LoginContainer'
import SignUpContainer from '../components/login/SignUpContainer'
import Emoji from '../components/shared/Emoji'


const LOGIN_STATE = "login"
const SIGNUP_STATE = "signup"

function LoginPage() {

  const { uid } = useSelector((state) => state.firebase.auth)
  const [state, setState] = useState(SIGNUP_STATE)

  const history = useHistory()
  const classes = useStyles()

  const loginRoute = () => {
    history.push("/home")
  }

  useEffect(() => {
    if(uid) {
      loginRoute()
    }
  }, [uid]) 

  // render one container and the opposite banner
  return (

    <>

      { // either login container..
        state === LOGIN_STATE &&
        <>
          <LoginContainer onLogin={loginRoute}/>
          {/* <SignupBanner onAction={() => setState(SIGNUP_STATE)} /> */}
          <Banner
              header="Har du redan ett konto?"
              emoji={<Emoji symbol="🍼"/>}
              buttonText="Skapa konto"
              onAction={() => setState(SIGNUP_STATE)}  
          >
            <p className={classes.info_font}>
            Det är gratis att ha ett konto på Campuskost. <br/>
            Läs mer om vilkor och användardata <a style={{color: 'blue'}} onClick={ () => history.push('/terms') }>här</a>.
            </p>
          </Banner>
        </>
      }

      { // ..or signup container
        state === SIGNUP_STATE &&
        <>
          <SignUpContainer onLogin={loginRoute}/>
          {/* <LogInBanner onAction={() => setState(LOGIN_STATE)}/> */}
          <Banner
              header="Har du redan ett konto?"
              buttonText="Logga in"
              onAction={() => setState(LOGIN_STATE)}
          />
        </>
      }

    </>

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

export default LoginPage
