import React from 'react'
import SelectInput from './SelectInput.js'
import CheckBoxInputs from './CheckBoxInputs.js'
import {makeRequest as mReq} from '../utils/mrequest';
require('./formsPanels.css');

var AdminFormUserRoles = React.createClass({

  getInitialState: function(){
    return {
      childSelectValue: undefined
    };
  },

  handleUserSelect: function (childSelectValue) {
    console.log(childSelectValue);
    var params = {'id': childSelectValue};
    var jsonData = {'params': params};
    this.getRemoteData(jsonData, 'apiAdmin/idUserRole');
  },

  getRemoteData: function (jsonData, url) {
    var parreq = {
      method: 'GET',
      url: url,
      params: jsonData
    };

    mReq(parreq)
      .then(function (response) {
        this.successHandler(response.result)
      }.bind(this))
      .catch(function (err) {
        console.error('AdminSelectRoles, there was an error!', err.statusText);
      });
  },

  successHandler: function (data) {
    var arrayData = [];
    arrayData.push(<option key='' value=''></option>);
    for (var i = 0; i < data.length; i++) {
      var option = data[i];
      arrayData.push(
        <option key={i} value={option.id}>{option.nomb}</option>
      );
    }
    this.setState({options: arrayData})
  },


  render: function() {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Usuario Role</h1>
        </div>

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
          />
        </label>

        <button type="button" className="success button">Grabar</button>

      </div>
    )
  }

});

export default AdminFormUserRoles
