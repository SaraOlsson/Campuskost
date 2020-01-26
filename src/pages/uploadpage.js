import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeStyles, withStyles, ThemeProvider } from '@material-ui/core/styles';
//import { withStyles } from '@material-ui/core/styles';
//import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import '../style/GlobalCssButton.css';
import FileInput from '../components/fileinput';
import ValidCheck from '../components/validcheck';
import theme from '../theme';

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

function ActionsInExpansionPanelSummary() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={<Checkbox />}
            label="Ingredienser"
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography color="textSecondary">
            The click event of the nested action will propagate up and expand the panel unless you
            explicitly stop it.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions2-content"
          id="additional-actions2-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={<Checkbox />}
            label="Beskrivning"
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography color="textSecondary">
            The focus event of the nested action will propagate up and also focus the expansion
            panel unless you explicitly stop it.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

function UploadPage(props) {

  const [title, setTitle] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [image, setImage] = React.useState(undefined);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const labelRef = React.useRef(null);

  const [valid, setValid] = React.useState({
    title: false,
    ingredients: false,
    desc: false,
    image: false
  });

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const store = useSelector(state => state.fireReducer);

  //const state = useSelector(state => state.testReducers); // subscribe to the redux store // testReducers
  //const state = useSelector(state => state.uploadReducer);
  //console.log(state)

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);


  const titleDisp = (evt) => {
    dispatch({
      type: "SETTITLE",
      title: evt.target.value
    })
  }

  const handleChange = event => {

    let value = event.target.value;
    setTitle(value);
    setValid({ ...valid, ["title"]: value.length > 2 ? true : false });

    dispatch({
      type: "SETTITLE",
      title: value
    })
  };

  const handleIngredientsAdd = length => {

    setValid({ ...valid, ["ingredients"]: length > 2 ? true : false });

  };

  const addIngredients = () => {
    setValid({ ...valid, ["ingredients"]: true });
  };

  const addDesc = () => {
    setValid({ ...valid, ["desc"]: true });
  };

  const onFileAdd = (files) => {
    setValid({ ...valid, ["image"]: true });
    setFiles(files);
    console.log(files)

    var reader = new FileReader();

    reader.onload = function(e) {
      setImage(e.target.result);
    //   $('#blah').attr('src', e.target.result);
    }

    reader.readAsDataURL(files[0]);

  };

  const uploadAction = () => {
    console.log("upload now")

    let temp_i = [
    {name: 'lax (temp data)', quantity: "400", measure: "gram"},
    {name: 'pasta', quantity: "500", measure: "gram"},
    {name: 'citron', quantity: "1", measure: "st"},
    {name: 'chilipeppar', quantity: "1", measure: "tsk"}
    ];

    let temp_d = [
    {order: 0, text: "Koka upp pastavattnet"},
    {order: 2, text: "Stek lax i pannan med olivolja"},
    {order: 1, text: "Blanda och tillsätt pressad citron och chilipeppar"}
    ];

/*
    firebase.database().ref('/recipes')
    .push({
      user: "NyaKocken",
      title: "Laxpasta",
      img: "temp_food2",
      ingredients: {temp_i},
      description: {temp_d}
    }); */
    // const Firestore = require('@google-cloud/firestore');

    // let recpiesRef = store.db.collection('recipes');

    let username = "CheapChef";
    let recipe_name = "Linssoppa"

    const document = store.db.doc('recipes/' + recipe_name + '-' + username);

    // Enter new data into the document.
    document.set({
      user: username,
      title: recipe_name,
      img: "temp_food2",
      ingredients: temp_i,
      description: temp_d
    }).then(() => {
      // Document created successfully.
      console.log( "Document created/updated successfully.")
    });

/*
    recpiesRef.push({
      user: "NyaKocken",
      title: "Laxpasta",
      img: "temp_food2",
      ingredients: {temp_i},
      description: {temp_d}
    }); */
/*
    // Import Admin SDK
    var admin = require("firebase-admin");

    // Get a database reference to our blog
    var db = admin.database();
    var ref = db.ref("server/saving-data/fireblog"); */

 /*
    var newPostRef = recpiesRef.push();
    newPostRef.set({
      user: "NyaKocken",
      title: "Laxpasta",
      img: "temp_food2",
      ingredients: {temp_i},
      description: {temp_d}
    });  */
/*
    firebase.database().ref('/books')
    .push({
      author,
      date,
      user: currentUser.uid,
      description,
      email,
      location,
      phone,
      pictureUrl,
      price,
      name,
      title
    })
    .then(() => {
      dispatch({ type: BOOK_CREATE });
      navigator.switchToTab({
        tabIndex: 0
      });
    });
}; */

  };

  return (


    <div>
      <h3>Ladda upp recept</h3>

      <form>

      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >

        <ValidCheck checked={valid.title} xs={2}/>

        <Grid item xs={9}>
        <FormControl variant="outlined">
          <InputLabel ref={labelRef} htmlFor="component-outlined"> Rubrik </InputLabel>
          <OutlinedInput
            value={title}
            onChange={handleChange}
            labelWidth={labelWidth}
          />
        </FormControl>
        </Grid>


        <Grid item xs={12}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
            <FormControlLabel
              aria-label="Acknowledge"
              control={<ValidCheck checked={valid.ingredients} xs={2}/>}
              label="Ingredienser"
              className={classes.formlabel}
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <IngredientsList handleAdd={handleIngredientsAdd}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        </Grid>

        <Grid item xs={12}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
            <FormControlLabel
              aria-label="Acknowledge"
              control={<ValidCheck checked={valid.desc} xs={2}/>}
              label="Beskrivning"
              className={classes.formlabel}
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <IngredientsList handleAdd={handleIngredientsAdd}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        </Grid>


        { /*style={{marginRight: '30px'}}

          <ActionsInExpansionPanelSummary/>

        <ValidCheck checked={valid.ingredients} xs={2}/>
        <Grid item xs={9}> <Button onClick={addIngredients} variant="contained" color="primary" className={classes.buttontext}>
          Lägg till ingredienser
        </Button> </Grid>

        <ValidCheck checked={valid.desc} xs={2}/>
        <Grid item xs={9}> <Button onClick={addDesc} variant="contained" color="primary" className={classes.buttontext}>
          Lägg till beskrivning
        </Button> </Grid> */ }

        {/*
        <div className={classes.imagediv} >

        <ValidCheck checked={valid.image} xs={2}/>
        <Grid item xs={9}>

        <FileInput value={files} onChange={onFileAdd} />

        </Grid>

        { image != undefined &&
        <Grid item xs={9}>
          <img src={image} alt={"loadedimage"} className={classes.loadedimage} />
        </Grid>
        }

        <Grid item xs={5}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={uploadAction}
        >
          Upload
        </Button>
        </Grid>

        </div>
        */ }

      </Grid>

      </form>
    </div>

  );

}

