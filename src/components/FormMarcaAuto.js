import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormMarcaAuto = React.createClass({

  getInitialState: function () {
    return {childSelectValue: undefined};
  },

  handleChange: function (event) {
    this.setState({
      childSelectValue: event.target.value
    })
  },

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Marcas de Carros y Camiones</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form>
          <div className="input-group">

              <SelectInput
                class="input-group-field"
                url="apiAdmin/allRoles"
                name="marcaName"
                value={this.state.childSelectValue}
                onChange={this.handleChange}
              />

              <div className="input-group-button">
                <input type="submit" className="alert button" value="Borrar"/>
              </div>
          </div>

          <div className="input-group">
            <input name="marcaEdit" className="input-group-field" type="text" value={this.state.childSelectValue}/>
            <div className="input-group-button">
              <button type="button" className="success button">Grabar</button>
              <button type="button" className="alert button">Editar</button>
            </div>
          </div>
        </form>
      </div>
    )
    }

    });

    export default FormMarcaAuto;
