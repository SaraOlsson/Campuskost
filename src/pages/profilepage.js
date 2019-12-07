import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BrowserRouter as Link, Redirect} from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/auth';

import recipeData from '../assets/recipes_dev';
import followerData from '../assets/users_dev';
import SimpleTabs from '../components/userpagetabs';
import RecipeGridList from '../components/recipegrid';
import FollowerList from '../components/followerlist';
import ListContainer from '../components/listcontainer';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import userchef from '../assets/userchef.png';

const useMountEffect = (fun) => useEffect(fun, []);

// () =>
function ProfilePage(props) {

  const [recipes, setRecipes] = useState(undefined);
  const [signedIn, setSignedIn] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const classes = useStyles();
  const state = useSelector(state => state.userReducer); // subscribe to the redux store
  const store = useSelector(state => state.fireReducer);
  console.log(state)

  function handleSignOut() {
    firebase.auth().signOut();
    setRedirect(true);
  }

  useEffect(() => {

    let recpiesRef = store.db.collection('recipes');
    recipeFetcher(recpiesRef);

  }, []);

  let username = "LillKocken";

  const recipeFetcher = (recpiesRef) => {
    store.db.collection("recipes").where("user", "==", "LillKocken")
    .onSnapshot(function(querySnapshot) {

        //let images_array = [];
        let recipe_docs = [];
        querySnapshot.forEach(function(doc) {
          //images_array.push(<ImageContainer key={doc.id} listId={doc.id} data={doc.data()}/>);
          recipe_docs.push(doc.data());
        });
        //setImages(images_array);
        setRecipes(recipe_docs);
    });
  }

  /*
  <Button onClick={ () => firebase.auth().signOut()} variant="contained" color="primary">
    Logga ut
  </Button>
  <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>*/


  let recipeContent = (recipes != undefined) ? <RecipeGridList imageData={recipes}/> : <div>Yo</div>;

  return (

    <React.Fragment>

      {!state.signedIn ? <Redirect to={"/"} /> : null }

      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
        className={classes.userinfo}
      >

        <Grid item xs={6}>
          <h3>{username}</h3>
        </Grid>
        <Grid item xs={3}>
          <img src={userchef} alt="userchef"/>
        </Grid>

      </Grid>

      <SimpleTabs>
        { recipeContent }
        <ListContainer title="Favoriter"/>
        <FollowerList followerData={followerData.LillKocken.followers}/>
        <FollowerList followerData={followerData.LillKocken.following}/>
      </SimpleTabs>

      {state.signedIn === false && <p> Hey you're not signed in. Things won't work here (redirect back) </p>  }

   </React.Fragment>

  );

}

const useStyles = makeStyles({
  userinfo: {
   marginBottom: '20px',
   }
});


export default ProfilePage;
