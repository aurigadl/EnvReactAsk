import React from 'react'
import AdminFormUserRoles from './AdminFormUserRoles.js'
import AdminFormUser from './AdminFormUser.js'

const PageOne = React.createClass({
  render: function(){
    return (
    <div className="row">
      <div className="small-12 large-expand columns">
        <AdminFormUser />
      </div>
      <div className="small-12 large-expand columns">
        <AdminFormUserRoles />
      </div>
    </div>
    );
  }
});

export default PageOne
