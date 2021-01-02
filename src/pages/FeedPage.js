import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import Emoji from '../components/shared/Emoji';
import LoadSpinner from '../components/shared/LoadSpinner';
import RecipeGridList from '../components/shared/RecipeGridList';
import {fetchData} from "../redux/testReducer"
import {fetchData as fetchFirestoreData} from "../redux/fetchFirestore"
//import DropZone from "../components/input/DropZone"
//import KeyFrames from "../components/framer/KeyFrames"
import Link from '@material-ui/core/Link';
import {FadeIn} from "react-anim-kit"
import {useTranslation} from "react-i18next";
import Button from '@material-ui/core/Button';

let src_flag_en = require('../assets/en_flag.png');
let src_flag_sv = require('../assets/sv_flag.png');


const VERSION = 3;


function TranslateOptions()
{
    // variant="contained" color="primary"
    const {t, i18n} = useTranslation('common');
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button onClick={() => i18n.changeLanguage('sv')} 
        style={{
          margin: 15
        }}>
          Svenska <img src={src_flag_sv} style={{ width: 20, marginLeft: 8}}/>
        </Button>
        
        <Button onClick={() => i18n.changeLanguage('en')}
        style={{
          margin: 15
        }}>
          English <img src={src_flag_en} style={{ width: 20, marginLeft: 8}}/>
        </Button>
      </div>
    )
}

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
  const {t, i18n} = useTranslation('common');

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
      {<TranslateOptions/>}
      <FadeIn right by={300}>
        <NewsContainer/>
      </FadeIn>
      <h3>{t("welcome.recipesheader")}</h3>
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
  const {t, i18n} = useTranslation('common');

  // <h1>{t('welcome.title', {framework:'Campuskost'})}</h1>

  //let feedback_form_link = <a href="https://forms.gle/wUSFkwExgdJbiAUL7" target="_blank" variant="body1">här</a>;
  // <Test/>
  let feedback_form_link = (
      <Link href="https://forms.gle/wUSFkwExgdJbiAUL7" target="_blank" variant="body2">
        här
      </Link>
  )
  
  return (
    <div>
    {/* <h3>Nyheter</h3> */}

    {/* <KeyFrames/> */}
    {/* <Test/> */}
    
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="center"
      className={classes.newscontainer}
    >

      <Grid item xs={12}>
        <div style={{padding: '10px'}}>
        <h3>{t('welcome.header', {appname:'Campuskost'})} <Emoji symbol="🌱"/> </h3>
        {/* <p> Campuskost har fått nytt utseende och funktion! Du kan nu skapa ett konto och själv ladda upp och redigera dina recept.
        Snart kommer funktionalitet såsom att skapa listor och följa dina vänners listor med recept. Lämna gärna feedback {feedback_form_link} om du
        hittar buggar eller har något roligt förslag.</p> */}
        <p>{t('welcome.message', {appname:'Campuskost'})}</p>
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
