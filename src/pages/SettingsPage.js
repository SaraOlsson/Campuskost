import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import AlertDialog from '../components/shared/AlertDialog';
import CollapseGrid from '../components/shared/CollapseGrid';
import ProfileImageSetting from '../components/settings/ProfileImageSetting';
import TextSetting from '../components/settings/TextSetting';
import UsernameSetting from '../components/settings/UsernameSetting';
import {useTranslation} from "react-i18next";

function Settings(props) {

  const userdoc = useSelector(state => state.firestore.data.userdoc)

  const [openSetting, setOpenSetting] = useState("")
  const [openAlert, setOpenAlert] = useState(false)

  const classes = useStyles()
  const firestore = useFirestore()
  const history = useHistory()
  const {t} = useTranslation('common')
  
  React.useEffect(() => {

    ReactGA.event({
      category: "Settings",
      action: "User enters settings",
    });

  }, []); 

  function signOut() {

    // sign out if signed in
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      history.push("/login");
    }
  }

  const onExpand = (e, expanded, id) => {
    let openval = expanded ? id : "";
    setOpenSetting(openval);
  }

  const isOpen = (collaps_name) => {
    return collaps_name === openSetting;
  }

  const removeAccount = () => {
    setOpenAlert(true);
  }

  const onDeleteAccChoice = (chosedDelete) => {

    if(chosedDelete === true) {
      firestore.collection('users').doc(userdoc.email).delete();
      history.push("/home");
    } else {
      setOpenAlert(false)
    }
  }

  if (userdoc && !userdoc.email) {
    history.push("/home");
  }
  
  return (

    <div>
      <div className={classes.login_div}>
        <h3>{t('settings.settings')}</h3>

        <CollapseGrid label={t('settings.username')}
                      controlName="username" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>
          <UsernameSetting db_field="username" label="användarnamn"/>
        </CollapseGrid> 
        
        <CollapseGrid label={t('settings.name')}
                      controlName="fullname" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>
            <TextSetting db_field="fullname" label="namn"/>
        </CollapseGrid>         

        <CollapseGrid label={t('settings.bio')}
                      controlName="bio" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>
            <TextSetting db_field="bio" label="biografi" multiline={true}/>
        </CollapseGrid>

        <CollapseGrid label={t('settings.profile_image')}
                      controlName="profileimage" 
                      expandedCheck={isOpen}
                      onExpand={onExpand}>
            <ProfileImageSetting db_field="profile_img_url" label="profilbild"/>
        </CollapseGrid>

      </div>

      <div style={{display: 'flex'}}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => signOut()}
        className={classes.center_btn}
      >
        {t('settings.actions.sign_out')}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => removeAccount()}
        className={classes.center_btn}
      >
        {t('settings.actions.delete_account')}
      </Button>
      </div>

      <AlertDialog
        open={openAlert}
        onAlertClose={onDeleteAccChoice}
        title={t('settings.delete_alert.title')}
        message={t('settings.delete_alert.message')}
        yesOptionText={t('settings.delete_alert.yes')}
        NoOptionText={t('settings.delete_alert.no')}
      />

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
  center_btn: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
    display: 'flex'
  }
});

export default Settings;

// before refactor: 633 lines..