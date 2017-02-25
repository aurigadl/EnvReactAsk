import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';

import {Card , Form , Input , Col, Row, Button, Icon, message} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;

var AdminFormEmpresa = React.createClass({

  getInitialState: function () {
    return {
      fileSign:'',
      fileLogo:''
    };
  },


  loadOptionFromServer: function () {
    var parreq = {
      method: 'GET',
      url: 'apiSystem/allSystem'
    };

    mReq(parreq)
      .then(function (response) {
        this.successHandler(response.result)
      }.bind(this))
      .catch(function (err) {
        console.log('AdminFormEmpresa, there was an error!', err.statusText);
      });
  },

  successHandler: function (data) {
    this.refs.name.value = data.name;
    this.refs.address.value = data.address;
    this.refs.owner.value = data.owner;
    this.refs.phone.value = data.phone;
    this.refs.email.value = data.email;
    this.refs.nit_1.value = data.nit_1;
    this.refs.nit_2.value = data.nit_2;
    this.refs.secuence_contract.value = data.secuence_contract;
    this.refs.id_company_legal.value = data.id_company_legal;
    this.refs.secuence_payroll.value = data.secuence_payroll;
    this.refs.secuence_vehicle.value = data.secuence_vehicle;

    this.setState({
      fileSign: data.sign,
      fileLogo: data.logo
    });

  },

  componentDidMount: function () {
    this.loadOptionFromServer();
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

    var name = ref.name.value;
    var address = ref.address.value;
    var owner = ref.owner.value;
    var phone = ref.phone.value;
    var email = ref.email.value;
    var nit_1 = ref.nit_1.value;
    var nit_2 = ref.nit_2.value;
    var secuence_contract = ref.secuence_contract.value;
    var id_company_legal = ref.id_company_legal.value;
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
      , id_company_legal: id_company_legal
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

  successFormUpdate: function (data) {
    message.success('Se actualizaron los datos de la empresa', 10);
  },

  errorFormUpdate: function (err) {
    message.error('No se actualizaron los datos de la empresa', 10)
  },

  handleImageLogo: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        fileLogo: event.target.result
      });
    }.bind(this);

    if (file.type == "image/png"){
      reader.readAsDataURL(file)
    }
  },

  handleImageSign: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        fileSign: event.target.result
      });
    }.bind(this);

    if (file.type == "image/png"){
      reader.readAsDataURL(file)
    }
  },


  render: function () {

    var imgLogo = this.state.fileLogo;
    var imagePreviewLogo;
    var imgSign = this.state.fileSign;
    var imagePreviewSign;

    if (imgLogo) {
      imagePreviewLogo = (<img src={imgLogo}/>);
    }

    if (imgSign) {
      imagePreviewSign = (<img src={imgSign}/>);
    }

    return (
        <Card id={this.props.id} title="Empresa" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>
                <FormItem label="Razón social">
                  <Input name="name"
                    type="text"
                    ref="name"
                    placeholder=""
                    required/>
                </FormItem>

                <FormItem label="Dirección">
                  <Input name="address"
                        type="text"
                        ref="address"
                        placeholder=""
                        required/>
                </FormItem>

                <FormItem label="Telefono">
                  <Input name="phone"
                    type="text"
                    ref="phone"
                    placeholder=""
                    required/>
                </FormItem>

                <FormItem label="Correo electronico">
                  <Input name="email"
                    type="email"
                    ref="email"
                    placeholder=""
                    required/>
                </FormItem>

              </Col>

              <Col span={8}>
                <FormItem label="Nit - Consecutivo de identificación">
                  <InputGroup compact>
                    <Input
                      style={{ width: '70%'  }}
                      name="nit_1"
                      type="number"
                      placeholder=""
                      ref="nit_1"
                      required/>

                    <Input
                      style={{ width: '30%' }}
                      name="nit_2"
                      type="number"
                      placeholder=""
                      ref="nit_2"
                      required/>
                  </InputGroup>
                </FormItem>

                <FormItem label="Identificación de la empresa">
                  <Input name="id_company_legal"
                    type="number"
                    placeholder=""
                    ref="id_company_legal"
                    required/>
                </FormItem>

                <FormItem label="Consecutivo contratos">
                  <Input name="secuence_contract"
                    type="number"
                    placeholder=""
                    ref="secuence_contract"
                    required/>
                </FormItem>

                <FormItem label="Consecutivo Planilla">
                  <Input name="secuence_payroll"
                    type="number"
                    placeholder=""
                    ref="secuence_payroll"
                    required/>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label="Consecutivo Planilla">
                  <Input name="secuence_vehicle"
                    type="number"
                    placeholder=""
                    ref="secuence_vehicle"
                    required/>
                </FormItem>

                <FormItem label="Representante Legal o Gerente">
                  <Input name="owner"
                    type="text"
                    ref="owner"
                    placeholder=""
                    required/>
                </FormItem>

                <FormItem label="Firma 'Grafico en PNG'">
                  <Input name="sign"
                    type="file"
                    ref="sign"
                    accept="image/png"
                    placeholder=""
                    onChange={this.handleImageSign} />
                </FormItem>
                {imagePreviewSign}

                <FormItem label="Logo 'Grafico en PNG'">
                  <Input name="logo"
                    type="file"
                    ref="logo"
                    accept="image/png"
                    placeholder=""
                    onChange={this.handleImageLogo} />
                </FormItem>
                {imagePreviewLogo}

                <Button type="primary" htmlType="submit" size="large">Grabar</Button>
              </Col>
            </Row>
        </Form>
      </Card>
    )
  }

});

export default AdminFormEmpresa;
