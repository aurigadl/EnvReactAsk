import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
require('./formsPanels.css');

var FormConductor = React.createClass({

  getInitialState: function () {
    return {
      newOptionSelectA: false,
      childSelectValue: undefined,
      newOptionSelectRuta: false,
      newOptionSelectTiCon: false,


      showMessage: false,
      typeMess: '',
      contextText: ''
    };
  },

  componentWillReceiveProps: function (nextProps) {
    var nextRuta = nextProps.newOptionRuta;
    var prevRuta = this.props.newOptionRuta;

    var nextTiCon = nextProps.newOptionTiCon;
    var prevTiCon = this.props.newOptionTiCon;

    if (nextRuta == true && nextRuta != prevRuta) {
      this.setState({
        newOptionSelectRuta: true
      });
      this.props.onItemNewRuta(false);
    }
    if (nextRuta == false && nextRuta != prevRuta) {
      this.setState({
        newOptionSelectRuta: false
      });
    }

    if (nextTiCon == true && nextTiCon != prevTiCon) {
      this.setState({
        newOptionSelectTiCon: true
      });
      this.props.onItemNewTiCon(false);
    }
    if (nextTiCon == false && nextTiCon != prevTiCon) {
      this.setState({
        newOptionSelectTiCon: false
      });
    }
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

      this.setState({
        childSelectValue: childSelectValue
      });

      this.getRemoteData(parreq
        , this.successHandlerSelect
        , this.errorHandlerSelect);
    } else {
      this.refs.no_agreement.value = '';
      this.refs.no_trip.value = '';
      this.refs.id_person.refs.selectValue.selectedIndex = undefined;
      this.refs.purpose.value = '';
      this.refs.id_route.refs.selectValue.selectedIndex = undefined;
      this.refs.id_type_agreement.refs.selectValue.selectedIndex = undefined;
      this.refs.init_date.value = '';
      this.refs.last_date.value = '';
    }
  },

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    this.refs.no_agreement.value = (data.no_agreement) ? data.no_agreement : undefined;
    this.refs.no_trip.value = (data.no_trip) ? data.no_trip : undefined;
    this.refs.id_person.refs.selectValue.selectedIndex = (data.id_person) ? data.id_person : undefined;
    this.refs.purpose.value = (data.purpose) ? data.purpose : undefined;
    this.refs.id_route.refs.selectValue.selectedIndex = (data.id_route) ? data.id_route : undefined;
    this.refs.id_type_agreement.refs.selectValue.selectedIndex = (data.id_type_agreement) ? data.id_type_agreement : undefined;
    this.refs.init_date.value = (data.init_date) ? data.init_date : undefined;
    this.refs.last_date.value = (data.last_date) ? data.last_date : undefined;
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

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var selectAgreement = ref.selectAgreement.value;
    var no_trip = ref.no_trip.value;
    var id_person = ref.id_person.value;
    var purpose = ref.purpose.value;
    var id_route = ref.id_route.value;
    var id_type_agreement = ref.id_type_agreement.value;
    var init_date = ref.init_date.value;
    var last_date = ref.last_date.value;

    var params = {
      no_trip: no_trip
      , id_person: id_person
      , purpose: purpose
      , id_route: id_route
      , id_type_agreement: id_type_agreement
      , init_date: init_date
      , last_date: last_date
    };

    if (selectAgreement === "") {

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newAgreement',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      params['id'] = selectAgreement;

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdAgreement',
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

  successFormCreate: function (data) {
    this.refs.no_agreement.value = data.result.id;
    this.setState({
      showMessage: true,
      contextText: 'Se creo el contrato',
      typeMess: 'success',
      newOptionSelectA: true
    });

    setTimeout(function () {
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormCreate: function (err) {
    this.setState({
      showMessage: true,
      contextText: 'No se Creo el contrato. Alguno de los datos no corresponde',
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

  successFormUpdate: function (data) {
    this.setState({
      showMessage: true,
      contextText: 'Se Actualizo el contrato',
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
      contextText: 'No se Actualizo el contrato',
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

  handleDelete: function (e) {
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    var params = {
      id: get_id
    };

    var parreq = {
      method: 'DELETE',
      url: 'apiFuec/deleteIdAgreement',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
      this.successFormDelete,
      this.errorFormDelete
    );
  },

  successFormDelete: function (data) {
    this.setState({
      showMessage: true,
      contextText: 'Se borro el contrato',
      typeMess: 'success',
      newOptionSelectA: true,
      inputValue: ''
    });
    setTimeout(function () {
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormDelete: function (err) {
    this.setState({
      showMessage: true,
      contextText: 'No se borro el contrato',
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
              <input type="button" className="alert button" onClick={this.handleDelete} value="Borrar"/>
            </div>

          </div>

          <label>No. de Contrato
            <input
              type="number"
              ref="no_agreement"
              name="no_agreement"
              readOnly/>
          </label>
          <label>No. de Viaje
            <input
              type="number"
              ref="no_trip"
              name="no_trip"
            />
          </label>

          <label> Persona Juridica o Natural
            <SelectInput
              url="apiFuec/allAgreement"
              ref="id_person"
              name="id_person"
              type="text"/>
          </label>

          <label>Objeto
            <input
              type="text"
              ref="purpose"
              name="purpose"/>
          </label>

          <label>Ruta origen - destino
            <SelectInput
              url="apiFuec/allRuta"
              name="id_route"
              ref="id_route"
              newOption={this.state.newOptionSelectRuta}
            />
          </label>

          <label>Tipo de contrato
            <SelectInput
              url="apiFuec/allKindHiring"
              name="id_type_agreement"
              ref="id_type_agreement"
              newOption={this.state.newOptionSelectTiCon}
            />
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
