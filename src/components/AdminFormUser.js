import React from 'react'
require('./formsPanels.css');
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'

var AdminFormUser = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: [],
      active: false,
      email: undefined,
      first_name: undefined,
      last_name: undefined,
      new_user: false,
      showHide: false
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
      this.getRemoteData(parreq, this.successHandler);
    } else {
      this.setState({
        first_name: undefined,
        last_name: undefined,
        new_user: false,
        active: false,
        email: undefined,
        showHide: false
      });
      this.refs.first_name.value = '';
      this.refs.last_name.value = '';
      this.refs.email.value = '';
    }
  },

  getRemoteData: function (parreq, cb) {
    mReq(parreq)
      .then(function (response) {
        cb(response.result)
      }.bind(this))
      .catch(function (err) {
        console.error('AdminFormUser, there was an error!', err.statusText);
      });
  },

  successHandler: function (data) {
    var email = (data.email) ? data.email : undefined;
    var first_name = (data.first_name) ? data.first_name : undefined;
    var last_name = (data.last_name) ? data.last_name : undefined;
    this.setState({
      first_name: first_name,
      last_name: last_name,
      new_user: data.new_user,
      active: data.active,
      email: email,
      showHide: true
    });
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
    console.log(e);
    if(!this.state.showHide){
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

  render: function () {

    var showClass = this.state.showHide ? 'show' : 'invisible';

    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Marcas de Carros y Camiones</h1>
        </div>
        <p>Selecciona un Usuario para editarlo
          o llena los campos sin seleccionar elemento
          para crear uno nuevo</p>

        <form>

          <label>Usuarios del sistema</label>

          <SelectInput
            class="input-group-field"
            url="apiUser/allUser"
            name="usuario"
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
              placeholder="Nombres para el usuario"/>
          </label>

          <label>Apellidos
            <input
              type="text"
              name="last_name"
              ref="last_name"
              value={this.state.last_name || ""}
              onChange={this.onChangeInputLastName}
              placeholder="Apellidos para el usuario"/>
          </label>

          <input
            id="checkbox1"
            type="checkbox"
            name="active"
            checked={this.state.active }
            onClick={this.clickActive}/><label>Activo</label>

          <input
            id="checkbox2"
            type="checkbox"
            checked={this.state.new_user}
            onClick={this.clickNewUser}
            name="new_user"/><label>Nuevo</label>

          <button type="submit" className="success button">Grabar</button>
        </form>
      </div>
    )
  }
});

export default AdminFormUser;
