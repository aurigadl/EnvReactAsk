import React from 'react'
import MessageAlert from './MessageAlert.js'
import {makeRequest as mReq} from '../utils/mrequest';
import SelectInput from './SelectInput.js'
import {Card , Form , Input , Col, Row, Button, Icon} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormPersonaCarro = React.createClass({

  getInitialState: function () {
    return {
      newOptionSelectCar: false,
      newOptionSelectPerson: false,
      childSelectValue: undefined,
      option: [{mod:'', person:''}],
      childSelectText: '',
      inputValue: '',
      updateKey: '',
    };
  },

  getRemoteData: function (parreq, cb_success, cb_error) {
    mReq(parreq)
      .then(function (response) {
        cb_success(response)
      }.bind(this))
      .catch(function (err) {
        cb_error(err);
        console.log('FormPersonCar, there was an error!', err.statusText);
      });
  },

  handleUserSelect: function (childSelectValue, childSelectText) {

    this.setState({
      childSelectValue: childSelectValue,
      inputValue: childSelectText
    });

    if (childSelectValue != 0) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idPersonCar',
        params: params
      };

      this.getRemoteData(parreq
        , this.successHandlerSelect
        , this.errorHandlerSelect);
    } else {
      this.refs.selectCar.refs.selectValue.selectedIndex = undefined;
      this.setState({
        option: [{mod:'', person:''}]
      });
    }
  },

  successHandlerSelect: function (remoteData) {
    var data = JSON.parse(remoteData.result);
    var dataArray = [];

    for (var prop in data) {
      var _mod = (data[prop].mod) ? data[prop].mod : undefined;
      var _per = (data[prop].person) ? data[prop].person : undefined;

      if(_mod != undefined && _per != undefined){
        dataArray.push({mod: _mod, person: _per});
      }else{
        dataArray = [];
      }
    }

    if(dataArray.length > 0){
      this.setState({
        option: dataArray
      });
    }else{
      this.setState({
        option: [{mod:'', person:''}]
      });
    }
  },

  errorHandlerSelect: function (remoteData) {
    this.setState({
      showMessage: true,
      contextText: 'Conexion rechazada',
      typeMess: 'alert'
    });
    setTimeout(function () {
      this.setState({
        showMessage: false,
        contextText: '',
        typeMess: ''
      })
    }.bind(this), 3000);
  },


  onChange(e) {
    this.setState({inputValue: e.target.value});
  },

  componentWillReceiveProps: function (nextProps) {
    var nextc = nextProps.newOptionCar;
    var prevc = this.props.newOptionCar;
    var nextp = nextProps.newOptionPerson;
    var prevp = this.props.newOptionPerson;

    if (nextc == true && nextc != prevc) {
      this.setState({
        newOptionSelectCar: true
      });
      this.props.onItemNewCar(false);
    }

    if (nextc == false && nextc != prevc) {
      this.setState({
        newOptionSelectCar: false
      });
    }

    if (nextp == true && nextp != prevp) {
      this.setState({
        newOptionSelectPerson: true
      });
      this.props.onItemNewPerson(false);
    }

    if (nextp == false && nextp != prevp) {
      this.setState({
        newOptionSelectPerson: false
      });
    }
  },

  handleReset: function (e) {
    this.refs.selectCar.value = '';
    this.setState({
      option: [{mod:'', person:''}]
    });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    var data = [];
    var relPerCar = new Object();
    var ref = e.target.elements;
    var selectCar = ref.selectCar.value;
    var result = [];

    for (var prop in ref) {
      if (!isNaN(prop) && prop != '0') {
        result.push(prop);
      }
    }

    for (var i = 0; i < result.length - 2; i++) {
      if ((i % 2 == 1)) {
        relPerCar.mod = ref[result[i]].value;
        data.push(relPerCar);
        relPerCar = new Object();
      } else {
        relPerCar.person = ref[result[i]].value;
      }
    }

    if (selectCar !== "") {

      var params = {
        id: selectCar
        , person_car: data
      };

      var parreq = {
        method: 'PUT',
        url: 'apiFuec/updatePersonCar',
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

  successFormUpdate: function (data) {
    this.props.onItemNewCar(true);
  },

  errorFormUpdate: function (err) {
  },

  addNewRelPerCar: function () {
    var newOption = this.state.option;
    newOption.push({keyId: this.uniqueId});
    this.setState({
      option: newOption
    });
  },

  delRelPerCar: function (e) {
    let idKey = e.currentTarget.dataset.key;
    var newOption = this.state.option;
    delete newOption[idKey];
    this.setState({
      option: newOption
    });
  },

  render: function () {
    return (

      <Card id={this.props.id} title="Relación de Personas y Carros" bordered={false}>
        <Form onSubmit={this.handleSubmitForm} ref="personCar">

          <Row gutter={15}>
            <Col span={8}>
              <FormItem  label="Carro">
                <InputGroup compact>
                  <Button onClick={this.addNewRelPerCar}  type="primary"  shape="circle" icon="plus"/>
                  <SelectInput
                    style={{ width: '88%' }}
                    url="apiFuec/allCar"
                    name="selectCar"
                    ref="selectCar"
                    newOption={this.state.newOptionSelectCar}
                    onUserSelect={this.handleUserSelect}
                  />
                </InputGroup>
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
              </FormItem>
            </Col>

            <Col span={16}>
              <FormItem label="Relación: Persona - Modalidad">
                {this.state.option.map(function (data, i) {
                return (
                <div key={i} ref={i} className="row">
                  <InputGroup compact>
                    <Button data-key={i} onClick={this.delRelPerCar} type="primary"  shape="circle" icon="minus"/>
                    <SelectInput
                      style={{ width: '47%' }}
                      selectstate={data.person}
                      className="input-group-field"
                      url="apiFuec/allPerson"
                      name={"selectPersonaCarro_" + i}
                      newOption={this.state.newOptionSelectPerson}
                    />
                    <SelectInput
                      style={{ width: '47%' }}
                      selectstate={data.mod}
                      url="apiFuec/allModality"
                      name={"selectModalidad_" + i}
                    />
                  </InputGroup>
                </div>)
                }, this)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

});

export default FormPersonaCarro;
