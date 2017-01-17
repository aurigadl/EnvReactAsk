import React from 'react'
import { Link } from 'react-router'
import auth from '../utils/auth'
require ('./menu.css');

const App = React.createClass({

  getInitialState() {
    return {
      loggedIn: auth.loggedIn()
    }
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn: !!loggedIn
    })
  },

  componentWillMount() {
    auth.onChange = this.updateAuth
  },

  render() {
    return (
      <div>

        <header className="header">
          <ul className="header-subnav">
            <li>
              {this.state.loggedIn ? (
                <Link to="/logout">Salir</Link>
              ) : (
                <Link to="/login">Ingresar</Link>
              )}
            </li>

            <li><Link to="/">Inicio</Link></li>

            {this.state.loggedIn ? (
              <li><Link to="/page2">Fuec</Link></li>
            ): null}
          </ul>

        </header>

        {this.props.children}

      </div>
    )
  }
});

export default App
