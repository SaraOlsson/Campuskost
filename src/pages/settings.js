import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';



function Settings(props) {

  const [username_textfield, setUsername_textfield] = useState("");
  const [has_changed, setHas_changed] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [in_editmode, setIn_editmode] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const labelRef = React.useRef(null);
  const [openSetting, setOpenSetting] = useState("");

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const history = useHistory();

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  React.useEffect(() => {
    if(store.firestore_user && username_textfield != store.firestore_user.username) {
      setHas_changed(true)
    }
  }, [username_textfield]);

  // when information about user signed in arrives, set textfield value
  React.useEffect(() => {
    if(store.firestore_user) {
      setUsername_textfield(store.firestore_user.username)
    }
  }, [store.firestore_user]);


  // exit edit mode
  function cancel_edit() {

    setIn_editmode(false);
    if(has_changed) {
      setUsername_textfield(store.firestore_user.username);
    }
  }

  function signOut() {

    console.log("sign out")

    // sign out if signed in
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      history.push("/login");
    }
  }

  const editUsername = (new_value) => {
    setUsername_textfield(new_value);
    setIsAvailable(true);
  }

  var toChangePromise = function(current_username) {
    return new Promise((resolve, reject) => {

      let listsRef = store.db.collection('recipes');
      let list_ids = [];

      let query = listsRef.where('user', '==', current_username).get()
        .then(snapshot => {

          snapshot.forEach(doc => {
            list_ids.push(doc.id);
          });
          resolve(list_ids)
        })
    });
  }

  var isAvailableCheck = function() {
    return new Promise((resolve, reject) => {

      // check if available
      let is_available = true;
      let query = store.db.collection('users').where('username', '==', username_textfield).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            is_available = false;
          });
          resolve(is_available)
        })
    });
  }

  // update in Firebase
  function save_username() {

    console.log("set username to " + username_textfield)

    isAvailableCheck().then((is_available) => {

      if(is_available === false)
      {
        console.log("is_available: " + is_available)
        setIsAvailable(false);
        return;
      }

      // Set the 'username' field of the city
      store.db.collection('users').doc(store.firestore_user.email).update({username: username_textfield});
      setIn_editmode(false);

      toChangePromise(store.firestore_user.username).then((loadedIds) => {
        console.log("Yay!! loaded " + loadedIds)
        loadedIds.map( _id => {
          store.db.collection('recipes').doc(_id).update({user: username_textfield});
      });

    });

  });

  }


  // update in Firebase
  function save_img() {

    console.log("set img url to: XXX")

  }

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

  const randomImg = () => {
    console.log("random img")
  }

  const onExpand = (e, expanded, id) => {
    let openval = expanded ? id : "";
    setOpenSetting(openval);
  }

  console.log("openSetting: " + openSetting)
  //let signText = (firebase.auth().currentUser) ? "Logga ut" : "Logga in";

  // let username = (store.firestore_user) ? store.firestore_user.username : "unset";

  let img_src = (store.firestore_user && store.firestore_user.profile_img_url ) ? store.firestore_user.profile_img_url : undefined;

  return (

    <div>
      <div className={classes.login_div}>
        <h3>Inställningar</h3>

        <ExpansionPanel
          onChange={(e, expanded) => onExpand(e, expanded, "username")}
          expanded={openSetting === "username"}
          style={{background: '#fbfbfb', marginTop: '8px'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Användarnamn</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{display: 'inline-block'}}>

            <FormControl variant="outlined">
              <InputLabel ref={labelRef} htmlFor="component-outlined"> Användarnamn </InputLabel>
              <OutlinedInput
                value={username_textfield}
                onChange={(e) => editUsername(e.target.value)}
                labelWidth={labelWidth}
                disabled={!in_editmode}
              />
            </FormControl>

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
                Slumpa 🤪
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => save_username()}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara nytt användarnamn
              </Button>
              { !isAvailable &&
              <Typography className={classes.available_text} >Namnet är upptaget</Typography>
              }
            </React.Fragment>
            }
          </ExpansionPanelDetails>

        </ExpansionPanel>

        <ExpansionPanel
          onChange={(e, expanded) => onExpand(e, expanded, "profileimage")}
          expanded={openSetting === "profileimage"}
          style={{background: '#fbfbfb', marginTop: '8px'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Profilbild</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{display: 'flex'}}>

            { img_src &&

            <img src={img_src} className={classes.profileimage}  alt={"profile img"} />

            }

            { !in_editmode &&
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIn_editmode(true)}
              className={classes.buttons}
            >
              Ändra bild
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
                onClick={() => randomImg()}
                className={`${classes.buttons} ${classes.rainbow}`}
              >
                Slumpa 🤪
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => save_img()}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara ny profilbild
              </Button>
            </React.Fragment>
            }

          </ExpansionPanelDetails>

        </ExpansionPanel>

      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => signOut()}
        className={classes.center_btn}
      >
        Logga ut
      </Button>

    </div>
  );
} // className={classes.formlabel}

const useStyles = makeStyles({
  login_div: {
    background: '#f5f5f5',
    padding: '1em',
    margin: '0.5em',
    borderRadius: '15px'
 },
 buttons: {
   margin: '5px'
 },
 rainbow: {
   backgroundImage: 'linear-gradient(to bottom right, #ff49e0 , #26ffa7)',
   fontWeight: 'bold'
 },
 center_btn: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
    display: 'flex'
 },
 available_text: {
    fontSize: '13px',
    color: '#f50057',
    margin: '8px'
},
profileimage: {
  marginLeft: 'auto',
  marginRight: 'auto'
}
});

export default Settings;
