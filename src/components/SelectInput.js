import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';

var SelectInput = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    name:React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      options: []
    }
  },

  componentDidMount: function() {

    var parreq = {
      method: 'GET',
      url: this.props.url
    };

    mReq(parreq)
      .then(function(response) {
        this.successHandler(response.result)
      }.bind(this))
      .catch(function (err) {
        console.error('AdminSelectRoles, there was an error!', err.statusText);
      });
  },

  successHandler: function(data) {
    for (var i = 0; i < data.length; i++) {
      var option = data[i];
      this.state.options.push(
        <option key={i} value={option.id}>{option.nomb}</option>
      );
    }
    this.forceUpdate();
  },

  render: function() {
    return (
      <select name={this.props.name}>{this.state.options}</select>
    )
  }

});

export default SelectInput
