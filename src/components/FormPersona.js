import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'

var FormPersona = React.createClass({

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
              name="selectPersona"
              onUserSelect={this.handleUserSelect}
            />
            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>
          </div>

          <label> Nombre
            <input name="first_name" type="text" placeholder="" required/>
          </label>
          <label> Apellido
            <input name="last_name" type="text" placeholder=""/>
          </label>
          <label> Correo Electronico
            <input name="email" type="text" placeholder="" required/>
          </label>
          <label> Telefono
            <input name="phone" type="text" placeholder=""/>
          </label>
          <label> Identificación
            <input name="id_number" type="text" placeholder="" required/>
          </label>
          <label> Tipo de Identificación
          <SelectInput
            url="apiFuec/allIdType"
            name="id_Type"
            onUserSelect={this.handleUserSelect}
            required
          />
          </label>
          <label> Licencia
            <input name="license" type="text" placeholder=""/>
          </label>
          <label> Vigencia
            <input name="effective_date" type="text" placeholder=""/>
          </label>
          <label> Dirección
            <input name="address" type="text" placeholder=""/>
          </label>
          <button type="button" className="success button">Grabar</button>
        </form>
      </div>
    )
  }

});

export default FormPersona;