import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import Emoji from '../components/Emoji';
import LoadSpinner from '../components/loadspinner';
import RecipeGridList from '../components/recipegridlist';
import {fetchData} from "../redux/testReducer"
import {fetchData as fetchFirestoreData} from "../redux/fetchFirestore"
//import DropZone from "../components/input/DropZone"

const VERSION = 3;

function Test(props) {
  //const count = useSelector(state => state)
  const dispatch = useDispatch()
  return (
      <div>
          <h1>Test</h1>
          <button onClick={() => dispatch(fetchData())}>Ladda in data</button>
      </div>
  )
}

function FeedPage() {

  const classes = useStyles();
  const [updateExists, setUpdateExists ] = useState(false);

  useFirestoreConnect({
    collection: `recipes`,
    storeAs: "recipes",
    orderBy: ['timestamp', 'desc']
  });

  useFirestoreConnect({
    collection: "common",
    doc: "version",
    storeAs: "version",
  });

  const recipes = useSelector((state) => state.firestore.data.recipes); 
  const version = useSelector((state) => state.firestore.data.version); 

  useEffect(() => {

    // console.log(serviceWorker.hasUpdates)
    if(version && version.release)
    {
      // console.log(version.release)
      
      //let local_version = Number(window.localStorage.getItem('version'));
      console.log("const version: " + VERSION);
      //console.log("local version: " + local_version);

      if (VERSION !== version.release)
        setUpdateExists(true);
      // else
      //  window.localStorage.setItem('version', '1'); // version.release.toString());
    }


  }, [version]);




  return (
    <div>
      { updateExists && 
      <div className={classes.updateBanner}>
        <p>Det finns en uppdatering av webbappen, stäng alla flikar och ladda om. </p>
      </div> 
      }
      <NewsContainer/>
      <h3>Senaste recepten</h3>
      { recipes && <div className={classes.grid_background}><RecipeGridList recipes={Object.values(recipes)}/></div> }
      { recipes === undefined &&  <LoadSpinner/> }
    </div>
  );

}

// component above the feed at start page
function NewsContainer(props) {

  const classes = useStyles();

  let feedback_form_link = <a href="https://forms.gle/wUSFkwExgdJbiAUL7" target="_blank" style={{color: '#68bb8c'}}>här</a>;
  // <Test/>
  
  return (
    <div>
    <h3>Nyheter</h3>
    
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="center"
      className={classes.newscontainer}
    >

      <Grid item xs={12}>
        <div style={{padding: '10px'}}>
        <h3>Välkommen till nya Campuskost <Emoji symbol="🌱"/> </h3>
        <p> Campuskost har fått nytt utseende och funktion! Du kan nu skapa ett konto och själv ladda upp och redigera dina recept.
        Snart kommer funktionalitet såsom att skapa listor och följa dina vänners listor med recept. Lämna gärna feedback {feedback_form_link} om du
        hittar buggar eller har något roligt förslag.</p>
        </div>
      </Grid>

    </Grid>

    </div>
  );
}

const useStyles = makeStyles({
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 50,
  },
  grid_background: {
    backgroundColor: '#f1f1f1',
    paddingTop: '10px'
  },
  foodImg: {
    backgroundColor: 'pink',
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 20
  },
  newscontainer: {
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginBottom: 15
  },
  listimage: {
    maxHeight: '90px',
    maxWidth: '90px',
    padding: '5px',
    margin: '15px',
    borderRadius: '10px'
  },
  imagesidebar: {
    padding: 5
  },
  triedby: {
    background: '#f1f1f1',
    borderRadius: '4px',
    padding: 5,
    textAlign: 'center'
  },
  updateBanner: {
    backgroundColor: '#ffd364',
    color: 'white',
    borderRadius: 5,
    '& p': {
      padding: 10
    }
  }
});

export default FeedPage;
