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
//import KeyFrames from "../components/framer/KeyFrames"
import Link from '@material-ui/core/Link';
import {FadeIn} from "react-anim-kit"


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
      <FadeIn right by={300}>
        <NewsContainer/>
      </FadeIn>
      <h3>Senaste recepten</h3>
      { recipes && 
        <div className={classes.grid_background}>
          
          <RecipeGridList recipes={Object.values(recipes)}/>
      
        </div>
      }
      { recipes === undefined &&  <LoadSpinner/> }
    </div>
  );

}

// component above the feed at start page
function NewsContainer(props) {

  const classes = useStyles();

  //let feedback_form_link = <a href="https://forms.gle/wUSFkwExgdJbiAUL7" target="_blank" variant="body1">här</a>;
  // <Test/>
  let feedback_form_link = (
      <Link href="https://forms.gle/wUSFkwExgdJbiAUL7" target="_blank" variant="body2">
        här
      </Link>
  )
  
  return (
    <div>
    <h3>Nyheter</h3>

    {/* <KeyFrames/> */}
    
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

const useStyles = makeStyles(theme => ({
  grid_background: {
    backgroundColor: theme.palette.campuskost.lightgrey,
    paddingTop: '10px'
  },
  newscontainer: {
    borderRadius: 20,
    backgroundColor: theme.palette.campuskost.lightgrey,
    marginBottom: 15
  },
  imagesidebar: {
    padding: 5
  },
  triedby: {
    background: theme.palette.campuskost.lightgrey,
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
}));

export default FeedPage;
