
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

function DescriptionList(props) {

  const [editObject, setEditObject] = useState(undefined);
  const [order, setOrder] = useState(-2);
  const [text, setText] = useState("");

  //console.log("order: " + order)

  const [descriptions, setDescriptions] = useState(() => initiate_descriptions());
  const classes = useStyles();

  const dispatch = useDispatch(); // be able to dispatch
  const upload_store = useSelector(state => state.uploadReducer);

  const ingredientsDisp = () => {
    dispatch({
      type: "SETDESCRIPTIONS",
      descriptions: descriptions
    })
  }

  function initiate_descriptions() {

    let temp_description = [
    {order: 1, text: "Knäck äggen i en bunke (default data)"},
    {order: 2, text: "Stek i pannan meed smör eller kokosolja"},
    {order: 3, text: "Vispa i mjöl, mjölk och salt"}
    ];

    temp_description = [];

    return (props.description !== undefined) ? props.description : temp_description;
  }

  useEffect(() => {

    let temp_descriptions = upload_store.descriptions;
    if(temp_descriptions !== undefined)
    {
      setDescriptions(temp_descriptions);
      // props.handleAdd(temp_descriptions.length);
    }

  }, []);

  const addDescription = () => {
    // console.log("okay add")

    let temp_list = descriptions.slice(0);
    let new_obj = {order: descriptions.length + 1, text: ""};
    temp_list.push(new_obj);
    setEditObject(new_obj);
    setDescriptions(temp_list);

    setOrder(descriptions.length + 1);
    ingredientsDisp();
  }

  const removeDescription = () => {
    //console.log("okay remove")
    let temp_list = descriptions.slice(0);
    let ind = temp_list.indexOf(editObject);
    temp_list.splice(ind, 1);

    setDescriptions(temp_list);
    setEditObject(undefined);

    setText("");
    setOrder(-321); //
    ingredientsDisp();

  }

  const listClick = (object) => {
    console.log("edit descriptions")
    setEditObject(object);

    // first letter to toUpperCase
    object.text = (object.text.length > 0) ? object.text[0].toUpperCase() + object.text.slice(1) : "";

    setText(object.text);
    // setOrder(object.order);

  }

  const saveEdited = () => {
    console.log("save values")

    let temp_list = descriptions.slice(0);
    let ind = temp_list.indexOf(editObject);

    //console.log(editObject)

    let obj_copy = editObject;
    obj_copy.text = (text.length > 0) ? text[0].toUpperCase() + text.slice(1) : "";
    //obj_copy.text = text[0].toUpperCase() + text.slice(1);
    // obj_copy.order = order;

    temp_list[ind] = obj_copy;

    //console.log(obj_copy)

    if(text.length < 1) {
      console.log("not relevant to save")
    }

    setDescriptions(temp_list);

    setEditObject(undefined);
    setText("");
    setOrder(-123)

    //console.log("temp_list.length" + temp_list.length)

    props.handleAdd(temp_list.length);
    ingredientsDisp();

  }

  const enterPress = (ev) => {

    // console.log(`Pressed keyCode ${ev.key}`);
    if (ev.key === 'Enter') {
      // Do code here
      console.log(`Pressed enter`);
      saveEdited();
      ev.preventDefault();
    }

  }

  // let ingredients = (props.ingredients != undefined) ? props.ingredients : temp_ingredients;
  // idx < ingredients.length - 1

  //console.log(descriptions)

  let descriptionjsx = descriptions.map((desc, idx) =>
  <React.Fragment key={idx}>
    <ListItem onClick={() => listClick(desc)} className={(descriptions.indexOf(editObject) === idx ? 'testis' : '')} style={{minHeight: 40}}>
      <ListItemText
        primary={ desc.order + ". " + desc.text }
      />

    </ListItem>
    { idx < descriptions.length - 1 && <Divider component="li" /> }

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

          {descriptionjsx}

          { editObject === undefined &&

            <ListItem alignItems="center" onClick={() => addDescription()} className={classes.newListItem}>
              <ListItemText
                primary="Lägg till"
              />
            </ListItem>
          }

        </List>
      </Grid>

      { (editObject !== undefined  ) &&

        <React.Fragment>

        <Grid item xs={10}>
          <TextField variant="outlined" label="steg" InputLabelProps={{shrink: true}} value={text} onChange={ event => setText(event.target.value)} onKeyPress={(ev) => enterPress(ev)}/>
        </Grid>

        <Grid item xs={1}>
          <SaveIcon onClick={saveEdited} className={classes.greenicon} />
        </Grid>
        <Grid item xs={1}>
          <DeleteForeverIcon onClick={removeDescription} className={classes.redicon} />
        </Grid>

        </React.Fragment>

      }

      </Grid>

    </div>
  );
}

// .toLowerCase()
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

export default DescriptionList;
