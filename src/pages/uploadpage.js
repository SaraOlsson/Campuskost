/*

Component: Page where recipes are uplaoded or edited.
TODO: refactor - a lot of code right now!
TODO: it should be possible to reorder ingredients (use Draggable?)
TODO: let the user add extra information, as time to cook or num portions

*/

import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles, ThemeProvider } from '@material-ui/core/styles';
import firebase from 'firebase'; // 'firebase/app';

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

  // remove these
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

    if(upload_store.descriptions != undefined)
    {
      handleDescriptionsAdd(upload_store.descriptions.length);
    }

    if(upload_store.ingredients != undefined)
    {
      handleIngredientsAdd(upload_store.ingredients.length);
    }

  }, []);

  /*
  const getImage = () => {

    let storageRef = firebase.storage();
    storageRef.ref('recept/bananbröd.jpg').getDownloadURL().then(function(url) {

      setUrl("temp 1")

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
        callback(downloadURL);
      });
    });
  }

  const uploadAction = () => {

    // make sure all valid
    /*
    if(!allValid())
    {
      return;
    } */

    // make sure signed in
    if(store.firestore_user == undefined) {
      alert("you have to sign in first")
      return;
    }

    // prepare data
    let username = store.firestore_user.username;
    let recipe_name = upload_store.title;
    
    // const document = store.db.doc('recipes/' + recipe_name + '-' + username);
    //const temp_doc = store.db.collection('recipes').doc();
    //const _id = recipe_name + '-' + temp_doc.id;

    const document = store.db.collection('recipes').doc();

    let r_img = "temp_food1";
    let ref_to_user = store.db.collection('users').doc(store.firestore_user.email);

    // if upload or create new doc
    if(upload_store.editmode == false)
    {
      // when image is uploaded, continue with uploading the rest
      uploadImage(function(returnValue_downloadURL) {
        // use the return value here instead of like a regular (non-evented) return value
        let downloadURL = returnValue_downloadURL;

        // Enter new data into the document.
        document.set({
          user: username,
          title: recipe_name,
          img: r_img,
          img_url: downloadURL,
          ingredients: upload_store.ingredients,
          description: upload_store.descriptions,
          user_ref: ref_to_user
        }).then((test) => {
          // Document created successfully.
          console.log( "Document created/updated successfully.")
          setUpload_wait(false);
          setDone(true);
        });

        // to be able to direct to recipe page
        setId(document.id);

      }); // end of image upload callback

    } else {

      // UPDATE MODE
      let update_data = {
        title: recipe_name,
        ingredients: upload_store.ingredients,
        description: upload_store.descriptions,
      };

      // either upload with or without image
      if (image == undefined) {

        store.db.collection('recipes').doc(upload_store.recipe_id).update(update_data);
        setUpload_wait(false);
        setDone(true);

      } else {
        uploadImage(function(returnValue_downloadURL) {
          // use the return value here instead of like a regular (non-evented) return value
          update_data.img_url = returnValue_downloadURL;
          store.db.collection('recipes').doc(upload_store.recipe_id).update(update_data);

          setUpload_wait(false);
          setDone(true);

        }); // end of image upload callback
      }

      // to be able to direct to recipe page
      setId(upload_store.recipe_id);
    }


  };

  // when done, there's an option to go to recipe page
  const goToRecipe = () => {
    history.push("/recipe/" + title + "/" + id );
  };

  // whether uploading new recipe or editing an existing
  let upload_done_text = (upload_store.editmode) ? "Ändring" : "Uppladding";
  let upload_button_text = (upload_store.editmode) ? "Ändra recept" : "Ladda upp";
  let bottom_content;
  let upload_disabled = !allValid();

  // if working on recipe
  if(upload_wait == false && done == false)
  {
    bottom_content = (<Button
      variant="contained"
      color="primary"
      startIcon={<CloudUploadIcon />}
      onClick={uploadAction}
      disabled={upload_disabled}
    >
      {upload_button_text}
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
      {upload_done_text} klar! Visa recept
    </Button> );
  }

  let page_title = (upload_store.editmode) ? "Ändra recept" : "Ladda upp recept";

  let decs_valid = (valid.desc || (upload_store.descriptions && upload_store.descriptions.length > 1)) ? true : false;
  let ingred_valid = (valid.ingredients || (upload_store.ingredients && upload_store.ingredients.length > 1)) ? true : false;
  let title_valid = (title.length >= 3 );


  return (


    <div>
      <h3>{page_title}</h3>

      <form>

      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >

        <ValidCheck checked={title_valid} xs={2}/>


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
              control={<ValidCheck checked={ingred_valid} xs={2}/>}
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
              control={<ValidCheck checked={decs_valid} xs={2}/>}
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
          <Grid item xs={4}>
          {bottom_content}
          </Grid>
          </Grid>
          </div>
      </form>
    </div>

  );

}

// className="whitebtn"

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
