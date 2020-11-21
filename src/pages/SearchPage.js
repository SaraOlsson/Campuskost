import { makeStyles } from '@material-ui/core/styles';
import React, {useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import FollowerList from '../components/followerlist';
import RecipeGridList from '../components/recipegridlist';

import LoadSpinner from '../components/loadspinner';

function SearchPage(props) {

  const dispatch = useDispatch();

  const searchString = useSelector((state) => state.searchReducer.searchstring);

  const recipes = useSelector((state) => state.firestore.data.allrecipes);
  const users = useSelector((state) => state.firestore.data.allusers);

  useEffect(() => {
    
    // Specify how to clean up after this effect:
    return function cleanup() {
      dispatch({
        type: "SETSEARCH",
        searchstring: ""
      })
    };

  },[]);

  const filterRecipes = (values) => {
    return values.filter(r => ( r != null && (match(r, "title") || match(r, "user") )));
  }

  const filterUsers = (values) => {
    return values.filter(u => ( u != null && (match(u, "username") || match(u, "fullname") )));
  }

  const match = (object, attr) => {
    return object[attr].toLowerCase().includes(searchString.toLowerCase());
  }

  const filteredRecipes = recipes ? filterRecipes(Object.values(recipes)) : undefined;
  const filteredUsers = users ? filterUsers(Object.values(users)) : undefined;

  return (

    <div>
      <h3>Sökresultat</h3>

      { (users && recipes && searchString !== "") &&
        <p> {filteredRecipes.length+filteredUsers.length} 
        {filteredRecipes.length+filteredUsers.length > 1 ? " sökträffar" : " sökträff"} 
        </p>
      }
      { searchString === "" &&
        <p> Du har inte sökt på något än, alla användare och recept visas nedan.</p>
      }

      { (!users || !recipes) && <LoadSpinner/> }

      { users &&
      <React.Fragment>
        <b> Användare: </b>
        <div>
          <FollowerList followerData={filteredUsers}/>
        </div>
      </React.Fragment>
      }
      { recipes &&
      <React.Fragment>
        <b> Recept: </b>
        <div style={{paddingTop: '15px'}}>
          <RecipeGridList recipes={filteredRecipes}/>
        </div>
      </React.Fragment>
      }

    </div>

  );
}

const useStyles = makeStyles({
});

export default SearchPage;
