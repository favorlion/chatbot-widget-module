/*global $*/

import React from 'react';
import './index.css';
import MessageGroup from '../MessageGroup';
import Carousel from '../../../../components/Carousel';

class Conversation extends React.Component {
  render() {
    const {messageGroups} = this.props;

    var messageGroupElements = messageGroups.map((messageGroup , i) => {

      if (messageGroup.type === 'interactive') {
        return <Carousel message={messageGroup.messages[0]} key={i}/>
      }
      return <MessageGroup messageGroup={messageGroup} key={i}/>;

    });

    return (
      <div className="hdvc-chat-bubbles scrollbar-macosx" ref="conversation">

          {messageGroupElements}




      </div>
    );
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    setTimeout(() => this.scrollToBottom(), 150);
    setTimeout(() => this.scrollToBottom(), 450);
    $('.scrollbar-macosx').scrollbar();
  }

  scrollToBottom() {

    const element = this.refs.conversation;
    element.scrollTop = element.scrollHeight;
  }
}

export default Conversation;
