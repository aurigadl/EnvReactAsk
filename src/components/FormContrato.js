import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
require('./formsPanels.css');

var FormConductor = React.createClass({

  getInitialState: function () {
    return {
      newOptionSelectA: false,

      showMessage: false,
      typeMess: '',
      contextText: ''
    };
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('FormContrato, there was an error!', err.statusText);
      });
  },

  handleContratoSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idAgreement',
        params: params
      };
      this.getRemoteData(parreq
        , this.successHandlerSelect
        , this.errorHandlerSelect);
    } else {
      this.refs.selectPerson.value = '';
      this.refs.first_name.value = '';
      this.refs.last_name.value = '';
      this.refs.email.value = '';
      this.refs.phone.value = '';
      this.refs.id_number.value = '';
      this.refs.id_type.value = '';
      this.refs.license.value = '';
      this.refs.effective_date.value = '';
      this.refs.address.value = '';
    }
  },

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    this.refs.first_name.value = (data.first_name) ? data.first_name : undefined;
    this.refs.last_name.value = (data.last_name) ? data.last_name : undefined;
    this.refs.email.value = (data.email) ? data.email : undefined;
    this.refs.phone.value = (data.phone) ? data.phone : undefined;
    this.refs.id_number.value = (data.id_number) ? data.id_number : undefined;
    this.refs.license.value = (data.license) ? data.license : undefined;
    this.refs.effective_date.value = (data.effective_date) ? data.effective_date : undefined;
    this.refs.address.value = (data.address) ? data.address : undefined;
    this.refs.id_type.refs.selectValue.selectedIndex = (data.id_type) ? data.id_type : undefined;
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

  onClickMessage: function (event) {
    this.setState({
      showMessage: false,
      contextText: ''
    })
  },

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Contrato</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>


        <form onSubmit={this.handleSubmitForm}>

          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiFuec/allAgreement"
              name="selectAgreement"
              ref="selectAgreement"
              newOption={this.state.newOptionSelectA}
              onUserSelect={this.handleContratoSelect}
            />

            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>

          </div>

          <label>No. de Contrato
            <input
              type="number"
              ref="no_agreement"
              name="no_agreement"
              placeholder=""
              required/>
          </label>
          <label>No. de Viaje
            <input
              type="number"
              ref="no_trip"
              name="no_trip"
              placeholder=""/>
          </label>
          <label>Persona o Empresa Contratante
            <input type="text" placeholder="" required/>
          </label>

          <label> Tipo de Identificación
            <SelectInput
              url="apiFuec/allIdType"
              name="id_type"
              id='id_type'
              ref="id_type"
              required/>
          </label>

          <label> Identificación
            <input
              ref="id_type"
              name="id_type"
              type="text"
              placeholder=""
              required/>
          </label>

          <div className="row">
            <div className="small-7 columns">
              <label>Nit - Consecutivo de identificación
                <input name="nit_1"
                       type="number"
                       placeholder=""
                       ref="nit_1"
                       required/>
              </label>
            </div>
            <div className="small-5 columns">
              <label>Nit - Digito de verificación
                <input name="nit_2"
                       type="number"
                       placeholder=""
                       ref="nit_2"
                       required/>
              </label>
            </div>
          </div>

          <label>Objeto
            <input
              type="text"
              ref="object"
              name="object"
              placeholder=""/>
          </label>

          <label>Ruta origen destino
            <SelectInput
              url="apiFuec/allRuta"
              name="id_route"
              ref="id_route"
            />
          </label>

          <label>Tipo de contrato
            <SelectInput
              url="apiFuec/allTipoContrato"
              name="id_type_agreement"
              ref="id_type_agreement"
            />
          </label>
          <label>Fecha Inicial
            <input
              placeholder=""
              type="date"
              pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}"
              name="init_date"
              ref="init_date"
            />
          </label>
          <label>Fecha Final
            <input
              placeholder=""
              type="date"
              pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}"
              name="last_date"
              ref="last_date"
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
    )
  }

});

export default FormConductor;