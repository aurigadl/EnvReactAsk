import React from 'react'
import TableFuec from './TableFuec'
import TableAgreement from './TableAgreement'
import browserHistory from 'react-router'
import {Layout, BackTop,
   Col, Row, Button, Icon} from 'antd';

const { Header, Content} = Layout;

const PageThree = React.createClass({


  render: function () {

    return (
          <Content>
            <Header>
              <h2>
                <Icon type="solution"/>
                  Tabla - Contrato Del Servicio Público
              </h2>
            </Header>
            <TableFuec/>
            <BackTop/>
          </Content>
    );
  }
});

export default PageThree
