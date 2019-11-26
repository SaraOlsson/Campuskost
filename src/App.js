import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import ProfilePage from './pages/profilepage';
import NoticePage from './pages/noticepage';
import FavoritePage from './pages/favoritepage';
import UploadPage from './pages/uploadpage';
import Login from './login';
// import Feed from './pages/feedpage';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PublishIcon from '@material-ui/icons/PublishRounded';
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded';
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';

require('dotenv').config();
//
const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  console.log("beforeinstallprompt")

  // alert("Heello")

  deferredPrompt.prompt();
  // Update UI notify the user they can add to home screen
  // showInstallPromotion();
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

const useStyles = makeStyles({
  body: {
    padding: 15
  },
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: 100 + '%',
    display: 'flex',
    justifyContent: 'center'
  },
  bottomMenu: {
    width: 500,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 50,

  },
  foodImg: {
    backgroundColor: 'pink',
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 20
  },

});

function ImageContainer(props) {

  const classes = useStyles();

  console.log(props)
  // <button onClick={() => props.removeFunction(props.listId) }>del</button>

  return (

    <div>

      <div className={classes.foodImg}>

      </div>
      {props.data.title}
    </div>

  );

}


function Feed() {

  const [images, setImages] = useState(undefined);
  const [recipes, setRecipes] = useState(undefined);
  const [docs, setDocs] = useState(undefined);

  useEffect(() => {
    someFetcher();
  }, []);

  const classes = useStyles();
  let recpiesRef = db.collection('recipes');

  const removeImg = (listId) => {

    console.log("remove " + listId +  " from parent component ")

  }

  const someFetcher = async () => {

    recpiesRef.get()
      .then(snapshot => {

        let images_array = [];
        let recipe_docs = [];

        snapshot.forEach(doc => {
          images_array.push(<ImageContainer key={doc.id} listId={doc.id} data={doc.data()} removeFunction={removeImg}/>);
          recipe_docs.push(doc.data());
          //docs_array.push(doc)
        })

        setImages(images_array);
        setRecipes(recipe_docs);

      })
      .catch(err => {
        console.log('Error getting documents', err);
    });

  }

  // <button onClick={() => setCount(count + 1)}>Click me</button>

  return (
    <div>

      <h1>Nya recept!</h1>

      <div className={classes.imageContainer}>{images}</div>

    </div>
  );

}

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


function App() {

  const [signedIn, setSignedIn] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [redirect, setRedirect] = React.useState(false);

  // let history = useHistory();

  // start auth listener
  useEffect(() => {
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
  }, []);

  if(db === undefined)
  {
    db = initFirebase();
  }

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    // console.log(event.target.value)
    // setValue(newValue);
    setRedirect(true);
    // history.push('/' + newValue );
    let button_value = event.target.value;

    if(button_value != undefined)
      setValue(button_value);
    else
      setValue(newValue);

  };

  /*
  const handleChange2 = (e) => {

    console.log(e.target.value)


  }; */

  console.log("signedIn: " + signedIn)

  let profile_or_login = (signedIn === true) ? "profile" : "login";

  console.log("profile_or_login: " + profile_or_login)
  console.log("value: " + value)

  return (
    <div className={classes.body}>

      <Router>

      {redirect ? <Redirect to={"/" + value} /> : null }

      <div className={classes.mainContainer}>

      <button value={profile_or_login} onClick={(e) => handleChange(e)}>{profile_or_login}</button>

        <Switch>
          <Route exact path="/">
            <Feed/>
          </Route>

          <Route path="/login" component={Login} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/upload" component={UploadPage} />
          <Route path="/notices" component={NoticePage} />
          <Route path="/saved" component={FavoritePage} />
        </Switch>

      </div>
      <div className={classes.footer}>
        <BottomNavigation value={value} onChange={handleChange} className={classes.bottomMenu}>
          <BottomNavigationAction label="Flöde" value="" icon={<HomeRoundedIcon />} />
          <BottomNavigationAction label="Ladda up" value="upload" icon={<PublishIcon />} />
          <BottomNavigationAction label="Notiser" value="notices" icon={<NotificationsActiveRoundedIcon />} />
          <BottomNavigationAction label="Sparat" value="saved" icon={<LoyaltyRoundedIcon />} />
        </BottomNavigation>
      </div>

      </Router>
    </div>
  );
}


export default App;
