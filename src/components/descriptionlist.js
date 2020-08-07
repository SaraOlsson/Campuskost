
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import '../style/GlobalCssButton.css';


function DescriptionList(props) {

  const [editObject, setEditObject] = useState(undefined);
  const [text, setText] = useState("");

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
    return (props.description !== undefined) ? props.description : [];
  }

  useEffect(() => {

    let existing_descriptions = upload_store.descriptions;  // in in edit mode
    if(existing_descriptions !== undefined)
    {
      setDescriptions(existing_descriptions);
    }

  }, []);


  const addDescription = () => {

    let temp_list = descriptions.slice(0);
    let new_obj = {order: descriptions.length + 1, text: ""};
    temp_list.push(new_obj);
    setEditObject(new_obj);
    setDescriptions(temp_list);

    ingredientsDisp();
  }

  const removeDescription = () => {

    let temp_list = descriptions.slice(0);
    let ind = temp_list.indexOf(editObject);
    temp_list.splice(ind, 1);

    setDescriptions(temp_list);
    setEditObject(undefined);

    setText("");
    ingredientsDisp();

  }

  const listClick = (object) => {

    setEditObject(object);

    // first letter to toUpperCase
    object.text = (object.text.length > 0) ? object.text[0].toUpperCase() + object.text.slice(1) : "";

    setText(object.text);


  }

  const saveEdited = () => {


    let temp_list = descriptions.slice(0);
    let ind = temp_list.indexOf(editObject);

    let obj_copy = editObject;
    obj_copy.text = (text.length > 0) ? text[0].toUpperCase() + text.slice(1) : "";
    //obj_copy.text = text[0].toUpperCase() + text.slice(1);
    // obj_copy.order = order;

    temp_list[ind] = obj_copy;

    if(text.length < 1) {
      console.log("not relevant to save")
    }

    setDescriptions(temp_list);

    setEditObject(undefined);
    setText("");

    props.handleAdd(temp_list.length);
    ingredientsDisp();

  }

  const enterPress = (ev) => {

    if (ev.key === 'Enter') {

      saveEdited();
      ev.preventDefault();
    }

  }

  // let ingredients = (props.ingredients !== undefined) ? props.ingredients : temp_ingredients;
  // idx < ingredients.length - 1


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
    <div >

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
                primary="Lägg till beskrivning"
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
    background: '#3f51b5',
    color: 'white',
    borderRadius: '5px',
    width: '200px'
  },
  titlediv: {
    background: 'gray'
  }
}));

export default DescriptionList;
