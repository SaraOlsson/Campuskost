import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import 'firebase/auth'
import 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFirestore } from 'react-redux-firebase'

function TextSetting(props) {

    const userdoc = useSelector(state => state.firestore.data.userdoc)
    const [settingValue, SetSettingValue] = useState('')
    const [in_editmode, setIn_editmode] = useState(false)
    const [has_changed, setHas_changed] = useState(false)

    const classes = useStyles()
    const firestore = useFirestore()
  
    useEffect(() => {
        SetSettingValue( userdoc ? userdoc[props.db_field] : '' )
    }, [userdoc]) 

    useEffect(() => {

        if(settingValue === '')
            return
        
        setHas_changed(settingValue !== userdoc[props.db_field])
    }, [settingValue])

    const cancel_edit = () => {
        setIn_editmode(false)
        SetSettingValue(userdoc[props.db_field])
    }

    const save_setting = () => {

        setIn_editmode(false)
        db_save(settingValue)
    }

    // update in Firebase
    function db_save(new_value) {

        // Update the database field of the user
        var key = props.db_field
        var obj = {}
        obj[key] = new_value

        firestore.collection('users').doc(userdoc.email).update(obj)
    }

    return !userdoc ? null : (
      <React.Fragment>
        <TextField
          id={'input-' + props.label}
          label={props.label.charAt(0).toUpperCase() + props.label.slice(1)}
          variant='outlined'
          value={settingValue}
          onChange={(e) => SetSettingValue(e.target.value)}
          disabled={!in_editmode}
          multiline={props.multiline}
        />

        { !in_editmode &&
        <Button
            variant='contained'
            color='primary'
            onClick={() => setIn_editmode(true)}
            className={classes.buttons}
        >
            Ändra {props.label}
        </Button>
        }
        { in_editmode &&
        <React.Fragment>
            <Button
            variant='contained'
            color='primary'
            onClick={() => cancel_edit() }
            className={classes.buttons}
            >
            Avbryt
            </Button>

            <Button
            variant='contained'
            color='primary'
            onClick={() => save_setting()}
            className={classes.buttons}
            disabled={!has_changed}
            >
            Spara {props.label}
            </Button>
        </React.Fragment>
        }
      </React.Fragment>
    )
}

const useStyles = makeStyles({
   buttons: {
     margin: '5px'
   },
   rainbow: {
     backgroundImage: 'linear-gradient(to bottom right, #ff49e0 , #26ffa7)',
     fontWeight: 'bold'
   },
   available_text: {
      fontSize: '13px',
      color: '#f50057',
      margin: '8px'
  },
})

export default TextSetting