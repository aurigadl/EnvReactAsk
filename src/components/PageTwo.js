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
      <div className="row small-up-1 medium-up-2 large-up-3">
        <div className="columns">
          <FormTipoContrato />
        </div>
        <div className="columns">
          <FormPersonaCarro />
        </div>
        <div className="columns">
          <FormRuta />
        </div>
        <div className="columns">
          <FormEmpresa />
        </div>
        <div className="columns">
          <FormMarcaAuto />
        </div>

        <div className="columns">
          <FormCarro />
        </div>
        <div className="columns">
          <FormContrato />
        </div>
        <div className="columns">
          <FormPersona />
        </div>
      </div>
    );
  }
});

export default PageTwo
