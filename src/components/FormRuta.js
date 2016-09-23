import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormRuta = React.createClass({

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
          <h1>Rutas</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form>
          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiAdmin/allRoles"
              name="selectRuta"
              onUserSelect={this.handleUserSelect}
            />

            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>
          </div>

          <div className="input-group">

            <textarea name="rutaEdit"
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

export default FormRuta;
