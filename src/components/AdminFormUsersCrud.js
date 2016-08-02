import React from 'react'

var AdminFormUsersCrud = React.createClass({
  render: function() {
    return (
      <input
    type="text"
    value={this.state.value}
    onChange={this.handleChange}
    />
    <button onClick={this.reset}>Borrar</button>
    <button onClick={this.alertValue}>Enviar</button>
      </div>
    );
  }
});

export default AdminFormUsersCrud
