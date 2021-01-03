import { useState, useEffect, useReducer } from "react";

// const DOC = "DOC"
// const COLLECTION = "COLLECTION"

const useFirebaseAction = () => {

    const setData = async (firebaseRef, obj ) => {

        if(firebaseRef === undefined)
            return;

        firebaseRef.set(obj)
        .catch(err => {
            //if (!didCancel) {
            console.log(err)
            //}
        })

    }
  
  
    // useEffect(() => {
  
    //   console.log("set..?")
  
    //   if(db_Ref === undefined)
    //     return;
  
    //   console.log("set!")
  
    //   let didCancel = false;
  
    //   const setData = async () => {

    //     db_Ref.get().set({liked_recipes: obj})
    //     .catch(err => {
    //       if (!didCancel) {
    //           console.log(err)
    //       }
    //     })
  
    //   }
  
    // //   const fetchArrayData = async () => {
  
    // //     dispatch({ type: "FETCH_INIT" });
    // //     const docs = []
  
    // //     db_Ref.get().then(async function(querySnapshot) {
    // //       await Promise.all(querySnapshot.docs.map(async (doc) => {
    // //         console.log(doc.id, " => ", doc.data());
    // //         docs.push(doc.data())
    // //       }));
    // //     })
    // //     .catch(err => {
    // //       if (!didCancel) {
    // //           dispatch({ type: "FETCH_FAILURE" });
    // //       }
    // //     });
  
    // //     if (!didCancel) {
    // //       dispatch({ type: "FETCH_SUCCESS", payload: docs });
    // //     }
    // //   }
  
    //   setData()
      
  
    //   // component is unmounted
    //   return () => {
    //     didCancel = true
    //   }
      
    // }, [db_Ref])
  
  
    return { setData }
  };
  
  export default useFirebaseAction;