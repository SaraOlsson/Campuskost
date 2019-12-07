import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

function ListContainer(props) {

  const classes = useStyles();

  return (
    <div>
    <h4>{props.title}</h4>
    <div className={classes.listcontainer}>
      <p>List</p>
    </div>
    </div>
  );
}

const useStyles = makeStyles({
  listcontainer: {
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginBottom: 15,
    minHeight: 50,
    padding: 15
  }
});

export default ListContainer;
