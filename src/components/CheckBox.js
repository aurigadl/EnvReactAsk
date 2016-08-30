let Checkbox = React.createClass({
  getInitialState: function () {
    return {
      isChecked: false
    };
  },

  toggleCheckbox: function () {
    this.setState({
      isChecked: ! this.state.isChecked
    });

    this.props.handleCheckboxChange(this.props.label);
  },

  render: function () {
    return (
      <div>
        <input type="checkbox"
               value={this.props.label}
               checked={this.state.isChecked}
               onChange={this.toggleCheckbox} />
          <label for="checkbox2">{this.props.label}</label>
      </div>
    );
  }
});
