import React from 'react';
import Message from '../Message';
import './index.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default function MessageGroup({messageGroup}) {
    var messageElements = messageGroup.messages.map((message, i) => <Message message={message} key={i}/>);

    console.log(messageGroup.source);

    return (
        <div>
            <ReactCSSTransitionGroup transitionName={'chat-bubble-' + messageGroup.source} transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                <ul>{messageElements}</ul>
            </ReactCSSTransitionGroup>
        </div>
    );

}
