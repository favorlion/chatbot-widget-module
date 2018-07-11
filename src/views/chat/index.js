import React, {Component} from 'react';
import groupMessages from '../../groupMessages';
import Header from '../../components/Header';
import Conversation from '../../components/Conversation';
import Footer from '../../components/Footer';
import _ from 'lodash';
import queryString from 'query-string';

import io from 'socket.io-client';

class Chat extends Component {

    static contextTypes = {
        handleSend: React.PropTypes.func,
        trackCTA: React.PropTypes.func,
        socket: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.themeAC = Math.random();

        window.addEventListener('message', e => {
            const data = this.parseMessage(e.data);
            if (data.cmd === 'chat_state') {
                this.setState({
                    stateClass: data.data
                });
            }
            if (data.cmd === 'click') {
                let elem = document.querySelector(data.data);
                elem && elem.click();
            }
        });
    }

    parseMessage(msg) {
        let cmd, data, s;

        if ((s = msg.indexOf('|')) !== -1) {
            cmd = msg.substr(0, s);
            data = msg.substr(s + 1);
            try {
                data = JSON.parse(data);
            } catch (ex) {}
        } else {
            cmd = msg;
        }

        return { cmd, data }
    }

    componentDidMount() {

        const options = queryString.parse(window.location.search);

        setTimeout(() => {
            this.context.handleSend(options.text, true);
        }, 1000)
    }

    render() {
        const messageGroups = groupMessages(this.props.messages);

        const options = queryString.parse(window.location.search);

        const theme = options.theme || 'amazon';
        const theme_ext = options.theme_ext && (decodeURIComponent(options.theme_ext) + '?' + this.themeAC) || '';
        const stylesheet = <link rel="stylesheet" href={process.env.PUBLIC_URL + '/themes/' + theme + '.css'}/>;
        const stylesheet_ext= <link rel="stylesheet" href={theme_ext}/>;

        let cls = 'App';
        if (this.state.stateClass) {
            cls += ' ' + this.state.stateClass;
        }

        return (
            <div className={cls}>
                {stylesheet}
                {stylesheet_ext}
                <Header/>
                <Conversation messageGroups={messageGroups} loader={this.props.loader} noFooter={!!this.props.quickReplies}/>
                <Footer quickReplies={this.props.quickReplies} onSend={this.context.handleSend.bind(this)} onClickTrough={this.context.trackCTA.bind(this)}/>
            </div>
        );
    }
}

export default Chat;
