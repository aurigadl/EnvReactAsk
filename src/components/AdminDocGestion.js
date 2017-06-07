import React from 'react'

import AdminDocDocument from './AdminDocDocument';
import AdminDocSecuence from './AdminDocSecuence';
import AdminDocGroups from './AdminDocGroups';
import AdminDocOption from './AdminDocOption';
import AdminDocDate from './AdminDocDate';
import AdminDocOrder from './AdminDocOrder';
import AdminDocRestart from './AdminDocRestart';

import { Form, Icon, Card, Row, Col} from 'antd';

const FormItem = Form.Item;

const AdminDocGestion = React.createClass({

  render: function () {

    return (

        <Card
          id={this.props.id}
          extra={<h3><a href="/PageOne#fuec"><Icon type="bars" /></a></h3>}
          title="Gestion de Documentos"
          bordered={false}>

          <Row gutter={26}>
            <Col className="gutter-row" span={12}>
              <section>
                <AdminDocDocument/>
              </section>
              <section>
                <AdminDocSecuence/>
              </section>
              <section>
                <AdminDocOption/>
              </section>
              <section>
                <AdminDocRestart/>
              </section>
            </Col>
            <Col className="gutter-row" span={12}>
              <section>
                <AdminDocGroups/>
              </section>
              <section>
                <AdminDocDate/>
              </section>
              <section>
                <AdminDocOrder/>
              </section>
            </Col>
          </Row>
        </Card>
      );
  }
})
export default AdminDocGestion
