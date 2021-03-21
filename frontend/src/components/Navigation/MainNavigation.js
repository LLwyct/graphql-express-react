import React from 'react'
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const MainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => (
      <header className="bg-primary main-navigation text-light">
        <div className="main-navigation__logo">
          <h1>EasyEvent</h1>
        </div>
        <nav className="main-navigation__item">
          <ul>
            {!context.token && (
              <li>
                <NavLink to="/auth" className="text-light">Authenticate</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/events" className="text-light">Events</NavLink>
            </li>
            {context.token && (
                <React.Fragment>
                    <li>
                  <NavLink to="/bookings" className="text-light">Bookings</NavLink>
                    </li>
                    <li>
                        <button onClick={context.logout}>Logout</button>
                    </li>
                </React.Fragment>
            )}
          </ul>
        </nav>
      </header>
    )}
  </AuthContext.Consumer>
);

export default MainNavigation;