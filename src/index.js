import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
// import reducer from "./store.js";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import { rootReducer } from "./ducks/reducers";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import theme from "./theme"

import ReactGA from 'react-ga';

const trackingId = "UA-176407801-1"; // Replace with your Google Analytics tracking ID
/*
ReactGA.initialize(trackingId);
ReactGA.pageview("/#/home");

ReactGA.set({
  userId: "testis-ID",
  // any data that is relevant to the user session
  // that you would like to track with google analytics
}) */

ReactGA.initialize(trackingId, {
  debug: true,
  titleCase: false,
  gaOptions: {
    userId: 123
  }
});

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: "AIzaSyAq0vTBf0o5MckjHcCOJiJ_DRK8v_UZY88",//API_KEY, // 
  authDomain: "campuskost-firebase.firebaseapp.com",
  databaseURL: "https://campuskost-firebase.firebaseio.com",
  projectId: "campuskost-firebase",
  storageBucket: "campuskost-firebase.appspot.com",
  messagingSenderId: "477692438735",
  appId: "1:477692438735:web:2e6dce163d7f7ce8baafba",
  measurementId: "G-MDB52ZHJER"
};

const rrfConfig = {
  userProfile: "authusers",
  useFirestoreForProfile: true,
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

/*
const messaging = firebase.messaging();
messaging.requestPermission().then(function() {

  console.log("have permission");
  return messaging.getToken();

}).then(function(token){
  console.log(token)

}).catch(function(err) {
  console.log("Message error")
}) 

// Add the public key generated from the console here.
messaging.usePublicVapidKey("BMIAooArU38LEj_5QHhRn7ijJHnkzFcarwhrJ49xQqt6s8mapaKKhuwke6CfqZQa5cLiZJ1drmd4a0KFh8thrLw");

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
}); */

// const initialState = {};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)))


const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, //since we are using Firestore
};

// wrapper for the provider to work properly
const AppWrapper = () => {

  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>

  )
}

const rootElement = document.getElementById('root');
ReactDOM.render(

  <AppWrapper/>,
  rootElement
);

// ***** serviceWorker functionallity *****
const testisCallback = (input) => {
}
const onUpdate = (registration) => {
  console.log(registration)
  console.log('Det finns en ny uppdatering av Campuskost. Stäng alla fönster så hämtas uppdateringen.')
}
const onSuccess = (registration) => {
  //console.log(registration)
  console.log('Content is cached for offline use.');
}
let cutomConfig = {testisCallback, onUpdate, onSuccess};

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register(cutomConfig);
