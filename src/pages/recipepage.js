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

  const { email } = useSelector((state) => state.firebase.auth);
  const recipe = useSelector((state) => state.firestore.data.recipeInView);

  useEffect(() => {

    if (recipe !== undefined && email !== undefined) {
      
      recipe.user_ref.get().then( (doc) => {
        let is_user = doc.data().email === email;
        setIfUser( is_user );
      });

      likeFetcher(email);
    } 
      
  }, [recipe] );  

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

    let likesRef = firestore.collection('recipe_likes').doc(email);

    likesRef.get().then(function(doc) {

      // add or remove like
      if (doc.exists) {

        let data = doc.data();
        data.liked_recipes[id] = (saved) ? false : true;
        firestore.collection("recipe_likes").doc(doc.id).update(data);
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
      type: "SETEDITMODE",
      editmode: true,
      recipe_id: id
    })

    history.push("/upload" );
  }

  let icon = (saved === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
  let r_img = ( recipe !== undefined) ? recipe.img : 'temp_food1';

  let img_src;

  if  ( recipe !== undefined && recipe.img_url !== undefined) {
    img_src = recipe.img_url;
  } else {
    img_src = require('../assets/'+ r_img + '.jpg');
  }

  const onDeleteRecipeChoice = (chosedDelete) => {

    console.log(chosedDelete);
    setOpenAlert(false);

    if(chosedDelete === true) {
      firestore.collection('recipes').doc(id).delete();
      history.push("/home");
    }
  }

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

        <Grid
          container
          spacing={1}
          justify="center"

        >
          <Grid item xs={6} >
            <img src={img_src} className={classes.listimage} alt={"recipe img"} />
          </Grid>
          <Grid item xs={4} className={classes.imagesidebar}>
            {/*
            <div onClick={recipeToFriend}>
              <PickUserDialog recipeId={recipe.id}/>
            </div>
            Dela på Facebook: <ReactShare location={history.location.pathname} title={recipetitle}/>
            */}
          </Grid>
        </Grid>

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
  listimage: {
    maxHeight: '100%',
    maxWidth: '100%',
    borderRadius: '4px',
    objectFit: 'cover',
    minHeight: '150px',
    maxWidth: '150px'
  },
  imagesidebar: {
    padding: 5
  },
  recipeheader: {
   margin: '20px 0px',
   fontWeight: 'bold'
  }
});

export default RecipePage;
// 488 rows before refactor..