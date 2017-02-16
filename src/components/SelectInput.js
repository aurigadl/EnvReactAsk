import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
import { Select  } from 'antd';
const Option = Select.Option;


var SelectInput = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      options: [],
      name: React.PropTypes.string.isRequired,
      valueSelect: ''
    }
  },

  loadOptionFromServer: function () {
    var parreq = {
      method: 'GET',
      url: this.props.url
    };

    mReq(parreq)
      .then(function (response) {
        this.successHandler(response.result)
      }.bind(this))
      .catch(function (err) {
        console.log('AdminSelectRoles, there was an error!', err.statusText);
      });
  },

  componentDidMount: function () {
    this.loadOptionFromServer();
  },

  componentWillReceiveProps: function(nextProps) {
    var next = nextProps.newOption;
    var prev = this.props.newOption;
    if ( next == true  && next != prev){
      this.loadOptionFromServer();
    }
  },


  successHandler: function (data) {
    var arrayData = [];
    arrayData.push(<Option key='' value='-- Ninguno --'></Option>);
    for (var i = 0; i < data.length; i++) {
      var option = data[i];
      arrayData.push(
        <Option key={i.toString()} value={option.id.toString()}>{option.nomb}</Option>
      );
    }
    this.setState({options: arrayData})
  },

  handleChange: function (value, label) {
    if (typeof this.props.onUserSelect === "function"){
      this.props.onUserSelect(
        value, label
      );
    }
    this.setState({ valueSelect: value});
  },

  render: function () {
    return (
      <Select
        {...this.props}
        value={this.state.valueSelect}
        onChange={this.handleChange}
        ref="valueSelect"
        name={this.props.name}>
        {this.state.options}
      </Select>
    )
  }

});

export default SelectInput
