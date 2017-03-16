import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import {Tooltip, Card , Form , Input , message,
  Col, Row, Button, Icon, InputNumber} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;


var FormCarro = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      newOption: 0,
    };
  },

  handleReset: function (e) {
    this.props.form.resetFields();
    this.setState({
      childSelectValue: undefined,
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
            const res = data.result;
            this.props.form.setFieldsValue({
              input_uno: res.no_car,
              input_dos: {key:res.brand_i,label:res.brand_t},
              input_tres: res.license_plate,
              input_cuatro: res.model,
              input_cinco: {key:res.class_car_i,label:res.class_car_t},
              input_seis: res.operation_card
            });
          },
          (err) => {
            message.error('NO se cargaron los datos de la seleccion: ' +
              '\n Error :' + err.message.error)
          }
      );

    }
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const selecChildV = this.state.childSelectValue;
    const selecChildT = this.state.childSelectText;

    form.validateFields((err, val) => {
      if (!err) {
        var params = {
            license_plate: val.input_tres
          , model: val.input_cuatro.toString()
          , brand: val.input_dos.key.toString()
          , class_car: val.input_cinco.key.toString()
          , operation_card: val.input_seis
        };

        //If the user does not select an existing option
        //create a new register
        if (selecChildV === undefined || selecChildV === "") {

          var parreq = {
            method: 'POST',
            url: 'apiFuec/newCar',
            params: {'params': params}
          };

          remoteData(parreq,
            (data) => {
              message.success('Se creo un nuevo registro carro');
              this.setState({
                newOption: this.state.newOption + 1
              });
              this.handleReset();
            },
            (err) => {
              message.error('NO se creo el registro' +
                '\n Error :' + err.message.error)
            }
          );

        } else {

          params['id'] = selecChildV;

          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updateIdCar',
            params: {
              'params': params
            }
          };

          remoteData(parreq,
            (data) => {
              message.success('Se actulizo el registro carro: ' + selecChildT);
              this.setState({
                newOption: this.state.newOption + 1
              });
              this.handleReset();
            },
            (err) => {
              message.error('NO se actualizo el registro' +
                '\n Error :' + err.message.error)
            }
          );

        }
      }
    })

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
            this.setState({
              newOption: this.state.newOption + 1
            });
            this.handleReset();
          },
          (err) => {
            message.error('Se genero un error en el registro: '+ this.state.childSelectText +
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

                <FormItem label="Carros Existentes - Placa">
                  <InputGroup compact>
                    <SelectInput
                      style={{ width: '88%' }}
                      url="apiFuec/allCar"
                      value={{key:this.state.childSelectValue}}
                      newOption={this.state.newOption}
                      onUserSelect={this.handleSelect}
                    />
                    <Tooltip title={'Borrar el registro seleccionado'}>
                      <Button
                        onClick={this.handleDelete}
                        type="danger"
                        shape="circle"
                        icon="minus"/>
                    </Tooltip>
                  </InputGroup>
                </FormItem>

                <FormItem label="No. de Carro">
                  {getFieldDecorator('input_uno')(
                  <Input
                    disabled={true} />
                  )}
                </FormItem>

                <FormItem label="Marca">
                  {getFieldDecorator('input_dos',
                  {
                    rules: [
                      { required: true,
                        type: 'object',
                        message: 'Seleccione una marca de vehiculo!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allMarca"/>
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
                  <InputNumber
                    min={2010}
                    max={2020}
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

                  <Button
                    style={{ marginLeft: 8  }}
                    htmlType="reset"
                    size="large"
                    onClick={this.handleReset}>Limpiar</Button>
                </FormItem>

              </Col>
            </Row>
          </Form>
        </Card>
    )
  }
}));

export default FormCarro;
