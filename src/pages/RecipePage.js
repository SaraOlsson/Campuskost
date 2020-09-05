import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import AlertDialog from '../components/AlertDialog';
import ListIngredients from '../components/ListIngredients';
import RecipeDecsList from '../components/RecipeDecsList';
import firebase from 'firebase'; // REFACTOR

import ReactGA from 'react-ga';

function RecipePage(props) {

  const { recipetitle, id } = useParams();
  const [ ifUser, setIfUser] = useState(false);
  const [ saved, setSaved ] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  
  const firestore = useFirestore();
  useFirestoreConnect({
    collection: `recipes`,
    doc: id,
    storeAs: "recipeInView",
  });

  const { email, uid } = useSelector((state) => state.firebase.auth);
  const recipe = useSelector((state) => state.firestore.data.recipeInView);

  useEffect(() => {

    if (recipe !== undefined && email !== undefined && recipe.recipeID === id) {
      
      recipe.user_ref.get().then( (doc) => {
        let is_user = doc.data().email === email;
        setIfUser( is_user );
      });

      likeFetcher(email);

      findSmallerImage();
    } else if(recipe !== undefined && recipe.recipeID !== id) {

      console.log("oups this was the previous recipe")
    }
      
  }, [recipe] );

  /*
  const generateImageFilename = () => {
    return 'recept/' + recipe.title + '_' + uid + '.jpg';
  }; */
  
  const findSmallerImage = () => {

    //  && recipe.img_filename
    if(!recipe.img_url_small && recipe.img_filename) { 

      let str = recipe.img_filename;

      console.log("findSmallerImage")

      let storageRef = firebase.storage(); // REFACTOR TO HOOKS?
      let small_filename = str.substring(0, str.indexOf(".jpg")) + "_500x500" + str.substring(str.indexOf(".jpg")); // 'recept/' + 
      
      try {
        // console.log(storageRef)
        let smallImageRef = storageRef.ref(small_filename);
        smallImageRef.getDownloadURL().then(function(downloadURL) {
          firestore.collection('recipes').doc(id).update({img_url_small: downloadURL});
        }); 
      }
      catch(err) {
        console.log(err.message);
      }

    } 
  }

  // review
  const likeFetcher = (current_email) => {

    let likesRef = firestore.collection('recipe_likes').doc(current_email);

    likesRef.get().then(function(doc) {

      let isliked;

      if (doc.exists) {

        let data = doc.data();  
        isliked = ( data.liked_recipes[id] !== undefined ) ? data.liked_recipes[id] : false;

      } else {
        firestore.collection('recipe_likes').doc(current_email).set({liked_recipes: {}});
        isliked = false;
      }

      setSaved(isliked);

    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  }

  const likeRecipe = () => {

    ReactGA.event({
      category: "Sign Up",
      action: "User pressed the big blue sign up button",
    });

    let likesRef = firestore.collection('recipe_likes').doc(email);

    likesRef.get().then(function(doc) {

      // add or remove like
      if (doc.exists) {

        let data = doc.data();

        if (!data.liked_recipes) {

          let obj = {};
          obj[id] = true;
          firestore.collection('recipe_likes').doc(doc.id).set({liked_recipes: obj});
        } else {
          data.liked_recipes[id] = (saved) ? false : true;
          firestore.collection("recipe_likes").doc(doc.id).update(data);
        }
      }

    });

    setSaved(!saved);

  };

  /*
  const recipeToFriend = () => {
    //setTried( !tried );
  }; */

  // make to reducer
  const editRecipe = () => {

    dispatch({
      type: "SETDESCRIPTIONS",
      descriptions: recipe.description
    })

    dispatch({
      type: "SETINGREDIENTS",
      ingredients: recipe.ingredients
    })

    dispatch({
      type: "SETTITLE",
      title: recipe.title
    })

    dispatch({
      type: "SETFREETEXT",
      freetext: recipe.freetext
    })

    dispatch({
      type: "SETSERVINGS",
      servings: recipe.servings
    })

    dispatch({
      type: "SETCOOKINGTIME",
      cookingtime: recipe.cookingtime
    })

    dispatch({
      type: "SETIMAGE",
      image: recipe.img_url
    })

    dispatch({
      type: "SETEDITMODE",
      editmode: true,
      recipe_id: id
    })

    history.push("/upload" );
  }

  const onDeleteRecipeChoice = (chosedDelete) => {

    console.log(chosedDelete);
    setOpenAlert(false);

    if(chosedDelete === true) {
      firestore.collection('recipes').doc(id).delete();
      history.push("/home");
    }
  }

  const generateTimeString = (timestamp) => {

    let string_result = undefined;
    try {
      let time = timestamp.toDate();
      let months = ["jan", "feb", "mars", "april", "maj", "juni", "juli", "aug", "sept", "okt", "nov", "dec"];
      string_result = time.getDate() + " " + months[time.getMonth()];
    }
    catch(err) {
      console.log(err.message);
    }
    return string_result;
  }

  const icon = (saved === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
  const timestring = recipe ? generateTimeString(recipe.timestamp) : undefined;
  const image = recipe ? <img src={recipe.img_url} className={classes.recipeImage} alt={recipe.title}/> : null;
  
  return (!recipe) ? null : (

    <div>
      <div>

          <div className={classes.recipeheader}>

            <span>
              { email && 
                <Button disableTouchRipple onClick={likeRecipe}>{icon}</Button>
              }
              {recipetitle + ' | '}
            </span>

            <span>
              <Button 
                disableTouchRipple 
                onClick={() => {history.push("/profile/" + recipe.user)}} >
                { recipe.user }
              </Button>
            </span>
          </div>
              
          <div className={classes.recipeContainer}>
            {image}
          </div> 

          { (recipe.servings || recipe.cookingtime) &&
            <div className={classes.timestamp}> 
              { recipe.servings &&
              <span> 
                {recipe.servings} portioner {" | "}
              </span>
              }
              { recipe.cookingtime &&
              <span> 
                Tillagningstid: {recipe.cookingtime} minuter
              </span>
              }
            </div>
          }

          { recipe.freetext &&
          <div className={classes.freetext}> 
            <b>{recipe.user}</b> {recipe.freetext}
          </div>
          }
          
          { timestring && 
          <div className={classes.timestamp}> 
            {timestring}
          </div>
          }
          

        <ListIngredients ingredients={recipe.ingredients}/>
        <RecipeDecsList description={recipe.description}/>

        {ifUser &&
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={editRecipe}
          >
            Ändra recept
          </Button>
        }

        &nbsp; &nbsp; &nbsp;

        {ifUser &&
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={ () => setOpenAlert(true) }
          >
            Ta bort recept
          </Button>
        }

      </div>
      

      <AlertDialog
      open={openAlert}
      onAlertClose={onDeleteRecipeChoice}
      title="Är du säker?"
      message="Är du säker på att du vill ta bort det här receptet?"
      yesOptionText="Ja"
      NoOptionText="Oj, nej!"
      />

    </div>
  ); 
}

const useStyles = makeStyles({
  recipeContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  recipeImage: {
    maxWidth: '90%',
    borderRadius: '5px',
    maxHeight: '500px'
  },
  recipeheader: {
   margin: '20px 0px',
   fontWeight: 'bold'
  },
  freetext: {

    fontSize: 'small',
    borderRadius: '5px',
    padding: '10px 20px'
  },
  timestamp: {
    fontSize: 'x-small',
    padding: '10px 20px',
    color: 'gray'
  }
});

export default RecipePage;
// 488 rows before refactor..
