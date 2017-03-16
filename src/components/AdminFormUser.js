import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import { message, Checkbox ,Card, Form,
  Input , Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var AdminFormUser = Form.create()(React.createClass({

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
        url: 'apiUser/idUser',
        params: params
      };

      remoteData(parreq,
          (data) => {
            const res = data.result;
            this.props.form.setFieldsValue({
               input_uno   :res.email
              ,input_dos   :res.first_name
              ,input_tres  :res.last_name
              ,input_cuatro:res.display_name
              ,input_cinco :res.active
              ,input_seis  :res.new_user
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
    var ref = e.target.elements;
    var user = ref.user.value;
    var email = ref.email.value;
    var first_name = ref.first_name.value;
    var last_name = ref.last_name.value;
    var active = ref.active.checked;
    var display_name = ref.display_name.value;
    var new_user = ref.new_user.checked;

    if (user === "") {
      var params = {
        email: email,
        first_name: first_name,
        last_name: last_name,
        display_name: display_name
      };

      var parreq = {
        method: 'POST',
        url: 'apiUser/newuser',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      var params = {
        id: user,
        email: email,
        first_name: first_name,
        last_name: last_name,
        active: active,
        display_name: display_name,
        new_user: new_user
      };

      var parreq = {
        method: 'PUT',
        url: 'apiUser/updateIdUser',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormUpdate,
        this.errorFormUpdate
      );
    }
  },

  successFormCreate: function (data){
    message.success('Se creo el usuario', 10);
    this.props.onItemNew(true);
  },

  errorFormCreate: function (err){
    message.error('No se creo el usuario',10);
  },

  successFormUpdate: function (data){
    message.success('Se actulizo el usuario', 10);
  },

  errorFormUpdate: function (err){
    message.error('No se actualizo el usuario',10);
  },

  hasErrors: function(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  render: function () {

    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
        <Card id={this.props.id} title="Usuarios del sistema" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>

              <FormItem label="Usuarios Existentes" >
                <SelectInput
                  url="apiUser/allUser"
                  value={{key:this.state.childSelectValue}}
                  newOption={this.state.newOption}
                  onUserSelect={this.handleSelect}
                />
              </FormItem>

              <FormItem label="Correo Electronico"
                extra="No modificable." >
                  {getFieldDecorator('input_uno',
                  {
                    rules: [
                      { required: true,
                        message: 'Digite un correo electronico!'
                      }
                    ],
                  })(
                  <Input placeholder="Correo Electronico" />
                  )}
              </FormItem>

              <FormItem label="Nombres" >
                  {getFieldDecorator('input_dos',
                  {
                    rules: [
                      { required: true,
                        message: 'Nombre de la persona a crear!'
                      }
                    ],
                  })(
                  <Input placeholder="Nombres" />
                  )}
              </FormItem>

              <FormItem label="Apellidos" >
                  {getFieldDecorator('input_tres',
                  {
                    rules: [
                      { required: true,
                        message: 'Nombre de la persona a crear!'
                      }
                    ],
                  })(
                  <Input placeholder="Apellidos" />
                  )}
              </FormItem>

              <FormItem label="Nombre a mostrar" >
                  {getFieldDecorator('input_cuatro',
                  {
                    rules: [
                      { required: true,
                        message: 'Nombre - Alias!'
                      }
                    ],
                  })(
                  <Input
                    placeholder="Un alias o el mismo nombre"
                  />
                  )}
              </FormItem>

              <Row gutter={8}>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('input_cinco',{
                    valuePropName: 'checked',
                    initialValue: false,
                    })(
                    <Checkbox>Estado</Checkbox>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator('input_seis',{
                    valuePropName: 'checked',
                    initialValue: false,
                    })(
                    <Checkbox> Usuario Nuevo </Checkbox>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <FormItem>
                <Button
                  disabled={this.hasErrors(getFieldsError())}
                  type="primary"
                  htmlType="submit"
                  size="large">Grabar</Button>

                <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
              </FormItem>

            </Row>
          </Form>
        </Card>
    )
  }
}));

export default AdminFormUser;
