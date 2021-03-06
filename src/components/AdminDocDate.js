import React from 'react'
import { Switch, Radio, Form, Button} from 'antd';

const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;

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
      <Form onSubmit={this.handleSubmitForm}>
        <h4>
          Secuencia por Fecha :
        </h4>
        <p>
          Selecciona una fecha para generar una secuencias y distinguir
          entre periodos de tiempo los documentos generados. </p>
        <p>Puedes seleccionar entre año, año y mes o año, mes y día.</p>
        <p>Puedes tambien activarla o inactivarla.</p>

        <FormItem {...formItemLayout}
          label="Estado"
          style={{ 'marginTop': 15 }} >
          <Switch defaultChecked={false}/>
        </FormItem>

        <FormItem {...formItemLayout}
          label="Secuencia" >
          <RadioGroup>
            <Radio value={1}>Año/Mes/Día</Radio>
            <Radio value={2}>Año/Mes</Radio>
            <Radio value={3}>Año</Radio>
          </RadioGroup>
        </FormItem>

        <ButtonGroup>
          <Button>Restaurar</Button>
          <Button type="primary">Grabar</Button>
        </ButtonGroup>

      </Form>
      );
  }
})

export default AdminDocDate
