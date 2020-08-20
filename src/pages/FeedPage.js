import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import Emoji from '../components/Emoji';
import LoadSpinner from '../components/loadspinner';
import RecipeGridList from '../components/recipegridlist';

function FeedPage() {

  const classes = useStyles();

  useFirestoreConnect({
    collection: `recipes`,
    storeAs: "recipes",
  });

  const recipes = useSelector((state) => state.firestore.data.recipes); 

  return (
    <div>
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
        hittar buggar eller har något roligt förslag</p>
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
  }
});

export default FeedPage;
