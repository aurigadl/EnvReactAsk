import React from 'react'

export class AdminShowTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: this.props.names};
  }

  render() {
    return (
        <ul>
          {this.state.value.map(listValue => <li>{listValue}</li>)}
        </ul>
    );
  }

}

AdminShowTest.defaultProps = { names: ['garabato', 'salina', 'comilo', 'pelone', 'testua']};
