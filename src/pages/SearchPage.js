import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
//import { useHistory } from "react-router-dom";
import FollowerList from '../components/followerlist';
import RecipeGridList from '../components/recipegridlist';

var Spinner = require('react-spinkit');

function SearchPage(props) {

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState(undefined);

  const classes = useStyles();
  const firestore = useFirestore();

  // const history = useHistory();

  let searchstring = "";

  useEffect(() => {
    userFetcher('users');
    userFetcher('recipes');
  }, []);

  const userFetcher = (collection_name) => {

    firestore.collection(collection_name).onSnapshot(function(querySnapshot) {

          let temp_users = [];
          querySnapshot.forEach( doc => {
            let data = doc.data();
            data.id = doc.id;
            temp_users.push(data);
          });

          if (collection_name === 'users')
            setUsers(temp_users);
          if (collection_name === 'recipes')
            setRecipes(temp_users);
      });
  }

  let followingInfo = users.map( user => {
    let obj = {username: user.username, fullname: user.fullname, profile_img_url: user.profile_img_url, follows: false};
    return obj;
  });

  
  // Sök specifikt recept eller användare ovan

  return (

    <div>
      <h3>Sökresultat</h3>



      { searchstring === "" && <p> Sökfunktionen kommer snart! Tills dess visas alla användare och recept nedan. </p> }

      { users.length <= 0 && <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div> }
      { users.length > 0 && <React.Fragment>
      <b> Alla användare: </b>
      <div>
      <FollowerList followerData={followingInfo}/>
      </div>
      <b> Alla recept: </b>
      <div style={{paddingTop: '15px'}}>
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
