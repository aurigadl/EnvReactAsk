import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormPersona = React.createClass({

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Personas</h1>
        </div>

        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form>
          <div className="input-group">
            <SelectInput
              class="input-group-field"
              url="apiAdmin/allRoles"
              name="selectPersona"
              onUserSelect={this.handleUserSelect}
            />
            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>
          </div>

          <label> Modalidad
            <input name="tipoMod" type="text" placeholder=""/>
          </label>
          <label> Nombre
            <input name="autoPlaca" type="text" placeholder=""/>
          </label>
          <label> Apellido
            <input type="text" placeholder=""/>
          </label>
          <label> Cedula
            <input type="text" placeholder=""/>
          </label>
          <label> Licencia
            <input type="text" placeholder=""/>
          </label>
          <label> Vigencia
            <input type="text" placeholder=""/>
          </label>
          <label> Telefono
            <input type="text" placeholder=""/>
          </label>
          <label> Dirección
            <input type="text" placeholder=""/>
          </label>
          <button type="button" className="success button">Grabar</button>
        </form>
      </div>
    )
  }

});

export default FormPersona;