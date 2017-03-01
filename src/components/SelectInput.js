import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
import { Select  } from 'antd';
const Option = Select.Option;


var SelectInput = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      options: [],
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
        console.log('Load data for selectinput, there was an error!', err.statusText);
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
    arrayData.push(<Option key='' value=' '> -- Ninguno --</Option>);
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
        placeholder="Selecciona un opción"
        onChange={this.handleChange}
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        showSearch>
        {this.state.options}
      </Select>
    )
  }

});

export default SelectInput
