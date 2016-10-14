import React from 'react'
require('./formsPanels.css');
import MessageAlert from './MessageAlert.js'
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

          <div className="row">
            <div className="small-2 columns">
              <label>&nbsp;&nbsp;</label>
              <a href="#" className="button"><i className="fi-plus"></i></a>
            </div>
            <div className="small-10 columns">
              <label>Carro</label>
              <SelectInput
                url="apiAdmin/allRoles"
                name="carro"
                onUserSelect={this.handleUserSelect}
              />
            </div>
          </div>

          <div className="row">
            <div className="small-2 columns">
              <label>&nbsp;&nbsp;</label>
              <a href="#" className="button"><i className="fi-minus"></i></a>
            </div>

            <div className="small-6 columns">
              <label> Persona
                <SelectInput
                  className="input-group-field"
                  url="apiFuec/allPerson"
                  name="selectPersonaCarro"
                  onUserSelect={this.handleUserSelect}
                />
              </label>
            </div>

            <div className="small-4 columns">
              <label> Modalidad
                <SelectInput
                  url="apiFuec/allModality"
                  name="selectModalidad"
                  onUserSelect={this.handleUserSelect}
                />
              </label>
            </div>

          </div>

          <div className="row">
            <div className="shrink columns">
              <input type="submit" className="success button" value="Grabar"/>
            </div>
            <div className="columns">
              <MessageAlert
                showHide={this.state.showMessage}
                type={this.state.typeMess}
                contextText={this.state.contextText}
                onclickMessage={this.onClickMessage}
              />
            </div>
          </div>

        </form>
      </div>
    )
  }

});

export default FormPersonaCarro;