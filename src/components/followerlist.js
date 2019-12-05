import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import FolderIcon from '@material-ui/icons/Folder';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PersonIcon from '@material-ui/icons/Person';

function FollowerListItem(props) {

  const classes = useStyles();
  let user = props.user;


  return (

    <ListItem>
      <ListItemAvatar>
        <Avatar>
            <PersonIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary= { user.nickname }
        secondary={ user.fullname }
      />



      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="follows">
          <CheckCircleIcon className={(user.follows ? classes.followColor : classes.notfollowColor)}/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>

  );

}

// className={(user.follows ? 'followColor' : 'notfollowColor')}

function FollowerList(props) {

  const classes = useStyles();

  let followers = [
  {nickname: "NinjaChef", fullname: "Amanda Tydén", follows: true},
  {nickname: "UtterMat", fullname: "Ronja Faltin", follows: true},
  {nickname: "SimbaFood", fullname: "Scar Leijon", follows: false}
  ];

  let followersjsx = props.followerData.map((user, idx) =>
    <FollowerListItem key={idx} user={user}/>
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
   }
});

export default FollowerList;
