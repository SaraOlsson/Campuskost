import React from 'react';
import { HashRouter, Route, Link, NavLink, withRouter } from "react-router-dom";
import './App.css';

function TempProfile() {

  return (
    <div>
      <h1>Profile page</h1>

    </div>
  );
}

function TempFeed() {

  return (
    <div>
      <h1>Feed page</h1>

    </div>
  );
}

function TempNotifications() {

  return (
    <div>
      <h1>Notification page</h1>

    </div>
  );
}

function App() {
  return (
    <div>
      

      <HashRouter>
        <Route exact path="/" component={TempFeed} />
        <Route path="/profile" component={TempProfile} />
        <Route path="/notifications" component={TempNotifications} />
      </HashRouter>
    </div>
  );
}

export default App;
