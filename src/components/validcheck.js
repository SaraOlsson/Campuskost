import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

function ValidCheck(props) {

  const classes = useStyles();

  return (
    <Grid item xs={props.xs}>
    <FormControlLabel disabled
      control={
        <Checkbox
          checked={props.checked}
          color= "primary"
          className= {classes.nomargin}
        />}
    />
    </Grid>
  );
}

const useStyles = makeStyles({
  nomargin: {
    margin: 0,
    color: '#68BB8C !important'
  }
});

export default ValidCheck;
