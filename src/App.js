import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
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

  return db;
}

/*
function ProfileBtn (props) {

  const classes = useStyles();

  //console.log(props)

  let text = (props.signedIn === true) ? "profile" : "login";
  let btn = (
    <div className={classes.profileBtn}>
      <button value={text} onClick={(e) => props.handleChange(e)}>{text}</button>
    </div> );

  let jsx_content = props.signedIn ? <Link to={"/profile"}><AccountCircleIcon/></Link> : btn;

  return (<div>{jsx_content} </div>);

} */

function App() {

  // const [signedIn, setSignedIn] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [redirect, setRedirect] = React.useState(false);

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const state_user = useSelector(state => state.userReducer); // subscribe to the redux store
  //console.log(state_user)

  // start auth listener
  useEffect(() => {

    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: user ? "SIGNIN" : "SIGNOUT" })
    });

  }, []);


  if(db === undefined) // init firebase once
  {
    db = initFirebase();
    dispatch({ type: "SETDB", db: db });
  }

  const handleChange = (event = undefined, newValue) => {

    console.log("heello" + newValue)

    setRedirect(true);
    setValue(newValue);
    /*
    setRedirect(true);
    let button_value = event.target.value;
    if(button_value != undefined)
      setValue(button_value);
    else
      setValue(newValue); */

  };

/*

<div className={classes.headerrow}>
<ProfileBtn signedIn={state_user.signedIn} handleChange={handleChange}/>
</div>

*/

  return (
    <div className="body">

      <Router>

      {redirect ? <Redirect to={"/" + value} /> : null }

      <div className={classes.headerrow}>
      <TopMenuBar signedIn={state_user.signedIn} handleChange={handleChange}/>
      </div>

      <div className={classes.mainContainer}>

        <Switch>
          <Route exact path="/">
            <FeedPage db={db}/>
          </Route>

          <Route path="/login" component={Login} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/upload" component={UploadPage} />
          <Route path="/notices" component={NoticePage} />
          <Route path="/saved" component={FavoritePage} />
          <Route path="/recipe/:recipe" component={RecipePage} />

        </Switch>

      </div>
      <div className={classes.footer}>
        <BottomNavigation value={value} onChange={ (evt,value) => handleChange(evt, value) } className={classes.bottomMenu}>
          <BottomNavigationAction label="Flöde" value="" icon={<HomeRoundedIcon />} />
          <BottomNavigationAction label="Ladda up" value="upload" icon={<PublishIcon />} />
          <BottomNavigationAction label="Notiser" value="notices" icon={<Badge badgeContent={3} color="secondary"><NotificationsIcon /></Badge>} />
          <BottomNavigationAction label="Sparat" value="saved" icon={<LoyaltyRoundedIcon />} />
        </BottomNavigation>
      </div>

      </Router>
    </div>
  );
}

// margin: -15px -11px 50px -15px;

const useStyles = makeStyles({
  body: {
    padding: 15,
    paddingTop: '35px'
  },
  mainContainer: {
    paddingTop: '50px'
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
