import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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

  const classes = useStyles();
  const state = useSelector(state => state.userReducer); // subscribe to the redux store
  console.log(state)

  function handleSignOut() {

    firebase.auth().signOut();
    setRedirect(true);

  }

  return (

    <div>

      {!state.signedIn ? <Redirect to={"/"} /> : null }

      <h1>Hey you</h1>
      {state.signedIn === false && <p> Hey you're not signed in. Things won't work here (redirect back) </p>  }
      <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>

    </div>

  );

}

export default ProfilePage;
