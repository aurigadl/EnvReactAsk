import React from 'react'
import { Switch, Radio, Form, Input} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const AdminDocOption = React.createClass({

  render: function () {

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
          Generación de Secuencia Adicional:
        </h4>
        <p>
          Crea un numero de identificacion general o una secuencia con el
          cual puedas identificar los documentos por periodos de tiempo o
          clasificarlos segun lo necesites. Puedes crear un valor que
          cambien con cada documento o uno fijo.
        </p>
        <p>
          Puedes Activar esta opción o dejarla inactiva.
        </p>
        <FormItem label="Estado" {...formItemLayout}
          style={{ 'marginTop': 15 }} >
          <Switch defaultChecked={false}/>
        </FormItem>
        <FormItem label="Tipo de Dato" {...formItemLayout}>
          <Radio.Group defaultValue="horizontal">
            <Radio.Button value="0">Numeros</Radio.Button>
            <Radio.Button value="1">Letras</Radio.Button>
          </Radio.Group>
        </FormItem>
        <FormItem label="Fijo o Variable" {...formItemLayout}>
          <Radio.Group defaultValue="horizontal">
            <Radio.Button value="0">Fijo</Radio.Button>
            <Radio.Button value="1">Variable</Radio.Button>
          </Radio.Group>
        </FormItem>
        <FormItem label='Valor Actual o Inicial' {...formItemLayout}>
          <Input placeholder="Valor actual"/>
        </FormItem>
      </Form>
      );
  }
})

export default AdminDocOption
