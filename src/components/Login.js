import React from 'react'
import { withRouter } from 'react-router'
import auth from '../utils/auth.js'
require ('./login.css');

const Login = React.createClass({
  getInitialState() {
    return {
      error: false
    }
  },

  handleSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const pass = this.refs.pass.value;

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true });

      const { location } = this.props;

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      } else {
        this.props.router.replace('/')
      }
    })
  },

  render() {
    return (
      <div className="row">
        <div className="medium-6 medium-centered large-4 large-centered columns">

          <form onSubmit={this.handleSubmit}>
            <div className="row column log-in-form">
              <h4 className="text-center">Ingresa con el correo electronico</h4>
              <label>Correo
                <input type="text"  ref="email" defaultValue="admon@midominio.co" placeholder="micorreo@ejemplo.com" />
              </label>
              <label>Contraseña
                <input defaultValue="qwerasdf" type="password" ref="pass" placeholder="Contraseña" />
              </label>
                <button className="button expanded" type="submit">Ingresar</button>
            </div>
            {this.state.error && (
              <p>Bad login information</p>
            )}
          </form>

        </div>
      </div>
    )
  }

});

export default withRouter(Login);
