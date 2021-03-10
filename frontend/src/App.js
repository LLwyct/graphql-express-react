import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/events';
import BookingsPage from './pages/bookings';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={AuthPage}/>
        <Route path="/events" component={EventsPage}/>
        <Route path="/bookings" component={BookingsPage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
