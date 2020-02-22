import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { Link, Redirect } from "react-router-dom";

function RecipeItem(props) {

  const [redirect, setRedirect] = React.useState(false);

  const history = useHistory();
  const classes = useStyles();

  const recipe = props.recipe;

  let r_img = ( recipe.img != undefined) ? recipe.img : 'temp_food1';
  let img_src;


  if  ( recipe.img_url != undefined) {
    img_src = recipe.img_url;
  } else {
    img_src = require('../assets/'+ r_img + '.jpg');
  }

  const handeRecipeClick = (clicked_recipe) => {
    history.push("/recipe/" + clicked_recipe.title + "/" + clicked_recipe.id );
  };


  let image = <img src={img_src} className={classes.listimage} alt={recipe.title} alt={"recipe img"} />;

  return (
    <React.Fragment>

      <GridListTile key={r_img} className={classes.listtile} onClick={() => handeRecipeClick(recipe)}>

        {image}

        <GridListTileBar
          title={recipe.title}
          subtitle={<span>Av: {recipe.user}</span>}
        />

      </GridListTile>

    </React.Fragment>
  );
}

/*

{ true &&
<GridListTile key={r_img} className={classes.listimage} onClick={() => handeRecipeClick(recipe)}>

  <img src={img_src} alt={recipe.title} alt={"recipe img"}/>

  <GridListTileBar
    title={recipe.title}
    subtitle={<span>Av: {recipe.user}</span>}
  />

</GridListTile>
}*/

const useStyles = makeStyles({
  listimage: {
    maxHeight: '150px',
    maxWidth: '150px',
    minWidth: '150px',
    minHeight: '150px',
    objectFit: 'cover'
  },
  listtile: {
    maxHeight: '150px',
    maxWidth: '150px',
    padding: '5px',
  }
});

export default RecipeItem;
