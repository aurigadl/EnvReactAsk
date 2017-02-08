import React from 'react'
import Griddle from 'griddle-react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';

var LinkComponent = React.createClass({
  handleGetFile: function (e) {
    e.preventDefault();
  },

  render: function () {
    return (
      <div>
        <a target="_blank" onClick={this.handleGetFile}>{this.props.data}</a>
      </div>)
  }
});

var DateComponent = React.createClass({

  render: function () {
    var d = new Date(this.props.data);
    var newDateformat = d.toLocaleString();
    return (<div>{newDateformat}</div>)
  }

});

var TableFuec = React.createClass({

  metadata: [
    {
      "columnName": "id",
      "order": 1,
      "locked": false,
      "visible": false
    },
    {
      "columnName": "no_fuec",
      "order": 2,
      "locked": false,
      "visible": true,
      "displayName": "No Fuec",
      "customComponent": LinkComponent
    },
    {
      "columnName": "created_at",
      "order": 3,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Creación",
      "customComponent": DateComponent
    },
    {
      "columnName": "created_by",
      "order": 3,
      "locked": false,
      "visible": true,
      "displayName": "Creado por"
    },
    {
      "columnName": "no_agreement",
      "order": 4,
      "locked": false,
      "visible": true,
      "displayName": "No Contrato"
    },
    {
      "columnName": "car_license_plate",
      "order": 5,
      "locked": false,
      "visible": true,
      "displayName": "Placa"
    },
    {
      "columnName": "car_operation",
      "order": 6,
      "locked": false,
      "visible": true,
      "displayName": "Tarjeta de Operación"
    },
    {
      "columnName": "last_date",
      "order": 7,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Final"
    },
    {
      "columnName": "init_date",
      "order": 8,
      "locked": false,
      "visible": false,
      "displayName": "Viaje"
    },
    {
      "columnName": "data_driver_json",
      "order": 9,
      "locked": false,
      "visible": true,
      "displayName": "Persona"
    }
  ],

  getInitialState: function () {
    return {
      dataValue: [],
      filetoload: ''
    };
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('TableFuec, there was an error!', err.statusText);
      });
  },

  componentDidMount: function () {
    var parreq = {
      method: 'GET',
      url: 'apiFuec/fullAllFuec'
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


  handleGetFile: function (e) {

    var params = {
      'fuec': e.props.data.id
    };

    var parreq = {
      method: 'GET',
      url: 'apiFuec/fileFuec',
      params: params
    };

    this.getRemoteData(parreq,
      this.successLoadFile,
      this.errorLoadFile
    );
  },

  successLoadFile: function (remoteData) {
    this.setState({
      filetoload: remoteData.result
    });
  },

  errorLoadFile: function () {
    this.setState({
      showMessage: true,
      contextText: 'No se Cargo el archivo',
      typeMess: 'alert'
    });
  },

  render: function () {
    var pdf;
    var showClass = this.state.filetoload ? '' : 'is-hidden';
    if (this.state.filetoload != "") {
      pdf = "data:application/pdf;base64," + this.state.filetoload;
    }

    return (
      <div className="header callout secondary">
        <MessageAlert
          showHide={this.state.showMessage}
          type={this.state.typeMess}
          contextText={this.state.contextText}
          onclickMessage={this.onClickMessage}
        />
        <div className="sign">
          <h1>La tabla</h1>
          <div className="columns">
            <Griddle
              columnMetadata={this.metadata}
              results={this.state.dataValue}
              columns={["no_fuec", "created_at", "created_by", "no_agreement","car_license_plate"]}
              showFilter={true}
              showSettings={true}
              onRowClick={this.handleGetFile}
            />
          </div>
          <div className="columns">
            <iframe
              src={pdf}
              className={showClass}
              frameBorder="0"
              width="100%"
              height="500px"
              alt="pdf"
              type="application/pdf"
            />
          </div>
        </div>
      </div>
    )
  }

});

export default TableFuec;
