import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import AlertDialog from '../components/AlertDialog';
import Emoji from '../components/Emoji';

function Settings(props) {

  const [username_textfield, setUsername_textfield] = useState("");
  const [fullname_textfield, setFullname_textfield] = useState("");
  const [bio_textfield, setBio_textfield] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);

  const [has_changed, setHas_changed] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [in_editmode, setIn_editmode] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const labelRef = React.useRef(null);
  const [openSetting, setOpenSetting] = useState("");

  const [openAlert, setOpenAlert] = useState(false);

  const [imageUrlList, setImageUrlList] = useState([]);

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();
  const history = useHistory();

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);

    const storageRef = firebase.storage().ref().child('profileimages');
    const available_images = [];

    // Find all the prefixes and items.
    storageRef.listAll().then(function(res) {
      res.items.forEach(function(itemRef) {
        itemRef.getDownloadURL().then((url) => { available_images.push(url); });
      });
      setImageUrlList(available_images);

    }).catch(function(error) {
      console.log("could not get storage list")
    });

  }, []);

  React.useEffect(() => {

    if(store.firestore_user && (username_textfield !== store.firestore_user.username ||
      imageUrl !== store.firestore_user.profile_img_url ||
      fullname_textfield !== store.firestore_user.fullname ||
      (!store.firestore_user.bio || (store.firestore_user.bio && bio_textfield !== store.firestore_user.bio)) )) {
      setHas_changed(true);
    } else {
      setHas_changed(false);
    }
  }, [username_textfield, fullname_textfield, bio_textfield, imageUrl]);

  // when information about user signed in arrives, set textfield value
  React.useEffect(() => {
    if(store.firestore_user) {
      setUsername_textfield(store.firestore_user.username)
      setFullname_textfield(store.firestore_user.fullname)

      if (store.firestore_user.profile_img_url !== undefined)
        setImageUrl(store.firestore_user.profile_img_url);

      if (store.firestore_user.bio !== undefined)
        setBio_textfield(store.firestore_user.bio);
    }
  }, [store.firestore_user]);


  // exit edit mode
  function cancel_edit() {

    setIn_editmode(false);
    if(has_changed) {
      setUsername_textfield(store.firestore_user.username);
      setFullname_textfield(store.firestore_user.fullname);
      setBio_textfield(store.firestore_user.bio);
      setImageUrl(store.firestore_user.profile_img_url);
    }
  }

  function signOut() {

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

  var isAvailableCheck = function() {
    return new Promise((resolve, reject) => {

      // check if available
      let is_available = true;
      firestore.collection('users').where('username', '==', username_textfield).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            is_available = false;
          });
          resolve(is_available)
        })
    });
  }

  // update in Firebase
  function save_fullname() {

    // Set the 'username' field of the user
    firestore.collection('users').doc(store.firestore_user.email).update({fullname: fullname_textfield});
    setIn_editmode(false);
  }

  // update in Firebase
  function save_bio() {

    // Set the 'username' field of the user
    firestore.collection('users').doc(store.firestore_user.email).update({bio: bio_textfield});
    setIn_editmode(false);
  }

  // update in Firebase
  function save_username() {

    isAvailableCheck().then((is_available) => {

      if(is_available === false)
      {
        setIsAvailable(false);
        return;
      }

      // Set the 'username' field of the user
      firestore.collection('users').doc(store.firestore_user.email).update({username: username_textfield});
      setIn_editmode(false);

      // update other docs (recipe docs) with this username
      toChangePromise(store.firestore_user.username).then((loadedIds) => {

        loadedIds.map( _id => {
          firestore.collection('recipes').doc(_id).update({user: username_textfield});
        });
      });
    });
  }


  // update in Firebase
  function save_img() {

    // Set the 'username' field of the user
    firestore.collection('users').doc(store.firestore_user.email).update({profile_img_url: imageUrl});
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

    let continue_search = true;
    let img_index, temp_url;
    do {

      img_index = Math.floor(Math.random() * imageUrlList.length);
      temp_url = imageUrlList[img_index];

      if(temp_url !== imageUrl) {
        continue_search = false;
        setImageUrl(temp_url);
      }

    } while(continue_search);
  }

  const onExpand = (e, expanded, id) => {
    let openval = expanded ? id : "";
    setOpenSetting(openval);
    cancel_edit();
  }

  const removeAccount = () => {
    setOpenAlert(true);
  }

  const onDeleteAccChoice = (chosedDelete) => {

    console.log(chosedDelete);

    if(chosedDelete === true) {
      firestore.collection('users').doc(store.firestore_user.email).delete();
      history.push("/home");
    }

  }


  //let signText = (firebase.auth().currentUser) ? "Logga ut" : "Logga in";
  // let username = (store.firestore_user) ? store.firestore_user.username : "unset";
  // fix if undefined
  // style={{display: 'inline-block'}}

  let img_src = imageUrl; // (store.firestore_user && store.firestore_user.profile_img_url ) ? store.firestore_user.profile_img_url : undefined;

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
          <ExpansionPanelDetails>

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
                Slumpa <Emoji symbol="🤪"/>
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
          onChange={(e, expanded) => onExpand(e, expanded, "fullname")}
          expanded={openSetting === "fullname"}
          style={{background: '#fbfbfb', marginTop: '8px'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Namn</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <FormControl variant="outlined">
              <InputLabel ref={labelRef} htmlFor="component-outlined"> Namn </InputLabel>
              <OutlinedInput
                value={fullname_textfield}
                onChange={(e) => setFullname_textfield(e.target.value)}
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
              Ändra namn
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
                onClick={() => save_fullname()}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara namn
              </Button>
            </React.Fragment>
            }
          </ExpansionPanelDetails>

        </ExpansionPanel>

        <ExpansionPanel
          onChange={(e, expanded) => onExpand(e, expanded, "bio")}
          expanded={openSetting === "bio"}
          style={{background: '#fbfbfb', marginTop: '8px'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Biografi</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <FormControl variant="outlined">

              <TextareaAutosize
                value={bio_textfield}
                onChange={(e) => setBio_textfield(e.target.value)}
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
              Ändra biografi
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
                onClick={() => save_bio()}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara biografi
              </Button>
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
          <ExpansionPanelDetails style={{display: 'flex', flexWrap: 'wrap'}}>

            { img_src &&
            <div className={classes.fullrow}>
              <img src={img_src} className={classes.profileimage}  alt={"profile img"} />
            </div>
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
                Slumpa <Emoji symbol="🤪"/>
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

      <div style={{display: 'flex'}}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => signOut()}
        className={classes.center_btn}
      >
        Logga ut
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => removeAccount()}
        className={classes.center_btn}
      >
        Radera konto
      </Button>
      </div>

      <AlertDialog
      open={openAlert}
      onAlertClose={onDeleteAccChoice}
      title="Är du säker?"
      message="Är du säker på att du vill radera ditt konto på Campuskost?"
      yesOptionText="Ja"
      NoOptionText="Oj, nej!"/>

    </div>
  );
}

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
  marginRight: 'auto',
  marginBottom: '15px'
},
fullrow: {
  flex: '0 0 100%',
  display: 'flex'
}
});

export default Settings;
