/*global videojs*/

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './index.css'
import Notifications from './Notifications'
import $ from 'jquery';

class Video extends React.Component {

    static contextTypes = {
        handleSend: React.PropTypes.func
    }

    static propTypes = {
        chatboxVisible: React.PropTypes.bool
    }

    constructor(props) {

        super()

        this.selectTopic = this.selectTopic.bind(this);

        this.addNotification = this.addNotification.bind(this);

        this.notifications = [
            {
                time: 4,
                text: "Hi, I’m Tess. Happy to introduce you to the all-new Tesla S."
            }, {
                time: 7,
                text: "Feel free to ask me anything about this beauty :)",
                activated: true
            }, {
                time: 16,
                length: 5,
                text: "Want to know more about these mind-blowing Autopilot features?",
                payload: "goto /navigation",
                type: "hotspot"
            }, {
                time: 23,
                text: "Did you know that the Tesla S can go from 0-60mph in just 5.4 seconds? 😲",
                activated: true
            }, {
                time: 32,
                length: 5,
                text: "Tesla keeps outdoing itself. Want to learn more about their software 8.0 update?",
                payload: "goto /software",
                type: "hotspot"
            }, {
                time: 39,
                text: "By the way, that’s one of Elon Musk’s favorite features! ;)"
            }, {
                time: 45,
                text: "Love it in “Ultra White”. What’s your favorite color?",
                activated: true
            }, {
                time: 55,
                text: "Wow, this is unreal!"
            }, {
                time: 56,
                text: "It parks itself as if by magic. 😲"
            }, {
                time: 64,
                length: 5,
                text: "Want to book a test drive?",
                payload: "goto /test-drive",
                type: "hotspot"
            }
        ]

        this.state = {
            time: 0,
            notifications: [],
            innerPlayer: null,
            videoOver: false,
            chatboxVisible: props.chatboxVisible,
            notificationsBlocked: false
        }

    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            chatboxVisible: nextProps.chatboxVisible && !nextProps.videoOver,
            videoOver: nextProps.videoOver
        })

    }

    addNotification(text, type, silent) {

        if (!this.state.chatboxVisible) {

            type = type || "user";

            silent = silent || false;

            this.setState({
                notifications: this.state.notifications.concat([
                    {
                        text: text,
                        type: type
                    }
                ])
            })

            if (!silent) {
                this.context.handleSend(text, true);
            }
        }

    }

    popNotification() {
        this.setState({notifications: this.state.notifications.slice(1)})
    }

    blockNotifications(time) {
        time = time || 10000;
        this.setState({notificationsBlocked: true});

        setInterval(() => {
            this.setState({notificationsBlocked: false})
        }, time);
    }

    componentDidMount(props) {

        let time;

        let self = this;

        let notifications = this.notifications;

        let markers = this.notifications.filter((notification) => {
            return notification.type === "hotspot"
        }).map((notification) => {
            return {time: notification.time, length: notification.length, text: notification.text, type: 'text'}
        });

        this.innerPlayer = videojs('video-player', {}, function() {

            let player = this;

            player.on("timeupdate", function() {

                if (time === parseInt(this.currentTime())) {
                    return false;
                }

                time = parseInt(this.currentTime());

                let duration = this.duration();

                let percentComplete = this.currentTime() / duration;

                let notification = _.find(notifications, (o) => {
                    return o.time === time;
                });

                if (notification && !self.state.notificationsBlocked) {

                    self.setState({
                        notifications: self.state.notifications.concat([notification]),
                        percentComplete
                    });
                } else {
                    self.setState({percentComplete});
                }

            });

            player.on('ended', () => {
                console.log("Video Ended..");
                self.setState({videoOver: true})
            });

            window.addEventListener('message', e => {

                if (e.data.playVideo) {
                    player.play();
                    $(player.controlBar.el_).show();
                } else if (e.data.pauseVideo) {
                    player.pause();
                    $(player.controlBar.el_).hide();
                } else if (e.data.addMessage) {
                    self.addNotification(e.data.message.text, "bot", true);
                    self.blockNotifications();
                }

            });
        });

        this.innerPlayer.markers({
            // onMarkerReached: function(marker) {
            //     marker.destination = 'chat';
            //     parent.postMessage(marker, "*");
            // },
            onMarkerClick: (marker) => {
                this.innerPlayer.play();
            },
            markerTip: {
                display: false,
                text: function(marker) {
                    return marker.text;
                }
            },
            markers: markers
        });

        var mark = 0;

        this.setState({innerPlayer: this.innerPlayer});

    }

    nextMark() {
        this.mark++;
        if (this.mark > (this.markers.length)) {
            this.mark = 0;
            this.innerPlayer.currentTime(0);
        } else {
            this.innerPlayer.markers.next();
        }
    }

    prevMark() {
        this.mark--;
        if (this.mark == 0) {
            this.innerPlayer.currentTime(0);
        } else {
            this.innerPlayer.markers.prev();
        }
    }

    skipTo(name) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].text === name) {
                console.log(this.markers[i]);
            }
        }
    }

    selectTopic(message) {

        this.props.toggleChatbox();

        this.context.handleSend(message);

    }

    render() {

        return (
            <div>
                <div className="hdvc-video">

                    <video controls poster id="video-player" className="video-js vjs-default-skin" preload="auto" autoPlay data-setup={'{ "inactivityTimeout": 0 }'}>
                        <source src="https://s3-us-west-1.amazonaws.com/sage-bots/tesla.mp4" type="video/mp4"/>
                        <p className="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that
                            <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                        </p>
                    </video>

                    <Notifications handleSend={this.context.handleSend} player={this.state.innerPlayer} toggleChatbox={this.props.toggleChatbox} notifications={this.state.notifications} chatboxVisible={this.state.chatboxVisible} videoOver={this.state.videoOver} addNotification={this.addNotification} percentComplete={this.state.percentComplete}/>

                </div>

                {this.state.videoOver && !this.state.chatboxVisible
                    ? (
                        <div className="hdvc-action-promo-wrap">
                            <div className="hdvc-action-promo">
                                <h2>Enjoyed watching the video?</h2>
                                <h5>Chat with our bot to learn more about the all-new Tesla S</h5>
                                <ul className="hdvc-topic-cards">
                                    <li onClick={() => this.selectTopic({payload: "goto /navigation", title: "Navigation"})}>
                                        <div>
                                            <img src="/svg/navigation.svg"/>
                                            <p>Navigation</p>
                                        </div>
                                    </li>
                                    <li onClick={() => this.selectTopic({payload: "goto /software", title: "Software"})}>
                                        <div>
                                            <img src="/svg/software.svg"/>
                                            <p>Software</p>
                                        </div>
                                    </li>
                                    <li onClick={() => this.selectTopic({payload: "goto /test-drive", title: "Test Drive"})}>
                                        <div>
                                            <img src="/svg/speed.svg"/>
                                            <p>Test Drive</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                    : null}
            </div>

        );
    }
}

export default Video;
