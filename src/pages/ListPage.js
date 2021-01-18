import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { FadeIn } from "react-anim-kit";
// import LoadSpinner from '../components/shared/LoadSpinner';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AddRecipeList from '../components/lists/AddRecipeList';
import AllLikesByUser from '../components/lists/AllLikesByUser';
import AllListsByUser from '../components/lists/AllListsByUser';
import AllListsUserFollows from '../components/lists/AllListsUserFollows';
import Emoji from '../components/shared/Emoji';


function ListPage() {

  const { uid, email } = useSelector((state) => state.firebase.auth); 
  const {t} = useTranslation('common')

  let no_account = <p> {t('lists.sign_in_message')} </p>

  const listCSS = {
    display: 'flex',
    flexWrap: 'wrap'
  }

  const easing = 0.5
  const delay = 0

  return (
    <div> 
      <h3> {t('lists.liked_recipes')} </h3>
      { !uid && no_account }
      <FadeIn left delayBy={delay} easeTiming={easing}>
      { email && <AllLikesByUser ref_user={email} css_prop={listCSS}/> }
      </FadeIn>
      
      <h3 style={{marginBottom: 30}}>{t('lists.my_recipe_lists')}</h3>
      <p>{t('lists.under_development')} <Emoji symbol="🥳"/> </p>
      <FadeIn left delayBy={delay} easeTiming={easing}>
        { email && <AllListsByUser ref_user={email} css_prop={listCSS}/> }
        { email && <AddRecipeList/> }
      </FadeIn>
      {/* { email && <RecipeLists byUser={email} firebase_query={query_my_lists} state_name="my_lists"/> } */}
      <h3>{t('lists.follows.recipe_lists_i_follow')}</h3>
      <FadeIn left delayBy={delay} easeTiming={easing}>
        { email && <AllListsUserFollows ref_user={email} css_prop={listCSS}/>}
      </FadeIn>
      {/* { email && <RecipeLists byUser={""} firebase_query={get_query_followed_lists()} state_name="others_lists"/> } */}
      {/* <p>{t('lists.follows.no_list_yet')}</p> */}
    </div>
  );
}

const useStyles = makeStyles({
});

export default ListPage
