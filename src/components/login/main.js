import React from 'react';
import {RouteHandler, Link} from 'react-router';

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>Example</h1>
        <Link to='example'>Inico con react-router...</Link>
        <RouteHandler/>
      </div>
    );
  }
}

export default Main;
