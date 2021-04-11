import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
// import reducer from './store.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { rootReducer } from './redux/rootReducer';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import theme from './theme'

import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import common_sv from './translations/sv/common.json';
import common_en from './translations/en/common.json';

import ReactGA from 'react-ga';

const trackingId = 'UA-176407801-1'; // Replace with your Google Analytics tracking ID
/*
ReactGA.initialize(trackingId);
ReactGA.pageview('/#/home');

ReactGA.set({
  userId: 'testis-ID',
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

const DEBUG = (window.location.hostname === 'localhost')

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'campuskost-firebase.firebaseapp.com',
  databaseURL: 'https://campuskost-firebase.firebaseio.com',
  projectId: 'campuskost-firebase',
  storageBucket: 'campuskost-firebase.appspot.com',
  messagingSenderId: '477692438735',
  appId: '1:477692438735:web:2e6dce163d7f7ce8baafba',
  measurementId: 'G-MDB52ZHJER'
};

const rrfConfig = {
  userProfile: 'authusers',
  useFirestoreForProfile: true,
};

firebase.initializeApp(firebaseConfig);

firebase.firestore().enablePersistence()
  .then(function(test) {
    console.log('enablePersistence enabled')
    console.log(test)
  })
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

firebase.firestore();


const messaging = firebase.messaging();

// subsequent calls to getToken will return from cache.
const vapidKey = 'BMIAooArU38LEj_5QHhRn7ijJHnkzFcarwhrJ49xQqt6s8mapaKKhuwke6CfqZQa5cLiZJ1drmd4a0KFh8thrLw'
messaging.getToken({ vapidKey: vapidKey }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
    // alert('Notifikationer kan dyka upp!')
    console.log('got token!')
    console.log(currentToken)
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.')
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err)
  // ...
});

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  alert('Message received. ', payload)
}); 

// translation
i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'sv',                              // language to use
  resources: {
      en: {
          common: common_en               // 'common' is our custom namespace
      },
      sv: {
          common: common_sv
      },
  },
});

// const initialState = {};
const use_devtools = (DEBUG === true)
console.log('use devtools: ' + use_devtools)
const composeEnhancer = use_devtools ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;
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
            <I18nextProvider i18n={i18next}>
              <App />
            </I18nextProvider>
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

// http://patorjk.com/software/taag/#p=display&f=Doom&t=Campuskost
console.log(`
╔═╗┌─┐┌┬┐┌─┐┬ ┬┌─┐┬┌─┌─┐┌─┐┌┬┐
║  ├─┤│││├─┘│ │└─┐├┴┐│ │└─┐ │ 
╚═╝┴ ┴┴ ┴┴  └─┘└─┘┴ ┴└─┘└─┘ ┴ 
'`)
