import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import {Tooltip, Card , Form , Input , message,
  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormRuta = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      inputValue: '',
      newOptionMA: 0
    };
  },

  //let emtpy fields and diseble button
  componentDidMount: function(){
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  },

  //callback to get data from component selectinput
  handleUserSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      childSelectText: childSelectText
    });
    this.props.form.setFieldsValue({
      edit: childSelectText,
    });
  },

  //Return all field to the initial state
  handleReset: function (e) {
    this.props.form.resetFields();
    this.setState({
      childSelectValue: '',
    });
    this.props.form.validateFields();
  },

  //Register change when the user enter characters
  onChange(e) {
    this.setState({inputValue: e.target.value});
  },

  //Create and edit option
  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const selecChildV = this.state.childSelectValue;
    const selecChildT = this.state.childSelectText;

    form.validateFields((err, values) => {
      if (!err) {
        const data_new = values.edit;
        //If the user does not select an existing option
        //create a new register
        if (selecChildV === undefined || selecChildV === "") {
          var params = { name: data_new };

          var parreq = {
            method: 'POST',
            url: 'apiFuec/newRuta',
            params: {'params': params}
          };

          remoteData(parreq,
            (data) => {
              message.success('Se creo el registro: ' + data_new);
              this.setState({newOptionMA: this.state.newOptionMA + 1});
              this.handleReset();
              this.props.onItemNew(true);
            },
            (err) => {
              message.error('NO se creo el registro: '+ data_new +
                '\n Error :' + err.message.error)
            }
          );

        //If the user select an existing option
        //edit register selected.
        } else {
          var params = {
            id: selecChildV,
            name: data_new
          };

          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updateIdRuta',
            params: {'params': params}
          };

          remoteData(parreq,
            (data) => {
              message.success('Se edito el registro (' + selecChildT + ') con ('+ data_new+')');
              this.setState({newOptionMA: this.state.newOptionMA + 1});
              this.handleReset();
              this.props.onItemNew(true);
            },
            (err) => {
              message.error('No se edito el registro: '+ selecChildT +
                '\n Error:' + err.message.error)
            }
          );
        }
      }
    });
  },

  //Delete select option
  handleDelete: function(e){
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    if(get_id){

      const params = { id: get_id };
      const parreq = {
        method: 'DELETE',
        url: 'apiFuec/deleteIdRuta',
        params: {'params': params}
      };

      remoteData(parreq,
          (data) => {
            message.success('Se borro el registro: ' + this.state.childSelectText);
            this.props.onItemNew(true);
            this.setState({newOptionMA: this.state.newOptionMA + 1});
            this.handleReset();
          },
          (err) => {
            message.error('NO se borro el registro: '+ this.state.childSelectText +
              '\n Error: ' + err.message.error)
          }
      );
    }
  },

  render: function () {

    const { getFieldDecorator, getFieldError, isFieldTouched  } = this.props.form;
    const editError = isFieldTouched('edit') && getFieldError('edit');

    return (
        <Card id={this.props.id} title="Rutas y Trayectos" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

              <FormItem>
                <InputGroup compact>

                  <SelectInput
                    style={{ width: '88%' }}
                    url="apiFuec/allRuta"
                    value={{key:this.state.childSelectValue}}
                    newOption={this.state.newOptionMA}
                    onUserSelect={this.handleUserSelect}
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

              <FormItem
                validateStatus={editError ? 'error' : ''}
                help={editError || ''}
              >
                {getFieldDecorator('edit', {
                rules: [{required: true,
                         whitespace: true,
                         min: '3',
                         initialValue: '',
                         message: 'Ingrese una nueva ruta!'}],
                })(
                <Input
                  placeholder="Editar o crear..."
                  onChange={this.onChange}/>
              )}
              </FormItem>

              <FormItem>

                <Button
                  disabled={getFieldError('edit')}
                  type="primary"
                  htmlType="submit"
                  size="large">
                  Grabar
                </Button>

                <Button
                  style={{ marginLeft: 8  }}
                  htmlType="reset"
                  size="large"
                  onClick={this.handleReset}>
                  Limpiar
                </Button>

              </FormItem>

          </Form>
        </Card>
    )
  }

}));

export default FormRuta;
