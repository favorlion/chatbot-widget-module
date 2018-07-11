import React from 'react'
import groupMessages from '../../groupMessages';
import Header from '../../components/Header';
import Footer from './components/Footer';
import Conversation from './components/Conversation';
import Video from './components/VideoPlayer';
import ClickToResume from './components/ClickToResume';

import './index.css';

class VideoChat extends React.Component {

    static contextTypes = {
        handleSend: React.PropTypes.func
    }

    static propTypes = {
        messages: React.PropTypes.array,
        quickReplies: React.PropTypes.array
    }

    constructor(props) {

        super(props)

        this.state = {
            chatboxVisible: false,
            snapshotURIArray: []
        }

        this.toggleChatbox = this.toggleChatbox.bind(this);
        this.closeChatbox = this.closeChatbox.bind(this);

        window.addEventListener('message', e => {

            if (e.data.text) {
                this.context.handleSend(e.data.text, true);
                this.setState({chatboxVisible: true});
            } else if (e.data.hideChatbox) {
                this.setState({chatboxVisible: false});
            }

        });
    }

    toggleChatbox() {

        this.setState({
            chatboxVisible: !this.state.chatboxVisible
        });

        if (!this.state.chatboxVisible) {
            parent.postMessage({
                pauseVideo: true,
                destination: "chat"
            }, "*");
        }

    }

    closeChatbox() {

        this.setState({chatboxVisible: false, videoOver: false});

        parent.postMessage({
            playVideo: true,
            destination: "chat"
        }, "*");

    }

    render() {

        let messageGroups = groupMessages(this.props.messages);

        return (
            <div className="App" id="hdvc">

                <header className="hdvc-header">
                    <span className="hdvc-client-logo"><img src="./svg/tesla.svg" height="20" width="140" alt="Tesla"/></span>
                    <button className="hdvc-btn-bc" onClick={this.toggleChatbox}>
                        <span/>
                        <span/>
                        <span/>
                    </button>
                    <button className="hdvc-btn-cls" onClick={this.closeChatbox}/>
                </header>

                <Video toggleChatbox={this.toggleChatbox} chatboxVisible={this.state.chatboxVisible}/> {this.state.chatboxVisible
                    ? (
                        <div className="hdvc-chatbox-wrap popInAnimation">
                            <div className="hdvc-chatbox hdvc-qaed">
                                <button className="hdvc-btn-cls" onClick={this.closeChatbox}/>
                                <Conversation messageGroups={messageGroups} noFooter={!!this.props.quickReplies}/>
                            </div>

                            <ClickToResume closeChatbox={this.closeChatbox}/>
                            <Footer quickReplies={this.props.quickReplies} onSend={this.context.handleSend.bind(this)}/>
                        </div>
                    )
                    : null}

            </div>

        );
    }

}

export default VideoChat
