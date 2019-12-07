import React, {useState, useEffect} from 'react';
import { BrowserRouter as Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import recipeData from '../assets/recipes_dev';
import RecipeGridList from '../components/recipegrid';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ImageIcon from '@material-ui/icons/Image';

var Spinner = require('react-spinkit');

function FeedPage(props) {

  // const [images, setImages] = useState();
  const [recipes, setRecipes] = useState(undefined);
  const [docs, setDocs] = useState(undefined);

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);

  useEffect(() => {
    // someFetcher();
    //usersRef.on('value', function(snap) { console.log(snap.val()); })
    let recpiesRef = store.db.collection('recipes');
    recipeFetcher(recpiesRef);

  }, []);

  const recipeFetcher = (recpiesRef) => {
    store.db.collection("recipes")
    .onSnapshot(function(querySnapshot) {

        //let images_array = [];
        let recipe_docs = [];
        querySnapshot.forEach(function(doc) {
          //images_array.push(<ImageContainer key={doc.id} listId={doc.id} data={doc.data()}/>);
          recipe_docs.push(doc.data());
        });
        //setImages(images_array);
        setRecipes(recipe_docs);
    });
  }

  // <div className={classes.imageContainer}>{images}</div>
  // recipeData.PastaMaster.recipes
// { recipes != undefined && <RecipeGridList imageData={recipes}/> }
  return (
    <div>
      <NewsContainer/>
      { recipes != undefined && <RecipeGridList imageData={recipes}/> }
      { recipes === undefined && <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div> }



    </div>
  );

}

function NewsContainer(props) {

  const classes = useStyles();
  // className={classes.userinfo}

  return (
    <div>
    <h3>Veckans poppis</h3>
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="center"
      className={classes.newscontainer}
    >
      <Grid item xs={3}>
        <ImageIcon/>
      </Grid>
      <Grid item xs={6}>
        <h3>Vegetarisk lasagne</h3>
        <h5>"Bästa matlådan!"</h5>
      </Grid>

    </Grid>

    </div>
  );


}

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
}

const useStyles = makeStyles({
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 50,

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
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  }
});

export default FeedPage;
