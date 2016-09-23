import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
require('./formsPanels.css');

var AdminFormUser = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: [],
      newOptionSelectA: false,

      active: false,
      email: undefined,
      first_name: undefined,
      last_name: undefined,
      display_name: undefined,
      new_user: false,

      showHide: false,

      showMessage: false,
      typeMess: '',
      contextText: ''
    };
  },

  handleUserSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiUser/idUser',
        params: params
      };
      this.getRemoteData(parreq, this.successHandlerSelect, this.errorHandlerSelect);
    } else {
      this.setState({
        first_name: undefined,
        last_name: undefined,
        new_user: false,
        active: false,
        email: undefined,
        display_name: undefined,
        showHide: false
      });
      this.refs.first_name.value = '';
      this.refs.last_name.value = '';
      this.refs.email.value = '';
      this.refs.display_name = '';
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

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    var email = (data.email) ? data.email : undefined;
    var first_name = (data.first_name) ? data.first_name : undefined;
    var last_name = (data.last_name) ? data.last_name : undefined;
    this.setState({
      first_name: first_name,
      last_name: last_name,
      new_user: data.new_user,
      active: data.active,
      email: email,
      display_name: data.display_name,
      showHide: true
    });
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

  clickNewUser: function () {
    this.setState({
      new_user: !this.state.new_user
    });
  },

  clickActive: function () {
    this.setState({
      active: !this.state.active
    });
  },

  onChangeInputEmail: function (e) {
    if (!this.state.showHide) {
      this.setState({
        email: e.target.value
      });
    }
  },

  onChangeInputFirstName: function (e) {
    this.setState({
      first_name: e.target.value
    });
  },

  onChangeInputLastName: function (e) {
    this.setState({
      last_name: e.target.value
    });
  },

  onChangeInputDisplayName: function (e) {
    this.setState({
      display_name: e.target.value
    });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;
    var user = ref.user.value;
    var email = ref.email.value;
    var first_name = ref.first_name.value;
    var last_name = ref.last_name.value;
    var active = ref.active.checked;
    var display_name = ref.display_name.value;
    var new_user = ref.new_user.checked;

    if (user === "") {
      var params = {
        email: email,
        first_name: first_name,
        last_name: last_name,
        display_name: display_name
      };

      var parreq = {
        method: 'POST',
        url: 'apiUser/newuser',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      var params = {
        id: user,
        email: email,
        first_name: first_name,
        last_name: last_name,
        active: active,
        display_name: display_name,
        new_user: new_user
      };

      var parreq = {
        method: 'PUT',
        url: 'apiUser/updateIdUser',
        params: {'params': params}
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
      contextText: 'Se Creo el usuario',
      typeMess: 'success',
      newOptionSelectA: true
    });
    
    this.props.onItemNew(true);
    
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
      contextText: 'No se Creo el usuario. El correo electronico ya esta registrado',
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

    var showClass = this.state.showHide ? 'show' : 'invisible';

    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Crea y edita usuarios</h1>
        </div>
        <p>Selecciona un Usuario para editarlo
          o llena los campos sin seleccionar elemento
          para crear uno nuevo</p>

        <form onSubmit={this.handleSubmitForm}>

          <label>Usuarios del sistema</label>

          <SelectInput
            class="input-group-field"
            url="apiUser/allUser"
            name="user"
            newOption={this.state.newOptionSelectA}
            onUserSelect={this.handleUserSelect}
          />

          <label>Correo Electronico
            <input
              type="email"
              name="email"
              ref="email"
              value={this.state.email || ""}
              aria-describedby="emailHelpText"
              placeholder="Correo Electronico"
              onChange={this.onChangeInputEmail}
              required
            />
          </label>

          <p className={"help-text " + showClass} id="emailHelpText">
            No modificable.
          </p>

          <label>Nombres
            <input
              type="text"
              name="first_name"
              ref="first_name"
              value={this.state.first_name || ""}
              onChange={this.onChangeInputFirstName}
              placeholder="Nombres para el usuario"
              required
            />
          </label>

          <label>Apellidos
            <input
              type="text"
              name="last_name"
              ref="last_name"
              value={this.state.last_name || ""}
              onChange={this.onChangeInputLastName}
              placeholder="Apellidos para el usuario"
            />
          </label>

          <label>Nombre a mostrar
            <input
              type="text"
              name="display_name"
              ref="display_name"
              value={this.state.display_name || ""}
              onChange={this.onChangeInputDisplayName}
              placeholder="Un alias o el mismo nombre"
              required
            />
          </label>

          <input
            id="checkbox1"
            type="checkbox"
            name="active"
            checked={this.state.active }
            onClick={this.clickActive}
          />
          <label>Activo</label>

          <input
            id="checkbox2"
            type="checkbox"
            checked={this.state.new_user}
            onClick={this.clickNewUser}
            name="new_user"
          />
          <label>Nuevo</label>

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

export default AdminFormUser;
