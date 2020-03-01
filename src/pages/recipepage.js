import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { useParams} from "react-router";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
// import { recipeFetch } from '../actions/RecipeActions';

import ValidCheck from '../components/validcheck';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
// import Container from '@material-ui/core/container';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import EditIcon from '@material-ui/icons/Edit';

//let admin = require('firebase-admin');

function RecipePage(props) {

  const [ ifUser, setIfUser] = useState(false);
  const [ recipe, setRecipe] = useState(undefined);
  const [ saved, setSaved ] = useState(false);
  const [ tried, setTried ] = useState(false);
  const { recipetitle, id } = useParams();
  const store = useSelector(state => state.fireReducer);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    // someFetcher();

    let ref = store.db.collection('recipes').doc(id);
    // ref.on('value', function(snap) { console.log(snap.val()); })
    recipeFetcher(ref);

  }, []);

  // know if recipe belongs to this user
  useEffect(() => {
    // exit funtion if undefined
    if(!store.firestore_user || !recipe || !recipe.user_doc.username )
      return;

    if(recipe.user_doc.username == store.firestore_user.username) {
      console.log("same as logged in: " + recipe.user_doc.username)
      setIfUser(true);
    } else {
      console.log("NOT same as logged in: " + recipe.user_doc.username)
    }

  }, [store.firestore_user, recipe]);

  const likeRecipe = () => {

    console.log("likeRecipe")
    /*
    if(!saved) {
      console.log("!saved")
      // ...
      let listRef = store.db.collection('lists').doc(store.firestore_user.email);

      // Atomically add a new region to the "regions" array field.
      let arrUnion = listRef.update({
        recipes: admin.firestore.FieldValue.arrayUnion(recipetitle)
      }).then(function() {
        console.log("Frank food updated");
      });

    } */
    /*
    else {
      store.db.collection("lists").doc(store.firestore_user.email).set({});
    } */
    setSaved( !saved );
  };

  const tryRecipe = () => {
    setTried( !tried );
  };

  const editRecipe = () => {

    console.log("edit recipe")

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
    /*
    dispatch({
      type: "SETDESCRIPTIONS",
      descriptions: descriptions
    }) */
    history.push("/upload" );
  }

  const handleUserClick = () => {
    history.push("/profile/" + recipe.user_doc.username );
  };

  const recipeFetcher = (ref) => {
    ref.get().then(function(doc) {
        if (doc.exists) {
            let data = doc.data()
            // console.log("Document data:", data);
            if(data.user_ref) {
              // get user info
              data.user_ref.get().then(function(user_doc) {
                let user_data = user_doc.data()
                data.user_doc = user_data; // append to recipe data
                // console.log("Document USER data:", user_data);
                setRecipe(data);
              });
            } else {
              setRecipe(data);
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }

  let icon = (saved === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
  let r_img = ( recipe != undefined) ? recipe.img : 'temp_food1';
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

  if  ( recipe != undefined && recipe.img_url != undefined) {
    img_src = recipe.img_url;
  } else {
    img_src = require('../assets/'+ r_img + '.jpg');
  }

  // console.log(img_src)

  return (

    <div>

      { recipe != undefined &&
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

        </div>
      }

    </div>

  ); // style={{display: 'inline', backgroundColor: 'transparent', textTransform: 'none'}}

}



function IngredientsList(props) {

  const classes = useStyles();

/*
  let ingredients = [
  "2 dl mjöl", "1 tsk salt", "4 dl mjölk", "2 ägg"
]; */


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
  // console.log(props.desc)

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
    textAlign: 'center'
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
