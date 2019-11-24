import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});

function NoticePage(props) {

  const classes = useStyles();

  // console.log(props)

  return (

    <div>
    <h1>Dina notiser</h1>
    </div>

  );

}

export default NoticePage;
