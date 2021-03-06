import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { blue } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";


// const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [myFriends, setMyFriends] = useState(undefined);

  const userdoc = useSelector(state => state.firestore.data.userdoc);
  const firestore = useFirestore();

  // when url changes, on load and on user click
  useEffect(() => {

    if(userdoc) {
      followFetcher(userdoc.email, "following");
    }

  }, [userdoc]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (friend) => {

    onClose(friend.email);

    let date = new Date();

    let event_tips_object = {
      email: friend.email,
      event_image_url: userdoc.profile_img_url, // change to recipe image
      other_username: userdoc.username,
      recipe: props.recipeId,
      timestamp: date,
      type: "TIPS",
      seen: false
    };

    let firebase_event_id = userdoc.email + "-tips-" + friend.email + "-" + props.recipeId;

    firestore.collection('events').doc(firebase_event_id).set(event_tips_object);
  };

  // get email of followers for the user profile in view
  const followFetcher = (current_user_email, collection) => {

    let follow_docs = [];
    let follow_data = [];

    firestore.collection("followers").doc(current_user_email).collection(collection)
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          firestore.collection("users").doc(doc.id)
          .onSnapshot(function(doc) {
              let data = doc.data();
              follow_data.push({email: doc.id, username: data.username, fullname: data.fullname, profile_img_url: data.profile_img_url, follows: false});
          })

        })
        //followBuilder(current_username, follow_docs, collection);

        setMyFriends(follow_data);
    });
  }

  let email_jsx = (myFriends != undefined) ? myFriends.map((friend) => (
    <ListItem button onClick={() => handleListItemClick(friend)} key={friend.email}>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={friend.username} />
    </ListItem>
  )) : null;

  //
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Tipsa vän</DialogTitle>
      <List>
        {email_jsx}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function PickUserDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("temp"); // emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
    // props.handleClickOpen();
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  // variant="outlined" color="primary"

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Tipsa en vän
      </Button>
      <SimpleDialog recipeId={props.recipeId} selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
}
