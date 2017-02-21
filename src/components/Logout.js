import React from 'react'
import auth from '../utils/auth'
import {message} from 'antd';
import { browserHistory  } from 'react-router'

const Logout = React.createClass({

  componentDidMount() {
    auth.logout()
    message.success('Conexion terminada');
    browserHistory.push(`/login`)
  },

  render() {
    return <p>Sesión, terminada con éxito</p>
  }

})

export default Logout
