import { useState, useEffect, useReducer } from 'react'
// import axios from 'axios'

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        hasErrored: false,
        errorMessage: '',
        data: action.payload
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        hasErrored: true,
        errorMessage: 'Data Retrieve Failure'
      }
    case 'REPLACE_DATA':
      // The record passed (state.data) must have the attribute 'id'
      const newData = state.data.map(rec => {
        return rec.id === action.replacerecord.id ? action.replacerecord : rec
      })
      return {
        ...state,
        isLoading: false,
        hasErrored: false,
        errorMessage: '',
        data: newData
      }
    default:
      throw new Error()
  }
}

const DOC = 'DOC'
const COLLECTION = 'COLLECTION'

/**
 * @param firebaseRef example: db.collection('users').doc('myDoc') where db = firebase.firestore()
 * @param type can be 'DOC' or 'COLLECTION'
 * @param initialData is optional
 */
const useFirebaseFetch = (firebaseRef, type = DOC, initialData) => {
  const [db_Ref, set_db_Ref] = useState(firebaseRef)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    hasErrored: false,
    errorMessage: '',
    data: initialData
  })

  useEffect(() => {

    if(db_Ref === undefined)
      return

    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' })

      db_Ref.get().then(function(doc) {

        if (doc.exists) {
  
          if (!didCancel) {
            dispatch({ type: 'FETCH_SUCCESS', payload: doc.data() })
          }
  
        } else {
            if (!didCancel) {
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }

      })
      .catch(err => {
        if (!didCancel) {
            dispatch({ type: 'FETCH_FAILURE' })
        }
      })

    }

    const fetchArrayData = async () => {

      dispatch({ type: 'FETCH_INIT' })
      const docs = []

      db_Ref.get().then(async function(querySnapshot) {
        await Promise.all(querySnapshot.docs.map(async (doc) => {
          //console.log(doc.id, ' => ', doc.data())
          let data = doc.data()
          data.id = doc.id
          docs.push(data)
          //docs.push(doc.data())
        }))
      })
      .catch(err => {
        if (!didCancel) {
            dispatch({ type: 'FETCH_FAILURE' })
        }
      })

      if (!didCancel) {
        dispatch({ type: 'FETCH_SUCCESS', payload: docs })
      }
    }

    if(type === DOC)
      fetchData()
    else if(type === COLLECTION)
      fetchArrayData()
    

    // component is unmounted
    return () => {
      didCancel = true
    }
    
  }, [db_Ref])

  const updateDataRecord = record => {
    dispatch({
      type: 'REPLACE_DATA',
      replacerecord: record
    })
  }

  const triggerFetch = newRef => {
    set_db_Ref(newRef)
  }

  return { ...state, triggerFetch, updateDataRecord }
}

export default useFirebaseFetch