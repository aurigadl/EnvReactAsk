import React from 'react'
import SelectInput from './SelectInput.js'
import CheckBoxInputs from './CheckBoxInputs.js'
require('./formsPanels.css');

var AdminFormUserRoles = React.createClass({

  getInitialState: function() {
    return {
      childSelectValue: undefined
    }
  },

  changeHandler: function(e) {
    this.setState({
      childSelectValue: e.target.value
    })
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
            value={this.state.childSelectValue}
            onChange={this.changeHandler}
          />
        </label>

        <label>Perfiles de acceso
          <CheckBoxInputs
            url="apiAdmin/allRoles"
            ck_name="Roles"
          />
        </label>

      </div>
    )
  }

});

export default AdminFormUserRoles
