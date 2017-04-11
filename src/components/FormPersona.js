import React from 'react';
import moment from 'moment';
import SelectInput from './SelectInput.js';
import {remoteData} from '../utils/mrequest';
import {Tooltip, Card , Form , Input , message, DatePicker,
  Col, Row, Button, Icon, InputNumber, Radio} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

var FormPersona = Form.create()(React.createClass({

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
        url: 'apiFuec/idPerson',
        params: params
      };

      remoteData(parreq,
          (data) => {
            const res = data.result;
            this.props.form.setFieldsValue({
               input_uno   :res.type_person
              ,input_dos   :res.address
              ,input_tres  :res.license
              ,input_cuatro:res.first_name
              ,input_cinco :res.last_name
              ,input_seis  :res.email
              ,input_siete :moment(res.effective_date, 'YYYY-MM-DD')
              ,input_ocho  :res.phone
              ,input_nueve :{key:res.id_type_i,label:res.id_type_t}
              ,input_diez  :res.id_number
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
           type_person    : val.input_uno.toString()
          ,address        : val.input_dos
          ,license        : val.input_tres
          ,first_name     : val.input_cuatro
          ,last_name      : val.input_cinco
          ,email          : val.input_seis
          ,effective_date : val.input_siete.format('YYYY-MM-DD')
          ,phone          : val.input_ocho
          ,id_type        : val.input_nueve.key.toString()
          ,id_number      : val.input_diez
        };

        if (selecChildV === undefined || selecChildV === "") {
          var parreq = {
            method: 'POST',
            url: 'apiFuec/newPerson',
            params: {'params': params}
          };

          remoteData(parreq,
              (data) => {
                message.success('Se creo un nuevo registro persona');
                this.setState({
                  childSelectValue: undefined,
                  newOption: this.state.newOption + 1
                });
                this.handleReset();
              },
              (err) => {
                message.error('NO se creo el registro' +
                  '\n Error :' + err.message.error)
          });

        } else {

          params['id'] = selecChildV;

          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updateIdPerson',
            params: {
              'params': params
            }
          };

          remoteData(parreq,
              (data) => {
                message.success('Se actulizo el registro persona: ' + selecChildT);
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

  handleDelete: function (e) {
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    if(get_id){

      const params = { id: get_id };
      const parreq = {
        method: 'DELETE',
        url: 'apiFuec/deleteIdPerson',
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
        <Card id={this.props.id} title="Personas" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>
                <FormItem label="Personas Existentes" >
                    <Col span={2}>
                      <Tooltip title={'Borrar el registro seleccionado'}>
                        <Button
                          onClick={this.handleDelete}
                          size="small"
                          type="danger"
                          icon="minus"/>
                      </Tooltip>
                    </Col>
                    <Col span={22}>
                      <SelectInput
                        url="apiFuec/allPerson"
                        value={{key:this.state.childSelectValue}}
                        newOption={this.state.newOption}
                        onUserSelect={this.handleSelect}
                      />
                    </Col>
                </FormItem>

                <FormItem label="Tipo de persona" >
                  {getFieldDecorator('input_uno',
                  {
                    rules: [
                      { required: true,
                        message: 'Seleccione un tipo de persona!'
                      }
                    ],
                  })(
                  <RadioGroup>
                    <Radio value={0}>Natural</Radio>
                    <Radio value={1}>Juridica</Radio>
                  </RadioGroup>
                  )}
                </FormItem>

                <FormItem label="Licencia">
                  {getFieldDecorator('input_tres',
                  {
                    rules: [
                      { message: 'Ingrese el numero de Licencia!' },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Vigencia - Liencia">
                  {getFieldDecorator('input_siete',
                  {
                    rules: [
                      {
                        type: 'object',
                        message: 'Ingrese la fecha de vigencia!'
                      },
                    ],
                  })(
                  <DatePicker/>
                  )}
                </FormItem>

              </Col>

              <Col span={8}>
                <FormItem label="Nombres" >
                  {getFieldDecorator('input_cuatro',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese los nombres!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Apellidos" >
                  {getFieldDecorator('input_cinco',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese los Apellidos!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Correo Electronico" >
                  {getFieldDecorator('input_seis',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese el correo electronico!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Dirección">
                  {getFieldDecorator('input_dos',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese la Dirección!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

              </Col>

              <Col span={8}>
                <FormItem label="Telefono" >
                  {getFieldDecorator('input_ocho',
                  {
                    rules: [
                      { required: true,
                        message: 'Ingrese el numero telefonico!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Tipo de Identificación">
                  {getFieldDecorator('input_nueve',
                  {
                    rules: [
                      { required: true,
                        message: 'Seleccione el tipo de identificación!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allIdType"/>
                  )}
                </FormItem>

                <FormItem label="Identificación">
                  {getFieldDecorator('input_diez',
                  {
                    rules: [
                      { required: true,
                        message: 'Seleccione el tipo de identificación!'
                      },
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem>
                  <Button
                    disabled={this.hasErrors(getFieldsError())}
                    type="primary"
                    htmlType="submit"
                    size="large">Grabar</Button>

                  <Button style={{ marginLeft: 8  }}
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

export default FormPersona;
