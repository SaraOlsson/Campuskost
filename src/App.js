import React, {useState, useEffect} from 'react';
import { HashRouter as BrowserRouter, Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// import { useHistory } from "react-router-dom";
// import { incrementdispatch } from './actions/RecipeActions';
import * as serviceWorker from './serviceWorker';

import MySnackbar from './components/snackbar';
// import our css
import './App.css';
import './style/GlobalCssButton.css';

// import our page components
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
import ListPage from './pages/listpage';

// import material UI components
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

import {Helmet} from "react-helmet";

require('dotenv').config(); // check if we need this

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

// initiate Firebase
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

// main component of the app
function App(props) {

  const [value, setValue] = React.useState('default');
  const [redirect, setRedirect] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const state_user = useSelector(state => state.userReducer); // subscribe to the redux store
  const store = useSelector(state => state.fireReducer); // subscribe to the redux store

  useEffect(() => {

    // console.log(serviceWorker.hasUpdates)

    if(serviceWorker.hasUpdates === true) {
      setOpenUpdateDialog(true);
    }

  }, [serviceWorker.hasUpdates]); // end useEffect

  // runs once on start
  useEffect(() => {

    // set listener for authentication changes
    // either only set redux object or also create firestore instance
    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: user ? "SIGNIN" : "SIGNOUT" })

      // if user is signed in, set redux object
      if( user ) {

        // dispatch auth info (such as last time logged in etc)
        dispatch({
          type: "SETUSER",
          auth_user: user
        })

        const user_id = user.uid;
        const user_email = user.email;

        const usersRef = db.collection('users').doc(user_email);
        // connect to firebase and check if a user doc for this email exists
        usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {

              console.log("user exists in firestore")

              // dispatch user doc info (such as username, other info set in the app)
              dispatch({
                type: "SETFIREUSER",
                firestore_user: doc.data()
              })

            });
          } else {

            // prepare to create firestore doc as this user signed in for the first time
            let userObj = {
              email: user_email,
              username: "DefaultChef",
              university: "",
              fullname: "Master Chef"
            };

            console.log("create the document")
            usersRef.set(userObj); // create the document

            // set redux state
            dispatch({
              type: "SETFIREUSER",
              firestore_user: userObj
            })
          }
      });

      } // end if user
      else {

        // no user is signed in
        dispatch({
          type: "SETUSER",
          user: undefined
        })

      }

    }); // end auth listener

  }, []); // end useEffect


  if(db === undefined) // init firebase once
  {
    let storage;
    [db, storage] = initFirebase();
    dispatch({ type: "SETDB", db: db });
    dispatch({ type: "SETSTORAGE", storage: storage });
  }

  const closeDialog = (action) => {
    setOpenUpdateDialog(false);
  };

  // used in TopMenuBar, which needs to be refactored
  const handleChange = (event = undefined, newValue) => {

    console.log("heello" + newValue + ".")

  };

  let update_message = 'New content is available and will be used when all tabs for this page are closed';

  // jsx code, looks like html
  // renders top bar, page content and bottom bar.
  // page content is based on url, defined with Route objects
  return (
    <div className="body">

      <Helmet>
          <meta charSet="utf-8" />
          <title>My Title</title>
          <link rel="canonical" href="https://campuskost.se" />
      </Helmet>

      <BrowserRouter>
      <div>

        <div className={classes.headerrow}>
        <TopMenuBar signedIn={state_user.signedIn} handleChange={handleChange}/>
        </div>

        <div className={classes.mainContainer}>

          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile/:username_url" component={ProfilePage} />
            <Route path="/upload" component={UploadPage} />
            <Route path="/notices" component={NoticePage} />
            <Route path="/saved" component={ListPage} />
            <Route path="/recipe/:recipetitle/:id" component={RecipePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/home" component={FeedPage}/>
            <Route path="/lists" component={ListPage}/>
            <Route component={FeedPage} />

          </Switch>

          <MySnackbar open={openUpdateDialog} handleClose={closeDialog} message={update_message} action={""}/>

        </div>
        <div className={classes.footer}>
          <BottomMenuBar/>
        </div>

      </div>
      </BrowserRouter>

    </div>
  );
}

// extract as individual component
function BottomMenuBar() {

  const [value, setValue] = React.useState('default');

  const history = useHistory();
  const classes = useStyles();
  const upload_store = useSelector(state => state.uploadReducer);
  const dispatch = useDispatch();

  const handleMenuClick = (event = undefined, val) => {
    setValue(val);
    history.push("/" + val);

    // set as one dispatch instead..
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
      <BottomNavigationAction label="Ladda upp" value="upload" icon={<PublishIcon />} />
      <BottomNavigationAction label="Notiser" value="notices" icon={<NotificationsIcon />} />
      <BottomNavigationAction label="Sparat" value="saved" icon={<LoyaltyRoundedIcon />} />
    </BottomNavigation>

  );

  // <Badge badgeContent={3} color="secondary"><NotificationsIcon /></Badge>

}

// margin: -15px -11px 50px -15px;

const useStyles = makeStyles({
  body: {
    padding: 15,
    paddingTop: '35px'
  },
  mainContainer: {
    paddingTop: '80px',
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
    width: 100 + '%',
    zIndex: 10
  },
  profileBtn: {
    color: 'green'
  },
  bottomMenu: {
    width: 500,
  }

});


export default App;
