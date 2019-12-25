import React, {useState, useEffect} from 'react';
import { useParams} from "react-router";
// import { recipeFetch } from '../actions/RecipeActions';

function RecipePage(props) {

  // console.log(props)

  let { recipe } = useParams();

  // {props.match.params.recipe}

  return (

    <div>
    <h1>Recept: { recipe }</h1>
    </div>

  );

}

export default RecipePage;
