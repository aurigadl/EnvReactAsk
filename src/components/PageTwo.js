import React from 'react'
import FormRuta from './FormRuta.js'
import FormFuec from './FormFuec.js'
import FormCarro from './FormCarro.js'
import FormPersona from './FormPersona.js'
import FormContrato from './FormContrato.js'
import FormMarcaAuto from './FormMarcaAuto.js'
import FormPersonaCarro from './FormPersonaCarro.js'
import {Tooltip, Layout, BackTop,
   Col, Row, Button, Icon} from 'antd';

const { Header, Content} = Layout;

const PageTwo = React.createClass({

  getInitialState: function () {
    return {
      newPerson: 0,
      newAgreement: 0,
      newBrand: 0,
      newRoute: 0,
      newPerCar: 0,
      newCar: 0,
      initValRoute:{},
      initValCar:{},
      initValAgree:{},
    };
  },

  handleChangePerson: function(){
    this.setState({
      newPerson: this.state.newPerson + 1
    });
  },

  handleChangeAgreement: function(){
    this.setState({
      newAgreement: this.state.newAgreement + 1
    });
  },

  handleChangeBrand: function(){
    this.setState({
      newBrand: this.state.newBrand + 1
    });
  },

  handleChangeRoute: function(){
    this.setState({
      newRoute: this.state.newRoute + 1
    });
  },

  handleChangeCar: function(){
    this.setState({
      newCar: this.state.Car + 1
    });
  },

  handleChangePerCar: function(){
    this.setState({
      newPerCar: this.state.newPerCar + 1
    });
  },


  handleChangeFuec: function(objselfuec){
    //objselfuec is object with
    //{agree:{}, car:{}, route:{}}
    this.setState({
      initValRoute:objselfuec.route,
      initValCar:objselfuec.car,
      initValAgree:objselfuec.agree,
    });
  },

  render: function () {

    const { newCar, newRoute, newAgreement, newPerson,
            newBrand, newPerCar, initValRoute, initValCar,
            initValAgree } = this.state;

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

              <FormFuec
                newOptCont={this.handleChangeFuec}
                newOption={newAgreement + newRoute + newCar + newPerCar}
                id='fuec'/>

              <FormPersonaCarro
                initVal={initValCar}
                newOptCont={this.handleChangePerCar}
                newOption={newPerson + newCar}
                id='personaCarro'/>

              <FormCarro
                initVal={initValCar}
                newOptCont={this.handleChangeCar}
                newOption={newBrand}
                id='carro'/>

              <FormContrato
                initVal={initValAgree}
                newOptCont={this.handleChangeAgreement}
                newOption={newPerson}
                id='contrato'/>

              <FormPersona
                newOptCont={this.handleChangePerson}
                id="persona"/>

              <Row>
                <Col span="12">
                  <FormRuta
                    initVal={initValRoute}
                    newOptCont={this.handleChangeRoute}
                    id="ruta"/>
                </Col>
                <Col span="12">
                  <FormMarcaAuto
                    newOptCont={this.handleChangeBrand}
                    id="marca"/>
                </Col>
              </Row>

            <BackTop/>
          </Content>
    );
  }
});

export default PageTwo
