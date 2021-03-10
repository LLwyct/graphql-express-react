import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/events';
import BookingsPage from './pages/bookings';

import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage}/>
            <Route path="/events" component={EventsPage}/>
            <Route path="/bookings" component={BookingsPage}/>
          </Switch>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
