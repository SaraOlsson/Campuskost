
import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
//import { withStyles } from '@material-ui/core/styles';
//import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import '../style/GlobalCssButton.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';

function IngredientsList(props) {

  const [editObject, setEditObject] = useState(undefined);
  const [quantity, setQuantity] = useState("");
  const [measure, setMeasure] = useState("");
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState(() => initiate_ingredients());
  const classes = useStyles();

  const dispatch = useDispatch(); // be able to dispatch
  const upload_store = useSelector(state => state.uploadReducer);

  const ingredientsDisp = () => {
    dispatch({
      type: "SETINGREDIENTS",
      ingredients: ingredients
    })
  }

  function initiate_ingredients() {
    let temp_ingredients = [
    {name: "mjöl (default data)", quantity: "2", measure: "dl"},
    {name: "salt", quantity: "1", measure: "tsk"},
    {name: "mjölk", quantity: "4", measure: "dl"},
    {name: "ägg", quantity: "2", measure: ""}
    ];

    temp_ingredients = [];

    return (props.ingredients !== undefined) ? props.ingredients : temp_ingredients;
  }

  useEffect(() => {

    let temp_ingredients = upload_store.ingredients;
    if(temp_ingredients !== undefined)
    {
      setIngredients(temp_ingredients);
      // props.handleAdd(temp_ingredients.length);
    }

  }, []);

  const addIngredient = () => {

    let temp_list = ingredients.slice(0);
    let new_obj = {name: "", quantity: "", measure: ""};
    temp_list.push(new_obj);
    setEditObject(new_obj);
    setIngredients(temp_list);

    ingredientsDisp();
  }

  const removeIngredient = () => {

    let temp_list = ingredients.slice(0);
    let ind = temp_list.indexOf(editObject);
    temp_list.splice(ind, 1);

    setIngredients(temp_list);
    setEditObject(undefined);

    setQuantity("");
    setMeasure("");
    setName("");

    ingredientsDisp();

  }

  const listClick = (object) => {

    setEditObject(object);

    setQuantity(object.quantity);
    setMeasure(object.measure);
    setName(object.name);
  }

  const saveEdited = () => {

    let temp_list = ingredients.slice(0);
    let ind = temp_list.indexOf(editObject);

    let obj_copy = editObject;
    obj_copy.quantity = quantity;
    obj_copy.measure = measure;
    obj_copy.name = name;

    temp_list[ind] = obj_copy;

    setIngredients(temp_list);

    setEditObject(undefined);
    setQuantity("");
    setMeasure("");
    setName("");

    props.handleAdd(temp_list.length);

    ingredientsDisp();

  }

  const enterPress = (ev) => {

    if (ev.key === 'Enter') {
      saveEdited();
      ev.preventDefault();
    }

  }

  // let ingredients = (props.ingredients != undefined) ? props.ingredients : temp_ingredients;
  // idx < ingredients.length - 1

  let ingredientsjsx = ingredients.map((ingred, idx) =>
  <React.Fragment key={idx}>
    <ListItem onClick={() => listClick(ingred)} className={(ingredients.indexOf(editObject) === idx ? 'testis' : '')} style={{minHeight: 40}}>
      <ListItemText
        primary={ ingred.quantity + " " + ingred.measure + " " + ingred.name }
      />

    </ListItem>
    { idx < ingredients.length - 1 && <Divider component="li" /> }

  </React.Fragment>
  );

  return (
    <div>

      <Grid className="test"
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >

      <Grid item xs={12}>
        <List dense={true} className={classes.ingredientslist}>

          {ingredientsjsx}

          { editObject === undefined &&

            <ListItem alignItems="center" onClick={() => addIngredient()} className={classes.newListItem}>
              <ListItemText
                primary="Lägg till"
              />
            </ListItem>
          }

        </List>
      </Grid>

      { (editObject !== undefined  ) &&

        <React.Fragment>

        <Grid item xs={2}>
          <TextField required variant="outlined" label="mängd" InputLabelProps={{shrink: true}} value={quantity} onChange={ event => setQuantity(event.target.value.toLowerCase())}/>
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="mått" InputLabelProps={{shrink: true}} value={measure} onChange={ event => setMeasure(event.target.value.toLowerCase())}/>
        </Grid>
        <Grid item xs={5}>
          <TextField required variant="outlined" label="ingrediens" InputLabelProps={{shrink: true}} value={name} onChange={ event => setName(event.target.value.toLowerCase())} onKeyPress={(ev) => enterPress(ev)}/>
        </Grid>
        <Grid item xs={1}>
          <SaveIcon onClick={saveEdited} className={classes.greenicon} />
        </Grid>
        <Grid item xs={1}>
          <DeleteForeverIcon onClick={removeIngredient} className={classes.redicon} />
        </Grid>

        </React.Fragment>

      }

      </Grid>

    </div>
  );
}


// material ui design
const useStyles = makeStyles(theme => ({
  body: {
    padding: 15
  },
  buttontext: {
    textTransform: 'unset'
  },
  input: {
    color: 'black',
    width: 200
  },
  loadedimage: {
    width: '100%',
    borderRadius: '4px'
  },
  root: {
    width: '100%',
  },
  formlabel: {
    marginRight: '30px'
  },
  imagediv: {
    background: '#fbfbfb',
    borderRadius: '4px',
    padding: '40px',
    marginTop: '8px'
  },
  uploaddiv: {
    background: '#68bb8c',
    borderRadius: '4px',
    padding: '40px',
    marginTop: '8px'
  },
  greenicon: {
    color: '#68BB8C'
  },
  redicon: {
    color: 'red'
  },
  newListItem: {
    background: '#f3f3f3'
  },
  titlediv: {
    background: 'gray'
  }
}));

export default IngredientsList;
