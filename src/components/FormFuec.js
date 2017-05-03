import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import { message, DatePicker, Modal,
   Card , Form , Input , Col, Row, Button, Icon} from 'antd';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const InputGroup = Input.Group;

const Fuec = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelV: undefined,
      childSelT: undefined,
      sec: '',
      id_company_legal: '',
      option: [],
      file_pdf: undefined,
      no_fuec:undefined,
      previewVisible: false,
      input_uno: 0,
      newOption: 0,
      sending: false,
      changSel: {agree:{}, car:{}, route:{}},
    }
  },

  setNewFuec: function(agree){
    const st = this.state;
    const sec = st.sec.toString();
    const company = st.id_company_legal.toString();
    return company + ' ' + agree + ' ' + sec;
  },

  componentDidMount: function () {
    var parreq = {
      method: 'GET',
      url: 'apiSystem/allSystem'
    };

    remoteData(parreq,
      (data) => {
        const res = data.result;
        const payroll = res.secuence_payroll + 1;
        this.setState({
          sec:payroll,
          id_company_legal: res.id_company_legal,
          input_uno : res.id_company_legal  + ' 0000 ' + payroll
        });
      },
      (err) => {
        message.error('No se cargaron los datos de configuración: ' +
          '\n Error :' + err.message.error)
      }
    )
  },

  addNewRuta: function () {
    var newOption = this.state.option;
    newOption.unshift({});
    this.setState({
      option: newOption
    });
  },

  delRelRuta: function (i) {
    var newn = this.state.option;
    delete newn[i];
    var build = newn.filter((a)=>typeof a !== 'undefined')
    this.setState({
      option: build
    });
  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;

    form.validateFields((err, val) => {
      if (!err) {
        this.setState({ sending: true });
        const data=[]
        let i=0;
        while(eval(`val.input_ruta_${i}`) !== undefined){
          let ruta  = eval(`val.input_ruta_${i}`).key;
          data.push(ruta);
          i++;
        }
        data.push(val.input_ruta_100.key)

        var params = {
          route:  data.toString(),
          date: [val.input_cinco[0].format('YYYY-MM-DD'), val.input_cinco[1].format('YYYY-MM-DD')] ,
          car: val.input_tres.key,
          agreement: val.input_cuatro.key
        };

        var parreq = {
          method: 'PUT',
          url: 'apiFuec/newFuec',
          params: {
            'params': params
          }
        };

        remoteData(parreq,
          (data) => {
            const res = data.result;

            this.setState({
              file_pdf: 'data:application/pdf;base64,' + res.file_pdf,
              no_fuec: res.no_fuec
            });

            message.success('Se creo un nuevo FUEC: ' + res.no_fuec);
            this.setState({
              sending: false ,
              newOption: this.state.newOption + 1,
              sec: this.state.sec + 1
            });

            this.handleReset();

          },
          (err) => {
            message.error('No se cargaron los datos de configuración: ' +
              '\n Error :' + err.message.error)
            this.setState({ sending: false });
          }
        )

      }
    });
  },

  handleReset: function (e) {
    this.props.form.resetFields();
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

  handleChange_agreement:  function (value) {
    var temp_changsel = this.state.changSel;
    temp_changsel.agree = value;
    this.setState({
      childSelV: value.key,
      childSelT: value.label,
      input_uno: this.setNewFuec(value.label),
      changeSel: temp_changsel
    });
    this.props.newOptCont(temp_changsel)
  },

  handleChange_route:  function (value) {
    var temp_changsel = this.state.changSel;
    temp_changsel.route = value;
    this.setState({
      changeSel: temp_changsel
    });
    this.props.newOptCont(temp_changsel)
  },

  handleChange_car:  function (value) {
    var temp_changsel = this.state.changSel;
    temp_changsel.car = value;
    this.setState({
      changeSel: temp_changsel
    });
    this.props.newOptCont(temp_changsel)
  },

  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOption;
    var prev = this.props.newOption;
    if (next != prev){
      this.setState({
        newOption: this.state.newOption + 1
      });
    }
  },

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, file_pdf, no_fuec, input_uno, sending } = this.state;
    const st = this.state.option;
    const children = [];
    var link_pdf='';

    if(file_pdf){
      link_pdf = (<a onClick={this.handlePreview}>{this.state.no_fuec}.pdf </a>)
    }

    for (let i = 0; i < st.length; i++){
      children.push(
        <div key={i} ref={i}>
          <InputGroup compact>
            <Button onClick={()=>this.delRelRuta(i)} type="danger" shape="circle" icon="minus"/>
            {getFieldDecorator(`input_ruta_${i}`, {
              rules: [
                { required: true,
                  message: 'Seleccione una ruta!'
                }
              ], })(
            <SelectInput
              onChange={this.handleChange_route}
              newOption={this.state.newOption}
              style={{ width: '88%' }}
              url="apiFuec/allRuta"
            />
            )}
          </InputGroup>
          <br/>
        </div>
      );
    }

    return (

        <Card
          id={this.props.id}
          extra={<h3><a href="/pageThree#fuec"><Icon type="bars" /></a></h3>}
          title="FUEC - Contrato Automotor Especial"
          bordered={false}>
          <Form onSubmit={this.handleSubmitForm}>
            <Row gutter={15}>
              <Col span={8}>

                <div className="ant-form-item-label">
                  <label>
                    No. FUEC temporal
                  </label>
                </div>
                <h3>{input_uno}</h3>
                <br/>

                <FormItem label="Ruta: Origen - Destino" >
                  <InputGroup size="large" compact>
                    <Button onClick={this.addNewRuta}  type="primary"  shape="circle" icon="plus"/>
                    {getFieldDecorator('input_ruta_100', {
                      rules: [ { required: true,
                      message: 'Seleccione un ruta!' } ],
                    })(
                    <SelectInput
                      onChange={this.handleChange_route}
                      newOption={this.state.newOption}
                      style={{ width: '88%' }}
                      url="apiFuec/allRuta" />
                    )}
                  </InputGroup>
                </FormItem>
                {children}

              </Col>

              <Col span={8}>
                <FormItem label="Fecha del fuec" >
                  {getFieldDecorator('input_cinco', {
                  rules: [{
                    required: true,
                    type: 'array',
                    message: 'Seleccione una fecha!' } ],
                  })(
                  <RangePicker placeholder={['Fecha - Inicio', 'Fecha - Fin']}/>
                  )}
                </FormItem>

                <FormItem label="Vehiculo:" >
                  {getFieldDecorator('input_tres', {
                    rules: [ { required: true,
                    message: 'Seleccione un vehiculo!' } ],
                  })(
                  <SelectInput
                    onChange={this.handleChange_car}
                    newOption={this.state.newOption}
                    url="apiFuec/allCarWithPerson"
                  />
                  )}
                </FormItem>

              </Col>

              <Col span={8}>
                <FormItem label="Numero del contrato" >
                  {getFieldDecorator('input_cuatro', {
                    rules: [ { required: true,
                    message: 'Seleccione un  contrato!' } ],
                  })(
                   <SelectInput
                    onChange={this.handleChange_agreement}
                    newOption={this.state.newOption}
                    url="apiFuec/allAgreement"
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
                  <Button
                    disabled={sending}
                    type="primary"
                    htmlType="submit"
                    size="large">Grabar</Button>

                  <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
                </FormItem>

                <br/>
                {link_pdf}

              </Col>

            </Row>
          </Form>

        </Card>
      );
  }
}))
export default Fuec
