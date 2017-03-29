import React from 'react'
import FormRuta from './FormRuta.js'
import TableFuec from './TableFuec.js'
import FormCarro from './FormCarro.js'
import SelectInput from './SelectInput.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import TableAgreement from './TableAgreement.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import {makeRequest as mReq} from '../utils/mrequest';
import {Tooltip, message, DatePicker, Layout, BackTop
  , Card , Form , Input , Col, Row, Button, Icon} from 'antd';

const { Header, Content} = Layout;
const FormItem = Form.Item;
const InputGroup = Input.Group;

const PageTwo = React.createClass({

  getInitialState: function () {
    return {
      newOptionPerson: false,
      newOptionCar: false,
      newOptionMarca: false,
      newOptionRuta: false,

      no_agreefuec: '',
      no_sec: '',
      no_fuec: '',
      no_nit: '',
      social_object: '',
      id_company_legal: '',
      option: [],

      startValue: null,
      endValue: null,
      endOpen: false
    }
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('PageTwo, there was an error!', err.statusText);
      });
  },

  componentDidMount: function () {
    var parreq = {
      method: 'GET',
      url: 'apiSystem/allSystem'
    };
    this.getRemoteData(parreq
      , this.successHandlerSelect
      , this.errorHandlerSelect);
  },


  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    var id_company_legal = data.id_company_legal.toString();
    var no_sec = data.secuence_contract.toString();
    var nit1 = data.nit_1;
    var nit2 = data.nit_2;
    var social_object = data.name;

    this.setState({
      id_company_legal: id_company_legal,
      no_sec: no_sec,
      no_fuec: id_company_legal + no_sec,
      no_nit: nit1 + '-' + nit2,
      social_object: social_object
    });
  },

  errorHandlerSelect: function (remoteData) {
    message.error('Conexion rechazada');
  },


  addNewRuta: function () {
    var newOption = this.state.option;
    newOption.unshift({});
    this.setState({
      option: newOption
    });
  },

  delRelRuta: function (e) {
    let idKey = e.currentTarget.dataset.key;
    var newOption = this.state.option;
    delete newOption[idKey];
    this.setState({
      option: newOption
    });
  },


  handleChangeNoAgreement: function (e) {
    var id_company_legal = this.state.id_company_legal;
    var no_sec = this.state.no_sec;
    var no_agreefuec = e.target.value;
    this.setState({
      no_agreefuec: no_agreefuec,
      no_fuec: id_company_legal + no_agreefuec + no_sec
    });
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;
    var data = [];
    var x = 0;
    var no_fuec = ref.no_fuec.value;
    var social_object = ref.social_object.value;
    var nit = ref.nit.value;
    var no_agreefuec = ref.no_agreefuec.value;
    var contractor = ref.contractor.value;
    var agreement_object = ref.agreement_object.value;
    var kind_agreement_link = ref.kind_agreement_link.value;
    var kind_agreement = ref.kind_agreement.value;
    var init_date = ref.init_date.value;
    var last_date = ref.last_date.value;
    var selectRuta = ref.selectRuta.value;
    var no_car = ref.no_car.value;

    data.push(selectRuta);

    while (eval('ref.selectRuta_' + x) !== undefined) {
      data.push(eval('ref.selectRuta_' + x).value);
      x++;
    }

    var params = {
      no_fuec: no_fuec
      , social_object: social_object
      , nit: nit
      , no_agreefuec: no_agreefuec
      , selectRuta: data
      , contractor: contractor
      , agreement_object: agreement_object
      , kind_agreement_link: kind_agreement_link
      , kind_agreement: kind_agreement
      , init_date: init_date
      , last_date: last_date
      , no_car: no_car
    };

    var parreq = {
      method: 'PUT',
      url: 'apiFuec/newFuec',
      params: {
        'params': params
      }
    };

    this.getRemoteData(parreq,
      this.successFormCreate,
      this.errorFormCreate
    );
  },

  successFormCreate: function (data) {
    message.success('Se creo un nuevo FUEC');
  },

  errorFormCreate: function (err) {
    message.error(err.message.error);
  },

  handleReset: function (e) {
    this.setState({
      no_agreefuec: ''
    });
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
          <Content>

            <div className="hiperLink">

              <Tooltip placement="left" title={'Fuec'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#fuec">Fu</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Carro - Personas'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#personaCarro">Pc</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Ruta'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#ruta">Ru</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Marca'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#marca">Ma</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Carro'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#carro">Ca</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Contrato'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#contrato">Co</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Persona'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#persona">Pe</a></Button>
              </Tooltip>

            </div>

            <Header>
              <h2>
                <Icon type="solution"/>
                FUEC - Contrato Del Servicio Público
              </h2>
            </Header>

            <Card id='fuec' title="FUEC - Contrato Automotor Especial" bordered={false}>
              <Form onSubmit={this.handleSubmitForm}>
                <Row gutter={15}>
                  <Col span={8}>
                    <FormItem  label="No. FUEC" >
                      <Input
                        name="no_fuec"
                        ref="no_fuec"
                        type="text"
                        value={this.state.no_fuec}
                        readOnly/>
                    </FormItem>

                    <FormItem label="Ruta: Origen - Destino" >
                      <InputGroup size="large" compact>
                        <Button onClick={this.addNewRuta}  type="primary"  shape="circle" icon="plus"/>
                        <SelectInput
                          style={{ width: '88%' }}
                          url="apiFuec/allRuta"
                          name={"selectRuta"}
                          ref={"selectRuta"}
                          newOption={this.state.newOptionRuta}
                          onItemNew={this.handleNewElementRuta}
                          required/>
                      </InputGroup>

                      {this.state.option.map(function (data, i) {
                      return (
                      <div key={i} ref={i}>
                        <InputGroup compact>
                          <Button data-key={i} onClick={this.delRelRuta} type="danger" shape="circle" icon="minus"/>
                          <SelectInput
                            style={{ width: '88%' }}
                            url="apiFuec/allRuta"
                            name={"selectRuta_" + i}
                            newOption={this.state.newOptionRuta}
                            onItemNew={this.handleNewElementRuta}
                          />
                        </InputGroup>
                      </div>
                      )
                      }, this)}

                    </FormItem>

                  </Col>

                  <Col span={8}>
                    <FormItem label="Razón social" >
                      <Input
                        name="social_object"
                        ref="social_object"
                        value={this.state.social_object}
                        type="text"
                        readOnly/>
                    </FormItem>
                    <FormItem label="Vehiculo:" >
                      <SelectInput
                        url="apiFuec/allCarWithPerson"
                        name="no_car"
                        ref="no_car"
                        newOption={this.state.newOptionCar}
                        onItemNew={this.handleNewElementCar}
                        required/>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem label="Nit" >
                      <Input
                        name="nit"
                        ref="nit"
                        value={this.state.no_nit}
                        type="text"
                        readOnly/>
                    </FormItem>
                    <FormItem label="Objeto del contrato" >
                      <SelectInput
                        name="agreement_object"
                        ref="agreement_object"
                        url="apiFuec/allObjectAgreement"
                        required/>
                    </FormItem>

                    <FormItem label="Fecha del contrato Inicial - Final" >
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

              <FormPersonaCarro
                id='personaCarro'
                newOptionPerson={this.state.newOptionPerson}
                onItemNewPerson={this.handleNewElementPerson}
                newOptionCar={this.state.newOptionCar}
                onItemNewCar={this.handleNewElementCar} />

              <Row>
                <Col span="12">
                  <FormRuta
                    id="ruta"
                    onItemNew={this.handleNewElementRuta} />
                </Col>
                <Col span="12">
                  <FormMarcaAuto
                    id="marca"
                    onItemNew={this.handleNewElementMarca} />
                </Col>
              </Row>

              <FormCarro
                id='carro'
                newOptionMarca={this.state.newOptionMarca}
                onItemNewMarca={this.handleNewElementMarca}
                onItemNewCar={this.handleNewElementCar} />

              <FormContrato
                id='contrato'
                newOptionPerson={this.state.newOptionPerson}
                onItemNewPerson={this.handleNewElementPerson}
                onItemNewAgreement={this.handleNewAgreement} />

              <FormPersona
                id="persona"
                onItemNew={this.handleNewElementPerson} />

            <BackTop/>
          </Content>
    );
  }
});

export default PageTwo
