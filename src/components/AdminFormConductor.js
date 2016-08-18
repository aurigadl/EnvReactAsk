import React from 'react'
require ('./formsPanels.css');

var AdminFormConductor = React.createClass({

  render: function() {
    return (
      <div className="header callout secondary">

        <div className="sign">
          <h1>new products</h1>
        </div>

        <label>Placa
          <input name="autoPlaca" type="text" placeholder="large-12.columns" />
        </label>
        <label>Input Label
          <input type="text" placeholder="large-12.columns" />
        </label>
        <label>Input Label
          <input type="text" placeholder="large-12.columns" />
        </label>
        <label>Input Label
          <input type="text" placeholder="large-12.columns" />
        </label>

        <select name="autoCart" form="carform">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="opel">Opel</option>
          <option value="audi">Audi</option>
        </select>

        <input type="submit" />

      </div>
    )
  }

});

export default AdminFormConductor;
