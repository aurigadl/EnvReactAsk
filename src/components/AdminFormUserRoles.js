import React from 'react'
import SelectInput from './SelectInput.js';
import {remoteData} from '../utils/mrequest';

import {Card , Input, Form , Row, Button,
        message , Checkbox} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;


var AdminFormUserRoles = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      indeterminate: false,
      plainOptions :[],
      checkedList:[],
      checkAll: false
    };
  },


  componentDidMount: function () {
    var parreq = {
      method: 'GET',
      url: "apiAdmin/allRoles"
    };

    remoteData(parreq,
      (data) => {
        this.setState({plainOptions:
          data.result.map(function (d) {
            return {
              value: d.id,
              label: d.nomb
            };
          })
        })
      },
      (err) => {
        message.error('NO se cargaron los roles existentes' +
          '\n Error :' + err.message.error);
      }
    );
  },


  handleSelect: function (childSelectValue, childSelectText) {
    const { form  } = this.props;

    this.setState({
      childSelectValue: childSelectValue,
      childSelectText: childSelectText
    });

    if (childSelectValue != undefined) {
      const parreq = {
        method: 'GET',
        url: 'apiAdmin/idUserRole',
        params: {'id': childSelectValue}
      };

      remoteData(parreq,
        (data) => {
          const chlist = data.result.map(function (d) {
            return d.role_id;
          })
          this.onChange(chlist);
        },
        (err) => {
          message.error('NO se cargaron los registros de los roles' +
            '\n Error :' + err.message.error);
        }
      );
    }
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const selecChildV = this.state.childSelectValue;

    form.validateFields((err, val) => {

      var params = {
        'role_id': this.state.checkedList.map((p)=> p.toString()),
        'user_id': selecChildV
      };

      var parreq = {
        method: 'PUT',
        url: 'apiAdmin/setUserRole',
        params: {'params': params}
      };

      remoteData(parreq,
        (data) => {
          message.success('Se actualizaron el registros');
        },
        (err) => {
          message.error('NO se actualizo el registro' +
            '\n Error :' + err.message.error)
        }
      );

    })
  },

  onChange : function(checkedList) {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
      checkAll: checkedList.length === this.state.plainOptions.length,
    });
  },


  onCheckAllChange : function(e) {
    const check = e.target.checked;
    const values = this.state.plainOptions.map(function (d) {
      return d.value;
    })

    this.setState({
      checkedList: check  ? values : [],
      indeterminate: false,
      checkAll: check
    });
  },

  hasErrors: function(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  render: function () {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
        <Card id={this.props.id} title="Usuarios y Roles" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>

              <FormItem label="Usuarios Existentes" >
              {getFieldDecorator('input_uno',
                {
                  rules: [
                    { required: true,
                      message: 'Seleccione un usuario!'
                    }
                  ],
                })(
                <SelectInput
                  url="apiUser/allUser"
                  name="usuario"
                  onUserSelect={this.handleSelect}
                />
              )}
              </FormItem>

              <FormItem label="Perfiles de acceso" >
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}>
                    Todos
                  </Checkbox>
                </div>
                {getFieldDecorator('input_dos',
                {
                  initialValue: this.state.checkedList,
                  type: 'array',
                  value: 'checked'
                })(
                <CheckboxGroup
                   onChange={this.onChange}
                   options={this.state.plainOptions} />
                )}
              </FormItem>

              <FormItem>
                <Button
                  disabled={this.hasErrors(getFieldsError())}
                  type="primary"
                  htmlType="submit"
                  size="large">Grabar</Button>
              </FormItem>

            </Row>
          </Form>
        </Card>
     )
  }
  }));

export default AdminFormUserRoles;