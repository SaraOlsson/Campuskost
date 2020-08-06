import React, { useState, useEffect, useReducer } from "react";
// import axios from "axios";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        hasErrored: false,
        errorMessage: "",
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        hasErrored: true,
        errorMessage: "Data Retrieve Failure"
      };
    case "REPLACE_DATA":
      // The record passed (state.data) must have the attribute "id"
      const newData = state.data.map(rec => {
        return rec.id === action.replacerecord.id ? action.replacerecord : rec;
      });
      return {
        ...state,
        isLoading: false,
        hasErrored: false,
        errorMessage: "",
        data: newData
      };
    default:
      throw new Error();
  }
};

const useFirebaseFetch = (firebaseRef, initialData) => {
  const [db_Ref] = useState(firebaseRef);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    hasErrored: false,
    errorMessage: "",
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      db_Ref.get().then(function(doc) {

        if (doc.exists) {
  
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: doc.data() });
          }
  
        } else {
            if (!didCancel) {
                dispatch({ type: "FETCH_FAILURE" });
            }
        }

      })
      .catch(err => {
        if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
        }
      });

    };

    fetchData();

    // component is unmounted
    return () => {
      didCancel = true;
    };

  }, [db_Ref]);

  const updateDataRecord = record => {
    dispatch({
      type: "REPLACE_DATA",
      replacerecord: record
    });
  };

  return { ...state, updateDataRecord };
};

export default useFirebaseFetch;