import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

var Spinner = require('react-spinkit');

function LoadSpinner(props) {

  const classes = useStyles();

  return (
    <div className={classes.spinner}>
      <Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/>
    </div>
  );
}

const useStyles = makeStyles({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  }
});

export default LoadSpinner;
