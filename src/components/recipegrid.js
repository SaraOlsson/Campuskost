import React, {useState, useEffect} from 'react';
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

import RecipeItem from '../components/recipeitem';



function RecipeGridList(props) {

  const classes = useStyles();

  const [images, setImages] = useState([]);
  let smalltiles = (props.smalltiles) ? props.smalltiles : false;

  useEffect(() => {

    let images_temp = props.recipes.map((recipe, idx) =>
      <RecipeItem recipe={recipe} key={idx} smalltiles={smalltiles}/>
    );

    setImages(images_temp);

  }, []);

  // console.log("images.length: " + images.length)

  // oh loading in parent component is what is taking time

  return (
    <div className={classes.root}>
      <GridList>
      {images.length > 0 && images }
      </GridList>
    </div>
  );
}
//    backgroundColor: '#f1f1f1',
//    padding: '10px'
const useStyles = makeStyles({
  root: {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'center',
   overflow: 'hidden'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  listimage: {
    maxHeight: '150px',
    maxWidth: '150px',
    padding: '5px'
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  }
});

export default RecipeGridList;
