import React from 'react'
import {makeRequest as mReq} from '../utils/mrequest';
require('./formsPanels.css');

var CheckboxInputs = React.createClass({

  getDefaultProps: function() {
    return {
      idsCheckSelected: []
    };
  },


  getInitialState: function () {
    return {
      globalCheckbox: false,
      dataList: []
    }
  },


  componentWillReceiveProps: function(nextProps) {
    this.replaceState({
      dataList: this.state.dataList.map(function (d) {
        var newSelected = ((nextProps.idsCheckSelected.indexOf(d.value) != -1) ? true : false);
        return {
          value: d.value,
          label: d.label,
          selected: newSelected
        };
      })
    });
  },


  linkGlobalCheckbox: function () {
    var newVal = !this.state.globalCheckbox;
    this.replaceState({
      globalCheckbox: newVal,
      dataList: this.state.dataList.map(function (d) {
        return {
          value: d.value,
          label: d.label,
          selected: newVal};
      })
    });
  },

  linkCheckbox: function (e) {
    this.replaceState({
      dataList: this.state.dataList.map(function (d) {
        var newSelected = (e.target.value == d.value ? !d.selected : d.selected);
        return {
          value: d.value,
          label: d.label,
          selected: newSelected
        };
      })
    });
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
        console.error('CheckBoxInputs, there was an error!', err.statusText);
      });

  },

  successHandler: function (data) {
    var arrayData = [];
    for (var i = 0; i < data.length; i++) {
      var check = data[i];
      arrayData.push({
        value: check.id,
        label: check.nomb,
        selected: false
      });
    }
    this.setState({dataList: arrayData})
  },

  render_Checkbox: function (result , i) {
    return <label for="checkbox2" key={i}>
      <input type="checkbox"
             key={i}
             name={this.props.ck_name}
             checked={result.selected}
             onChange={this.linkCheckbox}
             value={result.value}/>
      {result.label}
    </label>
  },

  render: function () {
    var list = this.state.dataList;
    var listCheck = list.map(this.render_Checkbox);
    return (<div>
        <label>Todos <input type="checkbox" onChange={this.linkGlobalCheckbox}/></label>
        {listCheck}
      </div>
    );
  }

});

export default CheckboxInputs;
