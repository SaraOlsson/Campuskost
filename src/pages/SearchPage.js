import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import FollowerList from '../components/shared/FollowerList';
import LoadSpinner from '../components/shared/LoadSpinner';
import RecipeGridList from '../components/shared/RecipeGridList';
import {useTranslation} from "react-i18next";
// import useFirebaseFetch from '../components/core/useFirebaseFetch'
// import firebase from "firebase/app"

function SearchPage(props) {

  const {t} = useTranslation('common');
  const dispatch = useDispatch();

  const searchString = useSelector((state) => state.searchReducer.searchstring);

  const recipes = useSelector((state) => state.firestore.data.allrecipes);
  const users = useSelector((state) => state.firestore.data.allusers);

  // var db = firebase.firestore();
  // let ref = db.collection("users").doc("sara.olsson4s@gmail.com") 
  // const {
  //   isLoading,
  //   hasErrored,
  //   errorMessage,
  //   data
  // } = useFirebaseFetch(ref, "DOC") 

  useEffect(() => {

    // Specify how to clean up after this effect:
    return function cleanup() {
      dispatch({
        type: "SETSEARCH",
        payload: ""
      })
    };

  },[]);

  const filterRecipes = (values) => {
    return values.filter(r => ( r != null && (match(r, "title") || match(r, "user") )));
  }

  const filterUsers = (values) => {
    return values.filter(u => ( u != null && (match(u, "username") || match(u, "fullname") )));
  }

  const match = (object, attr) => {
    return object[attr].toLowerCase().includes(searchString.toLowerCase());
  }

  const filteredRecipes = recipes ? filterRecipes(Object.values(recipes)) : undefined;
  const filteredUsers = users ? filterUsers(Object.values(users)) : undefined;

  return (

    <div>
      <h3>{t('search.header')}</h3>

      { (users && recipes && searchString !== "") &&
        <p> {filteredRecipes.length+filteredUsers.length} {" "}
        {filteredRecipes.length+filteredUsers.length > 1 ? t('search.hits') : t('search.hit')} 
        </p>
      }
      { searchString === "" &&
        <p> {t('search.helptext')}</p>
      }

      { (!users || !recipes) && <LoadSpinner/> }

      { users &&
      <React.Fragment>
        <b> {t('shared.users')}: </b>
        <div>
          <FollowerList followerData={filteredUsers}/>
        </div>
      </React.Fragment>
      }
      { recipes &&
      <React.Fragment>
        <b> {t('shared.recipes')}: </b>
        <div style={{paddingTop: '15px'}}>
          <RecipeGridList recipes={filteredRecipes}/>
        </div>
      </React.Fragment>
      }

    </div>

  );
}

const useStyles = makeStyles({
});

export default SearchPage;
