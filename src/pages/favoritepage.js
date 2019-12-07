import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ListContainer from '../components/listcontainer';

function FavoritePage(props) {

  return (

    <div>
    <h3>Dina listor</h3>
    <ListContainer title="Säkra kort"/>
    <ListContainer title="Att testa"/>
    <ListContainer title="Matlådemat"/>
    </div>

  );
}

export default FavoritePage;
