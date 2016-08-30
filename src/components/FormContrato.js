import React from 'react'
require('./formsPanels.css');

var AdminFormConductor = React.createClass({

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Contrato</h1>
        </div>
        <form>
          <label>No. Planilla
            <input name="autoPlaca" type="text" placeholder=""/>
          </label>
          <label>Contrato
            <input type="text" placeholder=""/>
          </label>
          <label>Persona Contratante
            <input type="text" placeholder=""/>
          </label>
          <label>Nit
            <input type="text" placeholder=""/>
          </label>
          <label>Objeto
            <input type="text" placeholder=""/>
          </label>
          <label>Origen destino
            <input type="text" placeholder=""/>
          </label>
          <label>Convenio
            <input type="text" placeholder=""/>
          </label>
          <label>Consorcio
            <input type="text" placeholder=""/>
          </label>
          <label>Temporal
            <input type="text" placeholder=""/>
          </label>
          <label>Fecha Inicial
            <input type="text" placeholder=""/>
          </label>
          <label>Fecha Final
            <input type="text" placeholder=""/>
          </label>
          <button type="button" className="success button">Grabar</button>
        </form>
      </div>
    )
  }

});

export default AdminFormConductor;
