import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});

function UploadPage(props) {

  const classes = useStyles();

  const counter = useSelector(state => state);
  const dispatch = useDispatch();

  // console.log(props)

  return (

    <div>
    <h1>Upload</h1>

    <h1>{counter.num}</h1>
    <button
    onClick={() =>
      dispatch({
        type: "INCREMENT",
        step: 1
      })
    }
   >
   Redux increment test
   </button>

    </div>

  );

}

export default UploadPage;
