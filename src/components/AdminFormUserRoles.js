import React from 'react'
import SelectInput from './SelectInput.js'
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

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Usuario Role</h1>
        </div>

        <SelectInput
          url="apiUser/allUser"
          name="Usuario"
          value={this.state.childSelectValue}
          onChange={this.changeHandler}
        />

      </div>
    )
  }

});

export default AdminFormUserRoles
