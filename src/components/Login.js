import React from 'react'
import {withRouter} from 'react-router'
import auth from '../utils/auth.js'
import {Form, Icon, Input, Button} from 'antd';
import css from './login.less';
const FormItem = Form.Item;


const Login = Form.create()(React.createClass({
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

    if (this.state.showHide) {
      pass_c = this.refs.pass_c.value;
    }

    auth.login(email, pass, pass_c, this.callbackFormLogin)
  },

  callbackFormLogin: function (result) {
    if (result.error != null && result.error.status === 423) {
      this.refs.pass.value = '';
      this.refs.pass_c.value = '';
      return this.setState({showHide: true});
    }
    if (!result.authenticated)
      return this.setState({error: true});

    const {location} = this.props;

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

    var showClass = this.state.showHide ? '' : 'is-hidden';

    return (
      <section className="code-box">
        <Form onSubmit={this.handleSubmit} className="ant-form login-form">

          <FormItem>
            <Input addonBefore={<Icon type="user" />} type="text" ref="email" defaultValue="admon@mi.co"
                   placeholder="micorreo@ejemplo.com"/>
          </FormItem>

          <FormItem>
            <Input
              addonBefore={<Icon type="lock" />}
              defaultValue="Abcd1234"
              aria-describedby="pass"
              pattern="(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$"
              type="password"
              ref="pass"
              placeholder="Contraseña"
              required/>
            <div className="ant-form-extra">Contraseña minimo 8 caracteres y debe contener
              mayusculas, minusculas y numeros.</div>
          </FormItem>

          <FormItem>
            <label className={showClass}>Repetir nueva Contraseña
              <Input
                addonBefore={<Icon type="lock" />}
                defaultValue=""
                pattern="(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$"
                type="password"
                ref="pass_c"
                placeholder="Contraseña"/>
            </label>
            <Button
              className="login-form-button"
              type="primary"
              className="login-form-button">Ingresar</Button>
          </FormItem>

          {this.state.error && (
            <p>Los datos no son correctos :(</p>
          )}
        </Form>
      </section>
    )
  }
}));

export default withRouter(Login);
