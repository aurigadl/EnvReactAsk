import React from 'react'
import {withRouter} from 'react-router'
import auth from '../utils/auth.js'
import { Form, Icon, Input, Button, Row  } from 'antd';
import css from './login.less';
import bg from '../../server/static/bg.jpg'

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Login = Form.create()(React.createClass({

  getInitialState() {
    return {
      error: false,
      showHide: false
    }
  },

  componentDidMount: function () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var email, pass, pass_c = null;

    if (this.state.showHide) {
       pass_c = this.props.form.getFieldValue('passw');
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        email = values.email;
        pass = values.pass;

        auth.login(email, pass, pass_c, (result) => {
          if (result.error != null && result.error.status === 423) {
            this.setState({showHide: true});
            this.props.form.setFieldsValue({
              passw : '',
              pass  : '',
            });
          }
          if (!result.authenticated)
            this.setState({error: true});

          const {location} = this.props;

          if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
          } else {
            this.props.router.replace('/')
          }
        })

      }
    });
  },

  render() {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched  } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    var passw, error, text = null;

    if(this.state.error){
      error = <p>Datos no son correctos</p>;
    };

    if (this.state.showHide){
      passw = <FormItem extra="Contraseña minimo 8 caracteres y debe contener
              mayusculas, minusculas y numeros.">
                {getFieldDecorator('passw', {
                   rules: [{
                    required: true,
                    pattern:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/,
                    message: 'Ingresa nuevamente la contraseña!'
                   }],
                })(
                  <Input
                    addonBefore={<Icon type="lock" />}
                    type="password"
                    placeholder="Contraseña"/>
                )}
              </FormItem>;
      text = "Cambio de contraseña"
    };

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
                rules: [{required: true,
                         type:'email',
                         message: 'Ingresa un usuario!'}],
              })(
                <Input
                  addonBefore={<Icon type="user" />}
                  type="text"
                  placeholder="micorreo@ejemplo.com" />
              )}
            </FormItem>

            <FormItem  extra={text}>
              {getFieldDecorator('pass', {
                initialValue: "Abcd1234",
                rules: [{ required: true,
                          message: 'Ingresa una contraseña!',
                          pattern:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/,
                        }],
              })(
                <Input
                  addonBefore={<Icon type="lock" />}
                  type="password"
                  placeholder="Contraseña"/>
              )}
            </FormItem>
            {passw}

            <Button
              className="login-form-button"
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
              className="login-form-button">Ingresar</Button>

            {error}

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
