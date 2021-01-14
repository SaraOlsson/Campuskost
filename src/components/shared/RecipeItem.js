import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useHistory } from "react-router-dom";
const fallbackImage = require('../../assets/err_image.png')

function RecipeItem({recipe, smalltiles}) {

  // handleaction in parent

  const history = useHistory();
  const classes = useStyles();

  const show_title = !smalltiles || ( smalltiles && smalltiles === false);
  const tilesize = show_title ? 150 : 100;  

  const handeRecipeClick = (clicked_recipe) => {
    history.push("/recipe/" + clicked_recipe.title + "/" + clicked_recipe.recipeID );
  };

  let img_url_temp = recipe.img_url_small ? recipe.img_url_small : recipe.img_url;
  const image = <div><img src={img_url_temp} className={classes.listimage} onError={(e)=>{e.target.onerror = null; e.target.src=fallbackImage}} alt={recipe.title} /></div>;


  return (

    <React.Fragment>
      <GridListTile 
        key={"tile" + recipe.recipeID} 
        className={classes.pointer } 
        style={getTileStyle(tilesize)}
        onClick={() => handeRecipeClick(recipe)}
      >
        {image}
        { show_title && 
        <GridListTileBar
          title={recipe.title}
          subtitle={<span>Av: {recipe.user}</span>}
        />
        }
      </GridListTile>
    </React.Fragment>

  );
}

const getTileStyle = (tileSize) => {
  return {
    maxHeight: `${tileSize}px`,
    maxWidth: `${tileSize}px`,
    padding: '5px'
}};

const useStyles = makeStyles({
  listimage: {
    maxHeight: '150px',
    maxWidth: '150px',
    minWidth: '150px',
    minHeight: '150px',
    objectFit: 'cover'
  },
  pointer: {
   cursor: 'pointer'
  }
});

export default RecipeItem;
