import React from 'react';
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute} from 'react-router'
import App   from 'modules/App/App';
import login from 'components/login/login';
import About from 'modules/about/About';

render ((
    <Router history={hashHistory}>
      <Router path="/" component={App}>
        <IndexRoute component={login}/>
        <Route path="/about" component={About}/>
      </Router>
    </Router>
), document.getElementByid('content'));
