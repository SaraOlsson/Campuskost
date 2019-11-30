// import firebase from 'firebase';
import { useDispatch } from "react-redux";

const RECIPES_FETCH_SUCCESS = "books_fetch_success";

/*
export const recipeFetch = () => {
  return (dispatch) => {
    firebase.database().ref('recipes').orderByChild('title')
      .on('value', snapshot => {
      const recipes = [];
      snapshot.forEach(child => {
        const childWithUid = { ...child.val(), uid: child.key };
        recipes.push(childWithUid);
      });
      recipes.reverse();
      dispatch({ type: RECIPES_FETCH_SUCCESS, payload: recipes });
    });
  };
}; */

// must start with use as it's calling a hook
export const useIncrementdispatch = () => {
  const dispatch = useDispatch();
  return (
    dispatch({
      type: "INCREMENT",
      step: 1
    })
  );

};
