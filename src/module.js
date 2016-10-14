// Bootstrapping module
require("./css/foundation.css");
require("./css/foundation-icons.css");
import React from 'react'
import { render  } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes  from './config/routes'

render(
    <Router history={browserHistory} routes={routes}/>, document.getElementById('content'));
