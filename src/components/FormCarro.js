import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'

import {Card , Form , Input , Col, Row, Button, Icon} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;


var FormCarro = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: [],
      newOptionSelectA: false,
      newOptionSelectMarca: false,

      showMessage: false,
      typeMess: '',
      contextText: ''
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOptionMarca;
    var prev = this.props.newOptionMarca;
    if ( next == true  && next != prev){
      this.setState({
        newOptionSelectMarca: true
      });
      this.props.onItemNewMarca(false);
    }
    if ( next == false  && next != prev){
      this.setState({
        newOptionSelectMarca: false
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
        console.log('AdminFormUser, there was an error!', err.statusText);
      });
  },

  handleCarSelect: function (childSelectValue) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idCar',
        params: params
      };
      this.getRemoteData(parreq
        , this.successHandlerSelect
        , this.errorHandlerSelect);
    } else {
      this.refs.no_car.value = '';
      this.refs.license_plate.value = '';
      this.refs.model.value = '';
      this.refs.brand.refs.selectValue.selectedIndex = undefined;
      this.refs.class_car.refs.selectValue.selectedIndex = undefined;
      this.refs.operation_card.value = '';
    }
  },

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    var d = new Date();
    var n = d.getFullYear();
    this.refs.no_car.value = (data.no_car) ? data.no_car : undefined;
    this.refs.license_plate.value = (data.license_plate) ? data.license_plate : undefined;
    this.refs.model.value = (data.model) ? data.model : n;
    this.refs.brand.refs.selectValue.selectedIndex = (data.brand) ? data.brand : undefined;
    this.refs.class_car.refs.selectValue.selectedIndex = (data.class_car) ? data.class_car : undefined;
    this.refs.operation_card.value = (data.operation_card) ? data.operation_card : undefined;
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

  handleReset: function (e) {
    this.refs.selectCar.value = '';
    this.refs.no_car.value = '';
    this.refs.license_plate.value = '';
    this.refs.model.value = '';
    this.refs.brand.refs.selectValue.selectedIndex = undefined;
    this.refs.class_car.refs.selectValue.selectedIndex = undefined;
    this.refs.operation_card.value = '';

    this.setState({
      inputValue: ''
    });

  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var selectCar = ref.selectCar.value;
    var license_plate = ref.license_plate.value;
    var model = ref.model.value;
    var brand = ref.brand.value;
    var class_car = ref.class_car.value;
    var operation_card = ref.operation_card.value;

    var params = {
      license_plate: license_plate
      , model: model
      , brand: brand
      , class_car: class_car
      , operation_card: operation_card
    };

    if (selectCar === "") {

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newCar',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      params['id'] = selectCar;

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdCar',
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
    this.setState({
      showMessage: true,
      contextText: 'Se creo un nuevo carro',
      typeMess: 'success',
      newOptionSelectA: true
    });

    this.refs.no_car.value = data.no_car;
    this.props.onItemNewCar(true);

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
      contextText: 'No se Creo el carro. Alguno de los datos no esta completo',
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
      contextText: 'Se Actualizo el carro',
      typeMess: 'success'
    });
    this.props.onItemNewCar(true);
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
      contextText: 'No se Actualizo el carro',
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

  render: function () {
    return (
        <Card id={this.props.id} title="Carro" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>

                <FormItem label="Carros Existentes">
                  <InputGroup compact>
                    <SelectInput
                      style={{ width: '88%' }}
                      class="input-group-field"
                      url="apiFuec/allCar"
                      name="selectCar"
                      ref="selectCar"
                      newOption={this.state.newOptionSelectA}
                      onUserSelect={this.handleCarSelect}
                    />
                    <Button type="danger" htmlType="submit" shape="circle"/>
                  </InputGroup>
                </FormItem>

                <FormItem label="No. de Carro">
                  <Input
                    type="number"
                    ref="no_car"
                    name="no_car"
                    readOnly/>
                </FormItem>

                <FormItem label="Marca">
                  <SelectInput
                    url="apiFuec/allMarca"
                    name="brand"
                    ref="brand"
                    newOption={this.state.newOptionSelectMarca}
                    required/>
                </FormItem>

              </Col>
              <Col span={8}>

                <FormItem label="Placa">
                  <Input
                    ref="license_plate"
                    name="license_plate"
                    type="text"
                    placeholder=""
                    required/>
                </FormItem>

                <FormItem label="Modelo">
                  <Input
                    ref="model"
                    name="model"
                    type="number"
                    pattern="^\d{4}$"
                    min="2010"
                    max="2020"
                    placeholder="YYYY"
                    required/>
                </FormItem>

              </Col>
              <Col span={8}>

                <FormItem label="Clase">
                  <SelectInput
                    url="apiFuec/allClassCar"
                    ref="class_car"
                    name="class_car"
                    placeholder=""
                    required/>
                </FormItem>

                <FormItem label="Tarjeta de openación">
                  <Input
                    ref="operation_card"
                    name="operation_card"
                    type="text"
                    placeholder=""
                    required/>
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

export default FormCarro;
