import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});

function FavoritePage(props) {

  const classes = useStyles();

  // console.log(props)

  return (

    <div>
    <h1>Dina listor</h1>
    </div>

  );

}

export default FavoritePage;
