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
import RecipeLists from '../components/RecipeLists';
import SimpleTabs from '../components/userpagetabs';
import { useFirestoreConnect } from "react-redux-firebase";
import LoadSpinner from '../components/loadspinner';
import Emoji from '../components/Emoji';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

function ProfilePage(props) {

  const [isFollowing, setIsFollowing] = useState(false);

  const classes = useStyles();
  const firestore = useFirestore();
  const history = useHistory();

  // get doc of user in view ***
  const { username_url } = useParams();
  useFirestoreConnect({
    collection: `users`,
    where: [
      ['username', '==', username_url],
    ],
    storeAs: "viewUser",
  }); 

  const user = useSelector((state) => {
    return state.firestore.data.viewUser ? Object.values(state.firestore.data.viewUser)[0] : undefined
  });
  const viewUserEmail = user ? user.email : "noemail";
  
  useFirestoreConnect(
    [{
    collection: `followers/${viewUserEmail}/following`,
    storeAs: `${viewUserEmail}-following`,
    },
    {
      collection: `followers/${viewUserEmail}/followers`,
      storeAs: `${viewUserEmail}-followers`,
    }]
  );
  const viewuser_following_users = useSelector((state) => state.firestore.data[`${viewUserEmail}-following`]);
  const viewuser_followers_users = useSelector((state) => state.firestore.data[`${viewUserEmail}-followers`]);

  // data of user signed in ***
  const { email } = useSelector((state) => state.firebase.auth); 
  const followers_users = useSelector((state) => state.firestore.data.followers);
  const following_users = useSelector((state) => state.firestore.data.following);
  const all_users = useSelector((state) => state.firestore.data.allusers);
  const userdoc = useSelector((state) => state.firestore.data.userdoc);
  
  // determine if we follow this user
  useFirestoreConnect({
    collection: `followers/${email}/following`,
    doc: viewUserEmail,
    storeAs: `${email}-follows-${viewUserEmail}`,
  });
  const is_following_state = useSelector((state) => state.firestore.data[`${email}-follows-${viewUserEmail}`]);
  useEffect(() => {
    setIsFollowing(is_following_state ? true : false );
  }, [is_following_state]) 

  // get recipes of user in view
  useFirestoreConnect({
    collection: `recipes`,
    where: [
      ['user', '==', username_url],
    ],
    storeAs: "viewRecipes",
  });
  const recipes = useSelector((state) => {

    let state_obj = state.firestore.data.viewRecipes;

    // no result yet
    if(state_obj === undefined) 
      return undefined;
    else if ( state_obj === null) 
      return [];
    else 
      return Object.values(state_obj);
  });

  // get user docs from email list
  const getUserDocs = (email_keys_object) => {

    if(!email_keys_object || !all_users)
      return [];

    let emails = Object.keys(email_keys_object);

    let docs = [];
    emails.forEach( value => {
      let found = Object.values(all_users).find( u => (u != null && u.email === value))
      if(found)
        docs.push(found);
    });

    return docs;
  }

  const isUser = () => {

    if(!email || !user)
      return false; // should not even call function?

    return user.email === email;
  }

  const followUser = () => {

    let firebase_event_id = email + "-follows-" + user.email;

    // in following, remove from following list
    if(isFollowing) {
      firestore.collection("followers").doc(email).collection("following").doc(user.email).delete();
      firestore.collection("followers").doc(user.email).collection("followers").doc(email).delete();
      firestore.collection('events').doc(firebase_event_id).delete();
      setIsFollowing(false)

    } else {
      firestore.collection("followers").doc(email).collection("following").doc(user.email).set({});
      firestore.collection("followers").doc(user.email).collection("followers").doc(email).set({});
      setIsFollowing(true)

      // if document for user who triggered the action is availiable
      if(userdoc)
      {
        let date = new Date();
        let event_follow_object = {
          email: user.email,
          event_image_url: userdoc.profile_img_url,
          other_username: userdoc.username,
          timestamp: date,
          type: "FOLLOWS",
          seen: false
        };

        firestore.collection('events').doc(firebase_event_id).set(event_follow_object);
      }
    }
  }

  let recipeContent;
  if (user)
  {
    if(!recipes)
    {
      recipeContent = <LoadSpinner/>;
    } else {
      let no_recipes_content = <div className={classes.noRecipesDiv}> Vi väntar med spänning på första receptet från <i>{user.username}!</i> <Emoji symbol="🍽️"/> </div>;
      recipeContent = recipes.length > 0 ? <RecipeGridList recipes={recipes}/> : no_recipes_content;
    }
  }
  // } else { // HEY MAY NOT BE LOADED YET
  //   history.push("/home");
  // }

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
          <span className={classes.university}> | {user.fullname}</span>
          
          { user.bio !== undefined &&
            <p className={classes.bio}><i>{user.bio}</i></p>
          }
          <br/>

          { isUser() && 
            <Button
              variant="contained"
              color="primary"
              startIcon={<SettingsIcon />}
              onClick={() => history.push("/settings")}
            >
            Inställningar
          </Button>}

          { !isUser() &&
            <Button
            variant="contained"
            color="primary"
            startIcon={isFollowing ? <RemoveIcon /> : <AddIcon />}
            onClick={() => followUser()}
          >
            {isFollowing ? "Sluta följ" : "Följ"}
          </Button>
          }

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
        <RecipeLists/>
        </div>
        <div>
        <FollowerList type="followers" followerData={isUser() ? getUserDocs(followers_users) : getUserDocs(viewuser_followers_users)} showFollowIcon={true}/>
        </div>
        <div>
        <FollowerList type="following" followerData={isUser() ? getUserDocs(following_users) : getUserDocs(viewuser_following_users)} showFollowIcon={true}/>
        </div>
      </SimpleTabs>

   </React.Fragment>

  );

}

// https://reactgo.com/css-crop-images/
const useStyles = makeStyles({
  userinfo: {
   marginBottom: '20px',
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
 },
 noRecipesDiv: {
   padding: '1rem',
   fontSize: 'small'
 }
});


export default ProfilePage;

// 382 rows before refactor..
