import React from 'react'
require('./formsPanels.css');
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';


var AdminFormEmpresa = React.createClass({

  getInitialState: function () {
    return {
      showHide: false,
      typeMess: '',
      contextText: ''
    };
  },


  loadOptionFromServer: function () {
    var parreq = {
      method: 'GET',
      url: 'apiSystem/allSystem'
    };

    mReq(parreq)
      .then(function (response) {
        this.successHandler(response.result)
      }.bind(this))
      .catch(function (err) {
        console.log('AdminFormEmpresa, there was an error!', err.statusText);
      });
  },

  successHandler: function (data) {
    this.refs.name.value = data.name;
    this.refs.address.value = data.address;
    this.refs.phone.value = data.phone;
    this.refs.email.value = data.email;
    this.refs.nit_1.value = data.nit_1;
    this.refs.nit_2.value = data.nit_2;
    this.refs.secuence_contract.value = data.secuence_contract;
    this.refs.secuence_payroll.value = data.secuence_payroll;
    this.refs.secuence_vehicle.value = data.secuence_vehicle;
  },

  componentDidMount: function () {
    this.loadOptionFromServer();
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

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var name = ref.name.value;
    var address = ref.address.value;
    var phone = ref.phone.value;
    var email = ref.email.value;
    var nit_1 = ref.nit_1.value;
    var nit_2 = ref.nit_2.value;
    var secuence_contract = ref.secuence_contract.value;
    var secuence_payroll = ref.secuence_payroll.value;
    var secuence_vehicle = ref.secuence_vehicle.value;

    var params = {
        name : name
      , address : address
      , phone : phone
      , email : email
      , nit_1 : nit_1
      , nit_2 : nit_2
      , secuence_contract : secuence_contract
      , secuence_payroll : secuence_payroll
      , secuence_vehicle : secuence_vehicle
    };

    var parreq = {
      method: 'PUT',
      url: 'apiSystem/updateSystem',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
      this.successFormUpdate,
      this.errorFormUpdate
    );

  },

  successFormUpdate: function (data) {
    this.setState({
      showMessage: true,
      contextText: 'Se Actualizaron los datos',
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

  errorFormUpdate: function (err) {
    this.setState({
      showMessage: true,
      contextText: 'No se Actualizaron los datos',
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


  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Empresa</h1>
        </div>

        <form onSubmit={this.handleSubmitForm}>

          <label>Razón social
            <input name="name"
                   type="text"
                   ref="name"
                   placeholder=""
                   required/>
          </label>

          <label>Dirección
            <input name="address"
                   type="text"
                   ref="address"
                   placeholder=""
                   required/>
          </label>

          <label>Telefono
            <input name="phone"
                   type="text"
                   ref="phone"
                   placeholder=""
                   required/>
          </label>

          <label>Correo electronico
            <input name="email"
                   type="email"
                   ref="email"
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

          <label>Consecutivo contratos
            <input name="secuence_contract"
                   type="number"
                   placeholder=""
                   ref="secuence_contract"
                   required/>
          </label>

          <label>Consecutivo Planilla
            <input name="secuence_payroll"
                   type="number"
                   placeholder=""
                   ref="secuence_payroll"
                   required/>
          </label>

          <label>Consecutivo Vehiculo
            <input name="secuence_vehicle"
                   type="number"
                   placeholder=""
                   ref="secuence_vehicle"
                   required/>
          </label>

          <label>Representante Legal o Gerente
            <input name="owner"
                   type="text"
                   ref="owner"
                   placeholder=""
                   required/>
          </label>

          <label> Firma "Dibujo en PNG"
            <input name="sing"
                   type="upload"
                   ref="sing"
                   placeholder=""/>
          </label>

          <label> Logo "Dibujo en PNG"
            <input name="logo"
                   type="upload"
                   ref="logo"
                   placeholder=""/>
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

export default AdminFormEmpresa;
