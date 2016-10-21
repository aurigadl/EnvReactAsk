import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
require('./formsPanels.css');

var FormRuta = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      newOptionSelectA: false,
      inputValue: '',

      showMessage: false,
      typeMess: '',
      contextText: ''
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
        console.log('AdminFormUser, there was an error!', err.statusText);
      });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var ruta_edit = ref.rutaEdit.value;
    var selectRuta = ref.selectRuta.value;

    var params = {
      name: ruta_edit
    };

    if (selectRuta === "") {

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newRuta',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      params['id'] = selectRuta;

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdRuta',
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
      contextText: 'Se Creo la ruta',
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
      contextText: 'No se Creo la ruta.',
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
      contextText: 'Se Actualizo la Marca',
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

  errorFormUpdate: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se Actualizo la Marca',
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


  handleDelete: function (e) {
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    var params = {
      id: get_id
    };

    var parreq = {
      method: 'DELETE',
      url: 'apiFuec/deleteIdRuta',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
      this.successFormDelete,
      this.errorFormDelete
    );
  },

  successFormDelete: function (data){
    this.setState({
      showMessage: true,
      contextText: 'Se borro la Ruta',
      typeMess: 'success',
      newOptionSelectA: true,
      inputValue: ''
    });

    this.props.onItemNew(true);
    this.refs.selectRuta.refs.selectValue.selectedIndex = '';

    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormDelete: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se borro la Ruta',
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
          <h1>Rutas</h1>
        </div>
        <p>Selecciona un elemento para editarlo o eliminarlo
          o llena el campo inferior sin seleccionar elemento
          para crear uno nuevo</p>

        <form onSubmit={this.handleSubmitForm}>
          <div className="input-group">

            <SelectInput
              class="input-group-field"
              url="apiFuec/allRuta"
              name="selectRuta"
              ref="selectRuta"
              newOption={this.state.newOptionSelectA}
              onUserSelect={this.handleUserSelect}
            />

            <div className="input-group-button">
              <input type="button" className="alert button" onClick={this.handleDelete} value="Borrar"/>
            </div>

          </div>

          <div className="input-group">

            <textarea
              name="rutaEdit"
              ref="rutaEdit"
              placeholder="Editar o crear..."
              className="input-group-field"
              onChange={this.onChange}
              value={this.state.inputValue}
              type="text"/>

            <div className="input-group-button">
              <input type="submit" className="success button" value="Grabar"/>
            </div>

          </div>

          <div className="columns">
            <MessageAlert
              showHide={this.state.showMessage}
              type={this.state.typeMess}
              contextText={this.state.contextText}
              onclickMessage={this.onClickMessage}
            />
          </div>

        </form>
      </div>
    )
  }

});

export default FormRuta;
