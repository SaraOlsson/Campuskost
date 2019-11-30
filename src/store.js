import { combineReducers } from 'redux';

function testreducer(state = { num: 0 }, action) {
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


// export default reducer;

export default combineReducers({
  testReducers: testreducer,
  uploadReducer: uploadReducer,
  userReducer: userReducer
});