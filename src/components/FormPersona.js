import React from 'react'
import SelectInput from './SelectInput.js'
import {makeRequest as mReq} from '../utils/mrequest';
import {Card , Form , Input , Col, Row, Button, Icon} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormPersona = React.createClass({

  getInitialState: function () {
    return {
      newOptionSelectA: false,
      childSelectValue: undefined,
      selectedOption: undefined,
    };
  },

  handleReset: function (e) {
    this.refs.selectPerson.value = '';
    this.refs.first_name.value = '';
    this.refs.last_name.value = '';
    this.refs.email.value = '';
    this.refs.phone.value = '';
    this.refs.id_number.value = '';
    this.refs.id_type.value = '';
    this.refs.license.value = '';
    this.refs.effective_date.value = '';
    this.refs.address.value = '';
    this.setState({
      selectedOption: undefined
    });
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

  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },


  handlePersonSelect: function (childSelectValue, handlePersonSelect) {
    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idPerson',
        params: params
      };

      this.setState({
        childSelectValue: childSelectValue
      });

      this.getRemoteData(parreq
        , this.successHandlerSelect
        , this.errorHandlerSelect);
    } else {
      this.refs.selectPerson.value = '';
      this.refs.first_name.value = '';
      this.refs.last_name.value = '';
      this.refs.email.value = '';
      this.refs.phone.value = '';
      this.refs.id_number.value = '';
      this.refs.id_type.value = '';
      this.refs.license.value = '';
      this.refs.effective_date.value = '';
      this.refs.address.value = '';
      this.setState({
        selectedOption: undefined
      });
    }
  },

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    this.refs.first_name.value = (data.first_name) ? data.first_name : undefined;
    this.refs.last_name.value = (data.last_name) ? data.last_name : undefined;
    this.refs.email.value = (data.email) ? data.email : undefined;
    this.refs.phone.value = (data.phone) ? data.phone : undefined;
    this.refs.id_number.value = (data.id_number) ? data.id_number : undefined;
    this.refs.license.value = (data.license) ? data.license : undefined;
    this.refs.effective_date.value = (data.effective_date) ? data.effective_date : undefined;
    this.refs.address.value = (data.address) ? data.address : '';
    this.refs.id_type.refs.selectValue.selectedIndex = (data.id_type) ? data.id_type : undefined;
    this.setState({
      selectedOption: ~~((data.type_person) ? data.type_person : undefined) + ''
    });
  },

  errorHandlerSelect: function (remoteData) {
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var ref = e.target.elements;

    var selectPerson = ref.selectPerson.value;
    var type_person = this.state.selectedOption;
    var first_name = ref.first_name.value;
    var last_name = ref.last_name.value;
    var email = ref.email.value;
    var phone = ref.phone.value;
    var id_number = ref.id_number.value;
    var id_type = ref.id_type.value;
    var license = ref.license.value;
    var effective_date = ref.effective_date.value;
    var address = ref.address.value;

    var params = {
      type_person: type_person
      , first_name: first_name
      , last_name: last_name
      , email: email
      , phone: phone
      , id_number: id_number
      , id_type: id_type
      , license: license
      , effective_date: effective_date
      , address: address
    };

    if (selectPerson === "") {

      var parreq = {
        method: 'POST',
        url: 'apiFuec/newPerson',
        params: {'params': params}
      };

      this.getRemoteData(parreq,
        this.successFormCreate,
        this.errorFormCreate
      );

    } else {

      params['id'] = selectPerson;

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updateIdPerson',
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
    this.props.onItemNew(true);
  },

  errorFormCreate: function (err) {
  },

  successFormUpdate: function (data) {
  },

  errorFormUpdate: function (err) {
  },

  onClickMessage: function (event) {
    this.setState({
      showMessage: false,
      contextText: ''
    })
  },


  handleDelete: function (e) {
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    var params = {
      id: get_id
    };

    var parreq = {
      method: 'DELETE',
      url: 'apiFuec/deleteIdPerson',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
      this.successFormDelete,
      this.errorFormDelete
    );
  },

  successFormDelete: function (data) {
    this.refs.person.getDOMNode().reset();
  },

  errorFormDelete: function (err) {
  },


  render: function () {

    return (
        <Card id={this.props.id} title="Personas" bordered={false}>
          <Form onSubmit={this.handleSubmitForm} ref="person">
            <Row gutter={15}>
              <Col span={8}>

                <FormItem label="Personas Existentes" >
                  <InputGroup size="large" compact>

                    <SelectInput
                      style={{ width: '88%' }}
                      class="input-group-field"
                      url="apiFuec/allPerson"
                      name="selectPerson"
                      ref="selectPerson"
                      newOption={this.state.newOptionSelectA}
                      onUserSelect={this.handlePersonSelect}
                    />
                    <Button onClick={this.handleDelete}  type="danger"  shape="circle" icon="minus"/>
                  </InputGroup>
                </FormItem>

                <FormItem label="Tipo de persona" >
                  <Input
                    type="radio"
                    name="type_person"
                    value="0"
                    id="personN"
                    checked={this.state.selectedOption === "0"}
                    onChange={this.handleOptionChange}
                    required
                  />
                </FormItem>

                <FormItem label="Natural" >

                  <Input
                    type="radio"
                    name="type_person"
                    id="personJ"
                    value="1"
                    checked={this.state.selectedOption === "1"}
                    onChange={this.handleOptionChange}
                  />
                </FormItem>
                <FormItem label="Dirección">
                  <Input ref="address" name="address" type="text" placeholder=""/>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label="Nombres" >
                  <Input ref="first_name" name="first_name" type="text" placeholder="" required/>
                </FormItem>
                <FormItem label="Apellidos" >
                  <Input ref="last_name" name="last_name" type="text" placeholder=""/>
                </FormItem>
                <FormItem label="Correo Electronico" >
                  <Input ref="email" name="email" type="text" placeholder="" required/>
                </FormItem>
                <FormItem label="Licencia">
                  <Input ref="license" name="license" type="text" placeholder=""/>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label="Telefono" >
                  <Input ref="phone" name="phone" type="text" placeholder=""/>
                </FormItem>
                <FormItem label="Tipo de Identificación">
                  <SelectInput
                    url="apiFuec/allIdType"
                    name="id_type"
                    id='id_type'
                    ref="id_type"
                    onUserSelect={this.handleIdTypeSelect}
                    required
                  />
                </FormItem>
                <FormItem label="Identificación">
                  <Input ref="id_number" name="id_number" type="text" placeholder="" required/>
                </FormItem>
                <FormItem label="Vigencia">
                  <Input
                    ref="effective_date"
                    name="effective_date"
                    type="date"
                    pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}"
                    placeholder=""/>
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

export default FormPersona;
