import React from 'react'
import AdminFormUser from './AdminFormUser.js'
import AdminFormEmpresa from './AdminFormEmpresa.js'
import AdminFormUserRoles from './AdminFormUserRoles.js'
import AdminDocGestion from './AdminDocGestion.js'
import {Row, Tooltip, message, Layout,
 Col, BackTop, Button, Icon, Input} from 'antd';

const { Header, Content} = Layout;

const PageOne = React.createClass({

  getInitialState: function () {
    return {
      newOption: false
    }
  },

  handleNewElement: function (newValue) {
    if (newValue !== this.state.newOption) {
      this.setState({
        newOption: newValue
      });
    }
  },

  render: function () {
    return (
      <Content>

        <div className="hiperLink">

          <Tooltip placement="left" title={'Empresa'}>
            <Button size={'large'} shape="circle" type="primary" ghost><a href="#empresa">Em</a></Button>
          </Tooltip>

          <Tooltip placement="left" title={'Usuario'}>
            <Button size={'large'} shape="circle" type="primary" ghost><a href="#usuario">Us</a></Button>
          </Tooltip>

          <Tooltip placement="left" title={'Roles'}>
            <Button size={'large'} shape="circle" type="primary" ghost><a href="#usuarioroles">Ur</a></Button>
          </Tooltip>

          <Tooltip placement="left" title={'Documentos'}>
            <Button size={'large'} shape="circle" type="primary" ghost><a href="#documentos">Ur</a></Button>
          </Tooltip>

        </div>

        <Header>
          <h2>
            <Icon type="solution"/>
            ADMIN - Administración
          </h2>
        </Header>

        <AdminFormEmpresa
          id="empresa"/>

        <Row>
          <Col span="12">

            <AdminFormUser
              id="usuario"
              onItemNew={this.handleNewElement} />
          </Col>

          <Col span="12">
            <AdminFormUserRoles
              id="usuarioroles"
              newOption={this.state.newOption}
              onItemNew={this.handleNewElement} />
          </Col>


        </Row>

        <AdminDocGestion />

        <BackTop/>

      </Content>
    );
  }

});

export default PageOne
