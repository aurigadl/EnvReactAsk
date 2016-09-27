import React from 'react'
import AdminFormUserRoles from './AdminFormUserRoles.js'
import AdminFormUser from './AdminFormUser.js'
import AdminFormEmpresa from './AdminFormEmpresa.js'

const PageOne = React.createClass({

  getInitialState: function () {
    return {
      newOption: false
    }
  },

  handleNewElement: function (newValue) {
    if (newValue !== this.state.newOption) {
      this.setState({
        newOption: newValue
      });
    }
  },

  render: function () {
    return (
      <div className="row small-up-1 medium-up-2 large-up-3">
        <div className="columns">
          <AdminFormEmpresa/>
        </div>
        <div className="columns">
          <AdminFormUser
            onItemNew={this.handleNewElement}
          />
        </div>
        <div className="columns">
          <AdminFormUserRoles
            newOption={this.state.newOption}
            onItemNew={this.handleNewElement}
          />
        </div>
      </div>
    );
  }

});

export default PageOne