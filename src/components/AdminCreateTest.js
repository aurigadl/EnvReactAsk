import React from 'react'

export class AdminCreateTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {nameTest: ''};
    this.handleTestChange = this.handleTestChange.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    var nameTest = this.state.author.trim();
    if (!name) {
      return;
    }
    this.props.onCommentSubmit({nameTest: text});
    this.setState({nameTest: ''});
  }

  handleTestChange(e) {
    this.setState({nameTest: e.target.value});
  }

  getName() {
    let noRand = Math.floor(Math.random()*100000);
    return   noRand + '_' + this.props.initName
  }

  render() {
    return (
        <form className="commentForm">

          <input
            type  ="text"
            value ={this.state.nameTest}
            placeholder="Nombre del Test"
            onChange={this.handleTestChange}
          />

          <input type="submit" value="Post" />

        </form>
    );
  }

}
