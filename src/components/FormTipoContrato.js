import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormTipoContrato = React.createClass({

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
          <h1>Tipo de Contrato</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form>
          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiAdmin/allRoles"
              name="selectTipoContrato"
              onUserSelect={this.handleUserSelect}
            />

            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>

          </div>

          <div className="input-group">

            <input name="contratoEdit"
                   placeholder="Editar o crear..."
                   className="input-group-field"
                   type="text"
                   onChange={this.onChange}
                   value={this.state.inputValue}/>

            <div className="input-group-button">
              <button type="button" className="success button">Grabar</button>
            </div>
          </div>

        </form>
      </div>
    )
  }

});

export default FormTipoContrato;
