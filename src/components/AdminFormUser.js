import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var AdminFormUser = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: []
    };
  },

  handleUserSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiAdmin/idUser',
        params: params
      };
      this.getRemoteData(parreq, this.successHandler);
    }else{
      this.setState({childSelectValue: []})
    }
  },

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Marcas de Carros y Camiones</h1>
        </div>
        <p>Selecciona un Usuario para editarlo
          o llena los campos sin seleccionar elemento
          para crear uno nuevo</p>

        <fo1rm>

          <label>Usuarios del sistema</label>

          <SelectInput
            class="input-group-field"
            url="apiUser/allUser"
            name="usuario"
            onUserSelect={this.handleUserSelect}
          />

          <label>Correo Electronico
            <input type="email" name="email" placeholder="Correo Electronico" />
          </label>

          <label>Contraseña
            <input type="password" name="password1" aria-describedby="passwordHelpText" />
          </label>
          <p className="help-text" id="passwordHelpText">La contraseña debe contener minimo 7 caracteres.</p>

          <label>Confirmar contraseña
            <input type="password" name="password2"/>
          </label>

          <label>Nombres
            <input type="text" placeholder="Nombres para el usuario" />
          </label>

          <label>Apellidos
            <input type="text" placeholder="Apellidos para el usuario" />
          </label>

          <input id="checkbox1" type="checkbox" name="active" /><label>Activo</label>
          <input id="checkbox2" type="checkbox" name="new_user" /><label>Nuevo</label>

          <button type="button" className="success button">Grabar</button>
        </fo1rm>
      </div>
    )
  }
});

export default AdminFormUser;
