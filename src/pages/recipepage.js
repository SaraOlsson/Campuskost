import React, {useState, useEffect} from 'react';
import { useParams} from "react-router";
// import { recipeFetch } from '../actions/RecipeActions';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

function RecipePage(props) {

  // console.log(props)


  const [ saved, setSaved ] = useState(false);

  const likeRecipe = () => {
    console.log("hey")
    setSaved( !saved );
  };

  let icon = (saved === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;

  let { recipe } = useParams();

  // {props.match.params.recipe}

  return (

    <div>

      <h1>
        <Button disableTouchRipple onClick={likeRecipe}
        style={{display: 'inline', backgroundColor: 'transparent'}}>
          {icon}
        </Button>
        { recipe + ' | ' }
      </h1>

    </div>

  );

}

/* <div style={{display: 'inline'}} onClick={likeRecipe}> {icon} </div>

<Button onClick={likeRecipe} >
  {icon}
</Button>

*/

export default RecipePage;
