import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedInStatus, setSignedInStatus] = useState("Ej inloggad");
  const [signContext, setSignContext ] = useState("Logga in");

  const dispatch = useDispatch(); // be able to dispatch
  // const state = useSelector(state => state.userReducer); // subscribe to the redux store
  // console.log(state)


  // init app only once
  /*
  useEffect(() => {
    initApp();
  }, []); */

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
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
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

  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
   /*
  function initApp() {

    console.log("initApp")

    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        // console.log('user json: ')
        //console.log(JSON.stringify(user, null, '  '))

        setSignedInStatus('Inloggad');
        setSignContext('Logga ut');

        dispatch({
          type: "SIGNIN",
          signedIn: ""
        })


      } else {
        // User is signed out.
        setSignedInStatus('Ej inloggad');
        setSignContext('Logga in');

        dispatch({
          type: "SIGNOUT",
          signedIn: ""
        })
      }

    });
    // [END authstatelistener]
  }
*/
  return (

    <div>
    <p>Ange email and lösenord för att logga in eller skapa ett konto</p>

         <input type="text" name="email" placeholder="Email" onChange={evt => setEmail(evt.target.value)}/>
         &nbsp;&nbsp;&nbsp;
         <input type="password" name="password" placeholder="Password" onChange={evt => setPassword(evt.target.value)}/>

         <br/><br/>
         <button onClick={toggleSignIn} name="signin"> {signContext} </button>
         &nbsp;&nbsp;&nbsp;
         <button onClick={handleSignUp} name="signup">Skapa konto</button>
         &nbsp;&nbsp;&nbsp;
         <button onClick={sendEmailVerification} name="verify">Verifiera konto</button>

         <span id="quickstart-sign-in-status"> &nbsp; {signedInStatus} </span>

    </div>

  );

}

/*

<!--
<button id="quickstart-verify-email" onClick={handleChange} name="verify-email">Send Email Verification</button>
&nbsp;&nbsp;&nbsp;
<button id="quickstart-password-reset" onClick={handleChange} name="verify-email">Send Password Reset Email</button> --> */

export default Login;
