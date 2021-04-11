

import { makeStyles } from '@material-ui/core/styles'
//import {useTranslation} from "react-i18next"
import firebase from "firebase/app"
import React from 'react'

function CacheComponent() {

  const classes = useStyles()
  var db = firebase.firestore()
  //const {email: authUser} = useSelector((state) => state.firebase.auth)
  
  db.collection("users").where("email", "==", "sara.olsson4s@gmail.com")
  .onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        //   if (change.type === "added") {
        //       console.log("New city: ", change.doc.data())
        //   }

        //   var source = snapshot.metadata.fromCache ? "local cache" : "server"
        //   console.log("Data came from " + source)
      })
  })

  return  (
    <div> 
    </div>
  )
}

const useStyles = makeStyles({
    listContainer: {
        padding: '1rem',
    },
    soonText: {
      fontSize: 'small'
    }
})

export default CacheComponent