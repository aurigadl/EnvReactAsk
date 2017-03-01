import React from 'react'
import SelectInput from './SelectInput.js'
import {makeRequest as mReq} from '../utils/mrequest';

import {Tooltip, Card , Form , Input ,
  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


var FormMarcaAuto = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      inputValue: '',
      newOptionSelectA: false
    };
  },


  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  },


  handleUserSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      inputValue: childSelectText
    });
  },

  handleReset: function (e) {
    this.props.form.resetFields();
    this.setState({
      childSelectValue: null,
    });
  },

  onChange(e) {
    this.setState({inputValue: e.target.value});
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
        .then(function (response) {
          cb_success(response)
        }.bind(this))
        .catch(function (err) {
          cb_error(err);
          console.log('FormMarca, there was an error!', err.statusText);
        });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (marcaSelect === "") {
          var params = {
            marca: marcaEdit
          };

          var parreq = {
            method: 'POST',
            url: 'apiFuec/newMarca',
            params: {'params': params}
          };

          this.getRemoteData(parreq,
            this.successFormCreate,
            this.errorFormCreate
          );

        } else {

          var params = {
            id: marcaSelect,
            name: marcaEdit
          };

          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updateIdMarca',
            params: {'params': params}
          };

          this.getRemoteData(parreq,
            this.successFormUpdate,
            this.errorFormUpdate
          );
        }
      }
    });
  },

  successFormCreate: function (data){
    this.props.onItemNew(true);
  },

  errorFormCreate: function (err){
  },

  successFormUpdate: function (data){
  },

  errorFormUpdate: function (err){
  },


  handleDelete: function(e){
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    var params = {
      id: get_id
    };

    var parreq = {
      method: 'DELETE',
      url: 'apiFuec/deleteIdMarca',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
        this.successFormDelete,
        this.errorFormDelete
    );
  },

  successFormDelete: function (data){
    this.props.onItemNew(true);
  },

  errorFormDelete: function (err){
  },


  render: function () {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched  } = this.props.form;
    const marcaEditError = isFieldTouched('marcaedit') && getFieldError('marcaedit');

    return (
        <Card id={this.props.id} title="Marca de Carros" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

              <FormItem>
                <InputGroup compact>

                    <SelectInput
                      style={{ width: '88%' }}
                      url="apiFuec/allMarca"
                      ref='marca'
                      value={this.state.childSelectValue}
                      newOption={this.state.newOptionSelectA}
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
                rules: [{required: true,
                         message: 'Ingrese un nuevo nombre de marca!'}],
                })(
                <Input
                  placeholder="Editar o crear..."
                  onChange={this.onChange}/>
              )}
              </FormItem>

              <FormItem>

                <Button
                  disabled={hasErrors(getFieldsError())}
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
