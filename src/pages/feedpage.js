import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});

function FeedPage(props) {

  const classes = useStyles();

  // console.log(props)

  return (

    <div>
    <h1>Upload</h1>
    </div>

  );

}

export default FeedPage;
