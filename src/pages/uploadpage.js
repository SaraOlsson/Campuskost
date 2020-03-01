import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles, ThemeProvider } from '@material-ui/core/styles';
import firebase from 'firebase'; // 'firebase/app';
// import 'firebase/firestore';
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

var Spinner = require('react-spinkit');

function UploadPage(props) {

  const [title, setTitle] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [image, setImage] = React.useState(undefined);
  const [id, setId] = React.useState(undefined);
  const [upload_wait, setUpload_wait] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const labelRef = React.useRef(null);
  const [url, setUrl] = React.useState("temp");

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
  const history = useHistory();

  const imageDisp = img => {
    dispatch({
      type: "SETIMAGE",
      image: img
    })
  }

  const allValid = () => {

    return (valid.title && valid.ingredients && valid.desc && valid.image)
  }

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
    // getImage();
    if(upload_store.title != undefined)
    {
      setTitle(upload_store.title);
      setValid({ ...valid, ["title"]: true });
    }
        
  }, []);

  /*
  const getImage = () => {

    let storageRef = firebase.storage();
    storageRef.ref('recept/bananbröd.jpg').getDownloadURL().then(function(url) {

      setUrl("temp 1")
      console.log("url: " + url)

    }).catch(function(error) {
      // Handle any errors
    });

  } */

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

  // upload image and callback with download URL
  const uploadImage = (callback) => {

    setUpload_wait(true);
    // Create a reference to the new image
    let storageRef = firebase.storage();
    let newImageRef = storageRef.ref('recept/' + title + '_image.jpg');

    // Upload image as a Base64 formatted image string.
    let uploadTask = newImageRef.putString(image, 'data_url');

    uploadTask.on('state_changed', function(snapshot){
    }, function(error) { // Handle unsuccessful uploads
    }, function() { // Handle successful uploads on complete

      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('Successful upload. File available at', downloadURL);
        callback(downloadURL);
      });
    });
  }

  const uploadAction = () => {
    console.log("upload now")

    // make sure all valid
    if(!allValid())
    {
      console.log("some input is not valid")
      return;
    }

    // make sure signed in
    if(store.firestore_user == undefined) {
      alert("you have to sign in first")
      return
    }

    // when image is uploaded, continue with uploading the rest
    uploadImage(function(returnValue_downloadURL) {
      // use the return value here instead of like a regular (non-evented) return value
      let downloadURL = returnValue_downloadURL;

      let username = store.firestore_user.username; //  "CheapChef";
      let recipe_name = upload_store.title; // "Linssoppa"

      /*
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
    ]; */

      const document = store.db.doc('recipes/' + recipe_name + '-' + username);
      let r_img = "temp_food1";

      setId(document.id)

      // Enter new data into the document.
      document.set({
        user: username,
        title: recipe_name,
        img: r_img,
        img_url: downloadURL,
        ingredients: upload_store.ingredients,
        description: upload_store.descriptions
      }).then((test) => {
        // Document created successfully.
        console.log( "Document created/updated successfully.")
        setUpload_wait(false);
        setDone(true);
      });

    }); // end of image upload callback

  };

  const goToRecipe = () => {

    history.push("/recipe/" + title + "/" + id );
  };

  let bottom_content;
  // if working on recipe
  if(upload_wait == false && done == false)
  {
    bottom_content = (<Button
      variant="contained"
      color="primary"
      startIcon={<CloudUploadIcon />}
      onClick={uploadAction}
    >
      Upload
    </Button> );
  }
  else if ( upload_wait == true ) // if waiting on upload
  {
    bottom_content = (<div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#ffffff" fadeIn="none"/></div>);
  } else // done with upload
  {
    bottom_content = (<Button
      variant="contained"
      color="primary"
      onClick={goToRecipe}
    >
      Uppladding klar! Visa recept
    </Button> );
  }


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
          {bottom_content}
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
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  }
}));

export default UploadPage;
