// Bootstrapping module
import React from 'react'
import { render  } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes  from './config/routes'
import css from './styles/main.less';

render(
    <Router history={browserHistory} routes={routes}/>, document.getElementById('content'));
