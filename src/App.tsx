import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Login } from './routes/login';
import { Chat } from './routes/chat';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/chat" component={Chat} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
