import React from 'react'
import Reflux from 'reflux';
import confDocActions from '../actions/confDoc';
import confDocStore from '../stores/confDoc';

import { Card, Form, Button, Switch, Icon, Input, Radio, message} from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

let uuid = 0;
const AdminDocDocument = Form.create()(React.createClass({

  mixins: [Reflux.connect(confDocStore, 'confDocStore')],

  componentDidMount: function () {
    const { form } = this.props;
    uuid = this.state.confDocStore.docConf.length;
    form.setFieldsValue({
      keys: Array.from(Array(uuid)).map((e,i)=>i+1),
    });
  },

  remove: function (k) {
    const { form } = this.props;
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

  hasErrors: function(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, val) => {
      if (!err) {
        var data = [];
        var i = 1;
        do{
          let ident = eval(`val.ident_${i}`);
          let name  = eval(`val.names_${i}`);
          let state = eval(`val.active_${i}`);
          data.push({'estado': state,
                    'ident':  ident,
                    'nombre': name});
          i++;
        }while(eval(`val.ident_${i}`) !== undefined)
        message.success('Se grabaron los identificadores de documentos');
        confDocActions.saveConfDocument(data);
      }
    });
  },

  render: function () {
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;
    const { docConf } = this.state.confDocStore ;

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
    const vali = docConf[index]? true : false;
    const icon = <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={()=>this.remove(k)} />
      return (
          <Card
            key={k}
            style={{ 'marginBottom': 15 }}
            bordered={true}>

            { vali ? null : icon }

            <FormItem {...formItemLayout}
              label='Estado'>
              {getFieldDecorator(`active_${k}`, {
                initialValue: vali ? docConf[index].estado : null,
                valuePropName: 'checked'
                })(
                <Switch/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='Nombre'
              required={true}
            >
              {getFieldDecorator(`names_${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: vali ? docConf[index].nombre : null,
                  rules: [{
                  required: true,
                  whitespace: true,
                  message: "Ingrese un nombre o borre este registro.",
                }],
              })(
              <Input
                disabled={vali}
                placeholder="Nombre del documento"
                 style={{ width: '60%', marginRight: 8  }} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='Idenfiticación'
              required={true}>

              {getFieldDecorator(`ident_${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: vali ? docConf[index].ident : null,
                  rules: [{
                  required: true,
                  whitespace: true,
                  message: "Ingrese una identificación o borre este registro.",
                }],
              })(
              <Input
                disabled={vali}
                placeholder="Identificación del documento"
                style={{ width: '60%', marginRight: 8  }} />
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
            <Button onClick={confDocActions.fetchConfDocument}>Restaurar</Button>
            <Button
              disabled={this.hasErrors(getFieldsError())}
              type="primary"
              htmlType="submit"> Grabar </Button>
          </ButtonGroup>

        </Form>
      );
  }
}))
export default AdminDocDocument
