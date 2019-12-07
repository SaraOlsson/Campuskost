import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { Link } from "react-router-dom";


function RecipeItem(props) {

  const tile = props.recipe;
  const classes = useStyles();

  let r_img = ( tile.img != undefined) ? tile.img : 'temp_food1';

  return (

    <GridListTile key={r_img} className={classes.listimage}>
      <img src={require('../assets/'+ r_img + '.jpg')} alt={tile.title} />

      <GridListTileBar
        title={tile.title}
        subtitle={<span>Av: {tile.user}</span>}

      />

    </GridListTile>
  );

}

const useStyles = makeStyles({
  listimage: {
    maxHeight: '150px',
    maxWidth: '150px',
    padding: '5px'
  }
});

export default RecipeItem;
