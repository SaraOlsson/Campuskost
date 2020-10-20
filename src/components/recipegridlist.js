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
          <React.Fragment>
            { (recipe !== undefined && recipe !== null ) &&
            <RecipeItem recipe={recipe} key={idx + recipe.title} smalltiles={smalltiles}/>
            }
          </React.Fragment>
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
