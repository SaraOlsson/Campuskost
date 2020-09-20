import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PublishIcon from '@material-ui/icons/PublishRounded';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { Route, Switch, useHistory } from "react-router-dom";
// import our css
import './App.css';
import MySnackbar from './components/snackbar';
import TopMenuBar from './components/topmenubar';
// import our page components
import FeedPage from './pages/FeedPage';
import ListPage from './pages/ListPage';
import LoginPage from './pages/LoginPage';
import NoticePage from './pages/NoticePage';
import ProfilePage from './pages/ProfilePage';
import RecipePage from './pages/RecipePage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import UploadPage from './pages/UploadPage';
import TermsPage from './pages/TermsPage';
import Todos from "./components/Todos";
import PrivateRoute from "./components/PrivateRoute";

import * as serviceWorker from './serviceWorker';
import './style/GlobalCssButton.css';


require('dotenv').config(); // check if we need this

/*
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("firebase-messaging-sw.js")
    .then(function(registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function(err) {
      console.log("Service worker registration failed, error:", err);
    });
}*/

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


// main component of the app
function App() {

  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const state_user = useSelector(state => state.userReducer); // subscribe to the redux store
  const userEmail = useSelector(state => state.firebase.auth.email);

  useFirestoreConnect({
    collection: `users`,
    doc: userEmail,
    storeAs: "userdoc",
  });

  useFirestoreConnect({
    collection: `users`,
    storeAs: "allusers",
  });

  useFirestoreConnect({
    collection: `recipes`,
    storeAs: "allrecipes",
  });

  useFirestoreConnect({
    collection: `recipe_likes`,
    doc:  `${userEmail}`,
    storeAs: "userLikes",
  });

  useFirestoreConnect([
    {
    collection: `followers/${userEmail}/following`,
    storeAs: "following",
    },
    {
    collection: `followers/${userEmail}/followers`,
    storeAs: "followers",
    }
  ]);

  const firestore = useFirestore();

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
      // dispatch({ type: user ? "SIGNIN" : "SIGNOUT" })

      // if user is signed in, set redux object
      if( user ) {

        const user_email = user.email;

        const usersRef = firestore.collection('users').doc(user_email);
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
            console.log("in app, user doc doesnt exist yet")
          }
        });

        // dispatch auth info (such as last time logged in etc)
        dispatch({
          type: "SETUSER",
          auth_user: user
        })

      } // end if user
      else {

        // no user is signed in
        dispatch({
          type: "SETUSER",
          user: undefined
        })

      }

      dispatch({ type: user ? "SIGNIN" : "SIGNOUT" })

    }); // end auth listener

  }, []); // end useEffect
  

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

      
      <div>

        <div className={classes.headerrow}>
        <TopMenuBar signedIn={state_user.signedIn} handleChange={handleChange}/>
        </div>

        <div className={classes.mainContainer}>

          <Switch>
            <Route exact path="/home" component={FeedPage}/>
            <Route path="/login" component={LoginPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/profile/:username_url" component={ProfilePage} />
            <Route path="/upload" component={UploadPage} />
            <Route path="/notices" component={NoticePage} />
            <Route path="/saved" component={ListPage} />
            <Route path="/recipe/:recipetitle/:id" component={RecipePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/home" component={FeedPage}/>
            <Route path="/lists" component={ListPage}/>
            <Route path="/terms" component={TermsPage}/>
            <PrivateRoute path = "/todos">
              <Todos />
            </PrivateRoute>
            <Route component={FeedPage} />

          </Switch>

          <MySnackbar open={openUpdateDialog} handleClose={closeDialog} message={update_message} action={""}/>

        </div>
        <div className={classes.footer}>
          <BottomMenuBar/>
        </div>

      </div>
      

    </div>
  );
}

/*
<PrivateRoute path = "/todos">
  <Todos />
</PrivateRoute>
*/

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

    dispatch({
      type: "SETIMAGE",
      title: undefined
    })

    if(val !== "upload" && upload_store.editmode === true) {
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
