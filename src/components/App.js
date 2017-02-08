import React from 'react'
import {Link} from 'react-router'
import auth from '../utils/auth'

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
              ) : null}
            </li>

            {this.state.loggedIn ? (
              <li><Link to="/PageOne">Admin</Link></li>)
              : null}

            {this.state.loggedIn ? (
              <li><Link to="/pageTwo">Fuec</Link></li>)
              : null}
          </ul>

        </header>

        {this.props.children}

      </div>
    )
  }
});

export default App
