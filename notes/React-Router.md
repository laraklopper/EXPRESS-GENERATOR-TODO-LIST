# REACT-ROUTER

```
import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Preferences from '../Preferences/Preferences';

function App() {
  const [token, setToken] = useState();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/preferences" component={Preferences} />
          <Redirect from="/" to="/dashboard" />
          {/* Add a default route or redirect logic if needed */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
```
```
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Preferences from '../Preferences/Preferences';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
}

function App() {
  const token = getToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      ...
    </div>
  );
}

export default App;
```
