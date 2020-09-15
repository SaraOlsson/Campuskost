/*
Component: Page where recipes are uplaoded or edited.
TODO: refactor - a lot of code right now!
TODO: it should be possible to reorder ingredients (use Draggable?)
TODO: let the user add extra information, as time to cook or num portions
*/

import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import firebase from 'firebase'; // REFACTOR
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import AddImage from '../components/AddImage';
import CollapseGrid from '../components/CollapseGrid';
import DescriptionList from '../components/descriptionlist';
import IngredientsList from '../components/ingredientslist';
import Emoji from '../components/Emoji';
import '../style/GlobalCssButton.css';

var Spinner = require('react-spinkit');

function UploadPage(props) {

  const [title, setTitle] = useState('');
  const [freetext, setFreetext] = useState('');
  const [cookingtime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [image, setImage] = useState(undefined);
  const [newImage, setNewImage] = useState(false);

  const [id, setId] = useState(undefined);
  const [upload_wait, setUpload_wait] = useState(false);
  const [done, setDone] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();
  const upload_store = useSelector(state => state.uploadReducer);
  const history = useHistory();
  
  // remove these
  const [valid, setValid] = useState({
    title: false,
    ingredients: false,
    desc: false,
    image: false
  });

  const imageDisp = img => {
    dispatch({
      type: "SETIMAGE",
      image: img
    })
  }

  const allValid = () => {

    return (valid.title && valid.ingredients && valid.desc && valid.image)
  }

  useEffect(() => {

    if(upload_store.title !== undefined)
      setTitle(upload_store.title);

    if(upload_store.image !== undefined)
      setImage(upload_store.image);

    if(upload_store.descriptions !== undefined)
      handleDescriptionsAdd(upload_store.descriptions.length);

    if(upload_store.freetext !== undefined)
      setFreetext(upload_store.freetext);
    
    if(upload_store.servings !== undefined)
      setServings(upload_store.servings);
    
    if(upload_store.cookingtime !== undefined)
      setCookingTime(upload_store.cookingtime);

    if(upload_store.ingredients !== undefined)
    {
      handleIngredientsAdd(upload_store.ingredients.length);
    
      // should check the other too..
      setValid ({
        title: true,
        ingredients: true,
        desc: true,
        image: true
      });
    }

  }, []);

  // hande title change
  const handleChange = event => {

    let value = event.target.value;
    setTitle(value);
    setValid({ ...valid, ["title"]: value.length > 0 ? true : false });

    dispatch({
      type: "SETTITLE",
      title: value
    })
  };

  const handleIngredientsAdd = length => {
    setValid({ ...valid, ["ingredients"]: length > 0 ? true : false });
  };

  const handleDescriptionsAdd = length => {
    setValid({ ...valid, ["desc"]: length > 0 ? true : false });
  };

  const onFileAdd = (files) => {

    setValid({ ...valid, ["image"]: true });
    // setFiles(files);

    var reader = new FileReader();
    reader.onload = function(e) {
      setImage(e.target.result);
      setNewImage(true);
      imageDisp(e.target.result);
    }

    try {
      reader.readAsDataURL(files[0]);
    } catch(err) {
        console.log(err.message);
    }
    imageDisp();

  };

  const onFileRemove = () => {
    setValid({ ...valid, ["image"]: false });
    //setFiles([]);
    setImage(undefined);
  };

  const generateImageFilename = () => {
    return 'recept/' + title + '_' + store.auth_user.uid + '.jpg';
  };

  // upload image and callback with download URL
  const uploadImage = (callback) => {
    
    setUpload_wait(true);
    // Create a reference to the new image
    let storageRef = firebase.storage(); // REFACTOR TO HOOKS
    let image_filename = generateImageFilename();
    let newImageRef = storageRef.ref(image_filename); // storageRef.ref('recept/' + title + '_image.jpg');

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

    if(!allValid()) {
      alert("not all valid")
      console.log(valid)
      return;
    }

    // make sure signed in, let pop up earlier..
    if(store.auth_user === undefined || store.firestore_user === undefined) {
      alert("you have to sign in first")
      return;
    }

    // prepare data
    let username = store.firestore_user.username;
    let recipe_name = upload_store.title;
    let image_filename = generateImageFilename();

    let ref_to_user = firestore.collection('users').doc(store.firestore_user.email);
    let firestore_timestamp = firebase.firestore.Timestamp.now();

    // if upload or create new doc
    if(upload_store.editmode === false)
    {
      // when image is uploaded, continue with uploading the rest
      uploadImage(function(returnValue_downloadURL) {
        // use the return value here instead of like a regular (non-evented) return value
        let downloadURL = returnValue_downloadURL;

        firestore
        .collection("recipes")
        .add({
          user: username,
          title: recipe_name,
          freetext: freetext,
          servings: servings,
          cookingtime: cookingtime,
          img_url: downloadURL,
          img_filename: image_filename,
          ingredients: upload_store.ingredients,
          description: upload_store.descriptions,
          user_ref: ref_to_user,
          timestamp: firestore_timestamp
        })
        .then((docRef) => {
          docRef.update({
            recipeID: docRef.id,
          });
          // Document created successfully.
          console.log( "Document created/updated successfully.")
          setUpload_wait(false);
          setDone(true);
          setId(docRef.id);
        });

      }); // end of image upload callback

    } else {

      // UPDATE MODE
      let update_data = {
        title: recipe_name,
        freetext: freetext,
        servings: servings,
        cookingtime: cookingtime,
        img_filename: image_filename,
        ingredients: upload_store.ingredients,
        description: upload_store.descriptions,
      };

      // either upload with or without image (no new imag needed of recipe _update_)
      if (newImage === false) {

        firestore.collection('recipes').doc(upload_store.recipe_id).update(update_data);
        setUpload_wait(false);
        setDone(true);

      } else {

        uploadImage(function(returnValue_downloadURL) {
          // use the return value here instead of like a regular (non-evented) return value
          update_data.img_url = returnValue_downloadURL;
          firestore.collection('recipes').doc(upload_store.recipe_id).update(update_data);

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
  if(upload_wait === false && done === false)
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
  else if ( upload_wait === true ) // if waiting on upload
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
  // </Grid>

  return (


    <div>
      <h3>{page_title}</h3>

        {/* TITLE */}

          <TextField
            id="recipename-input"
            label="Namn på recept"
            variant="outlined"
            value={title}
            onChange={handleChange}
          />

        <CollapseGrid label="Ingredienser">
          <IngredientsList handleAdd={handleIngredientsAdd}/>
        </CollapseGrid>

        <CollapseGrid label="Beskrivning">
          <DescriptionList handleAdd={handleDescriptionsAdd}/>
        </CollapseGrid>

        <CollapseGrid label="Receptbild">
          <p className={classes.copyright}>Obs, Ladda bara upp bilder du har rättigheter till <Emoji symbol="📷"/> </p>
          <AddImage image={image} onFileAdd={onFileAdd} onFileRemove={onFileRemove}/>
        </CollapseGrid>

        <CollapseGrid label="Övrigt (valfritt)">
        <TextField
            id="recipe-extra"
            className="freetext"
            label="Fritext"
            variant="outlined"
            rows={2}
            value={freetext}
            onChange={(e) => setFreetext(e.target.value)}
            multiline
          />

          <TextField
            id="recipe-servings"
            
            variant="outlined"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Portioner</InputAdornment>
            }} 
          />

          <TextField
            id="recipe-time"
            
            variant="outlined"
            type="number"
            value={cookingtime}
            onChange={(e) => setCookingTime(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Minuter</InputAdornment>
            }} 
          />

        </CollapseGrid>

      <div className={classes.uploaddiv} >
        
          {bottom_content}
          
      </div>

    </div>

  );
}

/*label="Antal portioner" label="Tillagningstid"
<div className={classes.uploaddiv} >
        <Grid container justify="center" alignItems="center">
          <Grid item xs={4}>
          {bottom_content}
          </Grid>
        </Grid>
      </div>
      */

// <RecipeCard/>

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
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'center'
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
  },
  copyright: {
    fontSize: 'x-small',
    fontStyle: 'italic',
    paddingLeft: '5px',
  }
}));

export default UploadPage;
