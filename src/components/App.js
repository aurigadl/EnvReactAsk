import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Evaluciones por Competencias</h1>
        <ul role="nav">
          <li><NavLink to="/" onlyActiveOnIndex>Inicio</NavLink></li>
          <li><NavLink to="/evalua" onlyActiveOnIndex>Evaluaciones</NavLink></li>
          <li><NavLink to="/results">Resultados</NavLink></li>
          <li><NavLink to="/admini">Administracion</NavLink></li>
        </ul>
        {this.props.children}
        <h2>Esto esta fuera del menu</h2>
      </div>
    )
  }
})
