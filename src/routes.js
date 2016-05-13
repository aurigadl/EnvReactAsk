const React = require('react');
const { Route, IndexRoute } = require('react-router');

const App = require('./modules/App');
const Home = require('./modules/Home');
const Item = require('./modules/Item');

module.exports = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/item" component={Item}/>
  </Route>
);
