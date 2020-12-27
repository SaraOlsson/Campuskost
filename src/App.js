import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { Route, Switch } from "react-router-dom";
// import our css
import './App.css';
import PrivateRoute from "./components/PrivateRoute";
import MySnackbar from './components/snackbar';
import Todos from "./components/Todos";
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
import TermsPage from './pages/TermsPage';
import UploadPage from './pages/UploadPage';
import * as serviceWorker from './serviceWorker';
import './style/GlobalCssButton.css';
import BottomMenuBar from "./components/core/BottomMenuBar"
import useDataLoad from './components/core/useDataLoad';


import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Draggable from 'react-draggable'; // The default
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import BotDialog from "./components/core/BotDialog"
import { ClickAwayListener } from '@material-ui/core';

//import {ErrorBoundary} from './pages/ErrorBoundary';

// TODO: needed to dispatch auth info?

require('dotenv').config(); // check if we need this


// TODO: for PWA - needed?
// let deferredPrompt;
// window.addEventListener('beforeinstallprompt', (e) => {
//   // Stash the event so it can be triggered later.
//   deferredPrompt = e;
//   deferredPrompt.prompt();

//   // Update UI notify the user they can add to home screen
//   deferredPrompt.userChoice
//     .then((choiceResult) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the A2HS prompt');
//       } else {
//         console.log('User dismissed the A2HS prompt');
//       }
//       deferredPrompt = null;
//   });

// });


// main component of the app
function App() {

  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [openBotDialog, setOpenBotDialog] = React.useState(false);

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const state_user = useSelector(state => state.userReducer); // subscribe to the redux store
  const userEmail = useSelector(state => state.firebase.auth.email);

  useDataLoad(userEmail)

  const firestore = useFirestore();

  useEffect(() => {
    if(serviceWorker.hasUpdates === true) {
      setOpenUpdateDialog(true);
    }
  }, [serviceWorker.hasUpdates]); // end useEffect

  useEffect(() => {

    // Listen to auth changes. Set redux object and/or create firestore instance
    firebase.auth().onAuthStateChanged(user => {

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

  const closeBotDialog = (action) => {
    setOpenBotDialog(false);
  };

  // used in TopMenuBar, which needs to be refactored
  const handleChange = (event = undefined, newValue) => {

    console.log("heello" + newValue + ".")

  };

  let update_message = 'New content is available and will be used when all tabs for this page are closed';

  const onBotClick = () => {
    console.log("onBotClick!")
    setOpenBotDialog(!openBotDialog)
  }

  const onTouchStart = () => {
    console.log("onTouchStart!")
  }

  const handleClickAway = (event) => {
    //console.log(event)
    //console.log("handleClickAway!")
    if(openBotDialog === true)
      setOpenBotDialog(false)
  } // {/* to hold a ref */} bounds="parent" 

  return (

    <div className="body">

      <div>

        <div className={classes.headerrow}>
        <TopMenuBar signedIn={state_user.signedIn} handleChange={handleChange}/>
        </div>

        <div id="chat" className={`${classes.mainContainer}`}>

          {/* <ClickAwayListener onClickAway={handleClickAway}> */}
          <div> 
          <Draggable 
            axis="y"
            bounds={{bottom: 0, top: -400}}
            onMouseDown={onBotClick}
          >
            <div 
              style={{
              position: 'fixed', 
              bottom: '70px', 
              right: '20px',
              zIndex: '10'
              }}>
            <Fab color="primary" aria-label="add">
              <ChatBubbleRoundedIcon onClick={onBotClick} />
            </Fab>
            </div>
          </Draggable>

            <BotDialog 
              open={openBotDialog}
              onAlertClose={closeBotDialog}
              title="Chatta med Chefina"
              message="Hej! Du kanske är ny på Campuskost, är det något du undrar?"
              yesOptionText="Ja"
              NoOptionText="Nej, stäng fönster"
            />
            </div>
            {/* </ClickAwayListener> */}

          <Switch>
            <Route exact path="/home" component={FeedPage}/>
            <Route path="/login" component={LoginPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/profile/:username_url" component={ProfilePage} />
            <Route path="/upload/:id_param" component={UploadPage} />
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


const useStyles = makeStyles({
  body: {
    padding: 15,
    paddingTop: '35px'
  },
  mainContainer: {
    paddingTop: '60px',
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
  chatbubble: {
    background: 'teal',
    borderRaduis: '15px'
  }
});


export default App;
