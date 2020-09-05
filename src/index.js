import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";
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
  apiKey: API_KEY,
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

const initialState = {};
const store = createStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// Dev: , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()


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
          <App />
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

// serviceWorker functionallity
const testisCallback = (input) => {
  console.log(input)
}

const onUpdate = (registration) => {
  console.log(registration)
  alert('Det finns en ny uppdatering av Campuskost. Stäng alla fönster så hämtas uppdateringen.');
}

const onSuccess = (registration) => {
  console.log(registration)
}

let cutomConfig = {testisCallback, onUpdate, onSuccess};

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register(cutomConfig);
