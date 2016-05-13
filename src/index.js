const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');
const {Router, RouterContext, match, browserHistory, createMemoryHistory} = require('react-router');

const routes = require('./routes');

// Client render
if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Router history={browserHistory} routes={routes} />,
    document.getElementById('container')
  );
}

module.exports = ({assets, template, path}, callback) => {
  const history = createMemoryHistory();
  const location = history.createLocation(path);

  match({routes, location}, (err, redirect, props) => {
    callback(null, template({
      html: ReactDOMServer.renderToStaticMarkup(<RouterContext {...props}/>),
      assets: assets
    }));
  });
};
