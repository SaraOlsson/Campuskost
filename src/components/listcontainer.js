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

  // omg ugly code - FIX
  const recipe_refs_fetcher = (refs_list) => {

    let temp_recipes = [];
    let continue_until = refs_list.length - 1;

    //console.log(refs_list)
    refs_list.map( (likes_doc, idx) => {

      if(likes_doc.list_ref != undefined)
      {
        likes_doc.list_ref.get().then(function(list_doc) {
            if (list_doc.exists) {

                let fetch_it = false;
                let list_data = list_doc.data();

                if (props.onlyMine == undefined){
                  console.log("care about all likes")
                  fetch_it = true;
                }
                else if (props.onlyMine == true && list_data.created_by == props.myEmail) {
                  console.log("only care about my lists")
                  fetch_it = true;

                } else if(props.onlyMine == false && list_data.created_by != props.myEmail){
                  console.log("only care about lists I follow")
                  fetch_it = true;
                } else {
                  //console.log("skipped recipe!")
                  continue_until = continue_until-1;
                }

                // if this recipe should be saved
                if(fetch_it == true)
                {
                  likes_doc.recipe_ref.get().then(function(doc) {
                      if (doc.exists) {

                          let data = doc.data();
                          data.id = doc.id;

                          temp_recipes.push(data);
                          if (idx == continue_until) {
                            setRecipes(temp_recipes);
                          }
                      } else {
                          console.log("No such document!");
                      }
                  }).catch(function(error) {
                      console.log("Error getting document:", error);
                  });

                }


            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      } else {

        likes_doc.recipe_ref.get().then(function(doc) {
            if (doc.exists) {

                let data = doc.data();
                data.id = doc.id;

                temp_recipes.push(data);
                if (idx == continue_until) {
                  setRecipes(temp_recipes);
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

      }

/*
      likes_doc.recipe_ref.get().then(function(doc) {
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
      }); */
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

  let listname = (props.list) ? props.list.listname : "<listname> | <username>"; // "Gillade recept"
  // listname = ( props.noheader != undefined ) ? listname : "";
  // listname = (props.list && props.list.listname) ? listname : "";
  let header;
  if(props.noheader == undefined || props.noheader == false ) {
    header = <p className={classes.list_header}> {listname}</p>
  }

  return (
    <div style={{width: '100%'}}>
    {header}
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
