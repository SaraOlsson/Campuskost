// import firebase from 'firebase';

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

export const incrementdispatch = () => {
  return (dispatch) => {
    dispatch({
      type: "INCREMENT",
      step: 1
    });
  };
};

/*
export const recipeFetch = () => {
  return (dispatch) => {
    firebase.database().ref('books').orderByChild('date')
      .on('value', snapshot => {
      const books = [];
      snapshot.forEach(child => {
        const childWithUid = { ...child.val(), uid: child.key };
        books.push(childWithUid);
      });
      books.reverse();
      dispatch({ type: BOOKS_FETCH_SUCCESS, payload: books });
    });
  };
};*/
