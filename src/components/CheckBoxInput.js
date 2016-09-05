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

  componentWillReceiveProps: function (nextProps) {
    console.log('tons que mi pex ' + nextProps.checked);
    this.replaceState({
      isChecked: nextProps.checked
    });
  },

  render: function () {
    return (
      <label for="checkbox2">
        <input type="checkbox"
               value={this.props.value}
               name={this.props.name}
               checked={this.state.isChecked}
               onChange={this.toggleCheckbox} />
          {this.props.label}
      </label>
    );
  }
});

export default CheckBoxInput
