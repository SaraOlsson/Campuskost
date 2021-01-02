import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Emoji from './shared/Emoji';

function RecipeLists() {

  const classes = useStyles();

  return  (
    <div className={classes.listContainer}> 
      <h4>Receptlistor</h4>
      <p className={classes.soonText}> Kommer snart! <Emoji symbol="🥳"/> </p>
    </div>
  );
}

const useStyles = makeStyles({
    listContainer: {
        padding: '1rem',
    },
    soonText: {
      fontSize: 'small'
    }
});

export default RecipeLists