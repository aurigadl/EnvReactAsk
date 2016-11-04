import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';

var SelectInput = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      options: [],
      name: React.PropTypes.string.isRequired,
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
    arrayData.push(<option key='' value=''></option>);
    for (var i = 0; i < data.length; i++) {
      var option = data[i];
      arrayData.push(
        <option key={i} value={option.id}>{option.nomb}</option>
      );
    }
    this.setState({options: arrayData})
  },

  handleChange: function (e) {
    var index = e.nativeEvent.target.selectedIndex;
    var text = e.nativeEvent.target[index].text;
    var user = this.refs.selectValue.value;
    if (typeof this.props.onUserSelect === "function"){
      this.props.onUserSelect(
        user, text
      );
    }
  },

  render: function () {
    return (
      <select
        value={this.props.selectstate}
        className={this.props.class}
        onChange={this.handleChange}
        ref="selectValue"
        required={this.props.required}
        name={this.props.name}>
        {this.state.options}
      </select>
    )
  }

});

export default SelectInput
