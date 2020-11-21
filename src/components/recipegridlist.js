import GridList from '@material-ui/core/GridList';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import RecipeItem from '../components/recipeitem';

function RecipeGridList({recipes, smalltiles}) {

  const classes = useStyles();

  return (
    <div className={classes.grid_root}>
      <GridList>
        {
          recipes.map((recipe, idx) =>
            { 
              if(recipe !== undefined && recipe !== null ) 
                return <RecipeItem key={idx + recipe.title} recipe={recipe} smalltiles={smalltiles}/>
            }
          )
        }
      </GridList>
    </div>
  );
}

/*
import PropTypes from 'prop-types';
RecipeGridList.propTypes = {
  recipes: PropTypes.array.isRequired
}; */

const useStyles = makeStyles({
  grid_root: {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'center',
   overflow: 'hidden'
  }
});

export default RecipeGridList;
