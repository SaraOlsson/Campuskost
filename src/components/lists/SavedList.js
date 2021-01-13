import { useDocument, useDocumentOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import React, {useEffect, useState} from "react"
import firebase from "firebase/app"
import { useSelector } from "react-redux"
import { makeStyles } from '@material-ui/core/styles'
import ListContent from './ListContent'
import { m } from 'framer-motion';


const SavedList = ({ref_listID}) => {

  const {email: authUser} = useSelector((state) => state.firebase.auth)
  const [isMine, setIsMine] = useState(false)
  const [value, loading, error] = useDocumentDataOnce(
    firebase.firestore().doc('lists/' + ref_listID), // 1rOnvDuk8VJoZPWbHZkU
    {
      // snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  // console.log(value)

  useEffect(() => {

    if(!authUser || !value ) 
      return

    // if email agrees
    setIsMine(authUser === value.created_by)

  }, [authUser, value])

  const onRemove = () => {
    console.log("remove " + ref_listID)
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
        <ListUI data={value} showRmButton={isMine} onRemove={onRemove}/>
        </>
        }
      
    </>
  );
};

// refactor
function isTouchDevice() {
  return(window.matchMedia("(pointer: coarse)").matches)
}

const ListUI = ({data, showRmButton, onRemove}) => {

  const [isHovering, setIsHovering] = useState(false)

  // console.log(data)

    const classes = useStyles()
    return (

        <div className={classes.listContainer}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
            <div className={classes.containerHeader}>
              <b> {data.title} </b>
              { (isHovering || isTouchDevice() ) && 
                <div className={classes.removeIcon}
                     onClick={onRemove}> 
                  <b>x</b> 
              </div>}
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
      justifyContent: 'space-between'
    },
    removeIcon: {
      cursor: 'pointer',
      color: theme.palette.secondary.main
    }
}))

// .data()

export default SavedList