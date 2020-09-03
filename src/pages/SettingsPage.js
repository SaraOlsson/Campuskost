import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useState } from 'react';
// import AddImage from '../components/AddImage';
import ReactGA from 'react-ga';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import AlertDialog from '../components/AlertDialog';
import CollapseGrid from '../components/CollapseGrid';
import Emoji from '../components/Emoji';
import TextSetting from '../components/settings/TextSetting';
import UsernameSetting from '../components/settings/UsernameSetting';

function Settings(props) {

  const userdoc = useSelector(state => state.firestore.data.userdoc);

  //const [username_textfield, setUsername_textfield] = useState("");
  const [fullname_textfield, setFullname_textfield] = useState("");
  const [bio_textfield, setBio_textfield] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);

  const [has_changed, setHas_changed] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [in_editmode, setIn_editmode] = useState(false);
  const labelRef = React.useRef(null);
  const [openSetting, setOpenSetting] = useState("");

  const [files, setFiles] = React.useState([]);
  const [image, setImage] = React.useState(undefined);

  const [openAlert, setOpenAlert] = useState(false);

  const [imageUrlList, setImageUrlList] = useState([]);

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();
  const history = useHistory();

  React.useEffect(() => {

    ReactGA.event({
      category: "Settings",
      action: "User enters settings",
    });

    // setLabelWidth(labelRef.current.offsetWidth); fix if needed 

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

    // (username_textfield !== store.firestore_user.username ||
    if(store.firestore_user && (imageUrl !== store.firestore_user.profile_img_url ||
      image !== undefined )) {
      setHas_changed(true);
    } else {
      setHas_changed(false);
    }
  }, [imageUrl, image]); // username_textfield, 

  // when information about user signed in arrives, set textfield value
  React.useEffect(() => {
    if(store.firestore_user) {

      if (store.firestore_user.profile_img_url !== undefined)
        setImageUrl(store.firestore_user.profile_img_url);

    }
  }, [store.firestore_user]);


  // exit edit mode
  function cancel_edit() {

    setIn_editmode(false);
    if(has_changed) {

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

  // update in Firebase
  function save_img() {

    // Set the 'username' field of the user
    firestore.collection('users').doc(store.firestore_user.email).update({profile_img_url: imageUrl});
  }

  const randomImg = () => {

    ReactGA.event({
      category: "Settings",
      action: "User tries random image",
    });

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

    onFileRemove();
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

  const onFileAdd = (files) => {
    setFiles(files);

    console.log("onFileAdd  ")

    var reader = new FileReader();
    reader.onload = function(e) {
      setImage(e.target.result);
      // console.log(e.target.result)
    }

    reader.readAsDataURL(files[0]);
  };

  const onFileRemove = () => {
    setFiles([]);
    setImage(undefined);
  };

  const isOpen = (collaps_name) => {
    return collaps_name === openSetting;
  }

  let img_src = image ? image : imageUrl;

  // (!userdoc || (userdoc && !userdoc.email)) ? <p> Du behöver vara inloggad </p> : 
  if (userdoc && !userdoc.email) {
    history.push("/home");
  }
  
  return (

    <div>
      <div className={classes.login_div}>
        <h3>Inställningar</h3>

        <CollapseGrid label="Användarnamn" 
                      controlName="username" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>

          <UsernameSetting></UsernameSetting>

        </CollapseGrid> 
        
        <CollapseGrid label="Namn" 
                      controlName="fullname" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>

            <TextSetting db_field="fullname" label="namn"/>

        </CollapseGrid>         

        <CollapseGrid label="Biografi" 
                      controlName="bio" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>

            <TextSetting db_field="bio" label="biografi" multiline="true"/>


        </CollapseGrid>

        <CollapseGrid label="Profilbild" 
                      controlName="profileimage" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>

            {/* style={{display: 'flex', flexWrap: 'wrap'}}> */}
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
              {/*<AddImage files={files} onFileAdd={onFileAdd} onFileRemove={onFileRemove}/>*/}
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

        </CollapseGrid>

          {/*<AddImage files={files} onFileAdd={onFileAdd} onFileRemove={onFileRemove}/>*/}

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
  marginBottom: '15px',
  height: '90px',
  width: '90px',
  borderRadius: '100px',
  objectFit: 'cover'
},
fullrow: {
  flex: '0 0 100%',
  display: 'flex'
}
});

export default Settings;

// before refactor: 633 lines..