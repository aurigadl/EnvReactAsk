import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
import {Table, Card, Col, Row, Button, Icon} from 'antd';

const columns = [{
  title: 'No del contrato',
  dataIndex: 'no_agreement',
  key: 'no_agreement',
  render: text => <Button type="primary" shape="circle" icon="download"/>,
}, {
  title: 'Fecha de creación',
    dataIndex: 'created_at',
    key: 'created_at',

}, {
  title: 'Creado Por',
    dataIndex: 'created_by',
    key: 'created_by',
}, {
  title: 'Fecha Inicial',
    dataIndex: 'init_date',
    key: 'init_date',
}, {
  title: 'Fecha Final',
    dataIndex: 'last_date',
    key: 'last_date',
}, {
  title: 'No del viaje',
    dataIndex: 'no_trip',
    key: 'no_trip',
}, {
  title: 'Contratante',
    dataIndex: 'person',
    key: 'person',
}];


var TableAgreement = React.createClass({

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


  handleGetFile: function (record, index) {

    var params = {
      'agreement': record.no_agreement
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
          <Table rowKey="id" onRowClick={this.handleGetFile} dataSource={this.state.dataValue} columns={columns} />
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
