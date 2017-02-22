import React from 'react'
import Griddle from 'griddle-react'
import {makeRequest as mReq} from '../utils/mrequest';
import {Card, Col, Row, Button, Icon} from 'antd';

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

var TableAgreement = React.createClass({
  metadata: [
    {
      "columnName": "id",
      "order": 1,
      "locked": false,
      "visible": false
    },
    {
      "columnName": "no_agreement",
      "order": 2,
      "locked": false,
      "visible": true,
      "displayName": "No Contrato",
      "customComponent": LinkComponent
    },
    {
      "columnName": "created_at",
      "order": 3,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Creación"
    },
    {
      "columnName": "KindAgreement",
      "order": 4,
      "locked": false,
      "visible": true,
      "displayName": "Contrato"
    },
    {
      "columnName": "created_by",
      "order": 5,
      "locked": false,
      "visible": true,
      "displayName": "Creador"
    },
    {
      "columnName": "init_date",
      "order": 6,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Inicial"
    },
    {
      "columnName": "last_date",
      "order": 7,
      "locked": false,
      "visible": true,
      "displayName": "Fecha Final"
    },
    {
      "columnName": "no_trip",
      "order": 8,
      "locked": false,
      "visible": false,
      "displayName": "Viaje"
    },
    {
      "columnName": "person",
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
  },


  handleGetFile: function (e) {

    var params = {
      'agreement': e.props.data.no_agreement
    };

    var parreq = {
      method: 'GET',
      url: 'apiFuec/fileAgreement',
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
  },

  render: function () {

    var pdf;

    var showClass = this.state.filetoload ? '' : 'is-hidden';
    if(this.state.filetoload != ""){
      pdf = "data:application/pdf;base64," + this.state.filetoload;
    }

    return (
        <Card title="Listado de contratos" bordered={false}>
          <Griddle
            columnMetadata={this.metadata}
            results={this.state.dataValue}
            columns={["no_agreement", "created_at", "KindAgreement", "created_by"]}
            showFilter={true}
            showSettings={true}
            onRowClick={this.handleGetFile}
          />
          <iframe
            src={pdf}
            className={showClass}
            width="100%"
            height="500px"
            alt="pdf"
            type="application/pdf"
          />
        </Card>
    )
  }

});

export default TableAgreement;
