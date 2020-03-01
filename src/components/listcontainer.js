import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import RecipeGridList from '../components/recipegrid';
var Spinner = require('react-spinkit');
// import RecipeGridList from '../components/recipegrid';

function ListContainer(props) {

  const [recipes, setRecipes] = React.useState([]);
  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);

  useEffect(() => {

    recipe_fetcher(props.list.recipes);

  }, []);

  // let ref = store.db.collection('recipes').doc(id);
  const recipe_fetcher = (recipe_id_list) => {

    let temp_recipes = [];
    let ref;
    recipe_id_list.map( (recipe_id, idx) => {

      ref = store.db.collection('recipes').doc(recipe_id);
      ref.get().then(function(doc) {
          if (doc.exists) {

              let data = doc.data();
              data.id = doc.id; 
              temp_recipes.push(data);
              if (idx == recipe_id_list.length - 1) {
                setRecipes(temp_recipes);
              }
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    })
  }

  let spinner_jsx = <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div>;
  let recipeContent = (recipes.length > 0) ? <RecipeGridList recipes={recipes} smalltiles={true}/> : spinner_jsx;

  return (
    <div>
    <h4>{props.list.listname}</h4>
    <div className={classes.listcontainer}>
      {recipeContent}
    </div>
    </div>
  );
}

const useStyles = makeStyles({
  listcontainer: {
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginBottom: 15,
    minHeight: 50
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  }
});


export default ListContainer;
