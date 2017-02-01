import React from 'react'
import { withRouter } from 'react-router'
import auth from '../utils/auth.js'
require ('./login.css');

const Login = React.createClass({
  getInitialState() {
    return {
      error: false,
      showHide: false
    }
  },

  handleSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const pass = this.refs.pass.value;
    var pass_c = undefined;

    if(this.state.showHide){
      pass_c = this.refs.pass_c.value;
    }

    auth.login(email, pass, pass_c,this.callbackFormLogin)
  },

  callbackFormLogin: function (result){
    if(result.error != null && result.error.status === 423){
      this.refs.pass.value = '';
      this.refs.pass_c.value = '';
      return this.setState({showHide: true});
    }
    if (!result.authenticated)
      return this.setState({ error: true });

    const { location } = this.props;

    if (location.state && location.state.nextPathname) {
      this.props.router.replace(location.state.nextPathname)
    } else {
      this.props.router.replace('/')
    }
  },

  componentDidMount() {
    auth.logout()
  },

  render() {

    var showClass = this.state.showHide ? 'show' : 'hide';

    return (
      <div className="row">
        <div className="medium-6 medium-centered large-4 large-centered columns">

          <form onSubmit={this.handleSubmit}>
            <div className="row column log-in-form">
              <h4 className="text-center">Ingresa con el correo electronico</h4>
              <label>Correo
                <input type="text"  ref="email" defaultValue="admon@mi.co" placeholder="micorreo@ejemplo.com" />
              </label>
              <label>Contraseña
                <input defaultValue="Abcd1234"
                       aria-describedby="pass"
                       pattern="(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$"
                       type="password"
                       ref="pass"
                       placeholder="Contraseña"
                       required/>
              </label>
              <p className={"help-text "} id="pass">
                Contraseña minimo 8 caracteres y debe contener mayusculas, minusculas y numeros.
              </p>

              <label className={showClass}>Repetir nueva Contraseña
                <input defaultValue=""
                       pattern="(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$"
                       type="password"
                       ref="pass_c"
                       placeholder="Contraseña"/>
              </label>

              <button className="button expanded" type="submit">Ingresar</button>
            </div>
            {this.state.error && (
              <p>Los datos no son correctos :(</p>
            )}
          </form>

        </div>
      </div>
    )
  }

});

export default withRouter(Login);
