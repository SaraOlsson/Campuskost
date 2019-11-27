import React, {useState, useEffect} from 'react';
// import { recipeFetch } from '../actions/RecipeActions';

function RecipePage(props) {

  // console.log(props)

  return (

    <div>
    <h1>Recept: {props.match.params.recipe}</h1>
    </div>

  );

}

export default RecipePage;
