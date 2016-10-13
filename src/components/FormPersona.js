import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
require('./formsPanels.css');

var FormPersona = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: [],
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
        console.log('AdminFormUser, there was an error!', err.statusText);
      });
  },

  handlePersonSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idPerson',
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

  errorHandlerSelect: function(remoteData){
    this.setState({
      showMessage: true,
      contextText: 'Conexion rechazada',
      typeMess: 'alert'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var selectPerson = ref.selectPerson.value;
    var first_name = ref.first_name.value;
    var last_name = ref.last_name.value;
    var email = ref.email.value;
    var phone = ref.phone.value;
    var id_number = ref.id_number.value;
    var id_type = ref.id_type.value;
    var license = ref.license.value;
    var effective_date = ref.effective_date.value;
    var address = ref.address.value;

    var params = {
        first_name: first_name
      , last_name: last_name
      , email: email
      , phone: phone
      , id_number: id_number
      , id_type: id_type
      , license: license
      , effective_date: effective_date
      , address: address
    };

    if (selectPerson === "") {

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newPerson',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      params['id'] = selectPerson;

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdPerson',
        params: {
          'params': params
        }
      };

      this.getRemoteData(parreq,
        this.successFormUpdate,
        this.errorFormUpdate
      );
    }
  },

  successFormCreate: function (data){
    this.setState({
      showMessage: true,
      contextText: 'Se creo persona',
      typeMess: 'success',
      newOptionSelectA: true
    });

    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormCreate: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se Creo el usuario. El correo electronico, o el nombre o la identificación ya esta registrado',
      typeMess: 'alert'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  successFormUpdate: function (data){
    this.setState({
      showMessage: true,
      contextText: 'Se Actualizo el usuario',
      typeMess: 'success'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  errorFormUpdate: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se Actualizo el usuario',
      typeMess: 'alert'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  onClickMessage: function(event) {
    this.setState({
      showMessage: false,
      contextText: ''
    })
  },

  render: function () {

    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Personas</h1>
        </div>

        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form onSubmit={this.handleSubmitForm}>
          <div className="input-group">
            <SelectInput
              class="input-group-field"
              url="apiFuec/allPerson"
              name="selectPerson"
              ref="selectPerson"
              newOption={this.state.newOptionSelectA}
              onUserSelect={this.handlePersonSelect}
            />
            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>
          </div>

          <label> Nombre
            <input ref="first_name" name="first_name" type="text" placeholder="" required/>
          </label>
          <label> Apellido
            <input ref="last_name" name="last_name" type="text" placeholder=""/>
          </label>
          <label> Correo Electronico
            <input ref="email" name="email" type="text" placeholder="" required/>
          </label>
          <label> Telefono
            <input ref="phone" name="phone" type="text" placeholder=""/>
          </label>
          <label> Identificación
            <input ref="id_number" name="id_number" type="text" placeholder="" required/>
          </label>
          <label> Tipo de Identificación
          <SelectInput
            url="apiFuec/allIdType"
            name="id_type"
            id = 'id_type'
            ref="id_type"
            onUserSelect={this.handleIdTypeSelect}
            required
          />
          </label>
          <label> Licencia
            <input ref="license" name="license" type="text" placeholder=""/>
          </label>
          <label> Vigencia
            <input ref="effective_date" name="effective_date" type="date" placeholder=""/>
          </label>
          <label> Dirección
            <input ref="address" name="address" type="text" placeholder=""/>
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

export default FormPersona;