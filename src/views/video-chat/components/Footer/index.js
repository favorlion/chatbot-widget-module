import React from 'react';
import classNames from 'classnames';
import queryString from 'query-string';

import './index.css';
import './TopFooter.css'; // These styles make the footer go to the top as an overlay

import QuickReplyContainer from '../QuickReplyContainer';

class Footer extends React.Component {

    constructor(props) {
        super(props);

        this.triggerSend = this.triggerSend.bind(this);
        this.updateText = this.updateText.bind(this);
        this.keyDownManager = this.keyDownManager.bind(this);
        this.toggleChapterMenu = this.toggleChapterMenu.bind(this);

        this.state = {
            text: ""
        };
    }

    handleQuickReplySelect(text) {
        this.refs.textarea.value = '';
        this.props.onSend(text);
    }

    triggerSend(e) {
        e.preventDefault();

        let text = this.refs.textarea.value;

        text = text.trim().trim('\n');

        if (!text.length) {
            return;
        }

        this.setState({text: ""})

        this.props.onSend(text);
    }

    updateText(ev) {
        this.setState({text: ev.target.value});
    }

    keyDownManager(e) {

        if (e.keyCode === 13 && e.ctrlKey) {
            e.preventDefault();
            this.setState({
                text: e.target.value + "\n"
            });
        } else if (e.keyCode === 13 && !e.ctrlKey) {
            e.preventDefault();
            this.triggerSend(e);
        }

    }

    toggleChapterMenu(){
      this.setState({
        showChapterMenu : !this.state.showChapterMenu
      })
    }

    render() {
        const {quickReplies} = this.props;

        let quickRepliesElement;
        if (quickReplies) {
            quickRepliesElement = <QuickReplyContainer onSelect={this.handleQuickReplySelect.bind(this)} replies={quickReplies}/>;
        }

        const query = queryString.parse(window.location.search);

        return (
            <div className="hdvc-composer-wrap">

                {quickRepliesElement}

                {this.state.showChapterMenu
                    ? (
                        <div className="chapter-menu">
                            <ul>
                                <li>Navigation</li>
                                <li>Navigation</li>
                                <li>Navigation</li>
                            </ul>

                        </div>
                    )
                    : null}

                <form onSubmit={this.triggerSend.bind(this)} id="hdvc-composer">

                    {/*<button className="hdvc-btn-bc" onClick={this.toggleChapterMenu}><span/><span/><span/></button>*/}

                    <textarea ref="textarea" placeholder="Type your message" value={this.state.text} onKeyDown={this.keyDownManager} onChange={this.updateText}/>
                    <input type="submit" value="Submit"/>

                </form>

            </div>
        );
    }

}

export default Footer;