function IngredientsList(props) {

  const [editObject, setEditObject] = useState(undefined);
  const [quantity, setQuantity] = useState("");
  const [measure, setMeasure] = useState("");
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState(() => initiate_ingredients());
  const classes = useStyles();
  // const happyPress = useKeyPress('8');

 /*
  const initiate_ingredients = () => {

    let temp_ingredients = [
    {name: 'mjöl (default data)', quantity: "2", measure: "dl"},
    {name: 'salt', quantity: "1", measure: "tsk"},
    {name: 'mjölk', quantity: "4", measure: "dl"},
    {name: 'ägg', quantity: "2", measure: ""}
    ];

    return (props.ingredients != undefined) ? props.ingredients : temp_ingredients;
  } */

  function initiate_ingredients() {
    let temp_ingredients = [
    {name: "mjöl (default data)", quantity: "2", measure: "dl"},
    {name: "salt", quantity: "1", measure: "tsk"},
    {name: "mjölk", quantity: "4", measure: "dl"},
    {name: "ägg", quantity: "2", measure: ""}
    ];

    temp_ingredients = [];

    return (props.ingredients != undefined) ? props.ingredients : temp_ingredients;
  }

  const addIngredient = () => {
    console.log("okay add")

    let temp_list = ingredients.slice(0);
    let new_obj = {name: "", quantity: "", measure: ""};
    temp_list.push(new_obj);
    setEditObject(new_obj);
    setIngredients(temp_list);
  }

  const removeIngredient = () => {
    //console.log("okay remove")
    let temp_list = ingredients.slice(0);
    let ind = temp_list.indexOf(editObject);
    temp_list.splice(ind, 1);

    setIngredients(temp_list);
    setEditObject(undefined);

    setQuantity("");
    setMeasure("");
    setName("");

  }

  const listClick = (object) => {
    console.log("edit ingredient")
    setEditObject(object);

    setQuantity(object.quantity);
    setMeasure(object.measure);
    setName(object.name);
  }

  /*
  const editValues = (event) => {
    console.log("edit values")
    console.log(event.target.value)

    let obj_copy = editObject;
    obj_copy.quantity = "hey"; // val;

    setEditObject(obj_copy);

    setQuantity(event.target.value);
  } */

  const saveEdited = () => {
    console.log("save values")

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

        { editObject == undefined &&

          <ListItem alignItems="center" onClick={() => addIngredient()} className={classes.newListItem}>
            <ListItemText
              primary="Lägg till"
            />
          </ListItem>

        }

      </List>

      </Grid>


      { editObject != undefined &&

        <React.Fragment>

        <Grid item xs={2}>
          <TextField variant="outlined" value={quantity} onChange={ event => setQuantity(event.target.value)}/>
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" value={measure} onChange={ event => setMeasure(event.target.value)}/>
        </Grid>
        <Grid item xs={5}>
          <TextField variant="outlined" value={name} onChange={ event => setName(event.target.value)} onKeyPress={(ev) => enterPress(ev)}/>
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

// Hook
function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

/*

<ListItem>

  <Grid className="test"
    container
    spacing={1}
    justify="center"
    alignItems="center"
  >

    <Grid item xs={3}>
      <TextField variant="outlined" />
    </Grid>
    <Grid item xs={3}>
      <TextField variant="outlined" />
    </Grid>
    <Grid item xs={6}>
      <TextField variant="outlined" />
    </Grid>

  </Grid>

</ListItem>

*/

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
    background: '#efefef',
    borderRadius: '15px',
    padding: '40px'
  },
  greenicon: {
    color: '#68BB8C'
  },
  redicon: {
    color: 'red'
  },
  newListItem: {
    background: '#f3f3f3'
  }
}));

export default UploadPage;
