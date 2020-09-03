import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import 'firebase/auth';
import 'firebase/firestore';
import { useSelector } from "react-redux";
import React, {useEffect, useRef, useState} from 'react';
import Emoji from '../Emoji';
import { useFirestore } from "react-redux-firebase";

// small bug when first unvalid name then writes again
// in original onChange, isAvailable changes

function UsernameSetting(props) {

    const userdoc = useSelector(state => state.firestore.data.userdoc);
    const [username_textfield, setUsername_textfield] = useState("");
    const [in_editmode, setIn_editmode] = useState(false);
    const [has_changed, setHas_changed] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);

    const classes = useStyles();
    const firestore = useFirestore();
    const store = useSelector(state => state.fireReducer);
  
    useEffect(() => {
        setUsername_textfield( userdoc ? userdoc.username : "" );
    }, [userdoc]); 

    useEffect(() => {

        if(username_textfield === "")
            return;
        
        setHas_changed(username_textfield !== userdoc.username);
    }, [username_textfield]);

    function newName() {

        let preNames = ["Master", "Lill", "Pro"];
        let postNames = ["Chef", "Sleven", "Pasta", "Vego"];
    
        let rand1 = Math.floor(Math.random() * preNames.length);
        let rand2 = Math.floor(Math.random() * postNames.length);
    
        let pre_n = preNames[rand1];
        let post_n = postNames[rand2];
    
        // props
        return pre_n + post_n;
    }

    const randomName = () => {
        let temp_username = newName();
        setUsername_textfield(temp_username);
    }

    const cancel_edit = () => {
        setIn_editmode(false);
        setUsername_textfield(userdoc.username);
    }

    const save_username = () => {

        // it does not know yet..!
        if(isAvailable)
            setIn_editmode(true);

        save_username_db(username_textfield);
    }

    // update in Firebase
    function save_username_db(new_username) {

        isAvailableCheck(new_username).then((is_available) => {

        if(is_available === false)
        {
            setIsAvailable(false);
            return;
        }

        // Set the 'username' field of the user
        firestore.collection('users').doc(store.firestore_user.email).update({username: new_username});
        setIn_editmode(false);

        // update other docs (recipe docs) with this username
        toChangePromise(store.firestore_user.username).then((loadedIds) => {

            loadedIds.map( _id => {
            firestore.collection('recipes').doc(_id).update({user: new_username});
            });
        });
        });
    }

    var toChangePromise = function(current_username) {
        return new Promise((resolve, reject) => {
    
          let listsRef = firestore.collection('recipes');
          let list_ids = [];
    
          listsRef.where('user', '==', current_username).get()
            .then(snapshot => {
    
              snapshot.forEach(doc => {
                list_ids.push(doc.id);
              });
              resolve(list_ids)
            })
        });
      }

    var isAvailableCheck = function(new_username) {
        return new Promise((resolve, reject) => {

        // check if available
        let is_available = true;
        firestore.collection('users').where('username', '==', new_username).get()
            .then(snapshot => {
            snapshot.forEach(doc => {
                is_available = false;
            });
            resolve(is_available)
            })
        });
    }

    // labelWidth={labelWidth}
  
    return !userdoc ? null : (
      <React.Fragment>
        <TextField
          id="outlined-disabled"
          label="Användarnamn"
          variant="outlined"
          value={username_textfield}
          onChange={(e) => setUsername_textfield(e.target.value)}
          disabled={!in_editmode}
        />
        {/*
        <FormControl variant="outlined">
            <InputLabel ref={labelRef} htmlFor="component-outlined"> Användarnamn </InputLabel>
            <OutlinedInput
            value={username_textfield}
            onChange={(e) => setUsername_textfield(e.target.value)}
            labelWidth={labelWidth}
            disabled={!in_editmode}
            />
        </FormControl> */}

            { !in_editmode &&
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIn_editmode(true)}
              className={classes.buttons}
            >
              Ändra användarnamn
            </Button>
            }
            { in_editmode &&
            <React.Fragment>
              <Button
                variant="contained"
                color="primary"
                onClick={() => cancel_edit() }
                className={classes.buttons}
              >
                Avbryt
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => randomName()}
                className={`${classes.buttons} ${classes.rainbow}`}
              >
                Slumpa <Emoji symbol="🤪"/>
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => save_username(username_textfield)}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara nytt användarnamn
              </Button>
              { (!isAvailable && has_changed) &&
              <Typography className={classes.available_text} >Namnet är upptaget</Typography>
              }
            </React.Fragment>
            }
      </React.Fragment>
    );
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
});

export default UsernameSetting;