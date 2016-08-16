import React from 'react'
import SelectInput from './SelectInput.js'

var AdminFormUsersCrud = React.createClass({

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
      <div>

        <SelectInput
          url="apiAdmin/allRoles"
          name="admin_roles"
          value={this.state.childSelectValue}
          onChange={this.changeHandler}
        />

        <h1>.!.(- -) (o)(o)  </h1>

      </div>
    )
  }

});

export default AdminFormUsersCrud
