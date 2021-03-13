import firebase from "firebase/app";
import { useEffect, useState } from 'react';
import { useCollection, useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import useFirebaseFetch from '../core/useFirebaseFetch';


export default function useRecipePage() {

  const { id } = useParams()
  const [ ifUser, setIfUser] = useState(false)
  const [ openAlert, setOpenAlert] = useState(false)
  const [ likeRef, setLikeRef] = useState("")

  const history = useHistory()
  const dispatch = useDispatch()

  // const firestore = useFirestore()
  var db = firebase.firestore()

  const [recipe] = useDocumentData(db.collection('recipes').doc(id))

  const { email } = useSelector((state) => state.firebase.auth);
  const [likes_this, loading, error] = useDocument(likeRef)
  const [likesBool, setLikesBool] = useState(false)

  const liking_users_ref = db.collection('recipe_likes').doc(id).collection('users')
  const [liking_users] = useCollection(liking_users_ref)

  if(liking_users)
    console.log("liking_users: ", liking_users.docs.length)

  useEffect(() => {

    if(email)
    {
      setLikeRef(db.doc('likes/' + email + '/likes/' + id))
    }  

    if(recipe && recipe.recipeID !== id) // should not happen
      console.log("oups recipeID is not the same as in header")

    if(recipe && email)
      setIfUser( recipe.user_ref === email );
     
  }, [recipe, email] );

  useEffect(() => {
    setLikesBool(likes_this && likes_this.exists)
  }, [likes_this])


  const likeRecipe = () => {

    if(!email)
      return

    if (likesBool)
    {
      db.collection('likes/' + email + '/likes/').doc(id).delete()
      db.collection('recipe_likes').doc(id).collection('users').doc(email).delete()
    }
    else 
    {
      db.collection('likes/' + email + '/likes/').doc(id).set({})
      db.collection('recipe_likes').doc(id).collection('users').doc(email).set({}) // /' + email + '/likes/
    }
      
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
      db.collection('recipes').doc(id).delete();
      history.push("/home");
    }
  }

  return {
    recipe,
    email,
    ifUser,
    likesBool,
    likeRecipe,
    editRecipe,
    openAlert,
    setOpenAlert,
    onDeleteRecipeChoice,
    liking_users
  }

}