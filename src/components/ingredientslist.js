
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import '../style/GlobalCssButton.css';
import DragNDrop from '../components/DragNDrop';
import Button from '@material-ui/core/Button';

const HEADER = "HEADER";
const ROW = "ROW";

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle
});

function IngredientsList(props) {

  const [editObject, setEditObject] = useState(undefined);
  const [quantity, setQuantity] = useState("");
  const [measure, setMeasure] = useState("");
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState(() => initiate_ingredients());
  const classes = useStyles();

  const dispatch = useDispatch(); // be able to dispatch
  const upload_store = useSelector(state => state.uploadReducer);

  const ingredientsDisp = (new_ingredients) => {

    dispatch({
      type: "SETINGREDIENTS",
      ingredients: new_ingredients
    })
    
    // TODO: make it work
    // if( !hasOrderProp() ) {
    //   console.log("add order prop")
    //   let updated = addOrderProp();
    //   dispatch({
    //     type: "SETINGREDIENTS",
    //     ingredients: updated
    //   })
    //   setIngredients(updated);
    // }
    // else {
    //   dispatch({
    //     type: "SETINGREDIENTS",
    //     ingredients: ingredients
    //   })
    // }
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
      // addOrderIfUndefined();
      setIngredients(temp_ingredients);
      
    }

  }, []);

  // addOrderIfUndefined
  const hasOrderProp = () => {

    if( ingredients.length > 0 ) 
    {
      let order = ingredients[0].order;
      return (order !== undefined) ? true : false;
    } else {
      return false;
    }
  }

  const addOrderProp = () => {

    let updated_ingredients = [];

    ingredients.forEach((row, idx) => {

      let new_obj = {order: idx, name: row.name, quantity: row.quantity, measure: row.measure, type: row.type};
      updated_ingredients.push(new_obj);
      
    });

    
    return updated_ingredients;
    // ingredientsDisp(updated_ingredients);
  }

  const addIngredient = (row_type) => {

    let temp_list = ingredients.slice(0);
    let new_order = (max_order()+1).toString();
    let new_obj = {order: new_order, name: "", quantity: "", measure: "", type: row_type};
    temp_list.push(new_obj);
    setEditObject(new_obj);
    setIngredients(temp_list);

    ingredientsDisp(temp_list);
  }

  const max_order = () => {
    let max = 0;
    if(!hasOrderProp())
      return max;

    ingredients.forEach(d => {
      if(d.order > max)
      {
        max = d.order;
      }
    })
    return max;
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

    ingredientsDisp(temp_list);

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

    ingredientsDisp(temp_list);

  }

  const enterPress = (ev) => {

    if (ev.key === 'Enter') {
      saveEdited();
      ev.preventDefault();
    }

  }

  const onReorder = (reordered_rows) => {

    let new_ingredients = [];

    reordered_rows.forEach((row, idx) => {

      var d = ingredients.find( d => d.order.toString() === row.id);
      if(d)
      {
        let new_obj = {order: idx, name: d.name, quantity: d.quantity, measure: d.measure, type: d.type};
        new_ingredients.push(new_obj);
      }
      else
        console.log("row id " + row.id + " not found")
    });

    console.log(new_ingredients)

    setIngredients(new_ingredients);
    ingredientsDisp(new_ingredients);
  }

  const getMyItems = (d_data, datajsx) => {

    const data = datajsx.map((item, idx) => ({
      id: `${d_data[idx].order}`,
      content: item
    }));
    return data;
  }

  // let ingredients = (props.ingredients != undefined) ? props.ingredients : temp_ingredients;
  // idx < ingredients.length - 1

  let ingredientsjsx = ingredients.map((ingred, idx) =>
  <React.Fragment key={idx}>
    <ListItem onClick={() => listClick(ingred)} className={(ingredients.indexOf(editObject) === idx ? 'testis' : '')} style={{minHeight: 40}}>
      <ListItemText
        classes={{ primary: (ingred.type === HEADER) ? classes.bold : '' }}
        primary={ ingred.quantity + " " + ingred.measure + " " + ingred.name }
      />

    </ListItem>
    { idx < ingredients.length - 1 && <Divider component="li" /> }

  </React.Fragment>
  );
  // {ingredientsjsx}

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

          { hasOrderProp() ?
            <DragNDrop items={getMyItems(ingredients, ingredientsjsx)} getListStyle={getListStyle} getItemStyle={getItemStyle} onReorder={onReorder}/>
            :
            ingredientsjsx
          }



          { editObject === undefined &&

            <ListItem alignItems="center">
              {/* <ListItemText onClick={() => addIngredient()} className={classes.newListItem}
                primary="Lägg till ingrediens"
              /> */}
              <Button variant="contained" color="primary" onClick={() => addIngredient(ROW)} className={classes.marginRight10}>
                {"Lägg till ingrediens"}
              </Button>
              <Button variant="contained" color="primary" onClick={() => addIngredient(HEADER)}>
                {"Lägg till rubrik"}
              </Button>
            </ListItem>
          }

        </List>
      </Grid>

      { editObject !== undefined &&

        <React.Fragment>

        { editObject.type === ROW &&

          <React.Fragment>
            <Grid item xs={3}>
              <TextField required variant="outlined" label="mängd" InputLabelProps={{shrink: true}} value={quantity} onChange={ event => setQuantity(event.target.value.toLowerCase())}/>
            </Grid>
            <Grid item xs={2}>
              <TextField variant="outlined" label="mått" InputLabelProps={{shrink: true}} value={measure} onChange={ event => setMeasure(event.target.value.toLowerCase())}/>
            </Grid>
            <Grid item xs={5}>
              <TextField required variant="outlined" label="ingrediens" InputLabelProps={{shrink: true}} value={name} onChange={ event => setName(event.target.value.toLowerCase())} onKeyPress={(ev) => enterPress(ev)}/>
            </Grid>
          </React.Fragment>
        }
        { editObject.type === HEADER && 
    
          <Grid item xs={10}>
            <TextField variant="outlined" label="rubrik" InputLabelProps={{shrink: true}} value={name} onChange={ event => setName(event.target.value)} onKeyPress={(ev) => enterPress(ev)}/>
          </Grid>
        
        }

          <Grid item xs={1}>
            <CheckCircleIcon onClick={saveEdited} className={classes.greenicon} />
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
    background: '#3f51b5',
    color: 'white',
    borderRadius: '5px',
    width: '200px'
  },
  titlediv: {
    background: 'gray'
  },
  marginRight10: {
    marginRight: '10px'
  },
  bold: {
    fontWeight: 'bold'
  }
}));

export default IngredientsList;
