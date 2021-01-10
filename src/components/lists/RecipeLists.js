import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import AddRecipeList from './AddRecipeList';
import RecipeListItem from './RecipeListItem'
//import {useTranslation} from "react-i18next";

function RecipeLists({onClick, byUser, firebase_query, state_name}) {

  const classes = useStyles();
  const {email: authUser} = useSelector((state) => state.firebase.auth)
  //const {t} = useTranslation('common')

  // useFirestoreConnect({
  //   collection: "lists",
  //   where: [
  //     ['created_by', '==', byUser] // "sara.olsson4s@gmail.com"
  //   ],
  //   storeAs: "lists",
  // });

  // console.log(firebase_query)

  useFirestoreConnect(firebase_query);
 
  const lists = useSelector((state) => state.firestore.data[state_name]);

  return  (
    <div className={classes.listContainer}> 

      {(authUser === byUser) && <AddRecipeList/> }

      <div
        style={{
          display: 'flex',
          margin: '15px 0',
          flexWrap: 'wrap'
        }}
      >
        {lists ?
          Object.values(lists).map((list, idx) => (
            (list && list.listID) && <RecipeListItem list={list} key={idx + list.title}/>
          ))
          :
        <p>Inga listor skapade än</p>
        }
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