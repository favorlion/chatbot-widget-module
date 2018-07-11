import React from 'react';
import Message from '../Message';
import './index.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default function MessageGroup({messageGroup}) {
  var messageElements = messageGroup.messages.map((message, i) =>
    <Message message={message} key={i}/>
  );


      return (
          <div className={'MessageGroup MessageGroup-' + messageGroup.source}>

              { messageGroup.source === "service" ? (<div className="MessageGroup-avatarColumn">
                  <div className={'Avatar Avatar-' + messageGroup.source}></div>
              </div>): null }

              <div className="MessageGroup-messagesColumn">
                  <ReactCSSTransitionGroup transitionName={'chat-bubble-' + messageGroup.source} transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                      {messageElements}
                  </ReactCSSTransitionGroup>
              </div>
          </div>
      )


}
