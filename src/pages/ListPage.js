import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from "react-redux";
import Emoji from '../components/shared/Emoji';
import LoadSpinner from '../components/shared/LoadSpinner';
import RecipeGridList from '../components/shared/RecipeGridList';

function ListPage() {

  const { uid } = useSelector((state) => state.firebase.auth); 
  const all_recipes = useSelector((state) => state.firestore.data.allrecipes);
  const userLikes = useSelector((state) => {
    return state.firestore.data.userLikes ? state.firestore.data.userLikes : undefined
  });

  const getRecipeDocs = (likesDict) => {

    if(!likesDict || !likesDict.liked_recipes || !all_recipes)
      return [];

    let docs = [];
    Object.keys(likesDict.liked_recipes).forEach(function(key) {

      let do_like = likesDict.liked_recipes[key]; // true or false

      let found = Object.values(all_recipes).find( u => (u != null && u.recipeID === key));
      if(found && do_like)
      {
        docs.push(found);
      }
    });

    return docs;
  }

  let recipeContent;
  if(!userLikes)
  {
    recipeContent = <LoadSpinner/>;
  } else {

    let no_recipes_content = <p> Du har inga gillade recept än. Klicka på <Emoji symbol="♡"/>-symbolen för att börja samla dina favoriter! </p>;
    recipeContent = getRecipeDocs(userLikes).length > 0 ? <RecipeGridList recipes={getRecipeDocs(userLikes)} /> : no_recipes_content;
  }

  let no_account = <p> Du behöver vara inloggad för att se innehåll på den här sidan. </p>

  return (
    <div> 
      <h3> Gillade recept </h3>
      { uid ? recipeContent : no_account }
      <h3>Receptlistor</h3>
      <p>Kommer snart! <Emoji symbol="🥳"/> </p>
    </div>
  );
}

const useStyles = makeStyles({
});

export default ListPage
