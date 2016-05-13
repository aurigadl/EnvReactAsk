const React = require('react');

const styles = require('./example.css');

module.exports = React.createClass({
  handleClick(evt) {
    console.log(evt);
  },

  render() {
    return (
      <div className={styles.example}>
        <h2>Example component</h2>
        <p>
          <button onClick={this.handleClick}>Click me</button>
        </p>
      </div>
    );
  }
});
