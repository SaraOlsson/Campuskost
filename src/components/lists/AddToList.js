import React, {useState} from 'react'
import { useTranslation } from "react-i18next"
import { useFirestore } from "react-redux-firebase"
import Button from '@material-ui/core/Button'
import SaveRecipeDialog from './SaveRecipeDialog'
import { useSelector } from "react-redux"


export default function AddToList({recipe}) {

  const [openDialog, setOpenDialog] = useState(false)

  const firestore = useFirestore()
  const { email } = useSelector((state) => state.firebase.auth) 
  const {t} = useTranslation('common')

  // const {has_recipe} = useHasRecipeInList("sara.olsson4s@gmail.com", recipe.recipeID)

  const addToList = (list_id) => {
    firestore
    .collection("lists").doc(list_id).collection("recipes").doc(recipe.recipeID)
    .set({
      title: recipe.title
    })

  }

  return  (
    <div> 
      <Button onClick={() => setOpenDialog(true)} 
              variant="contained" 
              color="primary">
        {t('lists.actions.add_to_list')}
      </Button>

      { email &&
      <SaveRecipeDialog
        open={openDialog}
        onAlertClose={() => setOpenDialog(false)}
        title={t('lists.actions.add_to_list')}
        NoOptionText={t('lists.actions.close_dialog')}
        onAdd={addToList}
        recipeID={recipe.recipeID}
        byUser={email}
      />
      }

    </div>
  )
}