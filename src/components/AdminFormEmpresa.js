import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
import { message } from 'antd';

var AdminFormEmpresa = React.createClass({

  getInitialState: function () {
    return {
      fileSign:'',
      fileLogo:''
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
    this.refs.owner.value = data.owner;
    this.refs.phone.value = data.phone;
    this.refs.email.value = data.email;
    this.refs.nit_1.value = data.nit_1;
    this.refs.nit_2.value = data.nit_2;
    this.refs.secuence_contract.value = data.secuence_contract;
    this.refs.id_company_legal.value = data.id_company_legal;
    this.refs.secuence_payroll.value = data.secuence_payroll;
    this.refs.secuence_vehicle.value = data.secuence_vehicle;

    this.setState({
      fileSign: data.sign,
      fileLogo: data.logo
    });

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
    var owner = ref.owner.value;
    var phone = ref.phone.value;
    var email = ref.email.value;
    var nit_1 = ref.nit_1.value;
    var nit_2 = ref.nit_2.value;
    var secuence_contract = ref.secuence_contract.value;
    var id_company_legal = ref.id_company_legal.value;
    var secuence_payroll = ref.secuence_payroll.value;
    var secuence_vehicle = ref.secuence_vehicle.value;
    var logo = this.state.fileLogo;
    var sign = this.state.fileSign;

    var params = {
      name: name
      , address: address
      , phone: phone
      , email: email
      , nit_1: nit_1
      , nit_2: nit_2
      , secuence_contract: secuence_contract
      , id_company_legal: id_company_legal
      , secuence_payroll: secuence_payroll
      , secuence_vehicle: secuence_vehicle
      , sign: sign
      , logo: logo
      , owner: owner
    };

    var parreq = {
      method: 'PUT',
      url: 'apiSystem/updateSystem',
      params: {
        'params': params
        ,'file': true
      }
    };

    this.getRemoteData(parreq,
      this.successFormUpdate,
      this.errorFormUpdate
    );

  },

  successFormUpdate: function (data) {
    message.success('Se actualizaron los datos de la empresa', 10);
  },

  errorFormUpdate: function (err) {
    message.error('No se actualizaron los datos de la empresa', 10)
  },

  handleImageLogo: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        fileLogo: event.target.result
      });
    }.bind(this);

    if (file.type == "image/png"){
      reader.readAsDataURL(file)
    }
  },

  handleImageSign: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        fileSign: event.target.result
      });
    }.bind(this);

    if (file.type == "image/png"){
      reader.readAsDataURL(file)
    }
  },


  render: function () {

    var imgLogo = this.state.fileLogo;
    var imagePreviewLogo;
    var imgSign = this.state.fileSign;
    var imagePreviewSign;

    if (imgLogo) {
      imagePreviewLogo = (<img src={imgLogo}/>);
    }

    if (imgSign) {
      imagePreviewSign = (<img src={imgSign}/>);
    }

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

          <label>Identificación de la empresa
            <input name="id_company_legal"
                   type="number"
                   placeholder=""
                   ref="id_company_legal"
                   required/>
          </label>


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
            <input name="sign"
                   type="file"
                   ref="sign"
                   accept="image/png"
                   placeholder=""
                   onChange={this.handleImageSign} />
          </label>
          {imagePreviewSign}

          <label> Logo "Dibujo en PNG"
            <input name="logo"
                   type="file"
                   ref="logo"
                   accept="image/png"
                   placeholder=""
                   onChange={this.handleImageLogo} />
          </label>
          {imagePreviewLogo}

          <div className="row">
            <div className="shrink columns">
              <input type="submit" className="success button" value="Grabar"/>
            </div>
          </div>

        </form>
      </div>
    )
  }

});

export default AdminFormEmpresa;
