//import redux, {applyMiddleware} from "redux"
//import thunk from "redux-thunk"

// const default_upload_state = {
//     editmode: false,
//     has_unsaved: false,  
//     recipe_id: undefined, 
//     title: undefined, 
//     ingredients: undefined, 
//     descriptions: undefined, 
//     image: undefined,
//     freetext: undefined,
//     servings: undefined,
//     cookingtime: undefined
//   }

const default_upload_state = {
    editmode: false,
    has_unsaved: false,  
    data: {}
  }

  export default function newUploadReducer(state = default_upload_state, action) {
    switch (action.type) {
        case "SETFIELD":
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.field]: action.payload
                }
            }
        case "SETDATA": {
            return {
                ...state,
                data: Object.assign({}, state.data, action.payload)
            }
        }
        case "SETIMAGE":
         
          return {
            ...state,
            image: action.image
          }
        case "SETEDITMODE":
          return {
            ...state,
            editmode: action.editmode,
            recipe_id: action.recipe_id,
          }
        case "SETALLDEFAULT":
          return default_upload_state
        default:
          return state;
    }
  }
//   case "SETTITLE":
//         return {
//         ...state,
//         title: action.title
//         }
//     case "SETFREETEXT":
//         return {
//         ...state,
//         freetext: action.freetext
//         }
//     case "SETCOOKINGTIME":
//         return {
//         ...state,
//         cookingtime: action.cookingtime
//         }
//     case "SETSERVINGS":
//         return {
//         ...state,
//         servings: action.servings
//         }