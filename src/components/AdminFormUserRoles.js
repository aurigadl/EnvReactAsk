import React from 'react'
import SelectInput from './SelectInput.js'
import MessageAlert from './MessageAlert.js'
import CheckBoxInputs from './CheckBoxInputs.js'
import {makeRequest as mReq} from '../utils/mrequest';
require('./formsPanels.css');

var AdminFormUserRoles = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      checkBoxSelectToSend: [],
      showMessage: false,
      typeMess: 'success',
      contextText: 'Transaccion exitosa'
    };
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
        console.error('AdminSelectRoles, there was an error!', err.statusText);
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
        <div className="header callout secondary">

          <div className="sign">
            <h1>Usuario Role</h1>
          </div>

          <form onSubmit={this.handleSubmitForm}>
            <label>Usuarios del sistema
              <SelectInput
                url="apiUser/allUser"
                name="usuario"
                onUserSelect={this.handleUserSelect}
              />
            </label>

            <label>Perfiles de acceso
              <CheckBoxInputs
                url="apiAdmin/allRoles"
                ck_name="roles"
                idsCheckSelected={this.state.childSelectValue}
              />
            </label>

            <div className="row">
              <div className="shrink columns">
                <input type="submit" className="success button" value="Grabar"/>
              </div>
              <div className="columns">
                <MessageAlert
                  showHide={this.state.showMessage}
                  type={this.state.typeMess}
                  contextText={this.state.contextText}
                  onclickMessage={this.onClickMessage}
                />
              </div>
            </div>
          </form>
        </div>
      )
    }
  });

export default AdminFormUserRoles;
