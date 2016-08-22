import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';

var SelectInput = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      options: []
    }
  },

  componentDidMount: function () {

    var parreq = {
      method: 'GET',
      url: this.props.url
    };

    mReq(parreq)
      .then(function (response) {
        this.successHandler(response.result)
      }.bind(this))
      .catch(function (err) {
        console.error('AdminSelectRoles, there was an error!', err.statusText);
      });
  },

  successHandler: function (data) {
    this.state.options.push(<option key='' value=''></option>);
    for (var i = 0; i < data.length; i++) {
      var option = data[i];
      this.state.options.push(
        <option key={i} value={option.id}>{option.nomb}</option>
      );
    }
    this.forceUpdate();
  },

  handleChange: function (e) {
    var index = e.nativeEvent.target.selectedIndex;
    var text = e.nativeEvent.target[index].text;
    if (typeof this.props.onUserSelect === "function")
      this.props.onUserSelect(
        index, text
      );
  },

  render: function () {
    return (
      <select
        className={this.props.class}
        onChange={this.handleChange}
        ref="selectValue"
        name={this.props.name}>
        {this.state.options}
      </select>
    )
  }

});

export default SelectInput
