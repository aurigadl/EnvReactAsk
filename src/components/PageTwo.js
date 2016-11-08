import React from 'react'
import FormRuta from './FormRuta.js'
import FormCarro from './FormCarro.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import FormPersonaCarro from './FormPersonaCarro.js'
require('./formsPanels.css');

const PageTwo = React.createClass({

  getInitialState: function () {
    return {
      newOptionPerson: false,
      newOptionCar: false,
      newOptionMarca: false,
      newOptionRuta: false
    }
  },

  handleNewElementCar: function (newValue) {
    if (newValue !== this.state.newOptionCar) {
      this.setState({
        newOptionCar: newValue
      });
    }
  },

  handleNewElementPerson: function (newValue) {
    if (newValue !== this.state.newOptionPerson) {
      this.setState({
        newOptionPerson: newValue
      });
    }
  },

  handleNewElementMarca: function (newValue) {
    if (newValue !== this.state.newOptionMarca) {
      this.setState({
        newOptionMarca: newValue
      });
    }
  },

  handleNewElementRuta: function (newValue) {
    if (newValue !== this.state.newOptionRuta) {
      this.setState({
        newOptionRuta: newValue
      });
    }
  },

  render: function () {
    return (
      <div className="row">
        <div className="columns small-12 medium-9 large-6">
          <div className="header callout secondary">

            <div className="sign">
              <h1>Formato Único De Extracto Del Contrato Del Servicio Público De
                Transporte Terrestre Automotor Especial</h1>
            </div>

            <form onSubmit={this.handleSubmitFuec}>

              <label>No. FUEC
                <input
                  name="no"
                  type="text"
                  readOnly/>
              </label>

              <label>Razón social:
                <input
                  name="social_object"
                  type="text"
                  readOnly/>
              </label>

              <label>Nit:
                <input
                  name="nit"
                  type="text"
                  readOnly/>
              </label>

              <label>No. Contrato:
                <input
                  name="agreement"
                  type="text"
                  readOnly/>
              </label>

              <label>Contratante:
                <input
                  name="contractor"
                  type="text"
                  readOnly/>
              </label>

              <label>Objeto del contrato:
                <input
                  name="agreement_object"
                  type="text"
                  readOnly/>
              </label>

              <label>Origen Destino:
                <input
                  name="agreement_object"
                  type="text"
                  readOnly/>
              </label>

              <label>Contrato:
                <input
                  name="agreement"
                  type="text"
                  readOnly/>
              </label>

              <label>Vehiculo:
                <input
                  name="car"
                  type="text"
                  readOnly/>
              </label>

            </form>
          </div>
        </div>

        <div className="columns small-12 medium-3">
          <FormPersonaCarro
            newOptionPerson={this.state.newOptionPerson}
            onItemNewPerson={this.handleNewElementPerson}
            newOptionCar={this.state.newOptionCar}
            onItemNewCar={this.handleNewElementCar}
          />
        </div>

        <div className="columns small-12 medium-3">
          <FormRuta
            onItemNew={this.handleNewElementRuta}
          />
        </div>

        <div className="columns small-12 medium-3">
          <FormMarcaAuto
            onItemNew={this.handleNewElementMarca}
          />
        </div>

        <div className="columns small-12 medium-3">
          <FormCarro
            newOptionMarca={this.state.newOptionMarca}
            onItemNewMarca={this.handleNewElementMarca}
            onItemNewCar={this.handleNewElementCar}
          />
        </div>

        <div className="columns small-12 medium-3">
          <FormContrato
            newOptionRuta={this.state.newOptionRuta}
            onItemNewRuta={this.handleNewElementRuta}
          />
        </div>

        <div className="columns small-12 medium-3">
          <FormPersona
            onItemNew={this.handleNewElementPerson}
          />
        </div>

      </div>
    );
  }
});

export default PageTwo