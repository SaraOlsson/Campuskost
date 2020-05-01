import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useParams} from "react-router";
import { useHistory } from "react-router-dom";
//import { BrowserRouter as Link, Redirect} from "react-router-dom";
//import firebase from 'firebase/app';
import 'firebase/auth';

import SimpleTabs from '../components/userpagetabs';
import RecipeGridList from '../components/recipegrid';
import FollowerList from '../components/followerlist';
import FavoritePage from '../pages/favoritepage';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import userchef from '../assets/userchef.png';

var Spinner = require('react-spinkit');

// () =>
function ProfilePage(props) {

  const { username_url } = useParams();
  // const [user, setUser] = useState(url_user); // props.match.params.url_user
  const [user, setUser] = useState(undefined);
  const [ifUser, setIfUser] = useState(false);
  const [recipes, setRecipes] = useState(undefined);
  //const [signedIn, setSignedIn] = useState(false);
  const [followInfo, setFollowInfo] = useState([]);
  const [followingInfo, setFollowingInfo] = useState([]);
  const [following_this_user, setFollowing_this_user] = useState({following: false, email: ""});

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const history = useHistory();

  // when url changes, on load and on user click
  useEffect(() => {

    recipeFetcher_new(username_url);

    if(store.firestore_user && username_url === store.firestore_user.username) {
      //console.log("firestore_user changed: " + store.firestore_user.username)
      //console.log("same as logged in")
      setIfUser(true)
      followFetcher(username_url, store.firestore_user.email, "followers");
      followFetcher(username_url, store.firestore_user.email, "following");
    } else if ( store.firestore_user && username_url !== store.firestore_user.username ) {

      //console.log("someone else than firestore_user: " + username_url)
      getEmail(username_url)
      setIfUser(false)
    }

    // get email of user
    email_promise(username_url).then((loadedDoc) => {
      //console.log("got email: " + loadedDoc.email)
      setUser(loadedDoc)
    });

  }, [store.firestore_user, username_url]);

  var email_promise = function(url_username) {
    return new Promise((resolve, reject) => {

      store.db.collection('users').where('username', '==', url_username).get()
        .then(snapshot => {

          let doc_data;
          snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            doc_data = doc.data();
          });
          resolve(doc_data)
        })
    });
  }

  const followUser = () => {
    console.log(store.firestore_user.username + " will follow " + username_url)

    console.log(following_this_user)

    // in following, remove from following list
    if(following_this_user.following) {
      store.db.collection("followers").doc(store.firestore_user.email).collection("following").doc(following_this_user.email).delete();
    } else {
      store.db.collection("followers").doc(store.firestore_user.email).collection("following").doc(following_this_user.email).set({});
    }
    setFollowing_this_user(!following_this_user);
  }

  // get email correspoding to username
  function getEmail(url_user) {

    // loop through all users to find email of user with this username
    store.db.collection("users")
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          let doc_email = "";
          if(doc.data().username === url_user) {
            doc_email = doc.id;
            console.log("found other user email: " + doc_email)

            followFetcher(username_url, doc_email, "followers");
            followFetcher(username_url, doc_email, "following");
          }

          let found = false;
          // check if user signed in is following the user of this profile page
          store.db.collection("followers").doc(store.firestore_user.email).collection("following")
          .onSnapshot(function(querySnapshot) {

              querySnapshot.forEach( doc => {
                // console.log(doc.id)
                if(doc.id === doc_email) {
                  console.log("following " + doc_email)
                  found = true;
                  setFollowing_this_user({following: true, email: doc_email});
                }
              })
          });

          if(found === false && doc_email !== "") {
            setFollowing_this_user({following: false, email: doc_email});
          }

        });

    });
  }

  // get email of followers for the user profile in view
  const followFetcher = (current_username, current_user_email, collection) => {

    let follow_docs = [];

    store.db.collection("followers").doc(current_user_email).collection(collection)
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          let data = doc.data();
          data.email = doc.id;
          follow_docs.push(data);
          // console.log(querySnapshot)
        })
        callback(current_username, follow_docs, collection);
    });
  }

  // when all followers (emails) are collected
  function callback (current_username, follow_docs, collection) {
    followBuilder(current_username, follow_docs, collection);
  }

  // from emails, get further user info
  const followBuilder = (current_username, follow_docs, collection) => {

    let followers = [];
    follow_docs.forEach((item, i) => {

      store.db.collection("users").doc(item.email)
      .onSnapshot(function(doc) {
          let data = doc.data();
          followers.push({username: data.username, fullname: data.fullname, profile_img_url: data.profile_img_url, follows: false});
      })
    });

    callback2(followers, collection);
  }

  function callback2 (followers, collection) {
    //console.log('setFollowInfo and setFollowingInfo');

    if(collection === "followers")
      setFollowInfo(followers);
    else if(collection === "following")
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

  let followBtn;
  if (store.firestore_user && !ifUser && following_this_user.following == true) {

    followBtn = (<Button
      variant="contained"
      color="primary"
      startIcon={<RemoveIcon />}
      onClick={() => followUser()}
    >
      Sluta följ
    </Button>);

  } else if (store.firestore_user && !ifUser) {

    followBtn = (<Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => followUser()}
    >
      Följ
    </Button>);
  }

  // let followBtn =

  let uni = (store.firestore_user != undefined) ? store.firestore_user.university : undefined;
  //let img_src = (store.firestore_user && store.firestore_user.profile_img_url ) ? store.firestore_user.profile_img_url : userchef;

  let img_src = userchef; // default user image
  if (ifUser && store.firestore_user && store.firestore_user.profile_img_url) {
    img_src = store.firestore_user.profile_img_url; // page shows profile for this user
  } else if (!ifUser && user && user.profile_img_url) {
    img_src = user.profile_img_url
  }

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
          <p className={classes.username}>{username_url}</p>
          <p className={classes.university}>{uni}</p>
          {ifUser && <Button
            variant="contained"
            color="primary"
            startIcon={<SettingsIcon />}
            onClick={() => history.push("/settings")}
          >
            Inställningar
          </Button>}
          {followBtn}
        </Grid>
        <Grid item xs={3}>
          <img src={img_src} alt="user-profile-img"/>
        </Grid>

      </Grid>

      <SimpleTabs value={0}>
        <div style={{paddingTop: '15px'}}>
        { recipeContent }
        </div>
        <div>
        <FavoritePage otheruser={user}/>
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
 },
 username: {
   fontWeight: 'bold',
   margin: '10px 0px'
 },
 university: {
   margin: '10px 0px'
 }
});


export default ProfilePage;
