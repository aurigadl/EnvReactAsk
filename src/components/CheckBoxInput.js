import React from 'react'

var CheckBoxInput = React.createClass({
  getInitialState: function () {
    return {
      isChecked: false
    };
  },

  toggleCheckbox: function () {
    this.setState({
      isChecked: ! this.state.isChecked
    });
  },

  render: function () {
    return (
      <div>
        <input type="checkbox"
               value={this.props.id}
               checked={this.state.isChecked}
               onChange={this.toggleCheckbox} />
          <label for="checkbox2">{this.props.label}</label>
      </div>
    );
  }
});

export default CheckBoxInput
