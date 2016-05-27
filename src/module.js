import React from 'react';
import { Router, Route, hashHistory  } from 'react-router'
import login from 'components/login/login';
import About from 'modules/about/About';

render ((
    <Router history={hashHistory}>
        <Route path="/" component={login}/>
        <Route path="/about" component={About}/>
        {this.props.children}
    </Router>
), document.getElementByid('content'));
