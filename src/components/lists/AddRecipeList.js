import React, { useState } from "react"
import { useFirestore } from "react-redux-firebase"
import { useSelector } from "react-redux"
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import {useTranslation} from "react-i18next"
import { makeStyles } from '@material-ui/core/styles'

export default function AddRecipeList() {

    const [listname, setListname] = useState("")

    const classes = useStyles()
    const {t} = useTranslation('common')
    const firestore = useFirestore()
    const { email } = useSelector((state) => state.firebase.auth)


    const addNewTodo = (todo) => {
        firestore
          .collection("lists")
          .add({
            title: listname,
            created_by: email,
          })
          .then((docRef) => {
            docRef.update({
              listID: docRef.id,
            })
          })
          setListname("")
    }
      
    return (
        <div className={classes.newRecipeContainer}>
            <TextField
            label={"Titel"}
            variant="outlined"
            style={{background: 'white'}}
            value={listname}
            onChange={(e) => setListname(e.target.value)}
            />
            <Button
              onClick={(event) => {
                event.preventDefault()
                addNewTodo(listname)
              }}
              variant="contained"
              color="primary"
            >
              {t('lists.actions.create_list')}
            </Button>

        </div>
      )
}

const useStyles = makeStyles(theme => ({
  newRecipeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    background: '#f1f1f1',
    padding: '30px 15px',
    borderRadius: 10,
    margin: 15
  }
}))