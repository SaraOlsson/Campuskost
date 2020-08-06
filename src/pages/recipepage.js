import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import PickUserDialog from '../components/pickuserdialog';
import ReactShare from '../components/ReactShare';
import useFirebaseFetch from "../reducers/useFirebaseFetch";

function RecipePage(props) {

  const [ ifUser, setIfUser] = useState(false);
  const [ recipe, setRecipe] = useState(undefined);
  const [ saved, setSaved ] = useState({likes: false, doc_id: undefined});
  const [ tried, setTried ] = useState(false);
  const { recipetitle, id } = useParams();
  
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const fireUser = useSelector(state => state.fireReducer.firestore_user);

  let init_recipe_ref = firestore.collection('recipes').doc(id);

  const {data, isLoading, hasErrored, errorMessage, updateDataRecord
  } = useFirebaseFetch(init_recipe_ref, []);

  // console.log(recipe_data)

  /*
  useEffect(() => {
    console.log(isLoading)
    console.log(hasErrored)

    if(isLoading === false && hasErrored === false) {
      console.log(data)
    } 

  }, isLoading); */


  useEffect(() => {

    let ref = firestore.collection('recipes').doc(id);
    recipeFetcher(ref);
    // likeFetcher();

  }, []);

  // know if recipe belongs to this user
  useEffect(() => {
    // exit funtion if undefined
    if(!store.firestore_user || !recipe || !recipe.user_doc.username )
      return;

    if(recipe.user_doc.username == store.firestore_user.username) {
      setIfUser(true);
    }

    //let queryRef = firestore.collection('likes').where('email', '==', store.firestore_user.email);
    //likeFetcher(queryRef);
    likeFetcher(store.firestore_user.email);

  }, [store.firestore_user, recipe]);

  const likeFetcher = (current_email) => {

    // let recipe_likesRef = firestore.collection('recipe_likes');
    let likesRef = firestore.collection('recipe_likes').doc(current_email);

    likesRef.get().then(function(doc) {

      let isliked;

      if (doc.exists) {

        let data = doc.data();
        isliked = ( data.liked_recipes[recipe.id] !== undefined ) ? data.liked_recipes[recipe.id] : false;

      } else {
        firestore.collection('recipe_likes').doc(current_email).set({liked_recipes: {}});
        isliked = false;
      }

      // if (isliked)
      setSaved({likes: isliked, doc_id: current_email});

    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  }

  const likeRecipe = () => {

    if(!store.firestore_user) {
      console.log("user not loaded yet..")
      return;
    }

    let likesRef = firestore.collection('recipe_likes').doc(store.firestore_user.email);

    likesRef.get().then(function(doc) {

      let data;

      // add or remove like
      if (doc.exists) {

        data = doc.data();
        data.liked_recipes[recipe.id] = (saved.likes) ? false : true;
        firestore.collection("recipe_likes").doc(doc.id).update(data);
      }

    });

    setSaved({likes: !saved.likes, doc_id: saved.doc_id});

  };

  const tryRecipe = () => {
    setTried( !tried );
  };

  const recipeToFriend = () => {
    //setTried( !tried );
  };

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

  const removeRecipe = () => {

    firestore.collection('recipes').doc(id).delete();
    history.push("/home");

  }

  const handleUserClick = () => {
    history.push("/profile/" + recipe.user_doc.username );
  };


  var user_promise = function(user_ref) {
    return new Promise((resolve, reject) => {

      // reject();

      user_ref.get().then(function(doc) {

          if (!doc.exists)
            reject();

          let doc_data = doc.data(); // append to recipe data
          resolve(doc_data);

        });
    });
  }

  const recipeFetcher = (ref) => {
    ref.get().then(function(doc) {
      if (doc.exists) {
          let data = doc.data()
          data.id = doc.id;

          user_promise(data.user_ref).then((extended_data) => {

            data.user_doc = extended_data;
            setRecipe(data);

          }).catch(() => {
            console.log("Could not get user data for recipe owner")
          })

      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }

  let icon = (saved.likes === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
  let r_img = ( recipe !== undefined) ? recipe.img : 'temp_food1';
  let triedbyNum = 3;
  // , zIndex: '-1'

  /*

  <h2 style={{display: 'inline'}}>
    <Button disableTouchRipple onClick={likeRecipe}
    style={{display: 'inline', backgroundColor: 'transparent'}}>
      {icon}
    </Button>
    { recipetitle + ' | ' }

  </h2>
  <h2 onClick={ handleUserClick} style={{display: 'inline'}}>
    { recipe.user }
  </h2>

  */

  let img_src;

  if  ( recipe !== undefined && recipe.img_url !== undefined) {
    img_src = recipe.img_url;
  } else {
    img_src = require('../assets/'+ r_img + '.jpg');
  }


  return (

    <div>



      { recipe !== undefined &&
        <div>

          <div className={classes.recipeheader}>
          <span>
            <Button disableTouchRipple onClick={likeRecipe}
            style={{display: 'inline', backgroundColor: 'transparent'}}>
              {icon}
            </Button>
            { recipetitle + ' | ' }

          </span>
          <span>

            <Button disableTouchRipple onClick={handleUserClick}
            style={{display: 'inline', backgroundColor: 'transparent', textTransform: 'none'}}>
              { recipe.user_doc.username }
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
            <div onClick={recipeToFriend}>
              <PickUserDialog recipeId={recipe.id}/>
            </div>

            <ReactShare location={history.location.pathname} title={recipetitle}/>

          </Grid>
        </Grid>

        <IngredientsList ingredients={recipe.ingredients}/>
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
            onClick={removeRecipe}
          >
            Ta bort recept
          </Button>
        }

        </div>
      }

    </div>

  ); // style={{display: 'inline', backgroundColor: 'transparent', textTransform: 'none'}}

  /*

  // className={classes.triedby}

  { tried === true &&
  <div className={classes.triedby} >
    <span className={classes.triedbyText}> Testat av </span>
    <span className={classes.triedbyNum}> {triedbyNum} </span>
    <span className={classes.triedbyText}> { triedbyNum > 1 ? "kockar" : "kock" }! </span>
  </div>
  }
  { tried === false &&
  <div className={classes.triedby} onClick={tryRecipe}>
    <span className={classes.triedbyText}>
      Bli den första att testa detta recept!
    </span>
  </div>
  }

  */

}



function IngredientsList(props) {

  const classes = useStyles();


  let temp_ingredients = [
  {name: 'mjöl (default data)', quantity: "2", measure: "dl"},
  {name: 'salt', quantity: "1", measure: "tsk"},
  {name: 'mjölk', quantity: "4", measure: "dl"},
  {name: 'ägg', quantity: "2", measure: ""}
];

  let ingredients = (props.ingredients != undefined) ? props.ingredients : temp_ingredients;

  let ingredientsjsx = ingredients.map((ingred, idx) =>
  <React.Fragment key={idx}>
    <ListItem>
      <ListItemText
        primary={ ingred.quantity + " " + ingred.measure + " " + ingred.name }
      />

    </ListItem>
    { idx < ingredients.length - 1 && <Divider component="li" /> }
  </React.Fragment>
  );

  return (
    <div>
      <h3> Ingredienser </h3>
      <List dense={true} className={classes.ingredientslist}>
        {ingredientsjsx}
      </List>
    </div>
  );
}



function RecipeDecsList(props) {

  const classes = useStyles();

  let temp_description = [
  {order: 0, text: "Knäck äggen i en bunke (default data)"},
  {order: 2, text: "Stek i pannan meed smör eller kokosolja"},
  {order: 1, text: "Vispa i mjöl, mjölk och salt"}
  ];

  let description = (props.description != undefined) ? props.description : temp_description;

  // sort by order
  description.sort( (desc1, desc2) => desc1.order - desc2.order );

  let descjsx = description.map((desc, idx) =>
    <RecipeDecsListItem idx={idx} key={idx} desc={desc.text} len={description.length}/>
  );

  return (
    <div>
      <h3> Gör så här </h3>
      <List dense={true} className={classes.ingredientslist}>
        {descjsx}
      </List>
    </div>
  );
}

function RecipeDecsListItem(props) {

  const [checked, setChecked] = useState(false);
  const classes = useStyles();

  let idx = props.idx;

  const onIngredClick = (idx) => {
    setChecked(!checked);
  }

  let icon = (checked === true ) ? <CheckBoxIcon className={classes.checkIcon}/> : <CheckBoxOutlineBlankIcon className={classes.checkIcon}/> ;

  return (
    <React.Fragment>
      <ListItem
        onClick={() => onIngredClick(idx)}
      >
        {icon}
        <ListItemText primary={ props.desc }/>
      </ListItem>
      { idx < props.len - 1 && <Divider component="li" /> }
    </React.Fragment>
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
  triedby: {
    background: '#f1f1f1',
    borderRadius: '4px',
    padding: 5,
    textAlign: 'center',
    marginTop: 5
  },
  triedbyText: {
    margin: '0',
  },
  triedbyNum: {
    fontWeight: 'bold',
    display: 'block',
    fontSize: '2em'
  },
  ingredientslist: {
   marginTop: '20px',
 },
 checkIcon: {
   marginRight: '10px',
   color: '#68bb8c'
 },
 recipeheader: {
   margin: '20px 0px',
   fontWeight: 'bold'
 }
});

export default RecipePage;
