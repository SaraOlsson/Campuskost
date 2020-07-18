import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PersonIcon from '@material-ui/icons/Person';

function FollowerListItem(props) {

  const classes = useStyles();
  let user = props.user;

  let user_avatar = undefined;
  if(user.profile_img_url != undefined) {
    user_avatar = <img src={user.profile_img_url} className={classes.smallprofileimage} alt={"profile-img"} />; //
  } else {
    user_avatar = (
      <Avatar>
          <PersonIcon />
      </Avatar>
    );
  }

  return (

    <ListItem className={classes.pointer}>
      <ListItemAvatar>
        {user_avatar}
      </ListItemAvatar>

      <ListItemText
        primary= { user.username }
        secondary={ user.fullname }
        onClick={() => props.handleChange(user.username)}
      />

      { props.showFollowIcon &&
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="follows">
          <CheckCircleIcon className={(user.follows ? classes.followColor : classes.notfollowColor)}/>
        </IconButton>
      </ListItemSecondaryAction>
      }
    </ListItem>

  );

}

// className={(user.follows ? 'followColor' : 'notfollowColor')}

function FollowerList(props) {

  const [followData, setFollowData] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  const handleUserClick = (user) => {
    history.push("/profile/" + user );
  };

  // when url changes, on load and on user click
  useEffect(() => {

    setFollowData(props.followerData);

  }, [props.followerData]);


  if (false && props.followerData.length < 1) {

    return (
      <p>sad, no followers</p>
    );
  }

  let followersjsx = followData.map((user, idx) =>
    <FollowerListItem key={idx} user={user} handleChange={handleUserClick} showFollowIcon={props.showFollowIcon}/>
  );

  return (
    <List dense={true} className={classes.followerlist}>
      {followersjsx}
    </List>
  );
}

const useStyles = makeStyles({
  followerlist: {
   marginTop: '20px',
 },
   followColor: {
     color: '#39A4B3'
   },
   notfollowColor: {
     color: '#e8e8e8'
   },
   smallprofileimage: {
     width: '40px'
   },
   pointer: {
    cursor: 'pointer'
   }
});

export default FollowerList;
