import firebase from "firebase/app";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import useFirebaseAction from '../core/useFirebaseAction';
import useFirebaseFetch from '../core/useFirebaseFetch';
import { useDocument, useDocumentOnce } from 'react-firebase-hooks/firestore';


export default function useRecipePage() {

  const { id } = useParams()
  const [ ifUser, setIfUser] = useState(false)
  const [ openAlert, setOpenAlert] = useState(false)
  const [ likeRef, setLikeRef] = useState("")

  const history = useHistory()
  const dispatch = useDispatch()

  // const {setData} = useFirebaseAction()
  
  const firestore = useFirestore()
  

  var db = firebase.firestore()



  let recipe_ref = db.collection("recipes").doc(id) 
  const {
    data: recipe
  } = useFirebaseFetch(recipe_ref, "DOC")

  const { email } = useSelector((state) => state.firebase.auth);
  const [likes_this, loading, error] = useDocument(likeRef)

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


  const isLiking = () => {
    return (likes_this && likes_this.exists)
  }

  const likeRecipe = () => {

    if(!email)
      return

    if (isLiking())
      db.collection('likes/' + email + '/likes/').doc(id).delete()
    else 
      db.collection('likes/' + email + '/likes/').doc(id).set({})
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