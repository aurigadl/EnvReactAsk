import React from 'react'
import FormRuta from './FormRuta.js'
import FormCarro from './FormCarro.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import FormTipoContrato from './FormTipoContrato.js'

const PageTwo = React.createClass({

  getInitialState: function () {
    return {
      newOptionPerson: false,
      newOptionMarca:false,
      newOptionRuta:false
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
      <div className="row small-up-1 medium-up-2 large-up-3">
        
        <div className="columns">
          <FormTipoContrato />
        </div>
        
        <div className="columns">
          <FormPersonaCarro
            newOptionPerson={this.state.newOptionPerson}
            onItemNewPerson={this.handleNewElementPerson}
          />
        </div>
        
        <div className="columns">
          <FormRuta
            onItemNew={this.handleNewElementRuta}
          />
        </div>
        
        <div className="columns">
          <FormMarcaAuto
            onItemNew={this.handleNewElementMarca}
          />
        </div>

        <div className="columns">
          <FormCarro
            newOptionMarca={this.state.newOptionMarca}
            onItemNewMarca={this.handleNewElementMarca}
          />
        </div>
        
        <div className="columns">
          <FormContrato
            newOptionRuta={this.state.newOptionRuta}
            onItemNewRuta={this.handleNewElementRuta}
          />
        </div>
        
        <div className="columns">
          <FormPersona
            onItemNew={this.handleNewElementPerson}
          />
        </div>
      </div>
    );
  }
});

export default PageTwo
