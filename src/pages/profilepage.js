import React, {useState, useEffect} from 'react';
import { BrowserRouter as Link, Redirect} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import firebase from 'firebase/app';
import 'firebase/auth';

const useMountEffect = (fun) => useEffect(fun, []);

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});
// () =>
function ProfilePage(props) {

  const [signedIn, setSignedIn] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  /*
  function auth_user() {
    firebase.auth().onAuthStateChanged(user => {
            if (user)  {
              // console.log("user signed in")
              setSignedIn(true);
            }
            else {
              // console.log("user NOT signed in")
              setSignedIn(false);
            }
    });
  } */

  //useMountEffect(auth_user); // function will run only once after it has mounted.

  function handleSignOut() {

    firebase.auth().signOut();
    //setRedirect(true);

  }
  // () => firebase.auth().signOut()
  console.log("signedIn: " + signedIn)

  const classes = useStyles();

  // console.log(props)

  return (

    <div>

    {redirect ? <Redirect to={"/"} /> : null }

    <h1>Hey you</h1>

    {signedIn === false && <p> Hey you're not signed in. Things won't work here (redirect back) </p>  }

    <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>

    </div>

  );

}

export default ProfilePage;
