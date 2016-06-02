// Bootstrapping module
import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import { render  } from 'react-dom';
import Main from 'components/main';
import Example from 'components/example';
import App from 'components/App';
render(<App/>, document.getElementById('content'))
