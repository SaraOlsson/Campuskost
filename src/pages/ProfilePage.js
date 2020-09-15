import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SettingsIcon from '@material-ui/icons/Settings';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import FollowerList from '../components/followerlist';
import RecipeGridList from '../components/recipegridlist';
import SimpleTabs from '../components/userpagetabs';
import ListPage from './ListPage';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

var Spinner = require('react-spinkit');

// () =>
function ProfilePage(props) {

  const { username_url } = useParams();
  const [user, setUser] = useState(undefined);
  const [ifUser, setIfUser] = useState(false);
  const [recipes, setRecipes] = useState(undefined);
  const [followInfo, setFollowInfo] = useState([]);
  const [followingInfo, setFollowingInfo] = useState([]);
  const [following_this_user, setFollowing_this_user] = useState({following: false, email: ""});

  const classes = useStyles();
  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();
  const history = useHistory();

  // when url changes, on load and on user click
  useEffect(() => {

    // CLEAN UP - can be done better

    recipeFetcher_new(username_url);

    if(store.firestore_user && username_url === store.firestore_user.username) {

      setIfUser(true)
      followFetcher(username_url, store.firestore_user.email, "followers");
      followFetcher(username_url, store.firestore_user.email, "following");
    } else if ( store.firestore_user && username_url !== store.firestore_user.username ) {

      getEmail(username_url) // fetches followers etc as well..
      setIfUser(false)
    }

    // get email of user
    email_promise(username_url).then((loadedDoc) => {

      setUser(loadedDoc)
    });

  }, [store.firestore_user, username_url]);

  var email_promise = function(url_username) {
    return new Promise((resolve, reject) => {

      firestore.collection('users').where('username', '==', url_username).get()
        .then(snapshot => {

          let doc_data;
          snapshot.forEach(doc => {

            doc_data = doc.data();
          });
          resolve(doc_data)
        })
    });
  }

  const followUser = () => {

    let firebase_event_id = store.firestore_user.email + "-follows-" + following_this_user.email;

    // in following, remove from following list
    if(following_this_user.following) {
      firestore.collection("followers").doc(store.firestore_user.email).collection("following").doc(following_this_user.email).delete();
      firestore.collection("followers").doc(following_this_user.email).collection("followers").doc(store.firestore_user.email).delete();
      firestore.collection('events').doc(firebase_event_id).delete();

    } else {
      firestore.collection("followers").doc(store.firestore_user.email).collection("following").doc(following_this_user.email).set({});
      firestore.collection("followers").doc(following_this_user.email).collection("followers").doc(store.firestore_user.email).set({});

      let date = new Date();

      let event_follow_object = {
        email: following_this_user.email,
        event_image_url: store.firestore_user.profile_img_url,
        other_username: store.firestore_user.username,
        timestamp: date,
        type: "FOLLOWS",
        seen: false
      };

      firestore.collection('events').doc(firebase_event_id).set(event_follow_object);

    }

    setFollowing_this_user({following: !following_this_user.following, email: following_this_user.email});

  }

  // get email correspoding to username
  function getEmail(url_user) {

    // loop through all users to find email of user with this username
    firestore.collection("users")
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          let doc_email = "";
          if(doc.data().username === url_user) {
            doc_email = doc.id;

            followFetcher(username_url, doc_email, "followers");
            followFetcher(username_url, doc_email, "following");
          }

          let found = false;
          // check if user signed in is following the user of this profile page
          firestore.collection("followers").doc(store.firestore_user.email).collection("following")
          .onSnapshot(function(querySnapshot) {

              querySnapshot.forEach( doc => {

                if(doc.id === doc_email) {

                  found = true;
                  setFollowing_this_user({following: true, email: doc_email});
                }
              })
          });

          if(found === false) // && doc_email !== ""
          {
            setFollowing_this_user({following: false, email: doc_email});
          }

        });

    });
  }

  // get email of followers for the user profile in view
  const followFetcher = (current_username, current_user_email, collection) => {

    let follow_docs = [];

    firestore.collection("followers").doc(current_user_email).collection(collection)
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          let data = {}; //  = doc.data(); // currently no other data
          data.email = doc.id;
          follow_docs.push(data);

        })
        followBuilder(current_username, follow_docs, collection);
    });
  }

  // from emails, get further user info
  const followBuilder = (current_username, follow_docs, collection) => {

    let followers = [];
    follow_docs.forEach((item, i) => {

      firestore.collection("users").doc(item.email)
      .onSnapshot(function(doc) {
          let data = doc.data();
          followers.push({username: data.username, fullname: data.fullname, profile_img_url: data.profile_img_url, follows: false});
      })
    });

    // callback2(followers, collection);
    if(collection === "followers")
      setFollowInfo(followers);
    else if(collection === "following")
      setFollowingInfo(followers);

  }

  // fetch recipes for the user profile in view
  const recipeFetcher_new = (current_username) => {
    firestore.collection("recipes")
    .onSnapshot(function(querySnapshot) {

        let recipe_docs = [];
        querySnapshot.forEach( doc => {

          let data = doc.data();
          if( data.user === current_username )
          {
            data.id = doc.id;
            recipe_docs.push(data);
          }
        });
        setRecipes(recipe_docs);
    });
  }

  let spinner_jsx = <div className={classes.spinner} ><Spinner name="ball-scale-multiple" color="#68BB8C" fadeIn="none"/></div>;
  let recipeContent = (recipes !== undefined) ? <RecipeGridList recipes={recipes}/> : spinner_jsx;

  let followBtn;
  if (store.firestore_user && !ifUser && following_this_user.following === true) {

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

  return !user ? [] : (

    <React.Fragment>

      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
        className={classes.userinfo}
      >

        <Grid item xs={6}>
          <span className={classes.username}>{username_url}</span>

          { user !== undefined &&
            <span className={classes.university}> | {user.fullname}</span>
          }

          { (user !== undefined && user.university !== "") &&
            <p className={classes.university}>🎓{user.university}</p>
          }

          { (user !== undefined && user.bio !== undefined ) &&
            <p className={classes.bio}><i>{user.bio}</i></p>
          }

          <br/>

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
        { user.profile_img_url ? 
          <Grid item xs={3}>
            <img src={user.profile_img_url} alt="user-profile-img" className={classes.profileImage}/>
          </Grid> 
          :
          <Avatar>
            <PersonIcon/>
          </Avatar>
        }
        

      </Grid>

      <SimpleTabs value={0}>
        <div style={{paddingTop: '15px'}}>
        { recipeContent }
        </div>
        <div>
        <ListPage/>
        </div>
        <div>
        <FollowerList followerData={followInfo} showFollowIcon={true}/>
        </div>
        <div>
        <FollowerList followerData={followingInfo} showFollowIcon={true}/>
        </div>
      </SimpleTabs>

   </React.Fragment>

  );
// followInfo.length > 0 &&
}

// https://reactgo.com/css-crop-images/

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
 },
 bio: {
   fontSize: '13px',
   maxWidth: '300px'
 },
 profileImage: {
  objectFit: 'cover',
  backgroundPosition: 'center',
  borderRadius: '50%',
  width: '100px',
  height: '100px'
 }
});


export default ProfilePage;

// 382 rows before refactor..
