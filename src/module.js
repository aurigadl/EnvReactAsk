// Bootstrapping module
import React from 'react'
import { render  } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes  from './config/routes'
import css from './styles/main.less';
import { LocaleProvider  } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';


function hashLinkScroll() {
  const { hash  } = window.location;
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}


render(
    <LocaleProvider locale={esES}>
      <Router
        history={browserHistory}
        onUpdate={hashLinkScroll}
        routes={routes}/>
    </LocaleProvider>
, document.getElementById('content'));
