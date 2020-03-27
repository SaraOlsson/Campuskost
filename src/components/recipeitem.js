import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import Holdable from '../components/holdable';
import SimpleDialog from '../components/simpledialog';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

/* avatar: {
   backgroundColor: blue[100],
   color: blue[600],
 }*/

 function handleClick(e, data) {
   console.log(data.foo);
 }

 function RightClickMenu() {
 // NOTICE: id must be unique for EVERY instance
   return (
     <div>

       <ContextMenuTrigger id="some_unique_identifier">
         <div className="well">Right click to see the menu</div>
       </ContextMenuTrigger>

       <ContextMenu id="some_unique_identifier">
         <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
           ContextMenu Item 1
         </MenuItem>
         <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
           ContextMenu Item 2
         </MenuItem>
         <MenuItem divider />
         <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
           ContextMenu Item 3
         </MenuItem>
       </ContextMenu>

     </div>
   );
 }

//let admin = require('firebase-admin');
/*
const emails = ['username@gmail.com', 'user02@gmail.com'];
function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
} */

function RecipeItem(props) {

  const [open, setOpen] = React.useState(false);
  //const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const history = useHistory();
  const classes = useStyles();

  /*
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  }; */

  const recipe = props.recipe;

  function onClick(evt) {
    console.log('click ' + evt.currentTarget.id)
  }

  function onHold(evt) {
    console.log('hold ' + evt.currentTarget.id)
    setOpen(true);
  }

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


  let image = <img src={img_src} className={classes.listimage} alt={recipe.title} alt={"recipe img"} />;

  let tile_jsx;
  // if feed or list
  if(props.smalltiles !== undefined && props.smalltiles === false) {
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
    // className={classes.contextmenu}
    tile_jsx = (
    <React.Fragment>

    <GridListTile key={r_img} className={classes.listtile_small} onClick={() => handeRecipeClick(recipe)}>
      {image}
    </GridListTile>

    </React.Fragment>);
  }

  /*
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
  */

  //     <RightClickMenu/>

  return (
    <React.Fragment>
    {tile_jsx}
    </React.Fragment>
  );
}

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
  },
  contextmenu: {
    background: 'gray',
    color: 'white',
    zIndex: 2
  }
});
/*
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
} */

export default RecipeItem;
