import React from 'react'
import {Link} from 'react-router'
import auth from '../utils/auth'
import {Affix, Popover, Layout, Icon, Button} from 'antd';
const {Sider} = Layout;

const content = (
    <ul id='fistMenu'>
      <li>
        <Link to='/pageOne'>
          <Button size={'large'} type="dashed" shape="circle" icon="setting"/>
          Admin
        </Link>
      </li>
      <li>
        <Link to='/pageTwo'>
          <Button size={'large'} type="dashed" shape="circle" icon="solution"/>
          Fuec
        </Link>
      </li>
      <li>
        <Link to='/logout'>
          <Button size={'large'} type="dashed" shape="circle" icon="logout"/>
          Salir
        </Link>
      </li>
    </ul>
    );

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
    this.setState({collapsed});
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
              <Popover placement="leftTop" content={content} trigger="click">
                <Icon type="appstore" />
              </Popover>
            </Affix>
          </Sider>
        ) : null}
      </Layout>
    )
  }
});

export default App
