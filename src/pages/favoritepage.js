import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

function FavoritePage(props) {

  const classes = useStyles();

  // console.log(props)
  return (

    <div>
    <h3>Dina listor</h3>
    <ListContainer title="Säkra kort"/>
    <ListContainer title="Att testa"/>
    <ListContainer title="Matlådemat"/>
    </div>

  );
}

function ListContainer(props) {

  const classes = useStyles();
  // className={classes.userinfo}

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


export default FavoritePage;
