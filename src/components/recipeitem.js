import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { Link, Redirect } from "react-router-dom";


function RecipeItem(props) {

  const [redirect, setRedirect] = React.useState(false);

  const tile = props.recipe;
  const classes = useStyles();

  let r_img = ( tile.img != undefined) ? tile.img : 'temp_food1';

  const handeRecipeClick = (recipeTitle) => {

    console.log("heelloo yoyoyo, go to " + recipeTitle)

    setRedirect(true);

  };

  if(redirect)
    return ( <Redirect to={"/recipe/" + tile.title} /> );

  return (

    <GridListTile key={r_img} className={classes.listimage} onClick={() => handeRecipeClick(tile.title)}>
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
