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

  const handeRecipeClick = (clicked_recipe) => {

    console.log("yoyoyo, go to " + clicked_recipe.title)
    console.log(clicked_recipe)


    history.push("/recipe/" + clicked_recipe.title + "/" + clicked_recipe.id );
    // setRedirect(true);

  };

    // console.log(recipe.user)

  // if(redirect)
  //  return ( <Redirect to={"/recipe/" + recipe.title} /> );

  return (

    <GridListTile key={r_img} className={classes.listimage} onClick={() => handeRecipeClick(recipe)}>
      <img src={require('../assets/'+ r_img + '.jpg')} alt={recipe.title} />

      <GridListTileBar
        title={recipe.title}
        subtitle={<span>Av: {recipe.user}</span>}

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
