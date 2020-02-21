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

var Spinner = require('react-spinkit');
const useMountEffect = (fun) => useEffect(fun, []);

// () =>
function ProfilePage(props) {

  const { user } = useParams();
  // const [user, setUser] = useState(url_user); // props.match.params.url_user
  const [ifUser, setIfUser] = useState(false);
  const [recipes, setRecipes] = useState(undefined);
  const [signedIn, setSignedIn] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [followInfo, setFollowInfo] = useState([]);
  const [followingInfo, setFollowingInfo] = useState([]);

  //console.log(followInfo)
  //console.log("user page: " + user)

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);

  function handleSignOut() {
    firebase.auth().signOut();
    setRedirect(true);
  }

  // when url changes, on load and on user click
  /*
  useEffect(() => {

    console.log("user url changed: " + user)
    recipeFetcher_new(user);

    if(store.firestore_user && user != store.firestore_user.username) {
      console.log("someone else than firestore_user: " + store.firestore_user.username)

      followFetcher(user, store.firestore_user.email, "followers");
      followFetcher(user, store.firestore_user.email, "following");
    }

  }, [user]); */

  // when url changes, on load and on user click
  useEffect(() => {

    recipeFetcher_new(user);

    if(store.firestore_user && user == store.firestore_user.username) {
      console.log("firestore_user changed: " + store.firestore_user.username)
      console.log("same as logged in")
      followFetcher(user, store.firestore_user.email, "followers");
      followFetcher(user, store.firestore_user.email, "following");
    } else if ( store.firestore_user && user != store.firestore_user.username ) {

      console.log("someone else than firestore_user: " + user)
      getEmail(user)
    }


  }, [store.firestore_user, user]);

  // get email correspoding to username
  function getEmail(url_user) {

    store.db.collection("users")
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          if(doc.data().username == url_user) {
            let doc_email = doc.id;
            console.log("found other user email: " + doc_email)

            followFetcher(user, doc_email, "followers");
            followFetcher(user, doc_email, "following");
          }
        });

    });
  }

  // get email of followers for the user profile in view
  const followFetcher = (current_username, current_user_email, collection) => {

    //console.log("in followFetcher")

    let follow_docs = [];

    store.db.collection("followers").doc(current_user_email).collection(collection)
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          let data = doc.data();
          data.email = doc.id;
          follow_docs.push(data);
          // console.log(querySnapshot)
        })

        //console.log(follow_docs)
        callback(current_username, follow_docs, collection);
    });
  }

  // when all followers (emails) are collected
  function callback (current_username, follow_docs, collection) {
    //console.log('callback');
    //console.log(follow_docs);
    followBuilder(current_username, follow_docs, collection);
  }

  // from emails, get further user info
  const followBuilder = (current_username, follow_docs, collection) => {

    //console.log("followBuilder")

    let followers = [];

    follow_docs.forEach((item, i) => {

      store.db.collection("users").doc(item.email)
      .onSnapshot(function(doc) {

          let data = doc.data();
          followers.push({username: data.username, fullname: data.fullname, follows: false});

      })

    });

    callback2(followers, collection);
  }

  function callback2 (followers, collection) {
    console.log('setFollowInfo and setFollowingInfo');

    //console.log(followers)
    // console.log("collection: " + collection)

    if(collection == "followers")
      setFollowInfo(followers);
    else if(collection == "following")
      setFollowingInfo(followers);
  }


  // fetch recipes for the user profile in view
  const recipeFetcher_new = (current_username) => {
    store.db.collection("recipes")
    .onSnapshot(function(querySnapshot) {

        let recipe_docs = [];
        querySnapshot.forEach( doc => {

          let data = doc.data();
          if( data.user == current_username )
          {
            data.id = doc.id;
            recipe_docs.push(data);
          }
        });
        setRecipes(recipe_docs);
    });
  }

  // fetch user correspoding to the url, compare to user signed in
  /*
  const userFetcher = () => {

    console.log('in userFetcher')
    // Create a reference to the cities collection
    let usersRef = store.db.collection('users');

    // Create a query against the collection
    let queryRef = usersRef.where('username', '==', user);
    let inSnapshot = false;

    //console.log(queryRef)
    queryRef.onSnapshot(function(querySnapshot) {

          inSnapshot = true;
          querySnapshot.forEach( doc => {
            let data = doc.data();

            if(data.username === user) {
              setIfUser(true);
            }
          });
    });

    if(inSnapshot === false)
    {
      setIfUser(false);
      console.log( "no snapshot");
    }
  }
  */
  /*
  <Button onClick={ () => firebase.auth().signOut()} variant="contained" color="primary">
    Logga ut
  </Button>
  <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>*/
  let spinner_jsx = <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div>;
  let recipeContent = (recipes != undefined) ? <RecipeGridList recipes={recipes}/> : spinner_jsx;

  //console.log("rerender ")


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

      <SimpleTabs value={0}>
        <div>
        { recipeContent }
        </div>
        <div>
        <ListContainer title="Favoriter"/>
        <ListContainer title="Att prova"/>
        </div>
        <div>
        <FollowerList followerData={followInfo}/>
        </div>
        <div>
        <FollowerList followerData={followingInfo}/>
        </div>
      </SimpleTabs>

   </React.Fragment>

  );
// followInfo.length > 0 &&
}

const useStyles = makeStyles({
  userinfo: {
   marginBottom: '20px',
 },
 spinner: {
   display: 'flex',
   justifyContent: 'center',
   marginTop: 100
 }
});


export default ProfilePage;
