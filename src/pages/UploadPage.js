/*
Component: Page where recipes are uploaded or edited.
TODO: notice if something differs from prev saved data 
*/

import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React from 'react';
import { useSelector } from "react-redux";
import AddImage from '../components/AddImage';
import CollapseGrid from '../components/CollapseGrid';
import Emoji from '../components/Emoji';
import ImageDialog from '../components/ImageDialog';
import DescriptionList from '../components/recipeform/descriptionlist';
import IngredientsList from '../components/recipeform/ingredientslist';
import useUpload from '../components/recipeform/useUpload';
import { useHistory } from "react-router-dom"
import '../style/GlobalCssButton.css';

var Spinner = require('react-spinkit');
const DEBUG = (window.location.hostname === 'localhost')

function UploadPage(props) {

  const classes = useStyles();
  const upload_store = useSelector(state => state.uploadReducer);
  const history = useHistory()
  const { uid } = useSelector((state) => state.firebase.auth);

  const {
    data,
    onValueChange,
    validUpload,
    uploadAction,
    upload_wait,
    done,
    goToRecipe,
    image,
    onFileAdd,
    onFileRemove,
    validTitle,
    validIngredients,
    validDescription,
    validImage,
    openImageDialog,
    onImageDialogChoise,
    rawImage
  } = useUpload()

  // configure bottom content
  let upload_done_text = (upload_store.editmode) ? "Ändring klar" : "Uppladding klar, gå till recept";
  let submit_text = (upload_store.editmode) ? "Ändra recept" : "Ladda upp";
  let is_working = (!upload_wait && !done) 
  let button_text = is_working ? submit_text : upload_done_text
  let onClick_action = is_working ? uploadAction : goToRecipe
  
  const spinner = <Spinner name="ball-scale-multiple" color="#ffffff" fadeIn="none"/>
  const button = (
    <Button
    variant="contained"
    color="primary"
    startIcon={is_working && <CloudUploadIcon />}
    onClick={onClick_action}
    disabled={is_working && !validUpload()}
    >
    {button_text}
    </Button>
  )

  let bottom_content = upload_wait ? spinner : button
  let page_title = (upload_store.editmode) ? "Ändra recept" : "Ladda upp recept";

  if(done)
  {
    return (
      <div>
        <div className={classes.newRecipeContainer}>
          <Button 
            onClick={() => history.go("/upload")}
            variant="contained" color="primary">
            Skapa nytt recept
          </Button>
        </div>
        <div className={classes.uploaddiv} >
          {bottom_content} 
        </div>
      </div>

    )
  }

  return (

    <div>
      <h3>{page_title}</h3>

        { !uid && 
          <p style={{color: 'orange'}}> Du behöver vara inloggad för att kunna ladda upp recept. </p>
        }

        {/* TITLE */}

          <TextField
            id="recipename-input"
            label="Namn på recept"
            variant="outlined"
            name="title"
            value={data.title}
            onChange={onValueChange}
          />

        {/* INGREDIENTS */}
        <CollapseGrid label="Ingredienser">
          <IngredientsList/>
        </CollapseGrid>

        {/* DESCRIPTION */}
        <CollapseGrid label="Beskrivning">
          <DescriptionList/>
        </CollapseGrid>

        {/* IMAGE */}
        <CollapseGrid label="Receptbild">
          <p className={classes.copyright}>Obs, Ladda bara upp bilder du har rättigheter till <Emoji symbol="📷"/> </p>
          <AddImage image={image} onFileAdd={onFileAdd} onFileRemove={onFileRemove}/>
        </CollapseGrid>

        {/* OTHER */}
        <CollapseGrid label="Övrigt (valfritt)">
        <TextField
            id="recipe-extra" className="freetext" variant="outlined" rows={2} multiline
            label="Fritext"
            name="freetext" value={data.freetext} onChange={onValueChange}
          />

          <TextField
            id="recipe-servings" variant="outlined"
            type="number"
            name="servings" value={data.servings} onChange={onValueChange} 
            InputProps={{
              endAdornment: <InputAdornment position="end">Portioner</InputAdornment>
            }} 
          />

          <TextField
            id="recipe-time" variant="outlined"
            type="number"
            value={data.cookingtime} name="cookingtime" onChange={onValueChange} 
            InputProps={{
              endAdornment: <InputAdornment position="end">Minuter</InputAdornment>
            }} 
          />

        </CollapseGrid>

      {/* BOTTOM CONTENT */}
      <div className={classes.uploaddiv} >
        { DEBUG &&
          <div className={classes.validList}>
            <ValidItem title="Receptnamn " valid={validTitle()}/>
            <ValidItem title="Ingredienser " valid={validIngredients()}/>
            <ValidItem title="Beskrivning " valid={validDescription()}/>
            <ValidItem title="Bild " valid={validImage()}/>
          </div>
        }
        {bottom_content} 
      </div>

      <ImageDialog
      open={openImageDialog}
      onAlertClose={onImageDialogChoise}
      image={rawImage} 
      />

    </div>
  );
}

function ValidItem(props) {
  const classes = useStyles()
  return (
    <p className={classes.validItem}>
      {props.title} 
      {props.valid ? <Emoji symbol="☑"/> : <Emoji symbol="☐"/>} 
    </p>
  )
}
// <RecipeCard/>

// material ui design
const useStyles = makeStyles(theme => ({
  uploaddiv: {
    background: '#68bb8c',
    borderRadius: '4px',
    padding: '40px',
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  validList: {
    display: 'flex',
    overflowWrap: 'anywhere'
  },
  validItem: {
    padding: '15px',
    color: 'white'
  },
  copyright: {
    fontSize: 'x-small',
    fontStyle: 'italic',
    paddingLeft: '5px',
  },
  newRecipeContainer: {
    display: 'flex',
    padding: '250px 50px',
    justifyContent: 'center' 

  }
}));

export default UploadPage;
