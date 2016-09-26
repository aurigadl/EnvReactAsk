import React from 'react'
require('./formsPanels.css');
import SelectInput from './SelectInput.js'
import {makeRequest as mReq} from '../utils/mrequest';

var FormMarcaAuto = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      inputValue: '',
      newOptionSelectA: false
    };
  },

  handleUserSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      inputValue: childSelectText
    });
  },

  onChange(e) {
    this.setState({inputValue: e.target.value});
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
        .then(function (response) {
          cb_success(response)
        }.bind(this))
        .catch(function (err) {
          cb_error(err);
          console.log('FormMarca, there was an error!', err.statusText);
        });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;
    var marcaSelect = ref.selectMarca.value;
    var marcaEdit = ref.marcaEdit.value;

    if (marcaSelect === "") {
      var params = {
        marca: marcaEdit
      };

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newMarca',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      var params = {
        id: marcaSelect,
        name: marcaEdit
      };

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdMarca',
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
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Marcas de Carros y Camiones</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form onSubmit={this.handleSubmitForm}>
          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiFuec/allMarca"
              name="selectMarca"
              newOption={this.state.newOptionSelectA}
              onUserSelect={this.handleUserSelect}
            />

            <div className="input-group-button">
              <input type="submit" className="alert button" value="Borrar"/>
            </div>

          </div>

          <div className="input-group">

            <input name="marcaEdit"
                   placeholder="Editar o crear..."
                   className="input-group-field"
                   type="text"
                   onChange={this.onChange}
                   value={this.state.inputValue}/>

            <div className="input-group-button">
              <button type="submit"  className="success button">Grabar</button>
            </div>
          </div>

        </form>
      </div>
    )
  }

});

export default FormMarcaAuto;
