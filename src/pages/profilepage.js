import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams} from "react-router";
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

  const { url_user } = useParams();
  const [user, setUser] = useState(url_user); // props.match.params.url_user
  const [ifUser, setIfUser] = useState(false);
  const [recipes, setRecipes] = useState(undefined);
  const [signedIn, setSignedIn] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const classes = useStyles();
  const state = useSelector(state => state.userReducer); // subscribe to the redux store
  const store = useSelector(state => state.fireReducer);

  // let username = props.match.params.user;

  // get user from db, compare with url parameter

  function handleSignOut() {
    firebase.auth().signOut();
    setRedirect(true);
  }

  useEffect(() => {
    recipeFetcher();
    //userFetcher();
  }, []);

  useEffect(() => {
    console.log('user changed!')
    setUser(url_user);
    userFetcher();

  }, [url_user]);

  const recipeFetcher = () => {
    store.db.collection("recipes")
    .onSnapshot(function(querySnapshot) {

        let recipe_docs = [];
        querySnapshot.forEach( doc => {
          let data = doc.data();
          data.id = doc.id;
          recipe_docs.push(data);
        });

        setRecipes(recipe_docs);
    });
  }

  // fetch user correspoding to the url, compare to user signed in
  const userFetcher = () => {

    console.log('in userFetcher')

    //const abortController = new AbortController();
    //const querySnapshot = abortController.querySnapshot;
    // Create a reference to the cities collection
    let usersRef = store.db.collection('users');

    // Create a query against the collection
    let queryRef = usersRef.where('username', '==', url_user);

    let inSnapshot = false;

    //console.log(queryRef)
    queryRef.onSnapshot(function(querySnapshot) {

          inSnapshot = true;

          querySnapshot.forEach( doc => {
            let data = doc.data();
            console.log(data)
            console.log(user)

            if(data.username === user) {
              console.log("profile page for user signed in: " + user + " - " + data.username);
              setIfUser(true);
            } else
              console.log( user + " not matching:  " + data.user);

          });

          if(querySnapshot.length < 1) {
            console.log( " no query results ");
          }

      });

      if(inSnapshot === false)
      {
        setIfUser(false);
        console.log( "no snapshot");
      }
/*
      return function cleanup() {
      abortController.abort();
    } */

    /*

    const document = store.db.doc('users/' + recipe_name + '-' + username);

    store.db.collection("usersRef")
    .onSnapshot(function(querySnapshot) {

        let recipe_docs = [];
        querySnapshot.forEach( doc => {
          let data = doc.data();
          data.id = doc.id;
          recipe_docs.push(data);
        });

        setRecipes(recipe_docs);
    });*/
  }

  /*
  <Button onClick={ () => firebase.auth().signOut()} variant="contained" color="primary">
    Logga ut
  </Button>
  <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>*/

  let recipeContent = (recipes != undefined) ? <RecipeGridList recipes={recipes}/> : <div>Yo</div>;

  // {!state.signedIn ? <Redirect to={"/"} /> : null }

  return (

    <React.Fragment>



      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
        className={classes.userinfo}
      >

        <Grid item xs={6}>
          <h3>{user}</h3>
          {ifUser && <p> You </p>}
        </Grid>
        <Grid item xs={3}>
          <img src={userchef} alt="userchef"/>
        </Grid>

      </Grid>

      <SimpleTabs>
        { recipeContent }
        <div>
        <ListContainer title="Favoriter"/>
        <ListContainer title="Att prova"/>
        </div>
        <FollowerList test={user} followerData={followerData.LillKocken.followers}/>
        <FollowerList test={user} followerData={followerData.LillKocken.following}/>
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
