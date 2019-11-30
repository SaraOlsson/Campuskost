import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
// import { useIncrementdispatch } from '../actions/RecipeActions';

function UploadPage(props) {

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  //const state = useSelector(state => state.testReducers); // subscribe to the redux store // testReducers
  const state = useSelector(state => state.uploadReducer);
  console.log(state)

  const titleDisp = (evt) => {
    dispatch({
      type: "SETTITLE",
      title: evt.target.value
    })
  }

  return (

    <div>
      <h1>Upload</h1>

      <input type="text" name="rtitle" placeholder="Recept" onChange={titleDisp}/>

    </div>

  );

}

// material ui design
const useStyles = makeStyles({
  body: {
    padding: 15
  }
});

export default UploadPage;

/*

<button
onClick={() => dispatch({
  type: "INCREMENT",
  step: 1
})}
>*/
