import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';

import { message, DatePicker, Modal, Table,
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
      tableAgreement: '',
      tableCarPeson: '',
      tableCar: '',
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
    var params = {'id': value.key};
    temp_changsel.agree = value;
    this.setState({
      childSelV: value.key,
      childSelT: value.label,
      input_uno: this.setNewFuec(value.label),
      changeSel: temp_changsel
    });
    this.props.newOptCont(temp_changsel)

    var parreq = {
      method: 'GET',
      url: 'apiFuec/idAgreement',
      params: params
    };

    remoteData(parreq,
      (data) => {
        const columns = [
          { title: 'Caracteristicas',
            dataIndex: 'nomb',
            key: 'nomb'
          },
          {
            title: 'Datos',
            dataIndex: 'dato',
            key: 'dato',
          }
        ];

        const res = data.result;
        const dataArray =[{key: 1,nomb:'Número de contrato', dato:res.no_agreement},
                    {key: 2,nomb:'Contratante', dato:res.name_person},
                    {key: 3,nomb:'Objeto del contrato', dato:res.name_object_agreement}
                   ]

        if(res.id_type_agreement){
          dataArray.push({key: 4, nomb:'Union - Tipo de contrato', dato:res.name_type_agreement});
        }

        if(res.id_person_agreement){
          dataArray.push({key: 5,nomb:'Union - Con', dato:res.name_person_agreement})
        }

        this.setState({
          tableAgreement: <div>
                          <br/>
                          <h4>Datos del Contrato</h4>
                          <Table dataSource={dataArray}
                          columns={columns}
                          size="small"
                          pagination={false}
                          />
                    </div>

        });

      },
      (err) => {
        message.error('NO se cargo el registro' +
          '\n Error :' + err.message.error)
    });
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

    var params = {'id': value.key};
    var parreq = {
      method: 'GET',
      url: 'apiFuec/idPersonCar',
      params: params
    };

    remoteData(parreq,
        (data) => {
          var dataArray = [];

          for (var x in data.result) {
            let mod = data.result[x].mod;
            let per = data.result[x].person;

            var _mod = mod.name;
            var _per = per.name;
            dataArray.push({key: x, mod: _mod, person: _per});
          }

          const columns = [
            { title: 'Persona',
              dataIndex: 'person',
              key: 'person'
            },
            {
              title: 'Función',
              dataIndex: 'mod',
              key: 'mod',
            }
          ];

          this.setState({
            tableCarPeson: <div>
                            <br/>
                            <h4>Vehiculo Relación Personas - Funciones</h4>
                            <Table dataSource={dataArray}
                            columns={columns}
                            size="small"
                            pagination={false}
                           />
                         </div>

          });

        },
        (err) => {
          message.warning('NO se encontraron datos para cargar')
        }
    );

    var parreq = {
      method: 'GET',
      url: 'apiFuec/idCar',
      params: params
    };

    remoteData(parreq,
        (data) => {
          const res = data.result;
          const columns = [
            { title: 'Caracteristicas',
              dataIndex: 'nomb',
              key: 'nomb'
            },
            {
              title: 'Datos',
              dataIndex: 'dato',
              key: 'dato',
            }
          ];

          data =[ {key:1, nomb:'Numero de carro:', dato:res.no_car},
                  {key:2, nomb:'Marca:', dato:res.brand_t},
                  {key:3, nomb:'Licencia:', dato:res.license_plate},
                  {key:4, nomb:'Modelo:', dato:res.model},
                  {key:5, nomb:'Clase:', dato:res.class_car_t},
                  {key:6, nomb:'Tarjeta de Operación:', dato:res.operation_card}
                ]

          this.setState({
            tableCar: <div>
                            <br/>
                            <h4>Datos del Vehiculo</h4>
                            <Table dataSource={data}
                            columns={columns}
                            size="small"
                            pagination={false}
                           />
                      </div>
          });


        },
        (err) => {
          message.error('NO se cargaron los datos de la seleccion: ' +
            '\n Error :' + err.message.error)
        }
    );

  },

  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOption;
    var prev = this.props.newOption;
    if (next != prev){
      this.setState({
        newOption: this.state.newOption + 1,
        tableCarPeson: '',
        tableCar: '',
      });
    }
  },

  render: function () {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, file_pdf, no_fuec, tableCarPeson,
            input_uno, sending, tableCar, tableAgreement } = this.state;
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


                <Modal width='80%' style={{ top: 20 }} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
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
          <Row gutter={15}>
            <Col span={12}>
              {tableCarPeson}
              {tableAgreement}
            </Col>
            <Col span={12}>
              {tableCar}
            </Col>
          </Row>
        </Card>
      );
  }
}))
export default Fuec
