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

  useEffect(() => {
    userFetcher('users');
    // setUsers(user_data);

    userFetcher('recipes');
    // setRecipes(recipe_data);
    // recipeFetcher();
  }, []);

  const userFetcher = (collection_name) => {

    console.log('in userFetcher')

    // let usersRef = store.db.collection(collection_name);
    let temp_users = [];

    //console.log(queryRef)
    store.db.collection(collection_name).onSnapshot(function(querySnapshot) {

          console.log(users)

          querySnapshot.forEach( doc => {
            let data = doc.data();
            temp_users.push(data);
            //console.log(data)
          });

          if (collection_name == 'users')
            setUsers(temp_users);
          if (collection_name == 'recipes')
            setRecipes(temp_users);

      });
  }

  console.log("users.length")

  let followingInfo = users.map( user => {
    let obj = {username: user.username, fullname: "", follows: false};
    return obj;
  });

  /*

  {
    users.map( user =>
      <p key={user.email}> &bull; {user.username} </p>
    )

    <FollowerList followerData={followingInfo}/>

  }

  */

  /*

  {
    recipes.map( (recipe, idx) =>
      <RecipeItem recipe={recipe} key={idx}/>
    )

  }*/

  return (

    <div>
      <h3>Sökresultat</h3>

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

//           <p key={recipe.title}> &bull; {recipe.title} </p>

const useStyles = makeStyles({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  }
});

export default SearchPage;
