import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

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
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [in_editmode, setIn_editmode] = React.useState(false);
  const labelRef = React.useRef(null);

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);

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

  // update in Firebase
  function save_username() {

    console.log("set username to " + username_textfield)

    // Set the 'username' field of the city
    let cityRef = store.db.collection('users').doc(store.firestore_user.email).update({username: username_textfield});
    setIn_editmode(false);

  }


  //let signText = (firebase.auth().currentUser) ? "Logga ut" : "Logga in";

  // let username = (store.firestore_user) ? store.firestore_user.username : "unset";

  return (

    <div className={classes.login_div}>
      <h3>Inställningar</h3>

      <ExpansionPanel style={{background: '#fbfbfb', marginTop: '8px'}}>
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
              onChange={(e) => setUsername_textfield(e.target.value)}
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
              onClick={() => console.log("Slumpa")}
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
          </React.Fragment>
          }
        </ExpansionPanelDetails>
      </ExpansionPanel>

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
 }
});

export default Settings;
