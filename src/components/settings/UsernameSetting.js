import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import 'firebase/auth'
import 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFirestore } from 'react-redux-firebase'
import Emoji from '../shared/Emoji'

// small bug when first unvalid name then writes again
// in original onChange, isAvailable changes

function UsernameSetting(props) {

    const userdoc = useSelector(state => state.firestore.data.userdoc)
    const [settingValue, SetSettingValue] = useState('')
    const [in_editmode, setIn_editmode] = useState(false)
    const [has_changed, setHas_changed] = useState(false)
    const [isAvailable, setIsAvailable] = useState(true)

    const classes = useStyles()
    const firestore = useFirestore()
  
    useEffect(() => {
        SetSettingValue( userdoc ? userdoc.username : '' )
    }, [userdoc]) 

    useEffect(() => {

        if(settingValue === '')
            return
        
        setHas_changed(settingValue !== userdoc.username)
    }, [settingValue])

    function newName() {

        let preNames = ['Master', 'Lill', 'Pro']
        let postNames = ['Chef', 'Sleven', 'Pasta', 'Vego']
    
        let rand1 = Math.floor(Math.random() * preNames.length)
        let rand2 = Math.floor(Math.random() * postNames.length)
    
        let pre_n = preNames[rand1]
        let post_n = postNames[rand2]
    
        // props
        return pre_n + post_n
    }

    const randomName = () => {
        let temp_username = newName()
        SetSettingValue(temp_username)
    }

    const cancel_edit = () => {
        setIn_editmode(false)
        SetSettingValue(userdoc.username)
    }

    const save_setting = () => {

        // it does not know yet..!
        if(isAvailable)
        {
            setIn_editmode(true)
        }
            
        db_save(settingValue)
    }

    // update in Firebase
    function db_save(new_value) {

        isAvailableCheck(new_value).then((is_available) => {

        if(is_available === false)
        {
            setIsAvailable(false)
            return
        }

        // Update the database field of the user
        var key = props.db_field
        var obj = {}
        obj[key] = new_value

        // Set the 'username' field of the user
        firestore.collection('users').doc(userdoc.email).update(obj)
        setIn_editmode(false)

        // update other docs (recipe docs) with this username
        toChangePromise(userdoc.username).then((loadedIds) => {

            loadedIds.map( _id => {
                firestore.collection('recipes').doc(_id).update({user: new_value})
            })
        })
        })
    }

    var toChangePromise = function(current_username) {
        return new Promise((resolve, reject) => {
    
          let listsRef = firestore.collection('recipes')
          let list_ids = []
    
          listsRef.where('user', '==', current_username).get()
            .then(snapshot => {
    
              snapshot.forEach(doc => {
                list_ids.push(doc.id)
              })
              resolve(list_ids)
            })
        })
      }

    var isAvailableCheck = function(new_username) {
        return new Promise((resolve, reject) => {

        // check if available
        let is_available = true
        firestore.collection('users').where('username', '==', new_username).get()
            .then(snapshot => {
            snapshot.forEach(doc => {
                is_available = false
            })
            resolve(is_available)
            })
        })
    }

    return !userdoc ? null : (
      <React.Fragment>
        <TextField
          id='outlined-disabled'
          label={props.label.charAt(0).toUpperCase() + props.label.slice(1)}
          variant='outlined'
          value={settingValue}
          onChange={(e) => SetSettingValue(e.target.value)}
          disabled={!in_editmode}
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
                onClick={() => randomName()}
                className={`${classes.buttons} ${classes.rainbow}`}
              >
                Slumpa <Emoji symbol='🤪'/>
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={() => save_setting(settingValue)}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara nytt {props.label}
              </Button>
              { (!isAvailable && has_changed) &&
              <Typography className={classes.available_text} >Namnet är upptaget</Typography>
              }
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

export default UsernameSetting