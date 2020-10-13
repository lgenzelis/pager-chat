import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, RouteChildrenProps, Switch } from 'react-router-dom';

const Login = lazy(() => import('./routes/login'));
const Chat = lazy(() => import('./routes/chat'));

const LoginLazy = () => (
  <Suspense fallback={null}>
    <Login />
  </Suspense>
);

const ChatLazy: React.FC<RouteChildrenProps> = (props) => (
  <Suspense fallback={null}>
    <Chat {...props} />
  </Suspense>
);

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/chat" component={ChatLazy} />
        <Route path="/" component={LoginLazy} />
      </Switch>
    </Router>
  );
}

export default App;
