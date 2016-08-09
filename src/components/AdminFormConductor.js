import React from 'react'

var AdminFormConductor = React.createClass({

  getInitialState: function() {
    return {
      childSelectValue: undefined
    }
  },

  changeHandler: function(e) {
    this.setState({
      childSelectValue: e.target.value
    })
  },

  render: function() {
    return (
      <div>

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
