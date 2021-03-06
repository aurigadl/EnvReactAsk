import React from 'react'
import SelectInput from './SelectInput.js'
import {remoteData} from '../utils/mrequest';
import {Card , Form , Input , Col, message,
  Row, Button, Icon} from 'antd';

const FormItem = Form.Item;

var FormPersonaCarro = Form.create()(React.createClass({


  getInitialState: function () {
    return {
      childSelV: undefined,
      childSelT: '',
      option:[
              {mod:{key:1, label:'Conductor'},
               person:[]},
              {mod:{key:3, label:'Supervisor'},
               person:[]}
            ],
      newOption: 0,
      initialValue: {},
    };
  },

  getRemoteData : function(parreq){
      remoteData(parreq,
          (data) => {
            var dataArray = [];

            for (var x in data.result) {
              let mod = data.result[x].mod;
              let per = data.result[x].person;

              var _mod = {key:mod.id, label:mod.name};
              var _per = {key:per.id, label:per.name};
              dataArray.push({mod: _mod, person: _per});

              //if element exist then set values
              if(dataArray.length === 1){
                this.props.form.setFieldsValue({
                  input_person_0:_per,
                  input_modal_0:_mod
                });
              }
            }

            if(dataArray.length > 0){
              this.setState({
                option: dataArray
              });
            }else{
              this.setState({
                option: [{mod:[], person:[]}]
              });
            }
          },
          (err) => {
            message.warning('NO se encontraron datos para cargar')
          }
      );
  },

  handleSelect: function (childSelV, childSelT) {
    this.setState({
      childSelV: childSelV,
      childSelT: childSelT
    });

    if (childSelV != undefined) {
      var params = {'id': childSelV};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idPersonCar',
        params: params
      };

      this.getRemoteData(parreq);

    } else {
      this.setState({
      option: [
              {mod:{key:1, label:'Conductor'},
               person:[]},
              {mod:{key:3, label:'Supervisor'},
               person:[]}
            ]
      })
    }

  },

  handleReset: function (e) {

    this.setState({
      childSelV: undefined,
      childSelT: '',
      option: [
              {mod:{key:1, label:'Conductor'},
               person:[]},
              {mod:{key:3, label:'Supervisor'},
               person:[]}
            ]
    });

    this.props.form.setFieldsValue({
      input_uno:[],
      input_modal_0:{key:1, label:'Conductor'},
      input_person_0:[],
    });

  },

  handleSubmitForm: function (e) {
    e.preventDefault();
    const form = this.props.form;
    const childV = this.state.childSelV;

    form.validateFields((err, val) => {
      if (!err) {
        const data=[]
        let i=0;
        do{
          let per_id = eval(`val.input_person_${i}`).key;
          let mod_id = eval(`val.input_modal_${i}`).key;
          data.push({'person': per_id, 'mod': mod_id});
          i++;
        }while(eval(`val.input_person_${i}`) !== undefined)

        var params = {
            id: childV
          , person_car: data
        };

        if (childV !== undefined) {
          var parreq = {
            method: 'PUT',
            url: 'apiFuec/updatePersonCar',
            params: {
              'params': params
            }
          };

          remoteData(parreq,
            (data) => {
              message.success('Se realizo el registro persona, carro y modalidad');
              //Update Container
              this.props.newOptCont();
              this.handleReset();
            },
            (err) => {
              message.error('NO se realizo el registro' +
                '\n Error :' + err.message.error)
          });
        }
      }
    })
  },

  addNewRelPerCar: function () {
    var newOption = this.state.option;
    newOption.push({mod:[], person:[]});
    this.setState({
      option: newOption
    });
  },

  delRelPerCar: function (i) {
    var newn = this.state.option;
    delete newn[i];
    var build = newn.filter((a)=>typeof a !== 'undefined')
    if(build.length == 0){
      build.push({mod:[], person:[]});
    }
    this.setState({
      option: build
    });
  },


  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOption;
    var prev = this.props.newOption;
    var next_i = nextProps.initVal;
    var prev_i = this.props.initVal;

    if (next != prev){
      this.setState({
        newOption: this.state.newOption + 1
      });
    }

    if (JSON.stringify(next_i) != JSON.stringify(prev_i)){
      var params = {'id': next_i.key};
      var parreq = {
        method: 'GET',
        url: 'apiFuec/idPersonCar',
        params: params
      };

      this.setState({
        initialValue: next_i,
        childSelV: next_i.key,
        childSelT: next_i.label
      });

      this.getRemoteData(parreq);
    }
  },

  render: function () {

    const { getFieldDecorator} = this.props.form;
    const {initialValue} = this.state
    const children = [];
    const st = this.state.option;
    var valSelec = '';

    if(initialValue){
      valSelec = initialValue;
    }

    for (let i = 0; i < st.length; i++){
      const data = st[i];
      children.push(
          <Row key={i}>
            <Col span="11">
              <FormItem>
                {getFieldDecorator(`input_person_${i}`,{
                  initialValue:data.person,
                  rules: [{
                    type:'object',
                    required: true,
                    message: 'Seleccione un tipo de persona!'
                  }],
                })(
                <SelectInput
                  newOption={this.state.newOption}
                  url="apiFuec/allPerson"
                  style={{marginRight: 4}}
                />
                )}
              </FormItem>
            </Col>
            <Col span="1">
              <p className="ant-form-split">-</p>
            </Col>
            <Col span="11">
              <FormItem>
                {getFieldDecorator(`input_modal_${i}`, {
                  initialValue:data.mod,
                  rules: [{
                    type:'object',
                    required: true,
                    message: 'Seleccione un tipo de Función!'
                  }],
                })(
                <SelectInput
                  url="apiFuec/allModality"
                  style={{marginRight: 8}}
                />
                )}
              </FormItem>
            </Col>
            <Col span="1">
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={i === 0}
                  onClick={()=>this.delRelPerCar(i)} />
            </Col>
          </Row>
      )
    };


    return (

      <Card id={this.props.id} title="Relación Carro y Personas" bordered={false}>
        <Form onSubmit={this.handleSubmitForm}>
          <Row gutter={15}>
            <Col span={8}>
              <FormItem  label="Carro">
                {getFieldDecorator('input_uno', {
                  initialValue:valSelec,
                  rules: [{
                    type:'object',
                    required: true,
                    message: 'Seleccione un vehiculo!'
                  }],
                })(
                <SelectInput
                  newOption={this.state.newOption}
                  url="apiFuec/allCar"
                  onUserSelect={this.handleSelect}
                />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" size="large">Grabar</Button>
                <Button style={{ marginLeft: 8  }} htmlType="reset" size="large" onClick={this.handleReset}>Limpiar</Button>
              </FormItem>
            </Col>

            <Col span={16}>
              <div className='ant-form-item-label'>
                <label className='ant-form-item-required'>Relacion Persona - Función</label>
              </div>
              {children}
              <FormItem>
                <Button onClick={this.addNewRelPerCar} type="dashed">
                  <Icon type="plus" /> Agregar Relación
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

}));

export default FormPersonaCarro;
