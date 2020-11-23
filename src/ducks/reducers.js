import {combineReducers} from "redux";
import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";
export const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    fireReducer: fireReducer,
    uploadReducer: uploadReducer,
    userReducer: userReducer,
    dragReducer: dragReducer,
    searchReducer: searchReducer
});

// remove
function searchReducer(state = { searchstring: "" }, action) {
    switch (action.type) {
      case "SETSEARCH":
        return {
          ...state,
          searchstring: action.searchstring
        };
      default:
        return state;
    }
  }
  
  
  // const init_repice_state = { 
  //   editmode: false, 
  //   recipe_id: undefined, 
  //   title: undefined, 
  //   ingredients: undefined, 
  //   descriptions: undefined, 
  //   image: undefined,
  //   freetext: undefined,
  //   servings: undefined,
  //   cookingtime: undefined,
  // }; 
  
  function uploadReducer(state = { 
    editmode: false, 
    recipe_id: undefined, 
    title: undefined, 
    ingredients: undefined, 
    descriptions: undefined, 
    image: undefined,
    freetext: undefined,
    servings: undefined,
    cookingtime: undefined,
  }, action) {
    switch (action.type) {
        case "SETTITLE":
          return {
            ...state,
            title: action.title
          };
        case "SETFREETEXT":
          return {
            ...state,
            freetext: action.freetext
          };
        case "SETCOOKINGTIME":
          return {
            ...state,
            cookingtime: action.cookingtime
          };
        case "SETSERVINGS":
          return {
            ...state,
            servings: action.servings
          };
        case "SETINGREDIENTS":
          return {
            ...state,
            ingredients: action.ingredients
          };
        case "SETDESCRIPTIONS":
          return {
            ...state,
            descriptions: action.descriptions
          };
        case "SETIMAGE":
         
          return {
            ...state,
            image: action.image
          };
        case "SETEDITMODE":
          return {
            ...state,
            editmode: action.editmode,
            recipe_id: action.recipe_id,
          };
        case "SETALLDEFAULT":
          return { 
            editmode: false, 
            recipe_id: undefined, 
            title: undefined, 
            ingredients: undefined, 
            descriptions: undefined, 
            image: undefined,
            freetext: undefined,
            servings: undefined,
            cookingtime: undefined,
          };

      default:
        return state;
    }
  }
  
  // try to remove
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
  
  // try to remove
  function fireReducer(state = { db: undefined, storage: undefined, auth_user: undefined, firestore_user: undefined }, action) {
    switch (action.type) {
      case "SETDB":
        return {
          ...state,
          db: action.db
        };
      case "SETSTORAGE":
        return {
          ...state,
          storage: action.storage
        };
      case "SETUSER":
        return {
          ...state,
          auth_user: action.auth_user
        };
      case "SETFIREUSER":
        return {
          ...state,
          firestore_user: action.firestore_user
        };
      default:
        return state;
    }
  }
  
  // try to remove
  function dragReducer(state = { isDragging: false, draggableId: undefined, enableDrag: false }, action) {
    switch (action.type) {
      case "SETISDRAGGING":
        return {
          ...state,
          isDragging: action.isDragging
        };
      case "SETDRAGGABLEID":
        return {
          ...state,
          draggableId: action.draggableId
        };
      case "SETENABLEDRAG":
        return {
          ...state,
          enableDrag: action.enableDrag
        };
      default:
        return state;
    }
  }