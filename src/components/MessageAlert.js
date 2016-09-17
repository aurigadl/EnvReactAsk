import React from 'react'

var MessageAlert = React.createClass({

  render: function () {
    var { showHide, type, contextText, onclickMessage } = this.props;
    var showClass = showHide ? 'show' : 'hide';

    return (
      <div className={type + " callout " + showClass} data-closable="slide-out-right">
        <button onClick={onclickMessage} className="close-button" aria-label="Close alert" type="button" data-close>
          <span aria-hidden="true">&times;</span>
        </button>
        <p>{contextText}</p>
      </div>
    )
  }

});

export default MessageAlert;
