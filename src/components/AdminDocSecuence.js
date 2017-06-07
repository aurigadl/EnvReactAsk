import React from 'react'
import { Form, InputNumber, Radio, Input } from 'antd';

const FormItem = Form.Item;

const AdminDocSecuence = React.createClass({

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
          Generación de Secuencia General de Documentos:
        </h4>
        <p>
          Agrega una secuencia a los documentos generados
          y lleva un conteo unico de las documentación.
        </p>

        <FormItem {...formItemLayout}
          label="Consecutivos"
          style={{ 'marginTop': 15 }} >
          <Radio.Group defaultValue="horizontal" onChange={this.handleChDoc}>
            <Radio.Button value="0">Numeros</Radio.Button>
            <Radio.Button value="1">Letras</Radio.Button>
          </Radio.Group>
        </FormItem>

        <FormItem {...formItemLayout}
          label="Tamaño">
          <InputNumber min={1} max={10} />
        </FormItem>

        <FormItem {...formItemLayout}
          label='Valor Actual o Inicial' >
          <Input placeholder="Valor actual"/>
        </FormItem>

      </Form>
      );
  }
})

export default AdminDocSecuence
