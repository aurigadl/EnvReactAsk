import React from 'react'
import auth from '../utils/auth'

const Dashboard = React.createClass({
  render() {
    const token = auth.getToken()

    return (
      <div className="row">
        <br />
        {this.props.children}
      </div>
    )
  }
});

export default Dashboard
