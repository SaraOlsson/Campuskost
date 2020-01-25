import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';

function SearchPage(props) {

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const store = useSelector(state => state.fireReducer);

  let all_users = ["temp1", "temp2", "temp3"];

  useEffect(() => {
    let user_data = userFetcher('users');
    setUsers(user_data);

    let recipe_data = userFetcher('recipes');
    setRecipes(recipe_data);
    // recipeFetcher();
  }, []);

  const userFetcher = (collection_name) => {

    console.log('in userFetcher')

    let usersRef = store.db.collection(collection_name);
    let temp_users = [];

    //console.log(queryRef)
    usersRef.onSnapshot(function(querySnapshot) {

          querySnapshot.forEach( doc => {
            let data = doc.data();
            temp_users.push(data);
            console.log(data)
          });

      });

      return temp_users;
  }

  return (

    <div>
      <h3>Sökresultat</h3>
      <b> Alla användare: </b>
      <div>
      {
        users.map( user =>
          <p key={user.email}> &bull; {user.username} </p>
        )

      }
      </div>
      <b> Alla recept: </b>
      <div>
      {
        recipes.map( recipe =>
          <p key={recipe.title}> &bull; {recipe.title} </p>
        )

      }
      </div>
    </div>

  );
}

export default SearchPage;
