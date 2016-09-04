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
    if(childSelectValue != 0){
      var params = {'id': childSelectValue};
      this.getRemoteData(params, 'apiAdmin/idUserRole');
    }
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
    for (var i = 0; i < data.length; i++) {
      arrayData.push(data[i].role_id);
    }
    this.setState({childSelectValue: arrayData})
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    // TODO: send request to the server
    this.setState({author: '', text: ''});
  },

  render: function() {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Usuario Role</h1>
        </div>

        <div class="callout secondary">
          <h5>This is a secondary callout</h5>
          <p>It has an easy to override visual style, and is appropriately subdued.</p>
          <a href="#">It's dangerous to go alone, take this.</a>
        </div>

        <form onSubmit={this.handleSubmit}>
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

          <input type="submit" className="success button" value="Grabar"/>
        </form>
      </div>
    )
  }

});

export default AdminFormUserRoles
