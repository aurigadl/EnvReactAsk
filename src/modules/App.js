const React = require('react');

const Nav = require('../components/nav');

module.exports = React.createClass({
  render() {
    return (
      <div>
        <Nav/>
        {this.props.children}
      </div>
    );
  }
});
