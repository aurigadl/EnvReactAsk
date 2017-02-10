import React from 'react'
import {withRouter} from 'react-router'
import auth from '../utils/auth.js'
import {Form, Icon, Input, Button, Row, Col} from 'antd';
import css from './login.less';
import bg from '../../server/static/bg.jpg'
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
    var email, pass, pass_c;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        email = values.email;
        pass = values.pass;

        if (this.state.showHide) {
          pass_c = values.pass_c;
        }
      }
    });

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

    const {getFieldDecorator} = this.props.form;
    var showClass = this.state.showHide ? null : 'is-hidden';

    return (
      <Row id="main">
        <div id="bg">
          <img src={bg} alt=""/>
        </div>
        <section>
          <Form onSubmit={this.handleSubmit} className="ant-form login-form">
            <h1>Ingreso</h1>
            <FormItem>
              {getFieldDecorator('email', {
                initialValue: "admon@mi.co",
                rules: [{required: true, message: 'Ingresa un usurio!'}],
              })(
                <Input
                  addonBefore={<Icon type="user" />}
                  type="text"
                  placeholder="micorreo@ejemplo.com"
                  required/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('pass', {
                initialValue: "Abcd1234",
                rules: [{required: true, message: 'Ingresa una contraseña!'}],
              })(
                <Input
                  addonBefore={<Icon type="lock" />}
                  aria-describedby="pass"
                  pattern="(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$"
                  type="password"
                  placeholder="Contraseña"
                  required/>
              )}
            </FormItem>

            <div className="ant-form-extra">Contraseña minimo 8 caracteres y debe contener
              mayusculas, minusculas y numeros.
            </div>

            { this.state.showResults ?
              <FormItem className={showClass}>
                {getFieldDecorator('passw', {
                  initialValue: "Abcd1234",
                  rules: [{message: 'Ingresa nuevamente la contraseña!'}],
                })(
                  <Input
                    addonBefore={<Icon type="lock" />}
                    pattern="(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$"
                    type="password"
                    placeholder="Contraseña"/>
                )}
                <div className="ant-form-extra">Repetir nueva Contraseña</div>
              </FormItem> : null }

            <Button
              className="login-form-button"
              type="primary"
              htmlType="submit"
              className="login-form-button">Ingresar</Button>
            {this.state.error && (
              <p>Los datos no son correctos :(</p>
            )}

          </Form>
          <article>
            <h2>Un numero</h2>
            <p>En esta seccion estaran los numero y las lineas de soporte</p>
          </article>
        </section>
        
        <aside>
        </aside>

      </Row>
    )
  }
}));

export default withRouter(Login);
