import React from 'react'
import {remoteData} from '../utils/mrequest';
import {Upload, Card , Form , Input , Col
  , Row, Button, Icon, message, InputNumber} from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;

var AdminFormEmpresa = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      fileSign: '',
      fileLogo: '',
      initData: {
           name              : ''
          ,address           : ''
          ,phone             : ''
          ,id_company_legal  : ''
          ,secuence_contract : ''
          ,secuence_payroll  : ''
          ,owner             : ''
          ,email             : ''
          ,secuence_vehicle  : ''
      }
    }
  },

  componentDidMount: function () {

    var parreq = {
      method: 'GET',
      url: 'apiSystem/allSystem'
    };

    remoteData(parreq,
      (data) => {
        this.setState({
          initData: data.result,
          fileSign: data.result.sign,
          fileLogo: data.result.logo
        });
      },
      (err) => {
          message.error('Se genero un error al cargar los datos: '+ this.state.childSelectText +
            '\n Error: ' + err.message.error)
      }
    );
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const fileLogo = this.state.fileLogo;
    const fileSign = this.state.fileSign;

    this.props.form.validateFields((err, val) => {
      if (!err) {
        var params = {
           name              :val.input_uno
          ,address           :val.input_dos
          ,phone             :val.input_tres
          ,email             :val.input_diez
          ,nit_1             :val.input_cuatro
          ,nit_2             :val.input_doce
          ,secuence_contract :val.input_siete
          ,id_company_legal  :val.input_seis
          ,secuence_payroll  :val.input_ocho
          ,secuence_vehicle  :val.input_once
          ,owner             :val.input_nueve
          ,logo              :fileLogo
          ,sign              :fileSign
        }

        var parreq = {
          method: 'PUT',
          url: 'apiSystem/updateSystem',
          params: {
            'params': params
              ,'file': true
          }
        };

        remoteData(parreq,
          (data) => {
            message.success('Se actualizaron los registros');
          },
          (err) => {
            message.error('NO se actualizo el registro' +
              '\n Error :' + err.message.error)
          }
        );
      }
    });
  },

  handleImageLogo: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        fileLogo: event.target.result
      });
    }.bind(this);

    if (file.type == "image/png"){
      reader.readAsDataURL(file)
    }
  },

  handleImageSign: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = function(event) {
      this.setState({
        fileSign: event.target.result
      });
    }.bind(this);

    if (file.type == "image/png"){
      reader.readAsDataURL(file)
    }
  },

  hasErrors: function(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  setImage: function(img){
    if (img) {
      return (
          <div className="ant-upload-list-picture-card">
            <div className="ant-upload-list-item">
                  <img className="ant-upload-list-item-thumbnail"
                    src={img} target="_blank" />
            </div>
          </div>);
    }
  },

  render: function () {
    const { initData, fileLogo, fileSign } = this.state;
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const imgPreLogo = this.setImage(fileLogo);
    const imgPreSign = this.setImage(fileSign);

    return (
        <Card id={this.props.id} title="Empresa" bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>
                <FormItem label="Razón social">
                  {getFieldDecorator('input_uno',
                  {
                    initialValue: (initData.name || ''),
                    rules: [
                      { required: true,
                        message: 'Escriba una razon social!'
                      }
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Dirección">
                  {getFieldDecorator('input_dos',
                  {
                    initialValue: (initData.address || ''),
                    rules: [
                      { required: true,
                        message: 'Seleccione un tipo de persona!'
                      }
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>

                <FormItem label="Telefono">
                  {getFieldDecorator('input_tres',
                  {
                    initialValue: (initData.phone || ''),
                    rules: [
                      { required: true,
                        message: 'Seleccione un tipo de persona!'
                      }
                    ],
                  })(
                  <Input/>
                  )}
                </FormItem>


                <FormItem label="Firma 'Grafico en PNG'">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={this.handleImageSign}/>
                </FormItem>


                {imgPreSign}

              </Col>

              <Col span={8}>

                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem label="Nit">
                      {getFieldDecorator( 'input_cuatro', {
                      initialValue: (initData.nit_1 || ''),
                      })(
                      <InputNumber min={1} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label=" - Verificación">
                      {getFieldDecorator('input_doce',
                      {

                      initialValue: (initData.nit_2 || ''),
                      }
                      )(
                      <InputNumber min={1} />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <FormItem label="Correo electronico">
                  {getFieldDecorator('input_diez',
                  {
                    initialValue: (initData.email || ''),
                    rules: [
                      { required: true,
                        message: 'Correo electronico!'
                      }
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                <FormItem label="Representante Legal o Gerente">
                  {getFieldDecorator('input_nueve',
                  {
                    initialValue: (initData.owner || ''),
                    rules: [
                      { required: true,
                        message: 'Digite el representante legal!'
                      }
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                <FormItem label="Logo 'Grafico en PNG'">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={this.handleImageLogo}/>
                </FormItem>

                {imgPreLogo}

              </Col>

              <Col span={8}>
                <FormItem label="Identificación de la empresa - Fuec">
                  {getFieldDecorator('input_seis',
                  {
                    initialValue: (initData.id_company_legal || ''),
                    rules: [
                      { required: true,
                        message: 'Identificación de la empresa!'
                      }
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                <FormItem label="Consecutivo contratos">
                  {getFieldDecorator('input_siete',
                  {
                    initialValue: (initData.secuence_contract || 0),
                    rules: [
                      { required: true,
                        message: 'Consecutivo de contratos!'
                      }
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                <FormItem label="Consecutivo Planilla">
                  {getFieldDecorator('input_ocho',
                  {
                    initialValue: (initData.secuence_payroll || 0),
                    rules: [
                      { required: true,
                        message: 'Consecutivo de planilla!'
                      }
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                <FormItem label="Consecutivo Vehiculo">
                  {getFieldDecorator('input_once',
                  {
                    initialValue: (initData.secuence_vehicle || 0),
                    rules: [
                      { required: true,
                        message: 'Consecutivo de planilla!'
                      }
                    ],
                  })(
                  <Input />
                  )}
                </FormItem>

                  <Button
                    disabled={this.hasErrors(getFieldsError())}
                    type="primary"
                    htmlType="submit">Grabar</Button>

              </Col>
            </Row>
        </Form>
      </Card>
    )
  }
})
);

export default AdminFormEmpresa;
