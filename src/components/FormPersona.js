import React from 'react'
require('./formsPanels.css');

var FormPersona = React.createClass({

  render: function () {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>Persona</h1>
        </div>
        <form>
          <label> Nombre
            <input name="autoPlaca" type="text" placeholder=""/>
          </label>
          <label> Apellido
            <input type="text" placeholder=""/>
          </label>
          <label> Cedula
            <input type="text" placeholder=""/>
          </label>
          <label> Licencia
            <input type="text" placeholder=""/>
          </label>
          <label> Vigencia
            <input type="text" placeholder=""/>
          </label>
          <label> Telefono
            <input type="text" placeholder=""/>
          </label>
          <label> Dirección
            <input type="text" placeholder=""/>
          </label>
          <button type="button" className="success button">Grabar</button>
        </form>
      </div>
    )
  }

});

export default FormPersona;
