import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import LoadSpinner from '../components/loadspinner';
import Emoji from '../components/Emoji';


const B = (props) => <span style={{fontWeight: 'bold'}}>{props.children}</span>


function NoticeListItem(props) {

  const classes = useStyles();
  const history = useHistory();
  let noticeText;

  const userClick = () => {
    history.push("/profile/" + props.user );
  };

  const recipeClick = () => {

    // let recipe_title = props.recipe.substring(0, props.recipe.indexOf("-"));
    history.push("/recipe/" + recipe_id_to_title(props.recipe) + "/" + props.recipe );
  };

  // NEEDS REWRITE AS RECIPE ID IS NOT TITLE
  const recipe_id_to_title = (recipe_id) => {
    let recipe_title = props.recipe.substring(0, props.recipe.indexOf("-"));
    return recipe_title;
  }

  switch (props.type) {
    case "FOLLOWS":
      noticeText = <div>
                   <span className={classes.pointer} onClick={userClick}><B>{props.user}</B></span>
                   <span> följer nu dig. </span>
                   </div>;
      break;
    case "TIPS":
      noticeText = <div>
                  <span className={classes.pointer} onClick={userClick}><B>{props.user}</B></span>
                  <span> tipsar dig om att laga </span>
                  <span className={classes.pointer} onClick={recipeClick}><B>{recipe_id_to_title(props.recipe)}</B>.</span>
                  </div>;
      break;
    case "TESTED":
      noticeText = <div>
                    <span className={classes.pointer} onClick={userClick}><B>{props.user}</B></span>
                    <span> har testat ditt recept </span>
                    <span className={classes.pointer} onClick={recipeClick}><B>{recipe_id_to_title(props.recipe)}</B>.</span>
                  </div>;
      break;
    default:

  }

  let user_avatar = undefined;

  if(props.eventimg !== undefined && props.eventimg !== "") {
    user_avatar = <img src={props.eventimg} className={classes.smallprofileimage + ' ' + classes.pointer } alt={"profile-img"} />; //
  } else {
    user_avatar = (
      <Avatar className={classes.pointer + " " + classes.avatar}>
          <PersonIcon />
      </Avatar>
    );
  }

  return (

    <ListItem>
      <ListItemAvatar>
        {user_avatar}
      </ListItemAvatar>

      <ListItemText
        primary= { noticeText }
        secondary={true ? props.time : null}
      />
    </ListItem>

  );
}

function NoticePage(props) {

  const [eventList, setEventList] = useState(undefined);

  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();

  // when url changes, on load and on user click
  useEffect(() => {

    if(store.firestore_user === undefined) {
      setEventList([]);
      return;
    }

    // get email of user
    events_promise(store.firestore_user.email).then((loadedDocs) => {
      setEventList(loadedDocs);
      //setUser(loadedDoc)
    });

  }, [store.firestore_user]);

  var events_promise = function(email) {
    return new Promise((resolve, reject) => {

      firestore.collection('events').where('email', '==', email).get()
        .then(snapshot => {

          let doc_data = [];
          snapshot.forEach(doc => {
            let temp_data = doc.data();
            doc_data.push(temp_data);
          });

          resolve(doc_data)
        })
    });
  }

  let eventListjsx = (eventList) ? eventList.map( (event, idx) =>
    <NoticeListItem key={idx} type={event.type} user={event.other_username} recipe={event.recipe || undefined} time="" eventimg={event.event_image_url}/>
  ) : <LoadSpinner/>;


  return (

    <div>
    <h3>Dina notiser</h3>

    { (true || eventList) &&
      <List dense={true}>
        {eventListjsx}
      </List>
    }
    { (eventList && eventList.length < 1) &&
      <p> Ledsen, inga händelser än. Börja interagera med dina kockvänner! <Emoji symbol="🍳"/> </p>
    }

    </div>
  );
}

const useStyles = makeStyles(theme => ({
  smallprofileimage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '100px',
    margin: '5px auto'
 },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  },
  pointer: {
   cursor: 'pointer'
  },
  avatar: {
    // marginBottom: '15px',
    color: '#fafafa',
    backgroundColor: theme.palette.campuskost.teal
  },
}));

export default NoticePage;
