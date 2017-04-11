import React from 'react'
import FormRuta from './FormRuta.js'
import TableFuec from './TableFuec.js'
import FormCarro from './FormCarro.js'
import SelectInput from './SelectInput.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import TableAgreement from './TableAgreement.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import {remoteData} from '../utils/mrequest';
import {Tooltip, message, DatePicker, Layout, BackTop
  , Card , Form , Input , Col, Row, Button, Icon} from 'antd';

const { Header, Content} = Layout;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const InputGroup = Input.Group;

const PageTwo = Form.create()(React.createClass({

  getInitialState: function () {
    return {
      childSelV: undefined,
      childSelT: undefined,
      no_sec: '',
      no_fuec: '',
      id_company_legal: '',
      option: [],
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

        this.setState({
          sec:res.secuence_payroll,
          id_company_legal: res.id_company_legal
        });

        this.props.form.setFieldsValue({
          input_uno : res.id_company_legal  + ' 0000 ' + res.secuence_payroll
        })

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


  delRelRuta: function (e) {
    let idKey = e.currentTarget.dataset.key;
    var newOption = this.state.option;
    delete newOption[idKey];
    this.setState({
      option: newOption
    });
  },


  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;

    form.validateFields((err, val) => {
      if (!err) {
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
              sec:res.secuence_payroll,
              id_company_legal: res.id_company_legal
            });

            this.props.form.setFieldsValue({
              input_uno : res.id_company_legal  + ' 0000 ' + res.secuence_payroll
            })

          },
          (err) => {
            message.error('No se cargaron los datos de configuración: ' +
              '\n Error :' + err.message.error)
          }
        )

      }
    });

  },


  handleReset: function (e) {
    this.setState({
      no_agree: ''
    });
  },

  //callback to get data from component selectinput
  handleSelect: function (childSelV, childSelT) {
    this.setState({
      childSelV: childSelV,
      childSelT: childSelT
    });

    this.props.form.setFieldsValue({
      input_uno : this.setNewFuec(childSelT)
    });
  },

  render: function () {

    const { getFieldDecorator } = this.props.form;
    const st = this.state.option;

    var children = st.map(function (data, i) {
      return (
        <div key={i} ref={i}>
          <InputGroup compact>
            <Button onClick={()=>this.delRelRuta(i)}  data-key={i}  type="danger" shape="circle" icon="minus"/>
            {getFieldDecorator(`input_ruta_${i}`,
            {
              rules: [
                { required: true,
                  message: 'Seleccione una ruta!'
                }
              ],
            })(
            <SelectInput
              style={{ width: '88%' }}
              url="apiFuec/allRuta"
            />
            )}
          </InputGroup>
        </div>
      );
    });


    return (
          <Content>

            <div className="hiperLink">

              <Tooltip placement="left" title={'Fuec'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#fuec">Fu</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Carro - Personas'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#personaCarro">Pc</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Ruta'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#ruta">Ru</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Marca'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#marca">Ma</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Carro'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#carro">Ca</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Contrato'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#contrato">Co</a></Button>
              </Tooltip>

              <Tooltip placement="left" title={'Persona'}>
                <Button size={'large'} shape="circle" type="primary" ghost><a href="#persona">Pe</a></Button>
              </Tooltip>

            </div>

            <Header>
              <h2>
                <Icon type="solution"/>
                FUEC - Contrato Del Servicio Público
              </h2>
            </Header>

            <Card id='fuec' title="FUEC - Contrato Automotor Especial" bordered={false}>
              <Form onSubmit={this.handleSubmitForm}>
                <Row gutter={15}>
                  <Col span={8}>
                    <FormItem  label="No. FUEC" extra="No modificable.">
                      {getFieldDecorator('input_uno')(
                      <Input disabled={true} />
                      )}
                    </FormItem>

                    <FormItem label="Ruta: Origen - Destino" >
                      <InputGroup size="large" compact>
                      <Button onClick={this.addNewRuta}  type="primary"  shape="circle" icon="plus"/>
                      {getFieldDecorator('input_ruta_100',
                      {
                        rules: [
                          { required: true,
                            message: 'Seleccione un ruta!'
                          }
                        ],
                      })(
                      <SelectInput
                        style={{ width: '88%' }}
                        url="apiFuec/allRuta" />
                      )}
                      </InputGroup>
                    </FormItem>

                    {children}


                  </Col>

                  <Col span={8}>
                    <FormItem label="Fecha del fuec" >
                      {getFieldDecorator('input_cinco',
                      {
                        rules: [
                          { required: true,
                            type: 'array',
                            message: 'Seleccione una fecha!'
                          }
                        ],
                      })(
                      <RangePicker placeholder={['Fecha - Inicio', 'Fecha - Fin']}/>
                      )}
                    </FormItem>

                    <FormItem label="Vehiculo:" >
                      {getFieldDecorator('input_tres',
                      {
                        rules: [
                          { required: true,
                            message: 'Seleccione un vehiculo!'
                          }
                        ],
                      })(
                      <SelectInput
                        url="apiFuec/allCarWithPerson"
                      />
                      )}
                    </FormItem>

                  </Col>

                  <Col span={8}>
                    <FormItem label="Numero del contrato" >
                      {getFieldDecorator('input_cuatro',
                      {
                        rules: [
                          { required: true,
                            message: 'Seleccione un  contrato!'
                          }
                        ],
                      })(
                      <SelectInput
                        url="apiFuec/allAgreement"
                        onUserSelect={this.handleSelect}
                      />
                      )}
                    </FormItem>

                    <FormItem>
                      <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                      <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
                    </FormItem>
                  </Col>

                </Row>
                </Form>

              </Card>

              <FormPersonaCarro
                id='personaCarro'/>

              <Row>
                <Col span="12">
                  <FormRuta
                    id="ruta"/>
                </Col>
                <Col span="12">
                  <FormMarcaAuto
                    id="marca"/>
                </Col>
              </Row>

              <FormCarro
                id='carro'/>

              <FormContrato
                id='contrato'/>

              <FormPersona
                id="persona"/>

            <BackTop/>
          </Content>
    );
  }
}));

export default PageTwo
