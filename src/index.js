import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";
//import store from "./store.js";
import reducer from "./store.js";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase';

// const initialState = {}

const store = createStore(
   reducer,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );

// const store = createStoreWithFirebase(reducer, initialState)
 // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const rootElement = document.getElementById('root');
ReactDOM.render(

  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
