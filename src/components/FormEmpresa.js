import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormEmpresa = React.createClass({

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Empresas</h1>
        </div>

        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form>

          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiAdmin/allRoles"
              name="selectEmpresa"
              onUserSelect={this.handleUserSelect}
            />

            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>
          </div>

          <label>Nombre
            <input name="nombre"
                   type="number"
                   placeholder=""
                   required/>
          </label>

          <div className="row">
            <div className="small-3 columns">
              <label>Nit - Consecutivo de identificación
                <input name="nit1"
                       type="number"
                       placeholder=""
                       required/>
              </label>
            </div>
            <div className="small-1 columns">
              <label>Nit - Digito de verificación
                <input name="nit2"
                       type="number"
                       placeholder=""
                       required/>
              </label>
            </div>
          </div>

          <label>Dirección
            <input name="direccion"
                   type="text"
                   placeholder=""/>
          </label>

          <label>Telefono
            <input name="direccion"
                   type="text"
                   placeholder=""/>
          </label>

          <label>Correo electronico
            <input name="email"
                   type="email"
                   placeholder=""/>
          </label>

          <button type="button" className="success button">Grabar</button>
        </form>
      </div>
    )
  }

});

export default FormEmpresa;
