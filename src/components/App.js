import React from 'react'
import {Link} from 'react-router'
import auth from '../utils/auth'
import { Menu, Affix, Popover, Layout, Icon, Button} from 'antd';

const SubMenu = Menu.SubMenu;
const {Sider} = Layout;

const content = (
    <Menu mode="vertical">
        <Menu.Item key="1">
          <Link to='/pageOne'>
            <Icon  type="setting"/>
            Admin
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to='/pageTwo'>
            Fuec
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to='/pageFour'>
            Documentos
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to='/logout'>
            <Icon type="logout"/>
            Salir
          </Link>
        </Menu.Item>
    </Menu>);

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

  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },

  render(){
    if(!this.state.loggedIn){
      var bg = {background: 'transparent'};
    }
    return (
      <Layout style={bg} id="initFormat">
        {this.props.children}
        {this.state.loggedIn ? (
          <Sider  width={45} style={{color:'#108ee9', 'fontSize': '35px', background: '#dcdcdc', padding: '5px'}}>
            <Affix offsetTop={5} >
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              {content}
            </Affix>
          </Sider>
        ) : null}
      </Layout>
    )
  }
});

export default App
