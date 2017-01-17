import React from 'react'
import Griddle from 'griddle-react'
import {makeRequest as mReq} from '../utils/mrequest';

require('./formsPanels.css');

var TableAgreement = React.createClass({
  metadata: [
    {
      "columnName": "KindAgreement",
      "order": 9,
      "locked": false,
      "visible": true,
      "displayName": "Contrato"
    },
    {
      "columnName": "created_at",
      "order": 1,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Creación"
    },
    {
      "columnName": "created_by",
      "order": 2,
      "locked": false,
      "visible": true,
      "displayName": "Creador"
    },
    {
      "columnName": "id",
      "order": 6,
      "locked": false,
      "visible": false
    },
    {
      "columnName": "init_date",
      "order": 3,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Inicial"
    },
    {
      "columnName": "last_date",
      "order": 4,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Final"
    },
    {
      "columnName": "no_trip",
      "order": 5,
      "locked": false,
      "visible": false,
      "displayName": "Viaje"
    },
    {
      "columnName": "no_agreement",
      "order": 6,
      "locked": false,
      "visible": true,
      "displayName": "No"
    },
    {
      "columnName": "person",
      "order": 7,
      "locked": false,
      "visible": true,
      "displayName": "Persona"
    }
  ],

  getInitialState: function () {
    return {
      dataValue: []
    };
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('TableAgreement, there was an error!', err.statusText);
      });
  },

  componentDidMount: function () {
    var parreq = {
      method: 'GET',
      url: 'apiFuec/fullAllAgreement'
    };
    this.getRemoteData(parreq,
      this.successLoadData,
      this.errorLoadData
    );
  },


  successLoadData: function (data) {
    this.setState({
      dataValue: data.result
    });
  },

  errorLoadData: function (err) {
    this.setState({
      showMessage: true,
      contextText: 'No se Cargo el contenido de la tabla',
      typeMess: 'alert'
    });
  },

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>La tabla</h1>
          <Griddle
            columnMetadata={this.metadata}
            results={this.state.dataValue}
            showFilter={true}
            showSettings={true}
          />
        </div>

      </div>
    )
  }

});

export default TableAgreement;
