import React from 'react'
import AdminFormUsersCrud from './AdminFormUsersCrud.js'

const PageOne = React.createClass({
  getInitialState: function() {
    return {value: 'Hello .!. '};
  },

  handleChange: function(event) {
    this.setState({value: event.target.value.substr(0, 140)});
  },

  render: function(){
    return (
      <div>
        <AdminFormUsersCrud />
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }

});

export default PageOne
