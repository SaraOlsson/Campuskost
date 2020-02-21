import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';

import RecipeGridList from '../components/recipegrid';
import RecipeItem from '../components/recipeitem';
import FollowerList from '../components/followerlist';
var Spinner = require('react-spinkit');

function SearchPage(props) {

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState(undefined);

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);

  let searchstring = "";

  useEffect(() => {
    userFetcher('users');
    userFetcher('recipes');
  }, []);

  const userFetcher = (collection_name) => {

    store.db.collection(collection_name).onSnapshot(function(querySnapshot) {

          let temp_users = [];
          querySnapshot.forEach( doc => {
            //let data = doc.data();
            let data = doc.data();
            data.id = doc.id;
            temp_users.push(data);
          });

          if (collection_name == 'users')
            setUsers(temp_users);
          if (collection_name == 'recipes')
            setRecipes(temp_users);
      });
  }

  let followingInfo = users.map( user => {
    let obj = {username: user.username, fullname: "", follows: false};
    return obj;
  });

  /*
  {
    recipes.map( (recipe, idx) =>
      <RecipeItem recipe={recipe} key={idx}/>
    )
  }*/

  return (

    <div>
      <h3>Sökresultat</h3>

      { searchstring == "" && <p> Sök specifikt recept eller användare ovan </p> }

      { users.length <= 0 && <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div> }
      { users.length > 0 && <React.Fragment>
      <b> Alla användare: </b>
      <div>
      <FollowerList followerData={followingInfo}/>
      </div>
      <b> Alla recept: </b>
      <div>
      { recipes != undefined && <RecipeGridList recipes={recipes}/> }

      </div>
      </React.Fragment> }
    </div>

  );
}

const useStyles = makeStyles({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  }
});

export default SearchPage;
