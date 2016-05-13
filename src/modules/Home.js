const React = require('react');

const Example = require('../components/example');

module.exports = React.createClass({
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Example/>
      </div>
    );
  }
});
