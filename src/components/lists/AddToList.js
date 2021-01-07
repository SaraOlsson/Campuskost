import { makeStyles } from '@material-ui/core/styles'
import React, {useState} from 'react'
import Emoji from '../shared/Emoji'
import { useTranslation } from "react-i18next"
import { useFirestore } from "react-redux-firebase"
import Button from '@material-ui/core/Button'
import SaveRecipeDialog from './SaveRecipeDialog'

export default function AddToList({recipe}) {

  const [openDialog, setOpenDialog] = useState(false)

  const classes = useStyles()
  const firestore = useFirestore()
  const {t} = useTranslation('common')

  const addToList = (list_id) => {
    firestore
    .collection("lists").doc(list_id).collection("recipes").doc(recipe.recipeID)
    .set({
      title: recipe.title
    })

  }

  return  (
    <div> 
      <Button onClick={() => setOpenDialog(true)} variant="contained" color="primary">Lägg till i lista</Button>

      <SaveRecipeDialog
        open={openDialog}
        onAlertClose={() => setOpenDialog(false)}
        title={'Lägg till i lista'}
        NoOptionText={'stäng'}
        onAdd={addToList}
        recipeID={recipe.recipeID}
      />

    </div>
  );
}

// title={t('settings.delete_alert.title')}
// message={t('settings.delete_alert.message')}
// yesOptionText={t('settings.delete_alert.yes')}
// NoOptionText={t('settings.delete_alert.no')}

const useStyles = makeStyles({
    
});