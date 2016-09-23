import React from 'react'
import FormRuta from './FormRuta.js'
import FormCarro from './FormCarro.js'
import FormPersona from './FormPersona.js'
import FormEmpresa from './FormEmpresa.js'
import FormContrato from './FormContrato.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import FormTipoContrato from './FormTipoContrato.js'

const PageTwo = React.createClass({
  render: function () {
    return (
      <div>
        <div className="row">
          <div className="small-4 columns">
            <FormTipoContrato />
          </div>
          <div className="small-4 columns">
            <FormPersonaCarro />
          </div>
        </div>
        <div className="row">
          <div className="small-4 columns">
            <FormRuta />
          </div>
          <div className="small-4 columns">
            <FormEmpresa />
          </div>
          <div className="small-4 columns">
            <FormMarcaAuto />
          </div>
        </div>
        <div className="row">
          <div className="small-4 columns">
            <FormCarro />
          </div>
          <div className="small-4 columns">
            <FormContrato />
          </div>
          <div className="small-4 columns">
            <FormPersona />
          </div>
        </div>
      </div>
    );
  }
});

export default PageTwo
