import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import LogInBanner from '../components/login/LogInBanner'
import LoginContainer from '../components/login/LoginContainer'
import SignupBanner from '../components/login/SignupBanner'
import SignUpContainer from '../components/login/SignUpContainer'


const LOGIN_STATE = "login"
const SIGNUP_STATE = "signup"

function LoginPage() {

  const { uid } = useSelector((state) => state.firebase.auth)
  const [state, setState] = useState(SIGNUP_STATE)

  const history = useHistory()

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

    <div>

      { // either login container..
        state === LOGIN_STATE &&
        <div>
          <LoginContainer onLogin={loginRoute}/>
          <SignupBanner onAction={() => setState(SIGNUP_STATE)} />
        </div>
      }

      { // ..or signup container
        state === SIGNUP_STATE &&
        <div>
          <SignUpContainer onLogin={loginRoute}/>
          <LogInBanner onAction={() => setState(LOGIN_STATE)}/>
        </div>
      }

    </div>

  )
}


export default LoginPage
