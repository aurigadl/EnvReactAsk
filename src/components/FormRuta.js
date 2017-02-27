import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'

import {Card , Form , Input , Col, Row, Button, Icon} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;


var FormRuta = React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      newOptionSelectA: false,
      inputValue: '',

      showMessage: false,
      typeMess: '',
      contextText: ''
    };
  },

  handleUserSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      inputValue: childSelectText
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
        console.log('AdminFormUser, there was an error!', err.statusText);
      });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var ruta_edit = ref.rutaEdit.value;
    var selectRuta = ref.selectRuta.value;

    var params = {
      name: ruta_edit
    };

    if (selectRuta === "") {

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newRuta',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      params['id'] = selectRuta;

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdRuta',
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

  successFormCreate: function (data){
    this.setState({
      showMessage: true,
      contextText: 'Se Creo la ruta',
      typeMess: 'success',
      newOptionSelectA: true
    });

    this.props.onItemNew(true);

    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormCreate: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se Creo la ruta.',
      typeMess: 'alert'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  successFormUpdate: function (data){
    this.setState({
      showMessage: true,
      contextText: 'Se Actualizo la Marca',
      typeMess: 'success',
      newOptionSelectA: true
    });

    this.props.onItemNew(true);

    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormUpdate: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se Actualizo la Marca',
      typeMess: 'alert'
    });
    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },

  handleReset: function (e) {
    this.refs.selectRuta.value = '';
    this.setState({
      inputValue: ''
    });
  },

  handleDelete: function (e) {
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    var params = {
      id: get_id
    };

    var parreq = {
      method: 'DELETE',
      url: 'apiFuec/deleteIdRuta',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
      this.successFormDelete,
      this.errorFormDelete
    );
  },

  successFormDelete: function (data){
    this.setState({
      showMessage: true,
      contextText: 'Se borro la Ruta',
      typeMess: 'success',
      newOptionSelectA: true,
      inputValue: ''
    });

    this.props.onItemNew(true);
    this.refs.selectRuta.refs.selectValue.selectedIndex = '';

    setTimeout(function(){
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: '',
        newOptionSelectA: false
      })
    }.bind(this), 3000);
  },

  errorFormDelete: function (err){
    this.setState({
      showMessage: true,
      contextText: 'No se borro la Ruta',
      typeMess: 'alert'
    });
    setTimeout(function(){
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
        <Card id={this.props.id} title="Rutas" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

            <Row gutter={15}>
              <FormItem>
                <InputGroup compact>
                  <SelectInput
                    style={{ width: '88%' }}
                    class="input-group-field"
                    url="apiFuec/allRuta"
                    name="selectRuta"
                    ref="selectRuta"
                    newOption={this.state.newOptionSelectA}
                    onUserSelect={this.handleUserSelect}
                  />
                  <Button onClick={this.handleDelete}  type="danger"  shape="circle" icon="minus"/>
                </InputGroup>
              </FormItem>

              <FormItem>
                <Input type="textarea"
                  name="rutaEdit"
                  ref="rutaEdit"
                  placeholder="Editar o crear..."
                  className="input-group-field"
                  onChange={this.onChange}
                  value={this.state.inputValue}
                  type="text"/>
              </FormItem>

              <FormItem>
                <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
              </FormItem>


            </Row>
          </Form>
        </Card>
    )
  }

});

export default FormRuta;
