import { createStore, combineReducers, compose } from 'redux'

function testreducer(state = { num: 0, url: "hey" }, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        num: state.num + action.step
      };
    case "DECREMENT":
      return {
        ...state,
        num: state.num - action.step
      };
    default:
      return state;
    case "SETURL":
      return {
        ...state,
        url: state.url
      };
  }
}

function uploadReducer(state = { title: "title" }, action) {
  switch (action.type) {
    case "SETTITLE":
      return {
        ...state,
        title: action.title
      };
    default:
      return state;
  }
}

function userReducer(state = { signedIn: false }, action) {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        signedIn: true
      };
    case "SIGNOUT":
      return {
        ...state,
        signedIn: false
      };
    default:
      return state;
  }
}

function fireReducer(state = { db: 0 }, action) {
  switch (action.type) {
    case "SETDB":
      return {
        ...state,
        db: action.db
      };
    default:
      return state;
  }
}

// export default reducer;
//  firestore: firestoreReducer,

const rootReducer = combineReducers({
  fireReducer: fireReducer,
  testReducers: testreducer,
  uploadReducer: uploadReducer,
  userReducer: userReducer
});

 export default rootReducer;
