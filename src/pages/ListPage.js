import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from "react-redux";
import Emoji from '../components/shared/Emoji';
import LoadSpinner from '../components/shared/LoadSpinner';
import RecipeGridList from '../components/shared/RecipeGridList';
import RecipeLists from '../components/lists/RecipeLists'
import { useTranslation } from "react-i18next"

function ListPage() {

  const { uid, email } = useSelector((state) => state.firebase.auth); 
  const all_recipes = useSelector((state) => state.firestore.data.allrecipes);
  const userLikes = useSelector((state) => {
    return state.firestore.data.userLikes ? state.firestore.data.userLikes : undefined
  });

  const {t} = useTranslation('common')

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
    
    let no_recipes_content = <p> {t('lists.no_likes_message_1')} <Emoji symbol="♡"/> {t('lists.no_likes_message_2')} </p>;
    recipeContent = getRecipeDocs(userLikes).length > 0 ? <RecipeGridList recipes={getRecipeDocs(userLikes)} /> : no_recipes_content;
  }

  let no_account = <p> {t('lists.sign_in_message')} </p>

  let query_my_lists = {
    collection: "lists",
    where: [
      ['created_by', '==', email] // "sara.olsson4s@gmail.com"
    ],
    storeAs: "my_lists",
  }

  // let query_followed_lists = email ? {
  //   collection: `lists_follows/${email}/lists`,
  //   storeAs: "others_lists"
  // } : {}

  const get_query_followed_lists = () => {
    return {
      collection: `lists_follows/${email}/lists`,
      storeAs: "others_lists"
    }
  }

  return (
    <div> 
      <h3> {t('lists.liked_recipes')} </h3>
      { uid ? recipeContent : no_account }
      <h3>{t('lists.my_recipe_lists')}</h3>
      <p>{t('lists.under_development')} <Emoji symbol="🥳"/> </p>
      { email && <RecipeLists byUser={email} firebase_query={query_my_lists} state_name="my_lists"/> }
      <h3>{t('lists.follows.recipe_lists_i_follow')}</h3>
      { email && <RecipeLists byUser={""} firebase_query={get_query_followed_lists()} state_name="others_lists"/> }
      {/* <p>{t('lists.follows.no_list_yet')}</p> */}
    </div>
  );
}

const useStyles = makeStyles({
});

export default ListPage
