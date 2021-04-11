import redux, {applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

export function fetchData() {
    return (dispatch, getState) => {
        // const number = 1; // getState()
        // const baseUrl = 'https://swapi.dev/api/people'
        // fetch(`${baseUrl}/${number}/`)
        //     .then(res => res.json())
        //     .then(res => {
        //         console.log(res)
        //         dispatch({
        //             type: 'FETCHDATA',
        //             payload: res
        //         })
        //     })

        // let ref = store.db.collection('users').doc('sara.olsson4s@gmail.com');

        // ref.get().then(function(doc) {
        //     let res = doc.data();
        //     //data.id = doc.id;
        //     console.log(res)
        //     dispatch({
        //         type: 'FETCHDATA',
        //         payload: res
        //     })
        //   });

    }
}

const default_state = {
    data: {},
    db: undefined
}

export default function reducer(state = default_state, action) {
    switch(action.type) {
        case 'SETDB':
            return {
            ...state,
            db: action.payload
            }
        case 'FETCHDATA':
            return  {
            ...state,
            data: action.payload
            }

        default:
            return state
    }
}