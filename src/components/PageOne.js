import React from 'react'
import AdminFormUsersCrud from './AdminFormUsersCrud.js'
import AdminFormUserRoles from './AdminFormUserRoles.js'

const PageOne = React.createClass({
  render: function(){
    return (
      <div className="row">
        <div className="large-4 columns">
          <AdminFormUsersCrud />
        </div>
        <div className="large-4 columns">
          <AdminFormUserRoles />
        </div>
      </div>
    );
  }
});

export default PageOne
