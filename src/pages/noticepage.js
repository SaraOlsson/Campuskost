import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

// import '../style/GlobalCssButton.css';
// import * as ui from '../meterialuiimports';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import FolderIcon from '@material-ui/icons/Folder';
import ForwardIcon from '@material-ui/icons/Forward';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles({
  body: {
    padding: 15
  }
});

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

/*

<ListItemText
  primary= { props.user + " följer nu dig" }
  secondary={true ? props.time : null}
/>*/

const B = (props) => <span style={{fontWeight: 'bold'}}>{props.children}</span>


function NoticeListItem(props) {

  const history = useHistory();
  let noticeText;

  const userClick = () => {
    console.log("well hello " + props.user)
    history.push("/profile/" + props.user );
  };

  const recipeClick = () => {
    console.log("well hello " + props.recipe)
    //history.push("/profile/" + props.user );
  };

  switch (props.type) {
    case "FOLLOWS":
      noticeText = <span onClick={userClick}><B>{props.user}</B> följer nu dig.</span>;
      break;
    case "TIPS":
      noticeText = <div><span onClick={userClick}><B>{props.user}</B></span> <span onClick={recipeClick}>tipsar dig om att laga <B>{props.recipe}</B>.</span></div>;
      break;
    case "TESTED":
      noticeText = <div><span onClick={userClick}><B>{props.user}</B></span> <span onClick={recipeClick}>har testat ditt recept <B>{props.recipe}</B>.</span></div>;
    default:

  }

  // if(props.type === "FOLLOWS")
  //  noticeText = <span><B>{props.user}</B> följer nu dig.</span>;

  return (

    <ListItem>
      <ListItemAvatar>
        <Avatar>
            <PersonIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary= { noticeText }
        secondary={true ? props.time : null}
      />

      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete">
          <ForwardIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>

  );

}

function NoticePage(props) {

  const classes = useStyles();
  // console.log(props)

  return (

    <div>
    <h3>Dina notiser</h3>

    <List dense={true}>
      <NoticeListItem type="FOLLOWS" user="Vegokocken" time="1 h"/>
      <NoticeListItem type="TIPS" user="DelicatoKing" recipe="Linsgryta" time="3 h"/>
      <NoticeListItem type="TESTED" user="PastaMaster" recipe="Korvstroganoff" time="2 dgr"/>
    </List>

    </div>

  );

}

/*

<ListItem>
  <ListItemAvatar>
    <Avatar>
        <PersonIcon />
    </Avatar>
  </ListItemAvatar>
  <ListItemText
    primary="Single-line item"
    secondary={true ? 'Secondary text' : null}
  />
  <ListItemSecondaryAction>
    <IconButton edge="end" aria-label="delete">
      <ForwardIcon />
    </IconButton>
  </ListItemSecondaryAction>
</ListItem>

*/


export default NoticePage;
