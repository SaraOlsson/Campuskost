import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import firebase from "firebase/app"
import React, { useState } from 'react'
import { useTranslation } from "react-i18next"
import { useFirestore } from "react-redux-firebase"
import useFirebaseFetch from '../core/useFirebaseFetch'
import Emoji from '../shared/Emoji'
import { useHistory } from "react-router-dom";

// TODO: reorder options so that lists that dont have the recipe appears at the top
// TODO: mouse-over on desktop
// TODO: change to subscribe in this case..!

function ListOption({list, onClick, hasPicked, recipeID}) {

  const [pickedThis, setPickedThis] = useState(false)
  const db = firebase.firestore()
  const {t} = useTranslation('common')
  //const [hasMouseOver, hasMouseOver] = useState(false);

  const clicked = () => {

    if(doc_if_saved)
      return

    setPickedThis(!pickedThis)
    onClick(list.listID)
  }

  const removeClick = () => {
    console.log("remove " + recipeID + " from " + list.title)
    db.collection("lists").doc(list.listID).collection("recipes").doc(recipeID).delete();
    setPickedThis(!pickedThis)
  }

  let db_doc_ref = db.collection("lists").doc(list.listID).collection("recipes").doc(recipeID)
  const {
    data: doc_if_saved
  } = useFirebaseFetch(db_doc_ref, "DOC")

  // console.log(doc_if_saved)

  return (
    
    <div 
      onClick={clicked}
      style={{
        background: (doc_if_saved) ? '#43a58e' : '#0081b3',
        borderRadius: 5,
        padding: '15px 15px',
        margin: 5,
        color: 'white',
        textAlign: 'center',
        cursor: !doc_if_saved ? 'pointer' : 'unset',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
        
      }}
      className={(doc_if_saved || hasPicked) ? '' : 'animOpacityBlinking'}
    >
      <span>{list.title} </span> 
      <div> 
      { pickedThis && <span>{t('lists.done_message')} <Emoji symbol="🗸"/></span> } 
      { doc_if_saved && 
        <>
          <span> {t('lists.already_saved')} <Emoji symbol="🐹"/></span>
          <Button onClick={removeClick}> {t('lists.actions.remove_from_list')} </Button>
        </>
      }
      </div>

    </div>
    
  )
}

export default function SaveRecipeDialog(props) {

  const [hasPicked, setHasPicked] = useState(false)

  const classes = useStyles()
  const history = useHistory()
  const firestore = useFirestore()
  const {t} = useTranslation('common')
  const db = firebase.firestore()

  let db_ref = db.collection("lists").where("created_by", "==", props.byUser)
  const {
    data: list_data
  } = useFirebaseFetch(db_ref, "COLLECTION")

  const handleClose = (chosedYes) => {
    props.onAlertClose(chosedYes);
  };

  const onClick = (listID) => {
    // console.log("picked listID "+ listID)
    setHasPicked(true)
    props.onAdd(listID)
  }

  return !props.open ? null : (
      
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{
          paperWidthSm: classes.overrideDialog
        }}
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>

        <div>
        { list_data ?
          list_data.map((list, idx) => 
            <ListOption 
              key={list.title+idx} 
              list={list} 
              onClick={onClick} 
              hasPicked={hasPicked}
              recipeID={props.recipeID}
            />
          )
          :
          <div 
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <p>{t("lists.no_lists_yet")}</p>
            <Button variant="contained" color="primary" 
                    onClick={() => history.push("/saved")}>
                    {t("lists.actions.create_list")}
            </Button>
          </div>
        } 
        </div>
        

        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            {props.NoOptionText}
          </Button>
          <Button onClick={() => handleClose(true)} color="primary" autoFocus>
            {props.yesOptionText}
          </Button>
        </DialogActions> */}
      </Dialog>
  );
}

const useStyles = makeStyles({
  overrideDialog: {
    maxWidth: '80%',
    minWidth: '50%',
    minHeight: '30%'
  }
});