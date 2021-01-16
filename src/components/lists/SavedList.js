import { useDocument, useDocumentOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import React, {useEffect, useState} from "react"
import firebase from "firebase/app"
import { useSelector } from "react-redux"
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ListContent from './ListContent'
import AlertDialog from '../shared/AlertDialog'
import {useTranslation} from "react-i18next";


const SavedList = ({ref_listID}) => {

  const db = firebase.firestore()
  const {t} = useTranslation('common')
  const {email: authUser} = useSelector((state) => state.firebase.auth)
  const [openAlert, setOpenAlert] = useState(false)
  const [isMine, setIsMine] = useState(false)
  const [value, loading, error] = useDocumentDataOnce(
    db.doc('lists/' + ref_listID), // 1rOnvDuk8VJoZPWbHZkU
    {
      // snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [follows, setFollows] = useState(false)
  const [followRef, setFollowRef] = useState('')
  const [followDoc] = useDocument(followRef)


  

  useEffect(() => {

    if(!authUser || !value ) 
      return

    if(followRef === '')
      setFollowRef(db.doc(`lists_follows/${authUser}/lists/${ref_listID}`))

    // if email agrees
    setIsMine(authUser === value.created_by)

  }, [authUser, value])

  useEffect(() => {

    if(followDoc)
      setFollows(followDoc.exists)

  }, [followDoc])

  // const onRemove = () => {
  //   console.log("remove " + ref_listID)
  //   firebase.firestore().doc('lists/' + ref_listID).delete()
  // }

  const onRemove = (chosedDelete) => {

    if(chosedDelete === true) {
      console.log("remove " + ref_listID)
    db.doc('lists/' + ref_listID).delete()
    } else {
      setOpenAlert(false)
    }
  }

  const toggleFollow = () => {

    if(!followDoc)
      return

    if(followDoc.exists)
    {
      followRef.delete()
      setFollows(false)
    }
    else 
    {
      followRef.set({
        title: value.title,
        created_by: value.created_by,
        listID: ref_listID
      })
      setFollows(true)
    }
    
  }

  return (
    <>
      {/* <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Document: Loading...</span>}
      </p> */}
        {value && 
        <>
        {/* <span>Document: {JSON.stringify(value)}</span> */}
        <ListUI data={value} 
                showRmButton={isMine} 
                showFollowBtn={!isMine} 
                follows={follows}
                toggleFollow={toggleFollow}
                onRemove={() => setOpenAlert(true)}/>
        </>
        }
      
      <AlertDialog
        open={openAlert}
        onAlertClose={onRemove}
        title={t('lists.delete_alert.title')}
        message={t('lists.delete_alert.message')}
        yesOptionText={t('lists.delete_alert.yes')}
        NoOptionText={t('lists.delete_alert.no')}
      />
    </>
  );
};

// refactor
function isTouchDevice() {
  return(window.matchMedia("(pointer: coarse)").matches)
}

const ListUI = ({data, showRmButton, onRemove, showFollowBtn, follows, toggleFollow}) => {

  const [isHovering, setIsHovering] = useState(false)
  const {t} = useTranslation('common')

  // console.log(data)

    const classes = useStyles()
    return (

        <div className={classes.listContainer}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
            <div className={classes.containerHeader}>
              <b> {data.title} </b>
              { (showRmButton && (isHovering || isTouchDevice()) ) && 
                <div className={classes.removeIcon}
                     onClick={onRemove}> 
                  <b>x</b> 
              </div>}
              { (showFollowBtn && (isHovering || isTouchDevice())) &&
              <div className={classes.removeIcon}> 
                  <Button onClick={toggleFollow} variant={!follows && "contained"} 
                          color={follows ? "secondary" : "primary"}>
                    {follows ? t('shared.unfollow') : t('shared.follow') }
                  </Button> 
              </div>
              }
            </div>
            <div className={classes.listItem}>
                
                <ListContent ref_listID={data.listID}/>
            </div>

        </div>
    )
}

const useStyles = makeStyles(theme => ({
    listItem: {
        background: theme.palette.campuskost.teal,
        color: 'white',
        borderRadius: '15px',
        padding: 10,
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflowY: 'auto',
        overflowX: 'hidden', // but should not happen
        marginTop: 10,
        maxHeight: 200,
        minHeight: 200,
        
        
    },
    listContainer: {
        minWidth: 300,
        minHeight: 150,
        maxWidth: '40%',
        //maxHeight: 200  
        textAlign: 'center',
        margin: 15
    },
    containerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      height: 40
    },
    removeIcon: {
      cursor: 'pointer',
      color: theme.palette.secondary.main
    }
}))

// .data()

export default SavedList