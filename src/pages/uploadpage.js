import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import '../style/GlobalCssButton.css';

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function UploadPage(props) {

  const [title, setTitle] = React.useState('');
  const [labelWidth, setLabelWidth] = React.useState(0);
  const labelRef = React.useRef(null);


  const [valid, setValid] = React.useState({
    title: false,
    ingredients: false,
    desc: false
  });

  const classes = useStyles();
  const dispatch = useDispatch(); // be able to dispatch
  //const state = useSelector(state => state.testReducers); // subscribe to the redux store // testReducers
  //const state = useSelector(state => state.uploadReducer);
  //console.log(state)

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);


  const titleDisp = (evt) => {
    dispatch({
      type: "SETTITLE",
      title: evt.target.value
    })
  }

  const handleChange = event => {

    let value = event.target.value;
    setTitle(value);
    setValid({ ...valid, ["title"]: value.length > 2 ? true : false });

    dispatch({
      type: "SETTITLE",
      title: value
    })
  };

  const addIngredients = () => {
    setValid({ ...valid, ["ingredients"]: true });
  };

  const addDesc = () => {
    setValid({ ...valid, ["desc"]: true });
  };

  return (

    <div>
      <h3>Ladda upp recept</h3>

      <form>

      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >

        <ValidCheck checked={valid.title} xs={2}/>

        <Grid item xs={9}>
        <FormControl variant="outlined">
          <InputLabel ref={labelRef} htmlFor="component-outlined"> Rubrik </InputLabel>
          <OutlinedInput
            value={title}
            onChange={handleChange}
            labelWidth={labelWidth}
          />
        </FormControl>
        </Grid>

        <ValidCheck checked={valid.ingredients} xs={2}/>
        <Grid item xs={9}> <Button onClick={addIngredients} variant="contained" color="primary" className={classes.buttontext}>
          Lägg till ingredienser
        </Button> </Grid>

        <ValidCheck checked={valid.desc} xs={2}/>
        <Grid item xs={9}> <Button onClick={addDesc} variant="contained" color="primary" className={classes.buttontext}>
          Lägg till beskrivning
        </Button> </Grid>


        <Grid item xs={5}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
        </Grid>

      </Grid>

      </form>
    </div>

  );

}

function ValidCheck(props) {

  const classes = useStyles();

  return (
    <Grid item xs={props.xs}>
    <FormControlLabel disabled
      control={
        <Checkbox
          checked={props.checked}
          color="primary"
          className= {classes.nomargin}
        />}
    />
    </Grid>
  );
}

// material ui design
const useStyles = makeStyles({
  body: {
    padding: 15
  },
  buttontext: {
    textTransform: 'unset'
  },
  nomargin: {
    margin: 0
  }
});

export default UploadPage;
