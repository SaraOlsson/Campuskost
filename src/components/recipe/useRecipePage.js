import firebase from "firebase/app";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import useFirebaseAction from '../core/useFirebaseAction';
import useFirebaseFetch from '../core/useFirebaseFetch';


export default function useRecipePage() {

  const { id } = useParams()
  const [ ifUser, setIfUser] = useState(false)
  const [ openAlert, setOpenAlert] = useState(false)

  const history = useHistory()
  const dispatch = useDispatch()

  const {setData} = useFirebaseAction()
  
  const firestore = useFirestore()

  var db = firebase.firestore()

  let recipe_ref = db.collection("recipes").doc(id) 
  const {
    isLoading: recipe_isLoading,
    hasErrored: recipe_hasErrored,
    errorMessage: recipe_errorMessage,
    data: recipe
  } = useFirebaseFetch(recipe_ref, "DOC")

  const { email } = useSelector((state) => state.firebase.auth);

  let userlikes_ref = undefined // wait for email
  const {
    isLoading: userlikes_isLoading,
    hasErrored: userlikes_hasErrored,
    errorMessage: userlikes_errorMessage,
    triggerFetch: userlikes_triggerFetch,
    data: userlikes
  } = useFirebaseFetch(userlikes_ref, "DOC") 

  useEffect(() => {

    if(email)
      userlikes_triggerFetch(db.collection('recipe_likes').doc(email))

    if(recipe && recipe.recipeID !== id) // should not happen
      console.log("oups recipeID is not the same as in header")

    if(recipe && email)
      setIfUser( recipe.user_ref === email );
     
  }, [recipe, email] );


  const isLiking = () => {

    if(!userlikes || !userlikes.liked_recipes) // valid data in db
      return false

    return (userlikes.liked_recipes[id] !== undefined &&  // has info && liked is true
            userlikes.liked_recipes[id] === true)
  }

  const likeRecipe = () => {

    if(!email)
      return

    let likesRef = db.collection('recipe_likes').doc(email);

    if (!userlikes.liked_recipes) {

      let obj = {};
      obj[id] = true;
      setData(likesRef, {liked_recipes: obj})

    } else {

      const acopy = Object.assign({}, userlikes.liked_recipes);
      acopy[id] = (isLiking()) ? false : true;
      setData(likesRef, {liked_recipes: acopy})
    }

    userlikes_triggerFetch(likesRef) // to update
  };

  // make to reducer
  const editRecipe = () => {
    
    dispatch({
      type: "SETDATA",
      payload: recipe
    })

    dispatch({
      type: "SETEDITMODE",
      editmode: true,
      recipe_id: id
    })
    
    history.push("/upload/" + recipe.recipeID );
  }

  const onDeleteRecipeChoice = (chosedDelete) => {

    if(!ifUser)
      return

    console.log(chosedDelete);
    setOpenAlert(false);

    if(chosedDelete === true) {
      firestore.collection('recipes').doc(id).delete();
      history.push("/home");
    }
  }

  return {
    recipe,
    email,
    ifUser,
    isLiking,
    likeRecipe,
    editRecipe,
    openAlert,
    setOpenAlert,
    onDeleteRecipeChoice
  }

}