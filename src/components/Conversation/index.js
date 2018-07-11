import React from 'react';
import './index.css';
import MessageGroup from '../MessageGroup';
import Carousel from '../Carousel';

class Conversation extends React.Component {
  render() {
    const {messageGroups} = this.props;

    var messageGroupElements = messageGroups.map((messageGroup , i) => {

      if (messageGroup.type === 'interactive') {
        return <Carousel message={messageGroup.messages[0]} key={i}/>
      }
      return <MessageGroup messageGroup={messageGroup} key={i}/>;

    });

    let style = {};

    if (this.props.noFooter) {
      style = { bottom: 0 };
    }

    return (
      <div className="Conversation" ref="conversation" style={style}>
        <div className="lines">

          {messageGroupElements}
          {this.props.loader &&
            <div className="message-loader"></div>
          }
          {this.props.noFooter ? <div className="lines-footer"><br/><br/><br/><br/></div> : null }

        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    setTimeout(() => this.scrollToBottom(), 150);
    setTimeout(() => this.scrollToBottom(), 450);
  }

  scrollToBottom() {

    const element = this.refs.conversation;
    element.scrollTop = element.scrollHeight;
  }
}

export default Conversation;
