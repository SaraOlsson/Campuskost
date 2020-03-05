import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';


function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedInStatus, setSignedInStatus] = useState("Ej inloggad");

  const classes = useStyles();

  // const dispatch = useDispatch(); // be able to dispatch

  /**
   * Handles the sign in button press.
   */
  function toggleSignIn() {

    console.log("toggleSignIn")

    // sign out if signed in
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } else {

      if (email.length < 4) {
        alert('Ogiltig mailadress, måste innehålla mer än 4 tecken.');
        return;
      }
      if (password.length < 4) {
        alert('Ogiltigt lösenord, måste innehålla mer än 4 tecken.');
        return;
      }
      // Sign in with email and pass.
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          alert('fel lösenord.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    }
  }
  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {

    console.log("handleSignUp")

    if (email.length < 4) {
      alert('Ogiltig mailadress, måste innehålla mer än 4 tecken');
      return;
    }
    if (password.length < 4) {
      alert('Ogiltigt lösenord, måste innehålla mer än 4 tecken');
      return;
    }
    // Sign in with email and pass.
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == 'auth/weak-password') {
        alert('Lösenordet är för svagt.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
    console.log("signed up " + email);
  }

  function sendEmailVerification() {
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        alert('Email Verification Sent!');
      });
  }

  function resetPassword() {

      firebase.auth().sendPasswordResetEmail(email).then(function() {
        alert("sent password reset to email: " + email);
      }).catch(function(error) {
        // An error happened.
        console.log("could not send reset email")
      });
  }

  let signText = (firebase.auth().currentUser) ? "Logga ut" : "Logga in";
  let btn_color = (firebase.auth().currentUser) ? "secondary" : "primary";

  return (

    <div className={classes.login_div}>
    <p>Ange email and lösenord för att logga in eller skapa ett konto</p>

         <input type="text" name="email" placeholder="Email" onChange={evt => setEmail(evt.target.value)}/>

         &nbsp;&nbsp;&nbsp;
         <input type="password" name="password" placeholder="Password" onChange={evt => setPassword(evt.target.value)}/>

         <br/><br/>

         <Button
           variant="contained"
           color={btn_color}
           onClick={toggleSignIn}
         >
           {signText}
         </Button>

         &nbsp;&nbsp;&nbsp;

         <Button
           variant="contained"
           color="primary"
           onClick={handleSignUp}
         >
           Skapa konto
         </Button>

         <br/><br/>

         <Button
           variant="contained"
           color="secondary"
           onClick={resetPassword}
         >
           Återställ lösenord
         </Button>


    </div>

  );

}

/*
<OutlinedInput
  value={email}
  onChange={evt => setEmail(evt.target.value)}
/>*/

const useStyles = makeStyles({
  login_div: {
    background: '#f5f5f5',
    padding: '1em',
    margin: '0.5em',
    borderRadius: '15px'
 }
});

// <span id="quickstart-sign-in-status"> &nbsp; {signedInStatus} </span>
// <button onClick={sendEmailVerification} name="verify">Verifiera konto</button>

/*

<!--
<button id="quickstart-verify-email" onClick={handleChange} name="verify-email">Send Email Verification</button>
&nbsp;&nbsp;&nbsp;
<button id="quickstart-password-reset" onClick={handleChange} name="verify-email">Send Password Reset Email</button> --> */

export default Login;
