import React from 'react'
import Reflux from 'reflux';
import *  as cSecAc from '../actions/confSecu';
import confSecuStore from '../stores/confSecu';

import { Form, InputNumber, Radio, Input, Button } from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;


const AdminDocSecuence = Form.create()(React.createClass({

  mixins: [Reflux.connect(confSecuStore, 'cSecSt')],

  getInitialState: function () {
    return {
      valOld:'',
      typedata: 'string'
    }
  },

  handleSwitch: function (e){
    cSecAc.setConfSecuence('');
    cSecAc.setConfType(e.target.value);
    this.setState({ valOld: ''});
  },

  handleValue: function (e) {
    var reg = '';
    var value = e.target.value;
    const type = this.state.cSecSt.type;

    if(type === 'string'){
      reg = /^[a-zA-Z]+$/;
    }else{
      reg = /^[0-9]+$/;
    }

    if (reg.test(value) || value === '' ) {
      cSecAc.setConfSecuence(value);
      this.setState({ valOld: value });
    }else{
      cSecAc.setConfSecuence(this.state.valOld);
    }
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    const { cSecSt } = this.state;
    cSecAc.saveConfSecuence();
  },

  render: function () {
    const { getFieldDecorator} = this.props.form;
    const {typedata, cSecSt} = this.state;
    var resError = '';

    if(cSecSt.secuence.length < 5 ){
      resError = 'error';
    }

    const formItemLayout = {
      labelCol: {
        sm: { span: 6  },
      },
      wrapperCol: {
        sm: { span: 18  },
      },
    };

    return (
      <Form onSubmit={this.handleSubmitForm}>
        <h4>
          Secuencia General:
        </h4>
        <p>
          Agrega una secuencia a los documentos generados
          y lleva un conteo unico de las documentación.
        </p>

        <FormItem {...formItemLayout}
          label="Consecutivo"
          style={{ 'marginTop': 15 }} >
          <Radio.Group
            onChange={this.handleSwitch}
            defaultValue={typedata}
            value={cSecSt.type}>
              <Radio.Button value="number">Numeros</Radio.Button>
              <Radio.Button value="string">Letras</Radio.Button>
            </Radio.Group>
        </FormItem>

        <FormItem {...formItemLayout}
          validateStatus={resError}
          help="Un valor mayor o igual a cinco caracteres"
          label='Valor Actual o Inicial' >
          <Input value={cSecSt.secuence} onChange={this.handleValue}/>
        </FormItem>

        <ButtonGroup>
          <Button
            onClick={cSecAc.fetchConfSecuence}>
            Restaurar
          </Button>

          <Button
              disabled={resError? true: false}
              type="primary"
              htmlType="submit">Grabar</Button>
        </ButtonGroup>

      </Form>
      );
  }
}));

export default AdminDocSecuence
