//import redux, {applyMiddleware} from 'redux'
//import thunk from 'redux-thunk'

export function fetchData() {
    return (dispatch, getState) => {
        const number = 1; // getState()
        const baseUrl = 'https://swapi.dev/api/people'
        fetch(`${baseUrl}/${number}/`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                dispatch({
                    type: 'FETCHDATA',
                    payload: res
                })
            })
    }
}

export default function reducer(data = {}, action) {
    switch(action.type) {
        case 'FETCHDATA':
            return action.payload

        default:
            return data
    }
}