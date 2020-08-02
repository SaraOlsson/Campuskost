import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./store.js";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// wrapper for the provider to work properly
const AppWrapper = () => {
 const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

 return (
   <Provider store={store}>
     <App />
   </Provider>
 )
}

const rootElement = document.getElementById('root');
ReactDOM.render(

  <AppWrapper/>,
  rootElement
);

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
