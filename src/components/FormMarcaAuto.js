import React from 'react'
import SelectInput from './SelectInput.js'
import {makeRequest as mReq} from '../utils/mrequest';

import {Card , Form , Input , Col, Row, Button, Icon} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormMarcaAuto = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      inputValue: '',
      newOptionSelectA: false
    };
  },

  handleUserSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      inputValue: childSelectText
    });
  },

  handleReset: function (e) {
    this.refs.selectMarca.value = '';
    this.setState({
      inputValue: ''
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
    var dot = e.target.elements;
    var marcaSelect = dot.selectMarca.value;
    var marcaEdit = dot.marcaEdit.value;

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
    return (
        <Card id={this.props.id} title="Marca de Carros" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>
                <InputGroup compact>
                  <SelectInput
                    style={{ width: '88%' }}
                    class="input-group-field"
                    url="apiFuec/allMarca"
                    name="selectMarca"
                    ref="selectMarca"
                    newOption={this.state.newOptionSelectA}
                    onUserSelect={this.handleUserSelect}
                  />
                  <Button onClick={this.handleDelete} type="primary" shape="circle" icon="minus"/>
                </InputGroup>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input name="marcaEdit"
                    placeholder="Editar o crear..."
                    className="input-group-field"
                    type="text"
                    onChange={this.onChange}
                    value={this.state.inputValue}/>
                </FormItem>
              </Col>
              <Col span={8}>
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

export default FormMarcaAuto;
