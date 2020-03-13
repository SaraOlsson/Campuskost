import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import GridList from '@material-ui/core/GridList';
import RecipeItem from '../components/recipeitem';

function RecipeGridList(props) {

  const classes = useStyles();

  const [images, setImages] = useState([]);
  let smalltiles = (props.smalltiles) ? props.smalltiles : false;

  useEffect(() => {

    let images_temp = props.recipes.map((recipe, idx) =>
      <RecipeItem recipe={recipe} key={idx} smalltiles={smalltiles} id={idx}/>
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
