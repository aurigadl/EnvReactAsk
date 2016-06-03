import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
  render() {
    return (
      <div>
        <h2>Results</h2>
        <ul>
          <li><NavLink to="/results/101">Evaluación 200</NavLink></li>
          <li><NavLink to="/results/10">Evaluación 100 </NavLink></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})
