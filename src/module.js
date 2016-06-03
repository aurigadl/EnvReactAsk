// Bootstrapping module
import React from 'react'
import { render  } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute  } from 'react-router'
import App     from 'components/App';
import Home    from 'components/Home'
import Evalua   from 'components/Evalua'
import Results from 'components/Results'
import Result  from 'components/Result'
import Admini  from 'components/Admini'

render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/results" component={Results}>
            <Route path="/results/:numtest" component={Result}/>
        </Route>
        <Route path="/evalua" component={Evalua}/>
        <Route path="/admini" component={Admini}/>
      </Route>
    </Router>) , document.getElementById('content'))
