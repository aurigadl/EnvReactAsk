import React from 'react';
import {remoteData} from '../utils/mrequest';
import SelectInput from './SelectInput.js';

import {message, Card , Form , Input ,
Upload,  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormConductor = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      file_pdf:'',
    };
  },


  handleSelect: function (childSelectValue, childSelectText) {
    this.setState({
      childSelectValue: childSelectValue,
      childSelectText: childSelectText
    });

    if (childSelectValue != undefined) {
      var params = {'id': childSelectValue};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idAgreement',
        params: params
      };

      this.setState({
        childSelectValue: childSelectValue
      });

      this.getRemoteData(parreq
        , this.successHandlerSelect
        , this.errorHandlerSelect);
    } else {
      this.refs.no_agreement.value = '';
      this.refs.no_trip.value = '';
      this.refs.id_person.refs.selectValue.selectedIndex = undefined;
      this.refs.id_type_agreement.refs.selectValue.selectedIndex = undefined;
      this.refs.init_date.value = '';
      this.refs.last_date.value = '';
    }
  },

  successHandlerSelect: function (remoteData) {
    var data = remoteData.result;
    this.refs.no_agreement.value = (data.no_agreement) ? data.no_agreement : undefined;
    this.refs.no_trip.value = (data.no_trip) ? data.no_trip : undefined;
    this.refs.id_person.refs.selectValue.selectedIndex = (data.id_person) ? data.id_person : undefined;
    this.refs.id_type_agreement.refs.selectValue.selectedIndex = (data.id_type_agreement) ? data.id_type_agreement : undefined;
    this.refs.init_date.value = (data.init_date) ? data.init_date : undefined;
    this.refs.last_date.value = (data.last_date) ? data.last_date : undefined;
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const selecChildV = this.state.childSelectValue;
    const selecChildT = this.state.childSelectText;

    form.validateFields((err, val) => {
      if (!err) {
        var params = {
           no_agreement : val.input_uno.toString()
          ,id_person    : val.input_dos.key
          ,id_type_agreement : val.input_tres.key
          ,id_object_agreement : val.input_cuatro.key
          ,file_pdf : this.state.file_pdf
        };

        if (selecChildV === undefined || selecChildV === "") {

          var parreq = {
            method: 'POST',
            url: 'apiFuec/newAgreement',
            params: {'params': params}
          };

          remoteData(parreq,
              (data) => {
                message.success('Se creo un nuevo registro contrato');
                this.handleReset();
              },
              (err) => {
                message.error('NO se creo el registro' +
                  '\n Error :' + err.message.error)
          });

        } else {
          params['id'] = selecChildV;
          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updateIdAgreement',
            params: {
              'params': params
            }
          };

          remoteData(parreq,
              (data) => {
                message.success('Se actulizo el registro contrato');
                this.handleReset();
              },
              (err) => {
                message.error('NO se creo el registro' +
                  '\n Error :' + err.message.error)
          });

        }
      }
    })
  },

  handleReset: function (e) {
    this.props.form.resetFields();
    this.setState({
      childSelectValue: undefined,
    });
  },

  handleDelete: function (e) {
    e.preventDefault();
    var get_id = this.state.childSelectValue;
    var params = {
      id: get_id
    };

    var parreq = {
      method: 'DELETE',
      url: 'apiFuec/deleteIdAgreement',
      params: {'params': params}
    };

    this.getRemoteData(parreq,
      this.successFormDelete,
      this.errorFormDelete
    );
  },


  handleImagePdf: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        file_pdf: event.target.result
      });
    }.bind(this);

    if (file.type == "application/pdf"){
      reader.readAsDataURL(file)
    }
  },


  disabledStartDate : function (startValue){
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  },


  render: function () {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
        <Card id={this.props.id} title="Contrato" extra={ <a href="./tables#contratos"><Icon type="layout"/></a>} bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

            <Row gutter={15}>
              <Col span={8}>
                <FormItem  label="Contratos Existentes">
                  <SelectInput
                    style={{ width: '88%' }}
                    class="input-group-field"
                    url="apiFuec/allAgreement"
                    onUserSelect={this.handleSelect}
                  />
                </FormItem>
                <FormItem  label="No. Contrato" >
                 {getFieldDecorator('input_uno',
                 {
                   rules: [
                     { required: true,
                       message: 'Ingrese el numero del contrato!'
                     },
                   ],
                 })(
                  <Input/>
                 )}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label="Contratante - Persona Juridica o Natural">
                  {getFieldDecorator('input_dos',
                  {
                    rules: [
                      { required: true,
                        type: 'object',
                        message: 'Seleccione un contratante!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allPerson"
                  />
                  )}
                </FormItem>

                <FormItem label="Tipo de contrato">
                  {getFieldDecorator('input_tres',
                  {
                    rules: [
                      { required: true,
                        type: 'object',
                        message: 'Seleccione un tipo de contrato!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allKindAgreement"
                  />
                  )}
                </FormItem>

              </Col>

              <Col span={8}>
                <FormItem label="Objeto del Contrato">
                  {getFieldDecorator('input_cuatro',
                  {
                    rules: [
                      { required: true,
                        type: 'object',
                        message: 'Seleccione un tipo de contrato!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allObjectAgreement" />
                  )}
                </FormItem>

                <FormItem label="Docuento en formato PDF" >
                  <Upload name="logo" listType="picture" onChange={this.handleImagePdf}>
                    <Button>
                      <Icon type="upload" /> Cargar PDF
                    </Button>
                  </Upload>
                </FormItem>

                <FormItem>
                  <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                  <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
                </FormItem>

              </Col>
            </Row>
          </Form>
        </Card>
    )
  }

}));

export default FormConductor;
