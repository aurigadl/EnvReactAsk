import React from 'react'
import { Button, Select, Form } from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;

const AdminDocDate = React.createClass({

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
      <div>
        <h4>
          Identificacíon y Clasificacón de Documentos:
        </h4>
        <p>
          Crea, activa e inactiva documentos. Clasificlos
          segun el tipo de movimientos que se realicen
          en la organización, documentos como Entrada, Salida, Factura, Memorando,
          Edicto y las referencias que requieras, en las cuales se
          agrupen a un gran numero de documentos.
        </p>
        <FormItem {...formItemLayout} label="Orden 1"
          style={{ 'marginTop': 30 }}>
          <Select style={{ width: 120  }} >
            <Option value=""> -- Ninguno --</Option>
            <Option value="0">Documento</Option>
            <Option value="1">Consecutivo</Option>
            <Option value="2">Grupo</Option>
            <Option value="3">Fecha</Option>
            <Option value="4">Comodin</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="Orden 2" >
          <Select style={{ width: 120  }} >
            <Option value=""> -- Ninguno --</Option>
            <Option value="0">Documento</Option>
            <Option value="1">Consecutivo</Option>
            <Option value="2">Grupo</Option>
            <Option value="3">Fecha</Option>
            <Option value="4">Comodin</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="Orden 3" >
          <Select style={{ width: 120  }} >
            <Option value=""> -- Ninguno --</Option>
            <Option value="0">Documento</Option>
            <Option value="1">Consecutivo</Option>
            <Option value="2">Grupo</Option>
            <Option value="3">Fecha</Option>
            <Option value="4">Comodin</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="Orden 4" >
          <Select style={{ width: 120  }} >
            <Option value=""> -- Ninguno --</Option>
            <Option value="0">Documento</Option>
            <Option value="1">Consecutivo</Option>
            <Option value="2">Grupo</Option>
            <Option value="3">Fecha</Option>
            <Option value="4">Comodin</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="Orden 5" >
          <Select style={{ width: 120  }} >
            <Option value=""> -- Ninguno --</Option>
            <Option value="0">Documento</Option>
            <Option value="1">Consecutivo</Option>
            <Option value="2">Grupo</Option>
            <Option value="3">Fecha</Option>
            <Option value="4">Comodin</Option>
          </Select>
        </FormItem>

        <ButtonGroup>
          <Button>Restaurar</Button>
          <Button type="primary">Grabar</Button>
        </ButtonGroup>

      </div>
      );
  }
})

export default AdminDocDate
