import React from 'react'
import AdminFormConductor from './AdminFormConductor.js'
import FormMarcaAuto from './FormMarcaAuto.js'

const PageTwo = React.createClass({
  render: function(){
    return (
    <div className="row">
      <div className="large-7 columns">
        <FormMarcaAuto />
      </div>
      <div className="large-5 columns">
        <AdminFormConductor />
      </div>
    </div>
    );
  }
});

export default PageTwo
