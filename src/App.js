import React, {useState} from 'react';
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

  // const [loadeddata, setLoadeddata] = useState(false);
  //const [count, setCount] = useState(0);
  const [init, setInit] = useState(true);

  const [images, setImages] = useState(undefined);
  const [recipes, setRecipes] = useState(undefined);
  const [docs, setDocs] = useState(undefined);

  const classes = useStyles();
  let recpiesRef = db.collection('recipes');

  const removeImg = (listId) => {

    console.log("remove " + listId +  " from parent component ")
    // let temp_array = recipes.filter( recipe => recipes. )
    // temp_array = temp_array.

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

  if(init === true)
  {
      someFetcher();
      setInit(false);
      console.log("init == true")
  }

  // <button onClick={() => setCount(count + 1)}>Click me</button>

  return (
    <div>

      <h1>Nya recept</h1>



      <div className={classes.imageContainer}>{images}</div>

    </div>
  );

}

let db;
function initFirebase() {

  console.log("run initFirebase")

  const firebaseConfig = {
    apiKey: "AIzaSyAq0vTBf0o5MckjHcCOJiJ_DRK8v_UZY88",
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

  console.log("hejsan")

  const classes = useStyles();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    console.log("handleChange")
    setValue(newValue);
  };



  db = initFirebase();
  let citiesRef = db.collection('users');
  let users = [];

  /*
  console.log("get..");

  let allCities = citiesRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        users.push(doc.data()); // doc.id
      })
    })
    .catch(err => {
      console.log('Error getting documents', err);
  });

  console.log("get done");
  console.log(users); */

  return (
    <div className={classes.body}>
      <div className={classes.mainContainer}>

      <Feed/>

      </div>
      <div className={classes.footer}>
        <BottomNavigation value={value} onChange={handleChange} className={classes.bottomMenu}>
          <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
        </BottomNavigation>
      </div>
    </div>
  );
}


export default App;
