import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeStyles, withStyles, ThemeProvider } from '@material-ui/core/styles';
//import { withStyles } from '@material-ui/core/styles';
//import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import '../style/GlobalCssButton.css';
import FileInput from '../components/fileinput';
import ValidCheck from '../components/validcheck';
import DescriptionList from '../components/descriptionlist';
import IngredientsList from '../components/ingredientslist';
import theme from '../theme';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';



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
  const upload_store = useSelector(state => state.uploadReducer);

  const imageDisp = img => {
    dispatch({
      type: "SETIMAGE",
      image: img
    })
  }

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
    setValid({ ...valid, ["ingredients"]: length > 1 ? true : false });
  };

  const handleDescriptionsAdd = length => {
    setValid({ ...valid, ["desc"]: length > 1 ? true : false });
  };

  const onFileAdd = (files) => {
    setValid({ ...valid, ["image"]: true });
    setFiles(files);

    var reader = new FileReader();
    reader.onload = function(e) {
      setImage(e.target.result);
      imageDisp(e.target.result);
    }

    reader.readAsDataURL(files[0]);
    imageDisp();
  };

  const onFileRemove = () => {
    setValid({ ...valid, ["image"]: false });
    setFiles([]);
    setImage(undefined);
  };

  const uploadAction = () => {
    console.log("upload now")

    if(store.firestore_user == undefined) {
      alert("you have to sign in first")
      return
    }

    let username = store.firestore_user.username; //  "CheapChef";
    let recipe_name = upload_store.title; // "Linssoppa"

    console.log("username: " + username)
    console.log("recipe_name: " + recipe_name)

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

    console.log(temp_d)
    console.log(upload_store.descriptions)

    const document = store.db.doc('recipes/' + recipe_name + '-' + username);
    let r_img = "temp_food1"; // ( upload_store.image != undefined) ? upload_store.image : 'temp_food1';

    // Enter new data into the document.
    document.set({
      user: username,
      title: recipe_name,
      img: r_img,
      ingredients: upload_store.ingredients,
      description: upload_store.descriptions
    }).then(() => {
      // Document created successfully.
      console.log( "Document created/updated successfully.")
    });

  };
  // style={{marginLeft: '-13px !important'}}

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
        <ExpansionPanel style={{background: '#fbfbfb', marginTop: '8px'}}>
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
        <ExpansionPanel style={{background: '#f7f6f6'}}>
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
            <DescriptionList handleAdd={handleDescriptionsAdd}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        </Grid>

      </Grid>

      <div className={classes.imagediv} >
        <ValidCheck checked={valid.image} xs={2}/>
        <Grid container spacing={1}>
          <Grid item xs={9} style={{
              display: 'flex',
              marginBottom: '10px'
          }}>
          <FileInput value={files} onChange={onFileAdd} />
          </Grid>

        </Grid>
        { image != undefined &&
        <React.Fragment>
          <Grid item xs={9}>
            <img src={image} alt={"loadedimage"} className={classes.loadedimage} />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={onFileRemove}
              style={{lineHeight: '1.2'}}
            >
              Ta bort bild
            </Button>
          </Grid>
        </React.Fragment>

        }
        </div>

        <div className={classes.uploaddiv} >
          <Grid container justify="center" alignItems="center">
          <Grid item xs={4} className="whitebtn">
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={uploadAction}
          >
            Upload
          </Button>
          </Grid>
          </Grid>
          </div>

      </form>
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

export default UploadPage;
