import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './index.css'

class Notifications extends React.Component {

    static propTypes = {
        handleSend: React.PropTypes.func,
        chatboxVisible: React.PropTypes.bool,
        notifications: React.PropTypes.array,
        player: React.PropTypes.object,
        videoOver: React.PropTypes.bool,
        percentComplete: React.PropTypes.number
    }

    constructor(props) {
        super()

        this.sendMessage = this.sendMessage.bind(this);
        this.updateText = this.updateText.bind(this);
        this.onTextInputClick = this.onTextInputClick.bind(this);

        this.state = {
            text: "",
            chatboxVisible: props.chatboxVisible,
            videoOver: props.videoOver
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({chatboxVisible: nextProps.chatboxVisible, videoOver: nextProps.videoOver})
    }

    sendMessage(e) {

        e.preventDefault();

        var text = this.state.text;

        if (text === "") {
            return false;
        }

        if (this.props.percentComplete > .25) {
            this.props.handleSend({payload: text, title: text});
            this.props.player.pause();
            this.props.toggleChatbox();
        } else {
            this.props.addNotification(text);
        }

        this.setState({text: ""})

    }

    updateText(ev) {
        this.setState({text: ev.target.value});
    }

    onTextInputClick() {
        let lastNotification = this.props.notifications[this.props.notifications.length - 1];

        if (lastNotification && lastNotification.type === "hotspot") {
            this.props.player.pause();
        }

    }

    render() {

        let lastNotification = this.props.notifications[this.props.notifications.length - 1];
        let inputActive = false;

        if (lastNotification && (lastNotification.type === "hotspot" || lastNotification.activated === true)) {
            inputActive = true
        }

        return <div className="hdvc-lc-box">
            <div className="hdvc-lc">

                <ul>
                    {this.props.notifications.map((notification, idx) => {

                        let type = notification.type || "bot";

                        return (

                            <li key={idx} className={"messageFlowAnimation"}>
                                {type === "user"
                                    ? (<img src="/images/user-avatar.png" style={{
                                        float: "right",
                                        padding:"5px",
                                        "background" : "white",
                                        "border": "2px solid gray"
                                    }} className="message-icon iconAnimation"/>) :
                                    (<img src="/images/tesla-80.png" style={{
                                        float: "left"
                                    }} className="message-icon iconAnimation"/>)
                                }

                                <div style={{
                                    background: type === "user"
                                        ? "#fae5e5"
                                        : "white"
                                }} className={(type === "user"
                                    ? "message-bubble-user userMessageAnimation"
                                    : "message-bubble messageAnimation")}>{notification.text}</div>
                                  <br style={{clear: "both" }} />
                            </li>

                        )

                    })}

                </ul>

                {(this.state.chatboxVisible  || this.state.videoOver || this.props.notifications.length === 0)
                    ? null
                    : (

                        <div className={"hdvc-input-box active fadeInAnimationFast"}>
                            <form action="#" method="post" onSubmit={(e) => this.sendMessage(e)}>
                                <input type="input" name="lc-message" id="lc-message" placeholder="Type your message" value={this.state.text} onChange={this.updateText} onClick={this.onTextInputClick} autoComplete="off"/>
                                <input type="submit" value="Send"/>
                            </form>
                        </div>
                    )};

            </div>
        </div>

    }
}

export default Notifications;
