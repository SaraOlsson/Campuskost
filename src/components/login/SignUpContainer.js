import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import { useFirebase, useFirestore } from "react-redux-firebase"

export default function SignUpContainer(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState({value: "", isValid: false})
  
  
    const [feedback, setFeedback] = useState({color: 'green', message: ""})
  
    const dispatch = useDispatch() // be able to dispatch
    const classes = useStyles()
    const firestore = useFirestore()
    const firebase = useFirebase()
  
    const create_db_user_doc = () => {
  
      const usersRef = firestore.collection('users').doc(email)
      // connect to firebase and check if a user doc for this email exists
      usersRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          // should not be possible
        } else {
  
          // prepare to create firestore doc as this user signed in for the first time
          let userObj = {
            email: email,
            username: username.value,
            university: "",
            fullname: "",
            bio: "",
            profile_img_url: ""
          }
  
          console.log("create the document")
          usersRef.set(userObj) // create the document
  
          // set redux state
          dispatch({
            type: "SETFIREUSER",
            firestore_user: userObj
          })
  
        }
  
        props.onLogin()
  
      })
  
    }
  
    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
  
      if (email.length < 4 || password.length < 4) {
        setFeedback({color: 'red', message: 'Mailadress/lösenord måste innehålla mer än 4 tecken.'})
        return
      }
  
      // Sign in with email and pass.
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(value) {
  
        setFeedback({color: 'green', message: "Skapade ett konto för " + email})
        create_db_user_doc()
  
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
  
        if (errorCode === 'auth/email-already-in-use')
          setFeedback({color: 'red', message: 'Ett konto med denna email finns redan.'})
        else if (errorCode === 'auth/weak-password')
          setFeedback({color: 'red', message: 'Lösenordet är för svagt.'})
      })
    }
  
    const handleUsername = () => {
  
      let current_username = username.value
  
      if( current_username === "" ) {
        setFeedback({color: 'orange', message: 'Skriv först in ett användarnamn.'})
        return
      }
  
      // not at every keypress..
      usenameIsAvailableCheck(current_username).then((is_available) => {
  
        setUsername({value: current_username, isValid: is_available})
  
        if(is_available === false)
          setFeedback({color: 'orange', message: 'Användarnamn upptaget.'})
        else
          setFeedback({color: 'green', message: 'Användarnamn ledigt.'})
  
      })
    }
  
    // setUsername({value: evt.target.value, isValid: false})}
    const editUsername = (username_textfield) => {
  
      setUsername({value: username_textfield, isValid: false})
      setFeedback({color: 'green', message: ""})
    }
  
    var usenameIsAvailableCheck = function(username_totry) {
      return new Promise((resolve, reject) => {
  
        // check if available
        let is_available = true
        firestore.collection('users').where('username', '==', username_totry).get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              is_available = false
            })
            resolve(is_available)
          })
      })
    }
  
    return (
  
      <div className={classes.login_div}>
      <h3> Skapa konto </h3>
      <p>Ange email and lösenord för att skapa ett konto</p>
  
           <input autoComplete="off" value={email} type="email" placeholder="Email" onChange={evt => setEmail(evt.target.value)}/>
           &nbsp;&nbsp;&nbsp;
           <input autoComplete="off" value={password} type="password" placeholder="Password" onChange={evt => setPassword(evt.target.value)}/>
           <br/><br/>
           <input autoComplete="off" value={username.value} type="text" placeholder="Usename" onChange={evt => editUsername(evt.target.value)}/>
  
           <Button
             variant="contained"
             color="primary"
             onClick={handleUsername}
             style={{marginLeft: 20}}
           >
           Ledigt?
           </Button>
  
           <br/><br/>
  
           <Button
             variant="contained"
             color="primary"
             onClick={handleSignUp}
             disabled={!username.isValid}
           >
             Skapa konto
           </Button>
  
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