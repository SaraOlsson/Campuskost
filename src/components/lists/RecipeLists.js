import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import AddRecipeList from './AddRecipeList';
import RecipeListItem from './RecipeListItem'
//import {useTranslation} from "react-i18next";

function RecipeLists({onClick}) {

  const classes = useStyles();
  //const {t} = useTranslation('common')

  useFirestoreConnect({
    collection: "lists",
    storeAs: "lists",
  });
  const lists = useSelector((state) => state.firestore.data.lists);

  return  (
    <div className={classes.listContainer}> 

      <AddRecipeList/>

      <div
        style={{
          display: 'flex',
          margin: '15px 0',
          flexWrap: 'wrap'
        }}
      >
        {lists &&
          Object.values(lists).map((list, idx) => (
            list && <RecipeListItem list={list} key={idx + list.title}/>
          ))}
      </div>

    </div>
  );
}

const useStyles = makeStyles({
    listContainer: {
        padding: '1rem',
    },
    soonText: {
      fontSize: 'small'
    }
});

export default RecipeLists