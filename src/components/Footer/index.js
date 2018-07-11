import React from 'react';
import classNames from 'classnames';
import queryString from 'query-string';

import './index.css';
import './TopFooter.css'; // These styles make the footer go to the top as an overlay

import QuickReplyContainer from '../QuickReplyContainer';

class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {quickReplies} = this.props;

        var textareaVis = {
            display: "inline"
        };

        let quickRepliesElement;
        if (quickReplies) {
            quickRepliesElement = <QuickReplyContainer onSelect={this.handleQuickReplySelect.bind(this)} replies={quickReplies}/>;
            textareaVis = {
                display: "none"
            };
        }

        const query = queryString.parse(window.location.search);
        const footerClass = classNames('Footer', {
            'Footer--onTop': this.state.hasFocus && window.innerWidth <= 600 && query.mobile
        })

        return (
            <div className={footerClass}>
                {quickRepliesElement}
                <div className="MessageInput" style={textareaVis}>
                    <div className="TextInput">

                        <textarea onFocus={this.handleFocus} onBlur={this.handleBlur} onClick={this.handleTextAreaClick.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} ref="textarea" className="TextInput-textarea" placeholder="Type your message"/>

                        <div onClick={this.handleSendClick.bind(this)} className="SendButton"></div>
                    </div>
                </div>
            </div>
        );
    }

    handleFocus = () => {
        this.setState({hasFocus: true});
    }

    handleBlur = () => {
        setTimeout(() => {
            this.setState({hasFocus: false});
        });
    }

    handleTextAreaClick(e) {
        if (this.props.quickReplies) {
            e.target.blur();
        }
    }

    handleKeyDown(e) {
        const keyDownVariable = {
            type: 'pause'
        };
        parent.postMessage(keyDownVariable, '*');

        if (e.which === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.triggerSend();
        }
    }

    handleSendClick(e) {
        this.triggerSend();
    }

    handleQuickReplySelect(text) {
        this.refs.textarea.value = '';
        if (text.url) {
            this.props.onClickTrough(text.url, text.title);
        } else {
            this.props.onSend(text);
        }
    }

    triggerSend() {
        let text = this.refs.textarea.value;
        text = text.trim().trim('\n');
        if (!text.length) {
            return;
        }

        this.refs.textarea.value = '';
        this.refs.textarea.blur();
        this.props.onSend(text);
    }
    componentDidMount() {
        if (this.props.quickReplies) {
            this.refs.textarea.blur();
        }
    }
    componentDidUpdate() {
        if (this.props.quickReplies) {
            this.refs.textarea.blur();
        }
    }
}

export default Footer;
