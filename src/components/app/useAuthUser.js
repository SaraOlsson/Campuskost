import { useDispatch } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import firebase from 'firebase/app';
import { useEffect } from 'react';

function useAuthUser() {

    const dispatch = useDispatch(); // be able to dispatch
    const firestore = useFirestore();

    useEffect(() => {

        // Listen to auth changes. Set redux object and/or create firestore instance
        firebase.auth().onAuthStateChanged(user => {
    
          // if user is signed in, set redux object
          if( user ) {
    
            const user_email = user.email;
            const usersRef = firestore.collection('users').doc(user_email);
    
            // connect to firebase and check if a user doc for this email exists
            usersRef.get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                usersRef.onSnapshot((doc) => {
    
                  console.log("user exists in firestore")
                  // dispatch user doc info (such as username, other info set in the app)
                  dispatch({
                    type: "SETFIREUSER",
                    firestore_user: doc.data()
                  })
    
                });
              } else {
                console.log("in app, user doc doesnt exist yet")
              }
            });
    
            // dispatch auth info (such as last time logged in etc)
            dispatch({
              type: "SETUSER",
              auth_user: user
            })
    
          } // end if user
          else {
    
            // no user is signed in
            dispatch({
              type: "SETUSER",
              user: undefined
            })
    
          }
    
          dispatch({ type: user ? "SIGNIN" : "SIGNOUT" })
    
        }); // end auth listener
    
      }, []); // end useEffect


}

export default useAuthUser