import React from 'react'
import {remoteData} from '../utils/mrequest';

import { Card, Form, Button, Switch, Icon, Input, Radio } from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

let uuid = 0;
const AdminDocDocument = Form.create()(React.createClass({
  remove: function (k) {
    const { form  } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  },


  add: function () {
    uuid++;
    const { form  } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({ keys: nextKeys, });
  },

  handleChDoc: function(e){
     console.log('doc letra: ' + e.target.value);
  },


  render: function () {
    const { getFieldDecorator, getFieldValue  } = this.props.form;

    const formItemLayout = {
      labelCol: {
        sm: { span: 6  },
      },
      wrapperCol: {
        sm: { span: 18  },
      },
    };

    getFieldDecorator('keys', { initialValue: []  });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Card
          key={k}
          style={{ 'marginBottom': 15 }}
          extra={ <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={() => this.remove(k)}
                  /> }
          bordered={true}>

          <FormItem {...formItemLayout}
            label='Estado'
          >
            <Switch/>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='Nombre'
            required={false}
          >
            {getFieldDecorator(`names-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Ingrese un nombre o borre este registro.",
            }],

            })(
            <Input placeholder="Nombre del documento" style={{ width: '60%', marginRight: 8  }} />

            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='Idenfiticación'
            required={false}
          >
            {getFieldDecorator(`names-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Ingrese una identificación o borre este registro.",
            }],

            })(
            <Input placeholder="Nombre del documento" style={{ width: '60%', marginRight: 8  }} />

            )}
          </FormItem>


        </Card>
        );
    });

    return (
        <Form onSubmit={this.handleSubmitForm}>
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
          <p>
            Escoge entre numeros o letras para identificarlos. Esta secuencia que
            selecciones no cambia. Si en algun momento no quieres usarlo mas,
            puedes inactivarlo pero no borrarlo. de lo contrario se perderia
            la realcion de clasificación con los elementos ya existentes.
          </p>

          {formItems}

          <FormItem {...formItemLayout}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Agregar Documento
            </Button>
          </FormItem>

          <ButtonGroup>
            <Button>Recargar</Button>
            <Button type="primary">Grabar</Button>
          </ButtonGroup>

        </Form>
      );
  }
}))
export default AdminDocDocument
