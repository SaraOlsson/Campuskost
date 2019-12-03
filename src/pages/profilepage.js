import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BrowserRouter as Link, Redirect} from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/auth';

import SimpleTabs from '../components/userpagetabs';
import RecipeGridList from '../components/recipegrid';
import '../style/GlobalCssButton.css';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';
import ListSubheader from '@material-ui/core/ListSubheader';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import InfoIcon from '@material-ui/icons/Info';
import PersonIcon from '@material-ui/icons/Person';
import userchef from '../assets/userchef.png';

const useMountEffect = (fun) => useEffect(fun, []);

// () =>
function ProfilePage(props) {

  const [signedIn, setSignedIn] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const classes = useStyles();
  const state = useSelector(state => state.userReducer); // subscribe to the redux store
  console.log(state)

  function handleSignOut() {
    firebase.auth().signOut();
    setRedirect(true);
  }

  let username = "Sara Olsson";

  /*
  <Button onClick={ () => firebase.auth().signOut()} variant="contained" color="primary">
    Logga ut
  </Button>
  <button onClick={ () => firebase.auth().signOut() } name="signout"> Logga ut </button>*/

  let tileData = [
  {img: 'temp_food1', title: "Falafeltalltik", author: "LillKocken"},
  {img: 'temp_food2', title: "Svamprisotto", author: "LillKocken"},
  {img: 'temp_food3', title: "Laxpasta", author: "LillKocken"},
  {img: 'temp_food4', title: "Bönsoppa", author: "LillKocken"},
  {img: 'temp_food5', title: "Gulaschsoppa", author: "LillKocken"}
  ];

  return (

    <React.Fragment>

      {!state.signedIn ? <Redirect to={"/"} /> : null }

      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
        className={classes.userinfo}
      >

        <Grid item xs={6}>
          <h3>{username}</h3>
        </Grid>
        <Grid item xs={3}>
          <img src={userchef} alt="userchef"/>
        </Grid>

      </Grid>

      <SimpleTabs>
        <RecipeGridList imageData={tileData}/>
        <InfoIcon/>
      </SimpleTabs>

      {state.signedIn === false && <p> Hey you're not signed in. Things won't work here (redirect back) </p>  }

   </React.Fragment>

  );

}

const useStyles = makeStyles({
  userinfo: {
   marginBottom: '20px',
   }
});


export default ProfilePage;
