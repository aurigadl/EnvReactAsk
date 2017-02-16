import React from 'react'
import {Link} from 'react-router'
import auth from '../utils/auth'
import {Layout, Menu, Icon} from 'antd';
const {Sider} = Layout;

const App = React.createClass({

  getInitialState() {
    return {
      loggedIn: auth.loggedIn(),
      collapsed: true,
    }
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn: !!loggedIn
    })
  },

  componentWillMount() {
    auth.onChange = this.updateAuth
  },


  onCollapse(collapsed){
    console.log(collapsed);
    this.setState({collapsed});
  },


  render(){
    console.log('Esta registrado ' + this.state.loggedIn);
    if(!this.state.loggedIn){
      var bg = {background: 'transparent'};
    }
    return (
      <Layout style={bg} id="initFormat">
        {this.state.loggedIn ? (
          <Sider
            collapsible
            collapsedWidth={40}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo"/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/pageOne">
                  <Icon type="eye-o" />
                  <span className="nav-text">Admin</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/pageTwo">
                  <Icon type="file-text" />
                  <span className="nav-text">Fuec</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/logout">
                  <Icon type="logout" />
                  <span className="nav-text">Salir</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
        ) : null}

        {this.props.children}

      </Layout>
    )
  }
});

export default App
