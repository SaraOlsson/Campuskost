import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import firebase from "firebase/app"
import React, { useEffect, useState } from 'react'
import { FadeIn } from "react-anim-kit"
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { useTranslation } from "react-i18next"
import { Else, If, Then } from 'react-if'
import { useDispatch } from "react-redux"
import Emoji from '../components/shared/Emoji'
import LoadSpinner from '../components/shared/LoadSpinner'
import RecipeGridList from '../components/shared/RecipeGridList'
import { fetchData } from "../redux/testReducer"
import TranslateOptions from "../components/core/TranslateOptions"

// import CacheComponent from '../components/core/CacheComponent'
// import DropZone from "../components/input/DropZone"
// import KeyFrames from "../components/framer/KeyFrames"
// import BouncyDiv from "../components/animations/BouncyDiv"
// import FavoriteIcon from '@material-ui/icons/Favorite'
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'


const VERSION = 4;


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
  const {t} = useTranslation('common');

  const db = firebase.firestore()
  const [version] = useDocumentData(db.collection('common').doc('version'))
  const [recipes] = useCollectionData(db.collection('recipes'))

  useEffect(() => {

    // console.log(serviceWorker.hasUpdates)
    if(version && version.release)
    {
      console.log(version.release)
      
      //let local_version = Number(window.localStorage.getItem('version'));
      //console.log("const version: " + VERSION);
      //console.log("local version: " + local_version);

      if (VERSION !== version.release)
        setUpdateExists(true);
      // else
      //  window.localStorage.setItem('version', '1'); // version.release.toString());
    }

  }, [version]);




  return (
    <div>

      {/* <CacheComponent/> */}
      {/* <BouncyDiv trigger={true}> <FavoriteIcon/> </BouncyDiv> */}

      
      <If condition={updateExists}><Then>
        
          <div className={classes.updateBanner}>
            <p>Det finns en uppdatering av webbappen, stäng alla flikar och ladda om. </p>
          </div> 
        
      </Then></If>

      <TranslateOptions/>

      <FadeIn right by={300}>
        <NewsContainer/>
      </FadeIn>
      <h3>{t("welcome.recipesheader")}</h3>

      <If condition={recipes}>
        <Then>
          {() =>
          <div className={classes.grid_background}>
            <RecipeGridList recipes={Object.values(recipes)}/>
          </div>
          }
        </Then>
        <Else>
          <LoadSpinner/>
        </Else>
      </If>
      
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
  let feedback_message = (<p>Lämna gärna feedback {feedback_form_link} om du
    hittar buggar eller har något roligt förslag <Emoji symbol="💡"/></p>)
  
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
        {i18n.language === 'sv' && feedback_message}
        </div>
      </Grid>

    </Grid>

    </div>
  );
}

const useStyles = makeStyles(theme => ({
  grid_background: {
    backgroundColor: theme.palette.campuskost.lightgrey,
    paddingTop: '10px',
    borderRadius: 5
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
