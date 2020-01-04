import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams} from "react-router";
import { useSelector } from 'react-redux';
// import { recipeFetch } from '../actions/RecipeActions';

import ValidCheck from '../components/validcheck';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

function RecipePage(props) {

  const [ recipe, setRecipe] = useState(undefined);
  const [ saved, setSaved ] = useState(false);
  const [ tried, setTried ] = useState(false);
  const { recipetitle, id } = useParams();
  const store = useSelector(state => state.fireReducer);
  const classes = useStyles();

  useEffect(() => {
    // someFetcher();
    //usersRef.on('value', function(snap) { console.log(snap.val()); })
    let ref = store.db.collection('recipes').doc(id);
    recipeFetcher(ref);

  }, []);

  const likeRecipe = () => {
    setSaved( !saved );
  };

  const tryRecipe = () => {
    setTried( !tried );
  };

  const recipeFetcher = (ref) => {
    ref.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            setRecipe(doc.data());
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

  return (

    <div>

      { recipe != undefined &&
        <div>
        <h2>
          <Button disableTouchRipple onClick={likeRecipe}
          style={{display: 'inline', backgroundColor: 'transparent', zIndex: '-1'}}>
            {icon}
          </Button>
          { recipetitle + ' | ' + recipe.user }
        </h2>

        <Grid
          container
          spacing={1}
          justify="center"

        >
          <Grid item xs={6} >
            <img src={require('../assets/'+ r_img + '.jpg')} className={classes.listimage} alt={"recipe img"} />
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

        <IngredientsList/>
        <RecipeDecsList/>

        </div>
      }

    </div>

  );

}


function IngredientsList(props) {

  const classes = useStyles();

  let ingredients = [
  "2 dl mjöl", "1 tsk salt", "4 dl mjölk", "2 ägg"
  ];

  let ingredientsjsx = ingredients.map((ingred, idx) =>
  <React.Fragment key={idx}>
    <ListItem>
      <ListItemText
        primary= { ingred }
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

  let full_desc = [
  "Knäck äggen i en bunke", "Vispa i mjöl, mjölk och salt", "Stek i pannan meed smör eller kokosolja"
  ];

  let descjsx = full_desc.map((desc, idx) =>
    <RecipeDecsListItem idx={idx} key={idx} desc={desc} len={full_desc.length}/>
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
  console.log(props.desc)

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
    borderRadius: '4px'
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
 }
});

export default RecipePage;
