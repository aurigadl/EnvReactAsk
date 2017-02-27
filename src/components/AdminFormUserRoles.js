import React from 'react'
import SelectInput from './SelectInput.js'
import CheckBoxInputs from './CheckBoxInputs.js'
import {makeRequest as mReq} from '../utils/mrequest';

import {Card , Form , Input , Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;


var AdminFormUserRoles = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      newOptionSelectA: false,
      checkBoxSelectToSend: [],

      showMessage: false,
      typeMess: 'success',
      contextText: 'Transaccion exitosa'
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOption;
    var prev = this.props.newOption;
    if ( next == true  && next != prev){
      this.setState({
        newOptionSelectA: true
      });
      this.props.onItemNew(false);
    }
    if ( next == false  && next != prev){
      this.setState({
        newOptionSelectA: false
      });
    }
  },

  handleUserSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiAdmin/idUserRole',
        params: params
      };
      this.getRemoteData(parreq, this.successHandler);
    }else{
      this.setState({childSelectValue: []})
    }
  },

  getRemoteData: function (parreq, cb) {
    mReq(parreq)
      .then(function (response) {
        cb(response.result)
      }.bind(this))
      .catch(function (err) {
        console.log('AdminSelectRoles, there was an error!', err.statusText);
      });
  },

  successHandler: function (data) {
    var arrayData = [];
    for (var i = 0; i < data.length; i++) {
      arrayData.push(data[i].role_id);
    }
    this.setState({childSelectValue: arrayData})
  },

  successForm: function (data) {
    this.setState({
      showMessage: true,
      contextText: 'Se grabaron los roles del usuario'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: ''
      })
    }.bind(this), 3000);
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;
    var user = ref.usuario.value;
    var roles = [];
    ref.roles.forEach(
      function (a) {
        if (a.checked) {
          roles.push(a.value);
        }
      }
    );

    var params = {
      'role_id': roles,
      'user_id': user
    };

    var parreq = {
      method: 'PUT',
      url: 'apiAdmin/setUserRole',
      params: {'params': params}
    };

    if (user.length) {
      this.getRemoteData(parreq, this.successForm);
    }
  },

  onClickMessage: function(event) {
    this.setState({
      showMessage: false,
      contextText: ''
    })
  },

  render: function () {
    return (
        <Card id={this.props.id} title="Usuarios y Roles" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>

              <FormItem label="Usuarios Existentes" >
                <SelectInput
                  class="input-group-field"
                  url="apiUser/allUser"
                  name="usuario"
                  newOption={this.state.newOptionSelectA}
                  onUserSelect={this.handleUserSelect}
                />
              </FormItem>

              <FormItem label="Perfiles de acceso" >
                <CheckBoxInputs
                  url="apiAdmin/allRoles"
                  ck_name="roles"
                  idsCheckSelected={this.state.childSelectValue}
                />
              </FormItem>

              <FormItem>
                <Button type="primary" htmlType="submit" size="large">Grabar</Button>
              </FormItem>
            </Row>
          </Form>
        </Card>
     )
  }
  });

export default AdminFormUserRoles;
