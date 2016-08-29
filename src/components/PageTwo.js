import React from 'react'
import FormConductor from './FormConductor.js'
import FormContrato from './FormContrato.js'
import FormPersona from './FormPersona.js'
import FormMarcaAuto from './FormMarcaAuto.js'



const PageTwo = React.createClass({
  render: function(){
    return (
    <div className="row">
      <div className="row">
        <div className="large-4 columns">
          <FormMarcaAuto />
        </div>
        <div className="large-4 columns">
          <FormConductor />
        </div>
        <div className="large-4 columns">
          <FormContrato />
        </div>
      </div>
      <div className="row">
        <div className="large-4 columns">
          <FormPersona />
        </div>
        <div className="large-4 columns">
        </div>
        <div className="large-4 columns">
        </div>
      </div>
    </div>
    );
  }
});

export default PageTwo
