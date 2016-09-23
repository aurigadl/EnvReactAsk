import React from 'react'
import AdminFormUserRoles from './AdminFormUserRoles.js'
import AdminFormUser from './AdminFormUser.js'

const PageOne = React.createClass({

  getInitialState: function () {
    return {
      newOption: false
    }
  },

  handleNewElement: function (newValue) {
    if (newValue !== this.state.newOption){
      this.setState({
        newOption: newValue
      });
    }
  },


  render: function(){
    return (
    <div className="row">
      <div className="small-12 large-expand columns">
        <AdminFormUser
          onItemNew={this.handleNewElement}
        />
      </div>
      <div className="small-12 large-expand columns">
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
