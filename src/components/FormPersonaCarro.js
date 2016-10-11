import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormPersonaCarro = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      inputValue: ''
    };
  },

  handleUserSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      inputValue: childSelectText
    });
  },

  onChange(e) {
    this.setState({inputValue: e.target.value});
  },

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Personas de Carros y Camiones</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form>

          <SelectInput
            url="apiAdmin/allRoles"
            name="carro"
            onUserSelect={this.handleUserSelect}
          />

          <div>

            <SelectInput
              class="input-group-field"
              url="apiAdmin/allRoles"
              name="selectPersonaCarro"
              onUserSelect={this.handleUserSelect}
            />

            <SelectInput
              url="apiFuec/allModality"
              name="selectModalidad"
              onUserSelect={this.handleUserSelect}
            />

          </div>

          <button type="button" className="success button">Grabar</button>

        </form>
      </div>
    )
  }

});

export default FormPersonaCarro;