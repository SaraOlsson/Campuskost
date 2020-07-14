import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

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

  const store = useSelector(state => state.fireReducer);

  // when url changes, on load and on user click
  useEffect(() => {

    if(store.firestore_user) {
      followFetcher(store.firestore_user.email, "following");
    }

  }, [store.firestore_user]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (friend) => {
    console.log("tips to: ", friend.email)
    onClose(friend.email);

    let date = new Date();

    let event_tips_object = {
      email: friend.email,
      event_image_url: store.firestore_user.profile_img_url, // change to recipe image
      other_username: store.firestore_user.username,
      recipe: props.recipeId,
      timestamp: date,
      type: "TIPS",
      seen: false
    };

    let firebase_event_id = store.firestore_user.email + "-tips-" + friend.email + "-" + props.recipeId;

    store.db.collection('events').doc(firebase_event_id).set(event_tips_object);
  };

  // get email of followers for the user profile in view
  const followFetcher = (current_user_email, collection) => {

    let follow_docs = [];
    let follow_data = [];

    store.db.collection("followers").doc(current_user_email).collection(collection)
    .onSnapshot(function(querySnapshot) {

        querySnapshot.forEach( doc => {

          store.db.collection("users").doc(doc.id)
          .onSnapshot(function(doc) {
              let data = doc.data();
              follow_data.push({email: doc.id, username: data.username, fullname: data.fullname, profile_img_url: data.profile_img_url, follows: false});
          })

        })
        //followBuilder(current_username, follow_docs, collection);
        //console.log(follow_data)
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
