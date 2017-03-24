import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'

import {message, DatePicker, Card , Form , Input ,
Upload,  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormConductor = React.createClass({

  getInitialState: function () {
    return {
      newOptionSelectA: false,
      childSelectValue: undefined,
      newOptionSelectTiCon: false,

      file_pdf:'',

      startValue: null,
      endValue: null,
      endOpen: false
    };
  },

  componentWillReceiveProps: function (nextProps) {
    var nextTiCon = nextProps.newOptionPerson;
    var prevTiCon = this.props.newOptionPerson;

    if (nextTiCon == true && nextTiCon != prevTiCon) {
      this.setState({
        newOptionSelectTiCon: true
      });
      this.props.onItemNewPerson(false);
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
    this.refs.id_type_agreement.refs.selectValue.selectedIndex = (data.id_type_agreement) ? data.id_type_agreement : undefined;
    this.refs.init_date.value = (data.init_date) ? data.init_date : undefined;
    this.refs.last_date.value = (data.last_date) ? data.last_date : undefined;
  },

  errorHandlerSelect: function (remoteData) {
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var selectAgreement = ref.selectAgreement.value;
    var no_trip = ref.no_trip.value;
    var id_person = ref.id_person.value;
    var id_type_agreement = ref.id_type_agreement.value;
    var init_date = ref.init_date.value;
    var last_date = ref.last_date.value;
    var file_pdf = this.state.file_pdf;

    var params = {
      no_trip: no_trip
      , id_person: id_person
      , id_type_agreement: id_type_agreement
      , init_date: init_date
      , last_date: last_date
      , file_pdf: file_pdf
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
  },

  errorFormCreate: function (err) {
  },

  successFormUpdate: function (data) {
  },

  errorFormUpdate: function (err) {
  },

  handleReset: function (e) {
    this.refs.selectAgreement.value = '';
    this.setState({
      inputValue: ''
    });
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
  },

  handleImagePdf: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        file_pdf: event.target.result
      });
    }.bind(this);

    if (file.type == "application/pdf"){
      reader.readAsDataURL(file)
    }
  },

  errorFormDelete: function (err) {
  },

  disabledStartDate : function (startValue){
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  },

  disabledEndDate: function (endValue){
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  },

  onChange: function (field, value) {
    this.setState({
      [field]: value,
    });
  },

  onStartChange: function (value){
    this.onChange('startValue', value);
  },

  onEndChange: function (value){
        this.onChange('endValue', value);
  },

  handleStartOpenChange: function(open){
    if (!open) {
      this.setState({ endOpen: true  });
    }
  },

  handleEndOpenChange: function(open){
    this.setState({ endOpen: open  });
  },

  render: function () {

    const { startValue, endValue, endOpen  } = this.state

    return (
        <Card id={this.props.id} title="Contrato" extra={ <a href="./tables#contratos"><Icon type="layout"/></a>} bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

            <Row gutter={15}>
              <Col span={8}>
                <FormItem  label="Contratos Existentes">
                  <InputGroup compact>
                    <SelectInput
                      style={{ width: '88%' }}
                      class="input-group-field"
                      url="apiFuec/allAgreement"
                      name="selectAgreement"
                      ref="selectAgreement"
                      newOption={this.state.newOptionSelectA}
                      onUserSelect={this.handleContratoSelect}
                    />
                    <Button onClick={this.handleDelete}  type="danger"  shape="circle" icon="minus"/>
                  </InputGroup>
                </FormItem>

                <FormItem label="No. de Contrato">
                  <Input
                    type="number"
                    ref="no_agreement"
                    name="no_agreement"
                    readOnly/>
                </FormItem>

                <FormItem label="No. de Viaje">
                  <Input
                    type="number"
                    ref="no_trip"
                    name="no_trip"
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label="Contratante - Persona Juridica o Natural">
                  <SelectInput
                    url="apiFuec/allPerson"
                    ref="id_person"
                    name="id_person"
                    newOption={this.state.newOptionSelectTiCon}
                  />
                </FormItem>

                <FormItem label="Tipo de contrato">
                  <SelectInput
                    url="apiFuec/allKindAgreement"
                    name="id_type_agreement"
                    ref="id_type_agreement"
                  />
                </FormItem>


              </Col>

              <Col span={8}>
                <FormItem label="Docuento en formato PDF" >
                  <Upload name="logo" listType="picture" onChange={this.handleImagePdf}>
                    <Button>
                      <Icon type="upload" /> Cargar PDF
                    </Button>
                  </Upload>
                </FormItem>

                <FormItem label="Fecha Inicial y Final" >
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    format="DD-MM-YYYY"
                    value={startValue}
                    placeholder="Inicio"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                  <DatePicker
                    disabledDate={this.disabledEndDate}
                    format="DD-MM-YYYY"
                    value={endValue}
                    placeholder="Fin"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                </FormItem>

                <FormItem>
                  <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                  <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
                </FormItem>

              </Col>

            </Row>
          </Form>
        </Card>
    )
  }

});

export default FormConductor;
