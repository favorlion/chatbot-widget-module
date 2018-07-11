import React from 'react';
import './index.css';
import Carousel from '../Carousel';
import ButtonHolder from '../../../../components/ButtonHolder';

class Message extends React.Component {

    static propTypes = {
        message: React.PropTypes.object,
        onPostback: React.PropTypes.func
    }

    render() {

        var {message, onPostback} = this.props;

        let messageClass = message.source === "user"
            ? "hdvc-outgoing"
            : "hdvc-incoming";

        switch (message.type) {
            case 'text':
                return (
                    <li className={messageClass}>
                        {message.source === "service"
                            ? <img src="/images/thumb.png" height="96" width="96" className="hdvc-service-thumb"/>
                            : <img src="/images/user-avatar.png" height="96" width="96" className="hdvc-thumb hdvc-user-thumb"/>}
                        <div className={'hdvc-wrap'}>
                            <p>{message.text}</p>
                        </div>
                    </li>
                );

            case 'carousel':
            case 'fb:generic':
                return (
                    <li>
                        <div className={'Message-bubble Message-carousel'}>
                            <Carousel onPostback={onPostback} message={message}/>
                        </div>
                    </li>
                );

                //   return <div className={'Message Message--' + message.source}>
                //   <div className={'Message-bubble Message-bubble--wide Message-bubble--' + message.source}>
                //     <Carousel onPostback={onPostback} message={message}/>
                //   </div>
                // </div>;

                // case 'fb:buttons':
                //     return <Buttons onPostback={onPostback} message={message}/>

            case 'image':
                return (
                    <li>
                        {message.source === "service"
                            ? <img src="./images/thumb.png" height="96" width="96" className="hdvc-service-thumb"/>
                            : null}
                        <div className="hdvc-wrap hdvc-full-image">
                            <img src={message.url} height="" width="" alt="Tesla Informaiton"/>
                        </div>
                    </li>
                );

            case 'video':
                return (
                    <li className={'Message Message--' + message.source + ' Message--video'}>
                        {/*<iframe className="Message-videoFrame Message--video-prev" src={message.video} frameborder="0" allowFullScreen={true}/> /!**/}
          {/*<img onClick={() => this.context.onVideoClick(message.video)} className='Message--video-prev' src={message.image} role="presentation"/>*/}
          */}
                        {/*<iframe width="420" height="315" src="https://www.youtube.com/embed/A6XUVjK9W4o" frameborder="0" allowfullscreen></iframe>*/}
                        <iframe width="620" height="515" src="https://www.youtube.com/embed/A6XUVjK9W4o" frameborder="0" allowfullscreen></iframe>
                    </li>
                );

            case 'buttons':
                return (
                    <li className={'Message Message--' + message.source}>

                        <ButtonHolder message={message}/>
                    </li>
                );

            case 'info-pic':
                return (
                    <li className={'Message-info-pic'}>

                        <img src={message.img} width="300px" role="presentation"/>

                    </li>
                );

                // case 'table':
                //   return <div className={'Message Message--' + message.source}>
                //     <TableHolder card={message} />
                //   </div>

            default:
                return <span>[{message.type}]</span>;
        }
    }
};

Message.contextTypes = {
    onVideoClick: React.PropTypes.func
};

export default Message;
