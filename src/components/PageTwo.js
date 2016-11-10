import React from 'react'
import FormRuta from './FormRuta.js'
import FormCarro from './FormCarro.js'
import SelectInput from './SelectInput.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import MessageAlert from './MessageAlert.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import {makeRequest as mReq} from '../utils/mrequest';
require('./formsPanels.css');

const PageTwo = React.createClass({

  getInitialState: function () {
    return {
      newOptionPerson: false,
      newOptionCar: false,
      newOptionMarca: false,
      newOptionRuta: false,
      newOptionAgreement: false,

      no_agreefuec:'',
      no_sec: '',
      no_fuec:'',
      id_company_legal:'',
      option: [],

      showMessage: false,
      typeMess: '',
      contextText: ''
    }
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('AdminFormUser, there was an error!', err.statusText);
      });
  },

  componentDidMount: function () {
    var parreq = {
      method: 'GET',
      url: 'apiSystem/allSystem'
    };
    this.getRemoteData(parreq
      , this.successHandlerSelect
      , this.errorHandlerSelect);
  },


  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    var d = new Date();
    var n = d.getFullYear();
    var id_company_legal = data.id_company_legal.toString();
    var no_sec = data.secuence_contract.toString();


    this.setState({
      id_company_legal: id_company_legal,
      no_sec: no_sec,
      no_fuec: id_company_legal + no_sec
    });

    this.refs.no_car.value = (data.no_car) ? data.no_car : undefined;
  },

  errorHandlerSelect: function (remoteData) {
    this.setState({
      showMessage: true,
      contextText: 'Conexion rechazada',
      typeMess: 'alert'
    });
    setTimeout(function () {
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
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

  handleNewAgreement: function (newValue) {
    if (newValue !== this.state.newOptionAgreement) {
      this.setState({
        newOptionAgreement: newValue
      });
    }
  },

  addNewRuta: function () {
    var newOption = this.state.option;
    newOption.push({id: ''});
    this.setState({
      option: newOption
    });
  },

  delRelRuta: function (e) {
    let idKey = e.currentTarget.dataset.key;
    var newOption = this.state.option;
    delete newOption[idKey];
    this.setState({
      option: newOption
    });
  },

  handleChangeNoAgreement: function (e) {
    var id_company_legal = this.state.id_company_legal;
    var no_sec = this.state.no_sec;
    var no_agreefuec = e.target.value;
    this.setState({
      no_agreefuec: no_agreefuec,
      no_fuec: id_company_legal + no_agreefuec + no_sec
    });
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
                  name="no_fuec"
                  ref="no_fuec"
                  type="text"
                  value = {this.state.no_fuec}
                  readOnly/>
              </label>

              <label>Razón social:
                <input
                  name="social_object"
                  ref="social_object"
                  type="text"
                  readOnly/>
              </label>

              <label>Nit:
                <input
                  name="nit"
                  ref="nit"
                  type="text"
                  readOnly/>
              </label>

              <label>No. Contrato:
                <input
                  value={this.state.no_agreefuec}
                  name="no_agreefuec"
                  ref="no_agreefuec"
                  type="text"
                  onChange={this.handleChangeNoAgreement}
                />
              </label>

              <label>Contratante:
                <SelectInput
                  name="contractor"
                  url="apiFuec/allPerson"
                />
              </label>

              <label>Objeto del contrato:
                <SelectInput
                  name="agreement_object"
                  url="apiFuec/allObjectAgreement"
                />
              </label>

              <label>Fecha Inicial
                <input
                  type="date"
                  pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}"
                  name="init_date"
                  ref="init_date"
                  required/>
              </label>

              <label>Fecha Final
                <input
                  type="date"
                  pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}"
                  name="last_date"
                  ref="last_date"
                  required/>
              </label>

              <div className="row">
                <div className="small-2 columns">
                  <label>&nbsp;&nbsp;</label>
                  <a onClick={this.addNewRuta} className="button">
                    <i className="fi-plus"></i>
                  </a>
                </div>
                <div className="small-10 columns">
                  <label>Ruta: Origen - Destino</label>
                  <SelectInput
                    className="input-group-field"
                    url="apiFuec/allRuta"
                    name={"selectRuta"}
                    ref={"selectRuta"}
                    newOption={this.state.newOptionRuta}
                  />
                </div>
              </div>

              {this.state.option.map(function (data, i) {
                return (
                  <div key={i} ref={i} className="row">

                    <div className="small-2 columns">
                      <a data-key={i}
                         onClick={this.delRelRuta}
                         className="button">
                        <i className="fi-minus"></i>
                      </a>
                    </div>

                    <div className="small-10 columns">
                      <SelectInput
                        className="input-group-field"
                        url="apiFuec/allRuta"
                        name={"selectRuta_" + i}
                        newOption={this.state.newOptionRuta}
                      />
                    </div>

                  </div>
                )
              }, this)}

              <label>Contrato:
                <SelectInput
                  url="apiFuec/allAgreement"
                  name="agreement"
                  newOption={this.state.newOptionAgreement}
                />
              </label>

              <label>Vehiculo:
                <SelectInput
                  url="apiFuec/allCar"
                  name="agreement"
                  newOption={this.state.newOptionCar}
                />
              </label>

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
            onItemNewAgreement={this.handleNewAgreement}
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