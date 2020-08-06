import React, {useState} from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';


import Button from '@material-ui/core/Button';

const LOGIN_STATE = "login";
const SIGNUP_STATE = "signup";

function LoginPage() {

  const [state, setState] = useState(SIGNUP_STATE);

  const classes = useStyles();
  const history = useHistory();

  const loginRoute = () => {

    console.log("go to homepage");
    history.push("/home");
  }

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

  );
}

function SignUpContainer(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState({value: "", isValid: false});
  // const [validUsername, setValidUsername] = useState("");


  const [feedback, setFeedback] = useState({color: 'green', message: ""});

  const dispatch = useDispatch(); // be able to dispatch
  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();
  const firebase = useFirebase();

  const create_db_user_doc = () => {

    const usersRef = firestore.collection('users').doc(email);
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
        };

        console.log("create the document")
        usersRef.set(userObj); // create the document

        // set redux state
        dispatch({
          type: "SETFIREUSER",
          firestore_user: userObj
        })

      }

      props.onLogin();

    });

  }

  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {

    if (email.length < 4 || password.length < 4) {
      setFeedback({color: 'red', message: 'Mailadress/lösenord måste innehålla mer än 4 tecken.'});
      return;
    }

    // Sign in with email and pass.
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(value) {

      setFeedback({color: 'green', message: "Skapade ett konto för " + email});
      create_db_user_doc();

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/email-already-in-use')
        setFeedback({color: 'red', message: 'Ett konto med denna email finns redan.'});
      else if (errorCode === 'auth/weak-password')
        setFeedback({color: 'red', message: 'Lösenordet är för svagt.'});
    });
  }

  const handleUsername = () => {

    let current_username = username.value;

    if( current_username === "" ) {
      setFeedback({color: 'orange', message: 'Skriv först in ett användarnamn.'});
      return;
    }

    // not at every keypress..
    usenameIsAvailableCheck(current_username).then((is_available) => {

      setUsername({value: current_username, isValid: is_available});

      if(is_available === false)
        setFeedback({color: 'orange', message: 'Användarnamn upptaget.'});
      else
        setFeedback({color: 'green', message: 'Användarnamn ledigt.'});

    })
  }

  // setUsername({value: evt.target.value, isValid: false})}
  const editUsername = (username_textfield) => {

    setUsername({value: username_textfield, isValid: false});
    setFeedback({color: 'green', message: ""});
  }

  var usenameIsAvailableCheck = function(username_totry) {
    return new Promise((resolve, reject) => {

      // check if available
      let is_available = true;
      let query = firestore.collection('users').where('username', '==', username_totry).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            is_available = false;
          });
          resolve(is_available)
        })
    });
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

  );

}

function LoginContainer(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState({color: 'green', message: ""});
  const [loginProblem, setLoginProblem] = useState(false);

  const classes = useStyles();
  const firebase = useFirebase();

  /**
   * Handles the sign in button press.
   */
  function toggleSignIn() {

    // sign out if signed in
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } else {

      if (email.length < 4 || password.length < 4) {
        setFeedback({color: 'red', message: 'Mailadress/lösenord måste innehålla mer än 4 tecken.'});
        return;
      }

      // Sign in with email and pass.
      firebase.auth().signInWithEmailAndPassword(email, password).then( () => {
        setLoginProblem(false);
        setFeedback({color: 'green', message: 'Välkommen tillbaka!'});
        props.onLogin();

      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          setFeedback({color: 'red', message: 'Fel lösenord.'});
          setLoginProblem(true);
          //alert('fel lösenord.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    }
  }

  /* not used yet
  function sendEmailVerification() {
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        alert('Email Verification Sent!');
      });
  } */

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
    <h3> Logga in </h3>
    <p>Ange email and lösenord för att logga in</p>

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

         { loginProblem === true &&
         <Button
           variant="contained"
           color="secondary"
           onClick={resetPassword}
         >
           Återställ lösenord
         </Button>
         }

         <br/><br/>

         <p style={{color: feedback.color}}> {feedback.message} </p>

    </div>

  );

}

function SignupBanner(props) {

  const classes = useStyles();

  return (

    <div className={classes.login_div}>
      <h3> Ny på Campuskost? 🍼 </h3>

      <Button
        variant="contained"
        color="primary"
        onClick={props.onAction}
      >
        Skapa konto
      </Button>

      <p className={classes.info_font}>
        Det är gratis att ha ett konto på Campuskost. <br/>
        Läs mer om vilkor och användardata <a>här</a>.
      </p>
    </div>

  );
}

function LogInBanner(props) {

  const classes = useStyles();

  return (

    <div className={classes.login_div}>
      <h3> Har du redan ett konto? </h3>
      <Button
        variant="contained"
        color="primary"
        onClick={props.onAction}
      >
        Logga in
      </Button>
    </div>

  );
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
});

// <span id="quickstart-sign-in-status"> &nbsp; {signedInStatus} </span>
// <button onClick={sendEmailVerification} name="verify">Verifiera konto</button>

/*

<!--
<button id="quickstart-verify-email" onClick={handleChange} name="verify-email">Send Email Verification</button>
&nbsp;&nbsp;&nbsp;
<button id="quickstart-password-reset" onClick={handleChange} name="verify-email">Send Password Reset Email</button> --> */

export default LoginPage;
