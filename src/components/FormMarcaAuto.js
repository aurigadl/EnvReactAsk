import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import {Tooltip, Card , Form , Input , message,
  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormMarcaAuto = Form.create()(React.createClass({

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
      marcaedit: childSelectText,
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
        const brand_new = values.marcaedit;
        //If the user does not select an existing option
        //create a new register
        if (selecChildV === undefined || selecChildV === "") {
          var params = { marca: brand_new };

          var parreq = {
            method: 'POST',
            url: 'apiFuec/newMarca',
            params: {'params': params}
          };

          remoteData(parreq,
            (data) => {
              message.success('Se creo el registro: ' + brand_new);
              this.setState({newOptionMA: this.state.newOptionMA + 1});
              //Update Container
              this.props.newOptCont();
              this.handleReset();
            },
            (err) => {
              message.error('NO se creo el registro: '+ brand_new +
                '\n Error :' + err.message.error)
            }
          );

        //If the user select an existing option
        //edit register selected.
        } else {
          var params = {
            id: selecChildV,
            name: brand_new
          };

          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updateIdMarca',
            params: {'params': params}
          };

          remoteData(parreq,
            (data) => {
              message.success('Se edito el registro (' + selecChildT + ') con ('+ brand_new+')');
              this.setState({newOptionMA: this.state.newOptionMA + 1});
              //Update Container
              this.props.newOptCont();
              this.handleReset();
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
        url: 'apiFuec/deleteIdMarca',
        params: {'params': params}
      };

      remoteData(parreq,
          (data) => {
            message.success('Se borro el registro: ' + this.state.childSelectText);
            this.setState({newOptionMA: this.state.newOptionMA + 1});
            //Update Container
            this.props.newOptCont();
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
    const { childSelectValue, initialValue, childSelectText } = this.state;
    const marcaEditError = isFieldTouched('marcaedit') && getFieldError('marcaedit');
    var valSelec = '';

    if(childSelectValue){
      valSelec = {key:childSelectValue,label:childSelectText}
    }else if(initialValue){
      valSelec = initialValue;
    }

    return (
        <Card id={this.props.id} title="Marca de Carros" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

              <FormItem>
                <InputGroup compact>

                  <SelectInput
                    style={{ width: '88%' }}
                    url="apiFuec/allMarca"
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
                validateStatus={marcaEditError ? 'error' : ''}
                help={marcaEditError || ''}
              >
                {getFieldDecorator('marcaedit', {
                initialValue: valSelec.label,
                })(
                <Input
                  placeholder="Editar o crear..."
                  onChange={this.onChange}/>
              )}
              </FormItem>

              <FormItem>

                <Button
                  disabled={getFieldError('marcaedit')}
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

export default FormMarcaAuto;
