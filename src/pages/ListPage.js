import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import LoadSpinner from '../components/loadspinner';
import RecipeGridList from '../components/recipegridlist';
import Emoji from '../components/Emoji';
import useFirebaseFetch from '../reducers/useFirebaseFetch.js'

const useNewLikesRecipes = () => {

  const [likedRecipes, setlikedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //const { email } = useSelector((state) => state.firebase.auth);
  const email = useSelector(
    ({ firebase: { auth } }) => (auth.email) ? auth.email : ""
   ) 

  const firestore = useFirestore();

  useEffect(() => {
    if(email !== "")
      getLikes();
  }, [email]);

  let getLikesDocsForUser = function(current_email) {
    return new Promise((resolve, reject) => {

      let likesRef = firestore.collection('recipe_likes').doc(current_email);

      likesRef.get().then(function(doc) {
        if(doc.exists)
          resolve(doc.data());
        else 
          reject("Doc doesn't exist");

      });
    });
  }

  // lists likes for the user "sara.olsson4s@gmail.com"
  const getLikes = () => {
    getLikesDocsForUser(email).then((like_docs) => {

      // if user has no liked recipes
      if(email === "")
        return;

      let liked_recipes_ids = like_docs.liked_recipes;
      if ( liked_recipes_ids !== undefined) {

        let temp_recipes = [];
        // previously liked recipes will persist in the firestore map but be false
        Object.keys(liked_recipes_ids).forEach(function(key) {
            if(liked_recipes_ids[key] === true)
              temp_recipes.push(key)
        });

        recipe_fetcher(temp_recipes); // Object.keys(props.recipemap)
      } 

    }).catch( (err) => {console.log("catched error: " + err )});
  }

  // fetch by list of recipe ids
  const recipe_fetcher = (recipe_id_list) => {

    let temp_recipes = [];
    recipe_id_list.map( (recipe_id, idx) => {

      firestore.collection('recipes').doc(recipe_id).get()
      .then(function(doc) {
          if (doc.exists) {

              let data = doc.data();
              temp_recipes.push(data);
              if (idx === recipe_id_list.length - 1) {
                setlikedRecipes(temp_recipes);
              }
          }
          
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    })
    setIsLoading(false);

  }

  return {likedRecipes, isLoading};
}

const useGetRefByEmail = (email, preRef) => {

  const [db_Ref, set_db_Ref] = useState(undefined);

  useEffect(() => {
    if(email !== undefined) {
      console.log("ready to run")
      set_db_Ref( preRef.doc(email) );
    }
  }, [email]);

  return db_Ref;
};

function ListPage() {

  const {likedRecipes, isLoading} = useNewLikesRecipes();

  /*
  const firestore = useFirestore();
  const { email } = useSelector((state) => state.firebase.auth);
  const ref = useGetRefByEmail(email, firestore.collection('recipe_likes')); */
  //const {isLoading, hasErrored, errorMessage, data, updateDataRecord} = useFirebaseFetch(ref, []);
  /*
  
  const firestore = useFirestore();
  let likesRef = firestore.collection('recipe_likes').doc(email);
  const {isLoading, hasErrored, errorMessage, data, updateDataRecord} = useFirebaseFetch(likesRef, []); */

  // console.log(ref)
  //console.log(data)

  return  (
    <div> 
      <h3> Gillade recept </h3>
      {
        (likedRecipes.length < 1 && isLoading === true) ? 
          <LoadSpinner/> 
          : 
          <RecipeGridList recipes={Object.values(likedRecipes)} />    
      }
      {(likedRecipes.length < 1 && isLoading === false) &&
         <p> Inga gillade recept än. </p>    
      }
      <h3>Receptlistor</h3>
      <p>Kommer snart! <Emoji symbol="🥳"/> </p>
    </div>
  );
}

const useStyles = makeStyles({
});


// Put the things into the DOM!
export default ListPage

/*
const useLikedRecipes = (collection, doc_id, doc_field) => {

  // const { email } = useSelector((state) => state.firebase.auth);

  const storeAs = collection+"_"+doc_id;
  // console.log(storeAs)

  useFirestoreConnect({
    collection: `${collection}`,
    doc: `${doc_id}`,
    storeAs: `${storeAs}`,
  });

  // const liked_recipes3 = useSelector((state) => state.firestore.data.user_liked_doc);
  const liked_recipes = useSelector(
    ({ firestore: { data } }) => data[storeAs] && data[storeAs][doc_field]
  )

  //console.log(liked_recipes)

  // as prevoisly liked recipes are false
  const recipe_ids = liked_recipes ? Object.keys(liked_recipes) : [];
  const filtered_likes = recipe_ids.filter(recipe_id => liked_recipes[recipe_id] === true )

  return filtered_likes;

} */
