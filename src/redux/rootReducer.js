import {combineReducers} from "redux";
import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";

import testReducer from "./testReducer"
import newUploadReducer from "./newUploadReducer"
//import firebaseFetch from "../redux/fetchFirestore"

export const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,

    // custom reducers
    uploadReducer: newUploadReducer,
    searchReducer: searchReducer,

    testReducer: testReducer
});

// remove or create a shared state reducer?
function searchReducer(state = { searchstring: "" }, action) {
    switch (action.type) {
      case "SETSEARCH":
        return {
          ...state,
          searchstring: action.payload
        };
      default:
        return state;
    }
}

  