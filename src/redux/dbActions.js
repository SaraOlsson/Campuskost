import redux, {applyMiddleware} from "redux"
import thunk from "redux-thunk"

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
        default:
          return state;
    }
  }