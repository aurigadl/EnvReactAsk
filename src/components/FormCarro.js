import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import {Tooltip, Card , Form , Input , message,
  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;


var FormCarro = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      newOption: 0,

      input_dos:''
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOptionMarca;
    var prev = this.props.newOptionMarca;
    if (next != prev){
      this.setState({
        newOptionSelectMarca: true
      });
    }
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

  handleSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      childSelectText: childSelectText
    });

    if (childSelectValue != undefined) {

      var params = {'id': childSelectValue};

      var parreq = {
        method: 'GET',
        url: 'apiFuec/idCar',
        params: params
      };

      remoteData(parreq,
          (data) => {

          },
          (err) => {
            message.error('NO se cargaron los datos de la seleccion: ' +
              '\n Error :' + err.message.error)
          }
      );

    } else {
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
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const selecChildV = this.state.childSelectValue;
    const selecChildT = this.state.childSelectText;

    form.validateFields((err, values) => {
      if (!err) {
        message.success('Se creo el registro: ok');
      }
    })

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
  },

  errorFormCreate: function (err) {
  },

  successFormUpdate: function (data) {
  },

  errorFormUpdate: function (err) {
  },


  //Delete select option
  handleDelete: function(e){
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    if(get_id){

      const params = { id: get_id };
      const parreq = {
        method: 'DELETE',
        url: 'apiFuec/deleteIdCar',
        params: {'params': params}
      };

      remoteData(parreq,
          (data) => {
            message.success('Se borro el registro: ' + this.state.childSelectText);
            this.props.onItemNew(true);
            this.setState({newOption: this.state.newOption + 1});
            this.handleReset();
          },
          (err) => {
            message.error('NO se borro el registro: '+ this.state.childSelectText +
              '\n Error: ' + err.message.error)
          }
      );
    }
  },

  hasErrors: function(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  render: function () {

    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
        <Card id={this.props.id} title="Carro" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>

                <FormItem label="Carros Existentes">
                  <InputGroup compact>
                    <SelectInput
                      style={{ width: '88%' }}
                      url="apiFuec/allCar"
                      value={{key:this.state.childSelectValue}}
                      newOption={this.state.newOption}
                      onUserSelect={this.handleSelect}
                    />
                    <Button
                      onClick={this.handleDelete}
                      type="danger"
                      shape="circle"
                      icon="minus"/>
                  </InputGroup>
                </FormItem>

                <FormItem label="No. de Carro">
                  <Input
                    type="number"
                    disabled={true} />
                </FormItem>

                <FormItem label="Marca">
                  {getFieldDecorator('input_dos',
                  {
                    rules: [
                      { required: true,
                        message: 'Seleccione una marca de vehiculo!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allMarca"
                    newOption={this.state.newOptionSelectMarca}/>
                  )}
                </FormItem>

              </Col>
              <Col span={8}>

                <FormItem label="Placa">
                  {getFieldDecorator('input_tres',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese la placa del vehiculo!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Modelo">
                  {getFieldDecorator('input_cuatro',
                  {
                    rules: [
                      { required: true,
                        message: 'Seleccione un modelo de vehiculo!'
                      },
                    ],
                  })(
                  <Input
                    pattern="^\d{4}$"
                    min="2010"
                    max="2020"
                    placeholder="YYYY"/>
                  )}
                </FormItem>

              </Col>
              <Col span={8}>

                <FormItem label="Clase">
                  {getFieldDecorator('input_cinco',
                  {
                    rules: [
                      { required: true,
                        message: 'Seleccione una clase de vehiculo!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allClassCar" />
                  )}
                </FormItem>

                <FormItem label="Tarjeta de operación">
                  {getFieldDecorator('input_seis',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese el numero de la tarjeta de operación!'
                      },
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                <FormItem>
                  <Button
                    disabled={this.hasErrors(getFieldsError())}
                    type="primary"
                    htmlType="submit"
                    size="large">Grabar</Button>

                  <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>

                </FormItem>

              </Col>
            </Row>
          </Form>
        </Card>
    )
  }
}));

export default FormCarro;
