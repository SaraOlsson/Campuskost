import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import Emoji from '../../components/Emoji';
// import AddImage from '../components/AddImage';

function ProfileImageSetting(props) {

    const userdoc = useSelector(state => state.firestore.data.userdoc);
    const [settingValue, SetSettingValue] = useState("");
    const [in_editmode, setIn_editmode] = useState(false);
    const [has_changed, setHas_changed] = useState(false);

    const [files, setFiles] = React.useState([]);
    const [image, setImage] = React.useState(undefined);
    const [imageUrlList, setImageUrlList] = useState([]);

    const classes = useStyles();
    const firestore = useFirestore();
    const store = useSelector(state => state.fireReducer);
  
    React.useEffect(() => {

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

    useEffect(() => {
        SetSettingValue( userdoc ? userdoc[props.db_field] : "" );
    }, [userdoc]); 

    useEffect(() => {

        if(settingValue === "")
            return;
        
        setHas_changed(settingValue !== userdoc[props.db_field]);
    }, [settingValue]);

    const cancel_edit = () => {
        setIn_editmode(false);
        SetSettingValue(userdoc[props.db_field]);
    }

    const save_setting = () => {

        setIn_editmode(false);
        db_save(settingValue);
    }

    // update in Firebase
    function db_save(new_value) {

        // Update the database field of the user
        var key = props.db_field;
        var obj = {};
        obj[key] = new_value;

        firestore.collection('users').doc(store.firestore_user.email).update(obj);
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
    
          if(temp_url !== settingValue) {
            continue_search = false;
            SetSettingValue(temp_url);
          }
    
        } while(continue_search);
    
        onFileRemove();
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

      let img_src = image ? image : settingValue;

    return !userdoc ? null : (
      <React.Fragment>
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
              Ändra {props.label}
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
                onClick={() => save_setting()}
                className={classes.buttons}
                disabled={!has_changed}
              >
                Spara ny {props.label}
              </Button>
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

export default ProfileImageSetting;

// {/*<AddImage files={files} onFileAdd={onFileAdd} onFileRemove={onFileRemove}/>*/}