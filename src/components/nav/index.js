const React = require('react');
const {Link} = require('react-router');

const styles = require('./nav.css');

module.exports = React.createClass({
  render() {
    return (
      <ul className={styles.nav}>
        <li><Link to="/">Index</Link></li>
        <li><Link to="/item">Item</Link></li>
      </ul>
    );
  }
});
