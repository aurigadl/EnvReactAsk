import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
import { message} from 'antd';
import {Checkbox ,Card, Form , Input , Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var AdminFormUser = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: [],
      newOptionSelectA: false,

      active: false,
      email: undefined,
      first_name: undefined,
      last_name: undefined,
      display_name: undefined,
      new_user: false,

      showHide: false
    };
  },

  handleUserSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiUser/idUser',
        params: params
      };
      this.getRemoteData(parreq, this.successHandlerSelect, this.errorHandlerSelect);
    } else {
      this.setState({
        first_name: undefined,
        last_name: undefined,
        new_user: false,
        active: false,
        email: undefined,
        display_name: undefined,
        showHide: false
      });
      this.refs.first_name.value = '';
      this.refs.last_name.value = '';
      this.refs.email.value = '';
      this.refs.display_name = '';
    }
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('AdminFormUser, there was an error!', err.statusText);
      });
  },

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    var email = (data.email) ? data.email : undefined;
    var first_name = (data.first_name) ? data.first_name : undefined;
    var last_name = (data.last_name) ? data.last_name : undefined;
    this.setState({
      first_name: first_name,
      last_name: last_name,
      new_user: data.new_user,
      active: data.active,
      email: email,
      display_name: data.display_name,
      showHide: true
    });
  },

  errorHandlerSelect: function(remoteData){
    message.error('Conexion rechazada', 10)
  },

  clickNewUser: function () {
    this.setState({
      new_user: !this.state.new_user
    });
  },

  clickActive: function () {
    this.setState({
      active: !this.state.active
    });
  },

  onChangeInputEmail: function (e) {
    if (!this.state.showHide) {
      this.setState({
        email: e.target.value
      });
    }
  },

  onChangeInputFirstName: function (e) {
    this.setState({
      first_name: e.target.value
    });
  },

  onChangeInputLastName: function (e) {
    this.setState({
      last_name: e.target.value
    });
  },

  onChangeInputDisplayName: function (e) {
    this.setState({
      display_name: e.target.value
    });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;
    var user = ref.user.value;
    var email = ref.email.value;
    var first_name = ref.first_name.value;
    var last_name = ref.last_name.value;
    var active = ref.active.checked;
    var display_name = ref.display_name.value;
    var new_user = ref.new_user.checked;

    if (user === "") {
      var params = {
        email: email,
        first_name: first_name,
        last_name: last_name,
        display_name: display_name
      };

      var parreq = {
        method: 'POST',
        url: 'apiUser/newuser',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      var params = {
        id: user,
        email: email,
        first_name: first_name,
        last_name: last_name,
        active: active,
        display_name: display_name,
        new_user: new_user
      };

      var parreq = {
        method: 'PUT',
        url: 'apiUser/updateIdUser',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormUpdate,
        this.errorFormUpdate
      );
    }
  },

  successFormCreate: function (data){
    message.success('Se creo el usuario', 10);
    this.props.onItemNew(true);
  },

  errorFormCreate: function (err){
    message.error('No se creo el usuario',10);
  },

  successFormUpdate: function (data){
    message.success('Se actulizo el usuario', 10);
  },

  errorFormUpdate: function (err){
    message.error('No se actualizo el usuario',10);
  },


  handleReset: function (e) {
    this.setState({
      first_name: undefined,
      last_name: undefined,
      new_user: false,
      active: false,
      email: undefined,
      display_name: undefined
    });
  },

  render: function () {

    var showClass = this.state.showHide ? 'show' : 'invisible';

    return (
        <Card id={this.props.id} title="Usuarios del sistema" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>

              <FormItem label="Usuarios Existentes" >
                <SelectInput
                  class="input-group-field"
                  url="apiUser/allUser"
                  name="user"
                  newOption={this.state.newOptionSelectA}
                  onUserSelect={this.handleUserSelect}
                />
              </FormItem>

              <FormItem label="Correo Electronico" >
                <Input
                  type="email"
                  name="email"
                  ref="email"
                  value={this.state.email || ""}
                  aria-describedby="emailHelpText"
                  placeholder="Correo Electronico"
                  onChange={this.onChangeInputEmail}
                  required
                />
                <div className={"ant-form-extra" + showClass}>No modificable.</div>
              </FormItem>

              <FormItem label="Nombres" >
                <Input
                  type="text"
                  name="first_name"
                  ref="first_name"
                  value={this.state.first_name || ""}
                  onChange={this.onChangeInputFirstName}
                  placeholder="Nombres para el usuario"
                  required
                />
              </FormItem>

              <FormItem label="Apellidos" >
                <Input
                  type="text"
                  name="last_name"
                  ref="last_name"
                  value={this.state.last_name || ""}
                  onChange={this.onChangeInputLastName}
                  placeholder="Apellidos para el usuario"
                />
              </FormItem>

              <FormItem label="Nombre a mostrar" >
                <Input
                  type="text"
                  name="display_name"
                  ref="display_name"
                  value={this.state.display_name || ""}
                  onChange={this.onChangeInputDisplayName}
                  placeholder="Un alias o el mismo nombre"
                  required
                />
              </FormItem>

              <FormItem>
                <Checkbox
                  onChange={this.clickActive}>
                  Estado
                </Checkbox>
                <Checkbox
                  onChange={this.clickNewUser}>
                  Usuario Nuevo
                </Checkbox>
              </FormItem>

              <FormItem>
                <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
              </FormItem>

            </Row>
          </Form>
        </Card>
    )
  }
});

export default AdminFormUser;
