import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect  } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

require('dotenv').config();
//

console.log(process.env);

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

console.log(API_KEY);

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

function Profile(props) {

  const classes = useStyles();

  // console.log(props)

  return (

    <div>
    <h1>Hey you</h1>
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

      <h1>Nya recept</h1>

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

  const [value, setValue] = React.useState('recents');




  if(db === undefined)
  {
    db = initFirebase();
  }

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.body}>

      <Router>

      <div className={classes.mainContainer}>

        <Switch>
          <Route exact path="/">
            <Feed/>
          </Route>
          <Route path="/profile" component={Profile} />
        </Switch>

      </div>
      <div className={classes.footer}>
        <BottomNavigation value={value} onChange={handleChange} className={classes.bottomMenu}>
          <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
        </BottomNavigation>
      </div>

      </Router>
    </div>
  );
}


export default App;
