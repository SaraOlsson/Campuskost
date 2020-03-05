import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
//import { HashRouter as BrowserRouter, Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { BrowserRouter as BrowserRouter, Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { incrementdispatch } from './actions/RecipeActions';
import './App.css';
import './style/GlobalCssButton.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import FeedPage from './pages/feedpage';
import ProfilePage from './pages/profilepage';
import NoticePage from './pages/noticepage';
import FavoritePage from './pages/favoritepage';
import UploadPage from './pages/uploadpage';
import RecipePage from './pages/recipepage';
import Login from './pages/login';
import Settings from './pages/settings';
import SearchPage from './pages/searchpage';
import TopMenuBar from './components/topmenubar';
// import Feed from './pages/feedpage';

import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge';

import PublishIcon from '@material-ui/icons/PublishRounded';
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

require('dotenv').config();
//
const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

// for PWA - needed?
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  deferredPrompt.prompt();

  // Update UI notify the user they can add to home screen
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
  });

});

let db = undefined;
function initFirebase() {

  console.log("run initFirebase")

  const firebaseConfig = {
    apiKey: API_KEY, // "AIzaSyAq0vTBf0o5MckjHcCOJiJ_DRK8v_UZY88",
    authDomain: "campuskost-firebase.firebaseapp.com",
    databaseURL: "https://campuskost-firebase.firebaseio.com",
    projectId: "campuskost-firebase",
    storageBucket: "campuskost-firebase.appspot.com",
    messagingSenderId: "477692438735",
    appId: "1:477692438735:web:2e6dce163d7f7ce8baafba",
    measurementId: "G-MDB52ZHJER"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  //const storage = firebase.storage();
  let storage = 1;

  return [db, storage];
}


function App(props) {

  // const [signedIn, setSignedIn] = React.useState(false);
  const [value, setValue] = React.useState('default');
  const [redirect, setRedirect] = React.useState(false);

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const state_user = useSelector(state => state.userReducer); // subscribe to the redux store
  const store = useSelector(state => state.fireReducer); // subscribe to the redux store

  //console.log(state_user)

  // start auth listener
  useEffect(() => {

    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: user ? "SIGNIN" : "SIGNOUT" })

      // if user is signed in
      if( user ) {

        dispatch({
          type: "SETUSER",
          auth_user: user
        })

        const user_id = user.uid;
        const user_email = user.email;
      //  console.log("userId: " + user_id)
      //  console.log("user_email: " + user_email)
      //  console.log(user)

        // check with firestore data
        // const document = store.db.doc('users/' + user_id);
        const usersRef = db.collection('users').doc(user_email);

        usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {
              // do stuff with the data
              console.log("user exists in firestore")
              //console.log(doc.data())

              dispatch({
                type: "SETFIREUSER",
                firestore_user: doc.data()
              })

            });
          } else {

            let userObj = {
              email: user_email,
              username: "DefaultChef",
              university: "",
              fullname: "Master Chef"
            };

            console.log("create the document")
            usersRef.set(userObj); // create the document

            dispatch({
              type: "SETFIREUSER",
              firestore_user: userObj
            })
          }
      });

        // Enter new data into the document.
        /*
        document.set({
          user: username,
          title: recipe_name,
          img: "temp_food2",
          ingredients: temp_i,
          description: temp_d
        }).then(() => {
          // Document created successfully.
          console.log( "Document created/updated successfully.")
        }); */

      } // end if user
      else {

      dispatch({
        type: "SETUSER",
        user: undefined
      })

      }

    });

    // end auth

  }, []); // end useEffect


  if(db === undefined) // init firebase once
  {
    let storage;
    [db, storage] = initFirebase();
    dispatch({ type: "SETDB", db: db });
    dispatch({ type: "SETSTORAGE", storage: storage });
  }

  const handleChange = (event = undefined, newValue) => {

    console.log("heello" + newValue + ".")

    //history.push("/" + value);
    //setRedirect(true);
    //setValue(newValue);

  };

  // console.log("redirect: " + redirect)

/*

<div className={classes.headerrow}>
<ProfileBtn signedIn={state_user.signedIn} handleChange={handleChange}/>
</div>

*/

  // to={{ ...location, pathname: "/welcome" }}
  // to={"/" + value}
  // {redirect ? <Redirect to={{ ...window.location, pathname: "/" + value }} /> : null }

  return (
    <div className="body">

      <BrowserRouter>
      <div>

        <div className={classes.headerrow}>
        <TopMenuBar signedIn={state_user.signedIn} handleChange={handleChange}/>
        </div>

        <div className={classes.mainContainer}>

          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile/:user" component={ProfilePage} />
            <Route path="/upload" component={UploadPage} />
            <Route path="/notices" component={NoticePage} />
            <Route path="/saved" component={FavoritePage} />
            <Route path="/recipe/:recipetitle/:id" component={RecipePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/home" component={FeedPage}/>
            <Redirect exact path="/" to="/home" />

          </Switch>

        </div>
        <div className={classes.footer}>
          <BottomMenuBar/>
        </div>

      </div>
      </BrowserRouter>

    </div>
  ); // <Redirect path="*" to="/home" />
}

function BottomMenuBar() {

  const [value, setValue] = React.useState('default');

  const history = useHistory();
  const classes = useStyles();
  const upload_store = useSelector(state => state.uploadReducer);
  const dispatch = useDispatch();

  const handleMenuClick = (event = undefined, val) => {
    setValue(val);
    history.push("/" + val);

    dispatch({
      type: "SETDESCRIPTIONS",
      descriptions: undefined
    })

    dispatch({
      type: "SETINGREDIENTS",
      ingredients: undefined
    })

    dispatch({
      type: "SETTITLE",
      title: undefined
    })

    if(val != "upload" && upload_store.editmode == true) {
      dispatch({
        type: "SETEDITMODE",
        editmode: false
      })

    }

  };

  return (

    <BottomNavigation value={value} onChange={ (evt,value) => handleMenuClick(evt, value) } className={classes.bottomMenu}>
      <BottomNavigationAction label="Flöde" value="home" icon={<HomeRoundedIcon />} />
      <BottomNavigationAction label="Ladda up" value="upload" icon={<PublishIcon />} />
      <BottomNavigationAction label="Notiser" value="notices" icon={<Badge badgeContent={3} color="secondary"><NotificationsIcon /></Badge>} />
      <BottomNavigationAction label="Sparat" value="saved" icon={<LoyaltyRoundedIcon />} />
    </BottomNavigation>

  );

}

// margin: -15px -11px 50px -15px;

const useStyles = makeStyles({
  body: {
    padding: 15,
    paddingTop: '35px'
  },
  mainContainer: {
    paddingTop: '50px',
    paddingBottom: '50px'
  },
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: 100 + '%',
    display: 'flex',
    justifyContent: 'center'
  },
  headerrow: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: 100 + '%'
  },
  profileBtn: {
    color: 'green'
  },
  bottomMenu: {
    width: 500,
  }

});

export default App;
