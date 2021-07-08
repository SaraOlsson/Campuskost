/*
Component: Page where recipes are uploaded or edited.
TODO: notice if something differs from prev saved data 
*/
import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { useSelector } from 'react-redux'
import AddImage from '../components/shared/AddImage'
import CollapseGrid from '../components/shared/CollapseGrid'
import Emoji from '../components/shared/Emoji'
import ImageDialog from '../components/recipeform/ImageDialog'
import DescriptionList from '../components/recipeform/EditDescription'
import IngredientsList from '../components/recipeform/EditIngredients'
import useUpload from '../components/recipeform/useUpload'
import { useHistory } from 'react-router-dom'
import {useTranslation} from 'react-i18next'

const Spinner = require('react-spinkit')
const DEBUG = (window.location.hostname === 'localhost')

function ValidItem(props) {
  const classes = useStyles()
  return (
    <p className={classes.validItem}>
      {props.title} 
      {props.valid ? <Emoji symbol='☑'/> : <Emoji symbol='☐'/>} 
    </p>
  )
}

function UploadPage(props) {

  const classes = useStyles()
  const uploadStore = useSelector(state => state.uploadReducer)
  const history = useHistory()
  const { uid } = useSelector((state) => state.firebase.auth)
  const {t} = useTranslation('common')
  const [needCredit, setNeedCredit] = useState(false)

  const {
    data,
    onValueChange,
    validUpload,
    uploadAction,
    uploadWait,
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
  const uploadDoneText = (uploadStore.editmode) ? 'Ändring klar' : 'Uppladding klar, gå till recept'
  const submitText = (uploadStore.editmode) ? t('upload.actions.edit') : t('upload.actions.upload')
  const isWorking = (!uploadWait && !done) 
  submitText = isWorking ? submitText : uploadDoneText
  const onClickAction = isWorking ? uploadAction : goToRecipe
  
  const spinner = <Spinner name='ball-scale-multiple' color='#ffffff' fadeIn='none'/>
  const button = (
    <Button
    variant='contained'
    color='primary'
    startIcon={isWorking && <CloudUploadIcon />}
    onClick={onClickAction}
    disabled={isWorking && !validUpload()}
    >
    {submitText}
    </Button>
  )

  let bottom_content = uploadWait ? spinner : button
  let page_title = (uploadStore.editmode) ? t('upload.header_edit') : t('upload.header_upload')

  if(done)
  {
    return (
      <div>
        <div className={classes.newRecipeContainer}>
          <Button 
            onClick={() => history.go('/upload')}
            variant='contained' color='primary'>
            {t('upload.createnew')}
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
          <p style={{color: 'orange'}}> {t('upload.signin_message')} </p>
        }

        {/* TITLE */}

          <TextField
            id='recipename-input'
            label={t('upload.tooltip.recipename')}
            variant='outlined'
            name='title'
            value={data.title}
            onChange={onValueChange}
          />

          <div style={{fontStyle: 'italic'}}>
            <p> {t('upload.creditquestion')}
              <span style={{color: 'green', marginLeft: 5, cursor: 'pointer'}}
                 onClick={() => setNeedCredit(true)}
              >
                {t('upload.enterLink')}
              </span> 
              {
                needCredit &&
                <span style={{color: 'red', marginLeft: 5, cursor: 'pointer'}}
                  onClick={() => setNeedCredit(false)}
                >
                  ({t('shared.hide')})
                </span> 
              }
            </p>
            {
            needCredit &&
            <>
            {/* <p> {t('upload.creditlinkinfo')}</p> */}
            <TextField
            id='recipecredit-input'
            label={t('upload.tooltip.credit')}
            variant='outlined'
            name='credit_link'
            value={data.credit_link}
            onChange={onValueChange}
            />
            </>
          }
          </div>

        {/* INGREDIENTS */}
        <CollapseGrid label={t('shared.ingredients')}>
          <IngredientsList/>
        </CollapseGrid>

        {/* DESCRIPTION */}
        <CollapseGrid label={t('shared.description')}>
          <DescriptionList/>
        </CollapseGrid>

        {/* IMAGE */}
        <CollapseGrid label={t('upload.recipe_image')}>
          <p className={classes.copyright}>{t('upload.creditmessage')}<Emoji symbol='📷'/> </p>
          <AddImage image={image} onFileAdd={onFileAdd} onFileRemove={onFileRemove}/>
        </CollapseGrid>

        {/* OTHER */}
        <CollapseGrid label={t('upload.other')}>
        <TextField
            id='recipe-extra' className='freetext' variant='outlined' rows={2} multiline
            label={t('upload.data.freetext')}
            name='freetext' value={data.freetext} onChange={onValueChange}
          />

          <TextField
            id='recipe-servings' variant='outlined'
            type='number'
            name='servings' value={data.servings} onChange={onValueChange} 
            InputProps={{
              endAdornment: <InputAdornment position='end'>{t('upload.data.servings')}</InputAdornment>
            }} 
          />

          <TextField
            id='recipe-time' variant='outlined'
            type='number'
            value={data.cookingtime} name='cookingtime' onChange={onValueChange} 
            InputProps={{
              endAdornment: <InputAdornment position='end'>{t('upload.data.cookingtime')}</InputAdornment>
            }} 
          />

        </CollapseGrid>

      {/* BOTTOM CONTENT */}
      <div className={classes.uploaddiv} >
        { DEBUG &&
          <div className={classes.validList}>
            <ValidItem title='Receptnamn ' valid={validTitle()}/>
            <ValidItem title='Ingredienser ' valid={validIngredients()}/>
            <ValidItem title='Beskrivning ' valid={validDescription()}/>
            <ValidItem title='Bild ' valid={validImage()}/>
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
  )
}


// <RecipeCard/>

// material ui design
const useStyles = makeStyles(theme => ({
  uploaddiv: {
    background: theme.palette.campuskost.teal,
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
}))

export default UploadPage
