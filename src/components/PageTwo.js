import React from 'react'
import FormRuta from './FormRuta.js'
import TableFuec from './TableFuec.js'
import FormCarro from './FormCarro.js'
import SelectInput from './SelectInput.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import MessageAlert from './MessageAlert.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import TableAgreement from './TableAgreement.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import {makeRequest as mReq} from '../utils/mrequest';

const PageTwo = React.createClass({

  getInitialState: function () {
    return {
      newOptionPerson: false,
      newOptionCar: false,
      newOptionMarca: false,
      newOptionRuta: false,

      no_agreefuec: '',
      no_sec: '',
      no_fuec: '',
      no_nit: '',
      social_object: '',
      id_company_legal: '',
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
        console.log('PageTwo, there was an error!', err.statusText);
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
    var id_company_legal = data.id_company_legal.toString();
    var no_sec = data.secuence_contract.toString();
    var nit1 = data.nit_1;
    var nit2 = data.nit_2;
    var social_object = data.name;

    this.setState({
      id_company_legal: id_company_legal,
      no_sec: no_sec,
      no_fuec: id_company_legal + no_sec,
      no_nit: nit1 + '-' + nit2,
      social_object: social_object
    });
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
    newOption.unshift({});
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


  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;
    var data = [];
    var x = 0;
    var no_fuec = ref.no_fuec.value;
    var social_object = ref.social_object.value;
    var nit = ref.nit.value;
    var no_agreefuec = ref.no_agreefuec.value;
    var contractor = ref.contractor.value;
    var agreement_object = ref.agreement_object.value;
    var kind_agreement_link = ref.kind_agreement_link.value;
    var kind_agreement = ref.kind_agreement.value;
    var init_date = ref.init_date.value;
    var last_date = ref.last_date.value;
    var selectRuta = ref.selectRuta.value;
    var no_car = ref.no_car.value;

    data.push(selectRuta);

    while (eval('ref.selectRuta_' + x) !== undefined) {
      data.push(eval('ref.selectRuta_' + x).value);
      x++;
    }

    var params = {
      no_fuec: no_fuec
      , social_object: social_object
      , nit: nit
      , no_agreefuec: no_agreefuec
      , selectRuta: data
      , contractor: contractor
      , agreement_object: agreement_object
      , kind_agreement_link: kind_agreement_link
      , kind_agreement: kind_agreement
      , init_date: init_date
      , last_date: last_date
      , no_car: no_car
    };

    var parreq = {
      method: 'PUT',
      url: 'apiFuec/newFuec',
      params: {
        'params': params
      }
    };

    this.getRemoteData(parreq,
      this.successFormCreate,
      this.errorFormCreate
    );
  },

  successFormCreate: function (data) {
    this.setState({
      showMessage: true,
      contextText: 'Se creo un nuevo FUEC',
      typeMess: 'success'
    });

    setTimeout(function () {
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  errorFormCreate: function (err) {
    console.log(err);
    this.setState({
      showMessage: true,
      contextText: err.message.error,
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

  handleReset: function (e) {
    this.setState({
      no_agreefuec: ''
    });
  },

  render: function () {
    return (
      <div className="row">
        <div className="columns small-12 medium-6">
          <div className="header callout secondary">

            <div className="sign">
              <h1>Formato Único De Extracto Del Contrato Del Servicio Público De
                Transporte Terrestre Automotor Especial</h1>
            </div>

            <form onSubmit={this.handleSubmitForm}>

              <label>No. FUEC
                <input
                  name="no_fuec"
                  ref="no_fuec"
                  type="text"
                  value={this.state.no_fuec}
                  readOnly/>
              </label>

              <label>Razón social:
                <input
                  name="social_object"
                  ref="social_object"
                  value={this.state.social_object}
                  type="text"
                  readOnly/>
              </label>

              <label>Nit:
                <input
                  name="nit"
                  ref="nit"
                  value={this.state.no_nit}
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
                  required/>
              </label>

              <label>Contratante:
                <SelectInput
                  name="contractor"
                  ref="contractor"
                  url="apiFuec/allPerson"
                  newOption={this.state.newOptionPerson}
                  onItemNew={this.handleNewElementPerson}
                  required/>
              </label>

              <label>Objeto del contrato:
                <SelectInput
                  name="agreement_object"
                  ref="agreement_object"
                  url="apiFuec/allObjectAgreement"
                  required/>
              </label>

              <label>Tipo de contrato:
                <SelectInput
                  name="kind_agreement"
                  ref="kind_agreement"
                  url="apiFuec/allKindAgreement"
                  required/>
              </label>

              <label>Con:
                <SelectInput
                  name="kind_agreement_link"
                  ref="kind_agreement_link"
                  url="apiFuec/allPerson"
                  newOption={this.state.newOptionPerson}
                  onItemNew={this.handleNewElementPerson}
                  required/>
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
                    onItemNew={this.handleNewElementRuta}
                    required/>
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
                        onItemNew={this.handleNewElementRuta}
                     />
                    </div>

                  </div>
                )
              }, this)}

              <label>Vehiculo:
                <SelectInput
                  url="apiFuec/allCarWithPerson"
                  name="no_car"
                  ref="no_car"
                  newOption={this.state.newOptionCar}
                  onItemNew={this.handleNewElementCar}
                  required/>
              </label>

              <div className="row">
                <div className="shrink columns">
                  <input type="submit" className="success button" value="Grabar"/>
                  <input type="reset" className="alert button" onClick={this.handleReset} value="Limpiar"/>
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

        <div className="columns">
          <TableFuec/>
        </div>

        <div className="columns small-12 medium-6">
          <FormPersonaCarro
            newOptionPerson={this.state.newOptionPerson}
            onItemNewPerson={this.handleNewElementPerson}
            newOptionCar={this.state.newOptionCar}
            onItemNewCar={this.handleNewElementCar}
          />
        </div>

        <div className="columns small-12 medium-6">
          <FormRuta
            onItemNew={this.handleNewElementRuta}
          />
        </div>

        <div className="columns small-12 medium-6">
          <FormMarcaAuto
            onItemNew={this.handleNewElementMarca}
          />
        </div>

        <div className="columns small-12 medium-6">
          <FormCarro
            newOptionMarca={this.state.newOptionMarca}
            onItemNewMarca={this.handleNewElementMarca}
            onItemNewCar={this.handleNewElementCar}
          />
        </div>

        <div className="columns small-12 medium-6">
          <FormContrato
            newOptionPerson={this.state.newOptionPerson}
            onItemNewPerson={this.handleNewElementPerson}
            onItemNewAgreement={this.handleNewAgreement}
          />
        </div>

        <div className="columns small-12 medium-6">
          <FormPersona
            onItemNew={this.handleNewElementPerson}
          />
        </div>

        <div className="columns">
          <TableAgreement/>
        </div>

      </div>
    );
  }
});

export default PageTwo
