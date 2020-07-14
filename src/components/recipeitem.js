import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import MyDialog from '../components/dialog';
import MySnackbar from '../components/snackbar';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
}



function RecipeItem(props) {

  const [openDialog, setopenDialog] = useState(false);

  const onLongPress = result => {
    console.log("pressss")
    setopenDialog(true);
  }

  const handleClose = (action) => {
    console.log("close")
    setopenDialog(false);

    if(action === "remove")
      props.handleaction(props.recipe.id);
  }

  const backspaceLongPress = useLongPress(onLongPress, 500);

  const history = useHistory();
  const classes = useStyles();

  const recipe = props.recipe;


  let r_img = ( recipe.img !== undefined) ? recipe.img : 'temp_food1';
  let img_src;

  if  ( recipe.img_url !== undefined) {
    img_src = recipe.img_url;
  } else {
    img_src = require('../assets/'+ r_img + '.jpg');
  }

  const handeRecipeClick = (clicked_recipe) => {
    history.push("/recipe/" + clicked_recipe.title + "/" + clicked_recipe.id );
  };

  // console.log(history)

  let enable_press = false;
  let image;

  if (enable_press === true)
    image = <div {...backspaceLongPress}> <img src={img_src} className={classes.listimage} alt={recipe.title} alt={"recipe img"} /> </div> ;
  else
    image = <div> <img src={img_src} className={classes.listimage} alt={recipe.title} alt={"recipe img"} /> </div> ;

  let tile_jsx;
  // if feed or list
  if( props.smalltiles !== undefined && props.smalltiles === false) {
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
    <React.Fragment>
      <GridListTile key={r_img} className={classes.listtile_small} onClick={() => handeRecipeClick(recipe)}>
        {image}
      </GridListTile>
    </React.Fragment>);
  }

  return (

    <React.Fragment>
        {tile_jsx}

      <MySnackbar open={openDialog} handleClose={handleClose} message={recipe.title} action={"ta bort från lista"}/>
    </React.Fragment>

  );
}

// <MyDialog open={openDialog}/>

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


export default RecipeItem;
