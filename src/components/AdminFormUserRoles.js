import React from 'react'
import SelectInput from './SelectInput.js'
import CheckBoxInputs from './CheckBoxInputs.js'
import {makeRequest as mReq} from '../utils/mrequest';
require('./formsPanels.css');

var AdminFormUserRoles = React.createClass({

  getInitialState: function(){
    return {
      childSelectValue: undefined,
      checkBoxSelectToSend: []
    };
  },

  handleUserSelect: function (childSelectValue) {
    if(childSelectValue != 0){
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiAdmin/idUserRole',
        params: params
      };
      this.getRemoteData(parreq, this.successHandler);
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

  handleUserCheckbox: function (checkValue) {
    this.setState({
      checkBoxSelectToSend: checkValue
    });
  },

  handleSubmitForm: function(e) {
    e.preventDefault();
    var params = {'id': childSelectValue};
    var parreq = {
      method: 'PUT',
      url: 'apiAdmin/setUserRole',
      params: params
    };
    this.getRemoteData(parreq, this.successHandler);
  },

  render: function() {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Usuario Role</h1>
        </div>

        <form onSubmit={this.handleSubmitForm}>
          <label>Usuarios del sistema
            <SelectInput
              url="apiUser/allUser"
              name="Usuario"
              onUserSelect={this.handleUserSelect}
            />
          </label>

          <label>Perfiles de acceso
            <CheckBoxInputs
              url="apiAdmin/allRoles"
              ck_name="Roles"
              idsCheckSelected={this.state.childSelectValue}
              onUserCheckbox={this.handleUserCheckbox}
            />
          </label>

          <input type="submit" className="success button" value="Grabar"/>
        </form>
      </div>
    )
  }

});

export default AdminFormUserRoles
