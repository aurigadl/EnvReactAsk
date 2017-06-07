import React from 'react'
import moment from 'moment';

import { Switch, Radio, Form, DatePicker } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';

const AdminDocRestart = React.createClass({

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
          Reinicio de Secuencias:
        </h4>
        <p>
          Selecciona una fecha para reiniciar los secuencias y distinguir
          entre periodos de tiempo los documentos generados. </p>
        <p>Una vez seleccionada la fecha el sistema no dejara realizar
          accciones a partir de ella. Debemos colocar una nueva fecha
          para usar la aplicación.</p>
        <p>Puedes tambien activarla o inactivarla.</p>

        <FormItem {...formItemLayout}
          label="Estado"
          style={{ 'marginTop': 15 }} >
          <Switch defaultChecked={false}/>
        </FormItem>

        <FormItem {...formItemLayout}
          label='Fecha'>
          <DatePicker
            style={{ 'width': 250 }}
            defaultValue={moment('2018/01/01', dateFormat)}
            format={dateFormat} />
        </FormItem>
      </Form>
      );
  }
})

export default AdminDocRestart
