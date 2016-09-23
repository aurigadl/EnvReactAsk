import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var AdminFormConductor = React.createClass({

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Contrato</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>


        <form>

          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiAdmin/allRoles"
              name="selectContrato"
              onUserSelect={this.handleUserSelect}
            />

            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>

          </div>

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
