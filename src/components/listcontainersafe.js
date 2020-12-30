import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import RecipeGridList from '../components/recipegridlist';

var Spinner = require('react-spinkit');

function ListContainerSafe(props) {

  const [recipes, setRecipes] = React.useState([]);
  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();

  useEffect(() => {

    // now using
    if(props.recipeDocs != undefined) {
      setRecipes(props.recipes);
      return;
    }

    // using recipe ids
    if (props.recipemap != undefined) {

      let temp_recipes = [];

      // previously liked recipes will persist in the firestore map but be false
      Object.keys(props.recipemap).forEach(function(key) {
          if(props.recipemap[key] === true)
            temp_recipes.push(key)
      });

      recipe_fetcher(temp_recipes); // Object.keys(props.recipemap)
    }

  }, []);

  // fetch by list of recipe ids
  const recipe_fetcher = (recipe_id_list) => {

    let temp_recipes = [];
    let ref;
    recipe_id_list.map( (recipe_id, idx) => {

      ref = firestore.collection('recipes').doc(recipe_id);
      ref.get().then(function(doc) {
          if (doc.exists) {

              let data = doc.data();
              data.id = doc.id;
              temp_recipes.push(data);
              if (idx == recipe_id_list.length - 1) {
                setRecipes(temp_recipes);
              }
          } 
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    })
  }

  // either spinner or recipe content is to be shown
  let spinner_jsx = <div className={classes.spinner} ><Spinner name="ball-scale-multiple" fadeIn="none"/></div>;
  let recipeContent = (recipes.length > 0) ? <RecipeGridList recipes={recipes} smalltiles={true}/> : spinner_jsx;

  let header;
  if (props.noheader == false) {
    let listname = (props.listname) ? props.listname : "<listname>"; // "Gillade recept"
    let user_in_header = (props.mine) ? "" : "| " + props.createdby.split("@")[0];
    header = <p className={classes.list_header}> {listname} <i>{user_in_header}</i> </p>;
  }

  let id = 5;

  return (
    <div style={{width: '100%'}}>
    {header}
    <div className={classes.listcontainer}>
      {recipeContent}
    </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  listcontainer: {
    borderRadius: 20,
    backgroundColor: theme.palette.campuskost.lightgrey,
    marginBottom: 15,
    minHeight: 50
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  list_header: {
    background: '#cab18e',
    color: 'white',
    padding: '3px 15px',
    borderRadius: '5px'
}
}));

export default ListContainerSafe;
