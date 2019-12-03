import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';
import ListSubheader from '@material-ui/core/ListSubheader';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import InfoIcon from '@material-ui/icons/Info';

function RecipeGridList(props) {

  const classes = useStyles();

  let tileData = props.imageData;

  let images = tileData.map(tile =>

    <GridListTile key={tile.img} style={{ maxHeight: '150px', maxWidth: '150px'}}>
      <img src={require('../assets/'+ tile.img + '.jpg')} alt={tile.title} />

      <GridListTileBar
        title={tile.title}
        subtitle={<span>Av: {tile.author}</span>}
        actionIcon={
          <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
            <InfoIcon />
          </IconButton>
        }
      />

    </GridListTile>
  );

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList}>
      {images}
      </GridList>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
   backgroundColor: 'white',
   },
   gridList: {
     width: 360,
     height: 300,
   },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

export default RecipeGridList;
