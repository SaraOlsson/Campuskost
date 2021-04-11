
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useFirebase } from 'react-redux-firebase'

export default function LoginContainer(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [feedback, setFeedback] = useState({color: 'green', message: ''})
    const [loginProblem, setLoginProblem] = useState(false)
  
    const classes = useStyles()
    const firebase = useFirebase()
  
    /**
     * Handles the sign in button press.
     */
    function toggleSignIn() {
  
      // sign out if signed in
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
      } else {
  
        if (email.length < 4 || password.length < 4) {
          setFeedback({color: 'red', message: 'Mailadress/lösenord måste innehålla mer än 4 tecken.'})
          return
        }
  
        // Sign in with email and pass.
        firebase.auth().signInWithEmailAndPassword(email, password).then( () => {
          setLoginProblem(false)
          setFeedback({color: 'green', message: 'Välkommen tillbaka!'})
          props.onLogin()
  
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
  
          if (errorCode === 'auth/wrong-password') {
            setFeedback({color: 'red', message: 'Fel lösenord.'})
            setLoginProblem(true)
            //alert('fel lösenord.')
          } else {
            alert(errorMessage)
          }
          console.log(error)
        })
      }
    }
  
    /* not used yet
    function sendEmailVerification() {
        firebase.auth().currentUser.sendEmailVerification().then(function() {
          // Email Verification sent!
          alert('Email Verification Sent!')
        })
    } */
  
    function resetPassword() {
  
        firebase.auth().sendPasswordResetEmail(email).then(function() {
          alert('sent password reset to email: ' + email)
        }).catch(function(error) {
          // An error happened.
          console.log('could not send reset email')
        })
    }
  
    let signText = (firebase.auth().currentUser) ? 'Logga ut' : 'Logga in'
    let btn_color = (firebase.auth().currentUser) ? 'secondary' : 'primary'
  
    return (
  
      <div className={classes.login_div}>
      <h3> Logga in </h3>
      <p>Ange email and lösenord för att logga in</p>
  
           <input type='text' name='email' placeholder='Email' onChange={evt => setEmail(evt.target.value)}/>
           &nbsp;&nbsp;&nbsp;
           <input type='password' name='password' placeholder='Password' onChange={evt => setPassword(evt.target.value)}/>
  
           <br/><br/>
  
           <Button
             variant='contained'
             color={btn_color}
             onClick={toggleSignIn}
           >
             {signText}
           </Button>
  
           &nbsp;&nbsp;&nbsp;
  
           { loginProblem === true &&
           <Button
             variant='contained'
             color='secondary'
             onClick={resetPassword}
           >
             Återställ lösenord
           </Button>
           }
  
           <br/><br/>
  
           <p style={{color: feedback.color}}> {feedback.message} </p>
  
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