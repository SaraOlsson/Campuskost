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

    // using recipe refs
    if (props.refs != undefined) {
      recipe_refs_fetcher(props.refs);
      //console.log("!= undefined");
    } // else {
      // console.log("oups undefined");
    // }


    // using recipe ids
    if (props.list != undefined)
      recipe_fetcher(props.list.recipes);

  }, []);

  const recipe_refs_fetcher = (refs_list) => {

    let temp_recipes = [];
    refs_list.map( (ref, idx) => {

      ref.recipe_ref.get().then(function(doc) {
          if (doc.exists) {

              let data = doc.data();
              data.id = doc.id;
              temp_recipes.push(data);
              if (idx == refs_list.length - 1) {
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

  let listname = (props.list) ? props.list.listname : "Gillade recept"; // "Gillade recept"

  return (
    <div style={{width: '100%'}}>
    <p className={classes.list_header}> {listname}</p>
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
  },
  list_header: {
    background: '#cab18e',
    color: 'white',
    padding: '3px 15px',
    borderRadius: '5px'
}
});


export default ListContainer;
