import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { makeStyles } from '@material-ui/core/styles'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded'
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded'
import NotificationsIcon from '@material-ui/icons/Notifications'
import PublishIcon from '@material-ui/icons/PublishRounded'
import 'firebase/auth'
import 'firebase/firestore'
import _ from "lodash"
import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
// import our css
import '../../App.css'
import AlertDialog from '../shared/AlertDialog'

function BottomMenuBar() {

    const [value, setValue] = React.useState('default')
    const [pendingValue, setPendingValue] = React.useState(undefined)
    const [openAlert, setOpenAlert] = React.useState(false)
  
    const history = useHistory()
    const classes = useStyles()
    const upload_store = useSelector(state => state.uploadReducer)
    const dispatch = useDispatch()
  
    const handleMenuClick = (event = undefined, val) => {
  
      let {pathname} = history.location
  
      if(`/${val}` === pathname) // dont push to current
        return
  
      if( pathname === "/upload" && !_.isEmpty(upload_store.data))
      {      
        console.log("upload store is not empty")
        setPendingValue(val)
        setOpenAlert(true)
      } else {
        setValue(val)
        history.push("/" + val)
      }
  
    };
  
    const onAlertClose = (chosedDelete) => {
  
      setOpenAlert(false);
  
      if(chosedDelete === true) {
        setValue(pendingValue)
        history.push("/" + pendingValue)
  
        dispatch({
          type: "SETALLDEFAULT"
        })
      }
    }
  
    return (
      <React.Fragment>
  
        <BottomNavigation value={value} onChange={ (evt,value) => handleMenuClick(evt, value) } 
            className={classes.bottomMenu}>
          <BottomNavigationAction label="Flöde" value="home" icon={<HomeRoundedIcon />} />
          <BottomNavigationAction label="Ladda upp" value="upload" icon={<PublishIcon />} />
          <BottomNavigationAction label="Notiser" value="notices" icon={<NotificationsIcon />} />
          <BottomNavigationAction label="Sparat" value="saved" icon={<LoyaltyRoundedIcon />} />
        </BottomNavigation>
  
        <AlertDialog
        open={openAlert}
        onAlertClose={onAlertClose}
        title="Är du säker?"
        message="Du har osparade ändringar, är du säker på att du vill avbryta?"
        yesOptionText="Ja"
        NoOptionText="Oj, nej!"
        />
      </React.Fragment>
    );
  
    // <Badge badgeContent={3} color="secondary"><NotificationsIcon /></Badge>
  
  }

  const useStyles = makeStyles({
    bottomMenu: {
      width: 500,
    }
  
  })

  export default BottomMenuBar