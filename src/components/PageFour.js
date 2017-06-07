import React from 'react'
import {Layout, BackTop,
   Col, Row, Button, Icon} from 'antd';

const { Header, Content} = Layout;

const PageFour = React.createClass({

  render: function () {

    return (
          <Content>
            <Header>
              <h2>
                <Icon type="solution"/>
                  Documentos
              </h2>
            </Header>
            <BackTop/>
          </Content>
    );
  }
});

export default PageFour
