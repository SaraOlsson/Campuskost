import React, {useState, useEffect} from 'react';
import { BrowserRouter as Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import RecipeGridList from '../components/recipegridlist';
import RecipeItem from '../components/recipeitem';

import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

var Spinner = require('react-spinkit');

function FeedPage() {

  // const [images, setImages] = useState();
  const [recipes, setRecipes] = useState(undefined);
  //const [docs, setDocs] = useState(undefined);
  const [scrollview, setScrollview] = useState(true);

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);

  useEffect(() => {

    let recpiesRef = store.db.collection('recipes');
    recipeFetcher(recpiesRef);

  }, []);

  const recipeFetcher = (recpiesRef) => {
    store.db.collection("recipes")
    .onSnapshot(function(querySnapshot) {

        let recipe_docs = [];
        querySnapshot.forEach( doc => {
          let data = doc.data();
          data.id = doc.id;
          recipe_docs.push(data);
        });

        setRecipes(recipe_docs);
    });
  }

  // <div className={classes.imageContainer}>{images}</div>
  // recipeData.PastaMaster.recipes
// { recipes != undefined && <RecipeGridList imageData={recipes}/> }
  if(scrollview === false )
  {
    return (

      <div>

      { recipes !== undefined && <ScrollableRecipes recipes={recipes}/> }

       </div>

    );
  }

  return (
    <div>
      <NewsContainer recipes={recipes}/>
      <h3>Senaste recepten</h3>
      { recipes !== undefined && <div className={classes.grid_background}><RecipeGridList recipes={recipes}/></div> }
      { recipes === undefined && <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div> }
    </div>
  );

}

function ScrollableRecipes(props) {

  const classes = useStyles();
  // className={classes.userinfo}

  let recipes = props.recipes.concat(props.recipes);
  recipes = recipes.concat(recipes);

  return (
    <Grid
      container
      spacing={1}
      justify="center"

    >
      {
        recipes.map((recipe, idx) =>
        <div className={classes.scrolldiv} key={idx}>
        <Grid item xs={12}>
        <h3 className={classes.scrolltitle}>
          { recipe.title + ' | ' + recipe.user }
        </h3>
        </Grid>
        <Grid item xs={12} >
          <img src={require('../assets/'+ 'temp_food1' + '.jpg')} className={classes.scrollimage} alt={"recipe img"} />
        </Grid>
        <Grid item xs={12}>
        <p className={classes.scrolltext}>
          { 'Some text' }
        </p>
        </Grid>
        </div>
      )

      }
    </Grid>
  );
}

// component above the feed at start page
function NewsContainer(props) {

  const classes = useStyles();
  const history = useHistory();
  // className={classes.userinfo}


  if(props.recipes === undefined || props.recipes.length < 1 )
    return null; // <p style={{margin: 15}}>Sorry chefs, an issue! probably no internet connection.</p>

  let recipe_index = Math.floor(Math.random() * props.recipes.length);

  let viral_header = (props.recipes !== undefined && props.recipes[recipe_index] !== undefined ) ? props.recipes[recipe_index].title : "Veckans favvo: ";

  const handleUserClick = (user) => {
    history.push("/profile/" + user );
  };

  let username = props.recipes[recipe_index].user;

  /*
  <Grid item xs={5}>

    {props.recipes !== undefined &&
      <GridList><RecipeItem recipe={props.recipes[recipe_index]} smalltiles={false}/></GridList>
    }

  </Grid>
  <Grid item xs={7}>
    <h3>{viral_header}</h3>
    <h5 onClick={() => handleUserClick(username)} style={{cursor: 'pointer'}}> @username</h5>
  </Grid>
  */

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
        <h3>Välkommen till nya Campuskost 🌱</h3>
        <p> Campuskost har fått nytt utseende och funktion! Du kan nu skapa ett konto och själv ladda upp och redigera dina recept.
        Snart kommer funktionalitet såsom att skapa listor och följa dina vänners listor med recept. Lämna gärna feedback {feedback_form_link} om du
        hittar buggar eller har något roligt förslag</p>
        </div>
      </Grid>

    </Grid>

    </div>
  );
}

// used before for testing
/*
function ImageContainer(props) {

  const classes = useStyles();

  return (
    <Link to={"/recipe/" + props.data.title } >
      <div>
      <div className={classes.foodImg}></div>
      {props.data.title}
      </div>
    </Link>
  );
} */

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
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
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
  scrollimage: {
    maxWidth: '300px',
  },
  scrolltitle: {
    alignSelf: 'flex-start'
  },
  scrolldiv: {
    background: '#f2f2f2',
    padding: '25px',
    margin: '15px',
    borderRadius: '12px'
  },
  scrolltext: {
    color: 'black'
  }
});

export default FeedPage;
