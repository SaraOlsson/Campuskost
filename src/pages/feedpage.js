import React, {useState, useEffect} from 'react';
import { BrowserRouter as Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import recipeData from '../assets/recipes_dev';
import RecipeGridList from '../components/recipegrid';

import Grid from '@material-ui/core/Grid';
import ImageIcon from '@material-ui/icons/Image';

function FeedPage(props) {

  const [images, setImages] = useState(default_content());
  const [recipes, setRecipes] = useState(undefined);
  const [docs, setDocs] = useState(undefined);

  useEffect(() => {
    // someFetcher();
  }, []);

  const classes = useStyles();
  let recpiesRef = props.db.collection('recipes');

  function default_content() {
    let images_array = [];
    for(let i = 0; i < 3; i++)
      images_array.push(<ImageContainer key={i} listId={i} data={{title: "Pannkaka", user: "Sara"}}/>);
    return images_array;
  }

  const someFetcher = async () => {

    recpiesRef.get()
      .then(snapshot => {

        let images_array = [];
        let recipe_docs = [];

        snapshot.forEach(doc => {
          images_array.push(<ImageContainer key={doc.id} listId={doc.id} data={doc.data()}/>);
          recipe_docs.push(doc.data());
        })

        setImages(images_array);
        setRecipes(recipe_docs);

      })
      .catch(err => {
        console.log('Error getting documents', err);
    });

  }

  // <div className={classes.imageContainer}>{images}</div>

  return (
    <div>
      <NewsContainer/>
      <RecipeGridList imageData={recipeData.PastaMaster.recipes}/>
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
  }
});

export default FeedPage;
