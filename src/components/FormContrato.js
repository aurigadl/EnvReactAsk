import React from 'react';
import {remoteData} from '../utils/mrequest';
import SelectInput from './SelectInput.js';

import {message, Card , Form , Input , Modal ,
Upload,  Col, Row, Button, Icon} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var FormConductor = Form.create()(React.createClass({


  getInitialState: function () {
    return {
      childSelectValue: undefined,
      childSelectText: '',
      file_pdf:'',
      fileList:[],
      previewVisible: false
    };
  },


  handleSelect: function (childSelectValue, childSelectText) {
    this.handleReset();

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

      remoteData(parreq,
        (data) => {
          const res = data.result;
          this.props.form.setFieldsValue({
             input_uno   :res.no_agreement
            ,input_dos   :{key:res.id_person,label:res.name_person}
            ,input_cuatro:{key:res.id_object_agreement,label:res.name_object_agreement}
          })

          if(res.id_type_agreement){
            this.props.form.setFieldsValue({
              input_tres  :{key:res.id_type_agreement,label:res.name_type_agreement}
            })
          }

          if(res.id_person_agreement){
            this.props.form.setFieldsValue({
              input_nueve: {key:res.id_person_agreement,label:res.name_person_agreement}
            })
          }

          if(res.file_pdf){
            this.setState({
              fileList:[{
                  uid: -1,
                  name: res.no_agreement + '_contrato.pdf',
                  status: 'done'
              }],
              file_pdf: 'data:application/pdf;base64,' + res.file_pdf
            });
          }else{
            this.setState({
              fileList:[],
              file_pdf: ''
            });
          }

        },
        (err) => {
          message.error('NO se cargo el registro' +
            '\n Error :' + err.message.error)
      });
    }
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
          ,id_person    : val.input_dos.key.toString()
          ,id_object_agreement : val.input_cuatro.key.toString()
          ,pdf_file : this.state.file_pdf
        };

        if(val.input_tres){
          params['id_type_agreement'] = val.input_tres.key.toString()
        }

        if(val.input_nueve){
          params['id_person_agreement'] = val.input_nueve.key.toString()
        }

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
      childSelectText: '',
      fileList:[]
    });
  },


  getBase64: function (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  },


  handleImagePdf: function(info){
    let fileList = info.fileList;
    fileList = fileList.slice(-1);

    fileList = fileList.map((file) => {
      if (file.type === "application/pdf") {
        this.getBase64(file.originFileObj, file_pdf => this.setState({ file_pdf  }));
      }
      return file;
    });

    this.setState({ fileList });
  },


  handlePreview: function(){
    if(this.state.file_pdf){
      this.setState({
        previewVisible: true,
      });
    }
  },


  handleCancel: function(){
    this.setState({ previewVisible: false  })
  },


  render: function () {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, file_pdf, fileList } = this.state;

    return (
        <Card id={this.props.id} title="Contrato" extra={ <a href="./tables#contratos"><Icon type="layout"/></a>} bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>

            <Row gutter={15}>
              <Col span={8}>
                <FormItem  label="Contratos Existentes">
                  {getFieldDecorator('input_cinco', {
                    rules: [{
                      type:'object',
                      message: 'Seleccione un Contrato!'
                    }],
                  })(
                  <SelectInput
                    url="apiFuec/allAgreement"
                    onUserSelect={this.handleSelect}
                  />
                  )}
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
                  <Upload
                    listType="text"
                    onPreview={this.handlePreview}
                    fileList={this.state.fileList}
                    onChange={this.handleImagePdf}>
                    <Button>
                      <Icon type="upload" /> Cargar PDF
                    </Button>
                  </Upload>
                </FormItem>
              </Col>

              <Col span={8}>

                <FormItem label="Union - Tipo de contrato">
                  {getFieldDecorator('input_tres',
                  {
                    rules: [
                      { type: 'object',
                        message: 'Seleccione un tipo de contrato!'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allKindAgreement"
                  />
                  )}
                </FormItem>

                <FormItem label="Union - Con">
                  {getFieldDecorator('input_nueve',
                  {
                    rules: [
                      { type: 'object',
                        message: 'Seleccione una persona o empresa !'
                      },
                    ],
                  })(
                  <SelectInput
                    url="apiFuec/allPerson"
                  />
                  )}
                </FormItem>


                <Modal width='80%' style={{ top: 20  }} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <iframe
                    src={file_pdf}
                    width="100%"
                    height="500px"
                    alt="pdf"
                    type="application/pdf"
                  />
                </Modal>

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
