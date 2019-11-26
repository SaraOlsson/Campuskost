import React, {useState, useEffect} from 'react';
import { BrowserRouter as Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import firebase from 'firebase/app';
import 'firebase/auth';

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});
// () =>
function ProfilePage(props) {

  const [signedIn, setSignedIn] = React.useState(false);

  // start auth listener
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
        let signed_in_bool = (user) ? true : false;
        setSignedIn(signed_in_bool);
    });
  }, []);

  console.log("signedIn: " + signedIn)

  const classes = useStyles();

  // console.log(props)

  return (

    <div>
    <h1>Hey you</h1>

    {signedIn === false && <p> Hey you're not signed in. Things won't work here (redirect back) </p>  }

    <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>

    </div>

  );

}

export default ProfilePage;
