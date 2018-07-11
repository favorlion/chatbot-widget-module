import React, {Component} from 'react';
import _ from 'lodash';
import io from 'socket.io-client';

class App extends Component {

    getChildContext() {
        var _This = this;
        return {
            onVideoClick(url) {
                //console.log('setting the video URL:', url);
                // _This.setState({videoURL: url});
            },
            onCloseClick() {
                _This.setState({videoURL: null});
            },
            handleSend(message, isSilent) {
                _This.handleSend(message, isSilent);
            },
            trackCTA(url, title) {
                _This.trackCTA(url, title);
            },
            socket: this.socket
        }
    }

    constructor(props) {

        super(props);

        let channelID = this.props.location.query.channelID;

        let bot = this.props.location.query.bot || (this.props.location.pathname.indexOf("/video")
            ? "tesla"
            : "amazon");

        this.state = {
            quickReplies: null, // ["autoplay","pause","start over"],
            videoURL: null,
            messages: [],
            loader: false,
            bot: bot,
            channelID
        };

        this.waiting = false;
        this.msgStack = [];

        this.conversationId = generateUniqueId();

        this.socket = io(process.env.REACT_APP_SOCKET_URL);
        this.socket.on('message', this.handleServerMessage.bind(this));
        this.socket.emit('start', {conversationId: this.conversationId});

    }

    componentDidMount() {}

    handleServerMessage(message) {
        if (this.waiting || this.state.loader) {
            this.msgStack.push({
                type: message.type,
                func: () => this.showMessage(message)
            });
        } else {
            this.showMessage(message);
        }
    }

    trackMessage(from, text) {
        this.postMessage('track-message', {
            from: from,
            text: text
        });
    }

    trackCTA(cta, title) {
        this.postMessage('track-message', {
            from: 'client',
            text: title,
            cta: cta
        });
    }

    postMessage(msg, data) {
        try {
            if (data = JSON.stringify(data)) msg += '|' + data;
        } catch (ex) {}

        let p = parent;
        try {
            while (p && p !== window.top) {
                if (!p.document) break;
                p = p.parent;
            }
        } catch (ex) {}

        if (p && p !== window.top) {
            p.postMessage(msg, '*');
        }
    }

    showMessage(message) {

        //console.log('showMessage: ', message, 'state messages: ', this.state.messages);
        message.source = 'service';

        if (message.quickReplies || message.type === 'carousel') {
            let arr = this.state.messages;
            let last = arr[arr.length - 1];
            if (last && last.text) {
                this.trackMessage('chatbot', last.text);
            }
        }

        if (message.quickReplies) {
            this.setState({quickReplies: message.quickReplies});
        }

        if (message.type) {
            this.setState({
                messages: this.state.messages.concat([message])
            });
            parent.postMessage({
                addMessage: true,
                message: message,
                destination: "chat"
            }, "*");
        }

        this.waiting = true;
        setTimeout(() => {
            this.waiting = false;
            if (this.msgStack.length) {
                let type = this.msgStack[0].type;
                if (!type || type === 'linkRedirect') {
                    let msg = this.msgStack.shift();
                    msg.func.call(this);
                } else {
                    this.setState({ loader: true });
                    setTimeout(() => {
                        this.setState({ loader: false });
                        if (this.msgStack.length) {
                            let msg = this.msgStack.shift();
                            msg.func.call(this);
                        }
                    }, 1500);
                }
            }
        }, 200);
    }

    interactServer() {
        console.log("okay");
    }

    handleSend(text, isSilent) {
        let clientMessage,
            serverMessage,
            channelID = this.state.channelID;

        if (typeof text === "string") {

            clientMessage = {
                source: 'user',
                type: 'text',
                text: text
            };

            serverMessage = {
                source: 'user',
                type: 'text',
                text: text,
                host: `${document.location.protocol}//${document.location.hostname}:${document.location.port === "5001"
                    ? "5000"
                    : document.location.port}`,
                bot: this.state.bot,
                channelID
            };

        } else {

            clientMessage = {
                source: 'user',
                type: 'text',
                text: text.title
            };

            serverMessage = {
                source: 'user',
                type: 'text',
                text: text.payload,
                host: `${document.location.protocol}//${document.location.hostname}:${document.location.port === "5001"
                    ? "5000"
                    : document.location.port}`,
                bot: this.state.bot,
                channelID
            };

        }

        this.setState({quickReplies: null});

        if (!isSilent) {

            this.setState({
                messages: this.state.messages.concat([clientMessage])
            });

            this.trackMessage('client', clientMessage.text);
        }

        this.forceUpdate();

        if (this.socket && this.socket.connected) {
            //console.log(serverMessage);
            this.socket.emit('message', serverMessage);
        }
        // sends message to parent
        // var userMessage = {
        //   source: "user",
        //   message: text,
        // };

        // parent.postMessage(clientMessage, '*');

    }

    render() {

        var childrenWithProps = React.cloneElement(this.props.children, {
            messages: this.state.messages,
            quickReplies: this.state.quickReplies,
            loader: this.state.loader
        });

        return (
            <div>
                {childrenWithProps}
            </div>
        )

    }

}

App.childContextTypes = {
    onVideoClick: React.PropTypes.func,
    onCloseClick: React.PropTypes.func,
    handleSend: React.PropTypes.func,
    trackCTA: React.PropTypes.func,
    socket: React.PropTypes.object

};

export default App;

function generateUniqueId() {
    return (new Date()).getTime() + '-' + Math.random().toString().split('.')[1];
}
