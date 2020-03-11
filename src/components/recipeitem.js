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

  function onClick(evt) {
    console.log('click ' + evt.currentTarget.id)
  }

  function onHold(evt) {
    console.log('hold ' + evt.currentTarget.id)
  }

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

  /*
  <Holdable
    onClick={onClick}
    onHold={onHold}
    key={id}
    id={id}
  >
    {id}
  </Holdable>*/

  let image = <img src={img_src} className={classes.listimage} alt={recipe.title} alt={"recipe img"} />;

  let tile_jsx;
  // if feed or list
  if(props.smalltiles != undefined && props.smalltiles == false) {
    tile_jsx = (
    <GridListTile key={r_img} className={classes.listtile} onClick={() => handeRecipeClick(recipe)}>
      {image}
      <GridListTileBar
        title={recipe.title}
        subtitle={<span>Av: {recipe.user}</span>}
      />
    </GridListTile>);
  } else // LIST
  {
    tile_jsx = (
    <Holdable
      onClick={onClick}
      onHold={onHold}
      id={props.id}
    >
    <GridListTile key={r_img} className={classes.listtile_small} onClick={() => handeRecipeClick(recipe)}>
      {image}
    </GridListTile>
    </Holdable>);
  }

  return (
    <React.Fragment>

    {tile_jsx}


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
  listtile_small: {
    maxHeight: '100px',
    maxWidth: '100px',
    padding: '2px',
  },
  listtile: {
    maxHeight: '150px',
    maxWidth: '150px',
    padding: '5px',
  }
});

function Holdable({id, onClick, onHold, children}) {

  const [timer, setTimer] = React.useState(null)

  function onPointerDown(evt) {
    const event = { ...evt } // convert synthetic event to real object
    const timeoutId = window.setTimeout(timesup.bind(null, event), 500)
    setTimer(timeoutId)
  }

  function onPointerUp(evt) {
    if (timer) {
      window.clearTimeout(timer)
      setTimer(null)
      onClick(evt)
    }
  }

  function timesup(evt) {
    setTimer(null)
    onHold(evt)
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      id={id}
      style={{display: 'inherit'}}
    >
      {children}
    </div>
  )
}

export default RecipeItem;
