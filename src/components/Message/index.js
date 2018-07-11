import React from 'react';
import './index.css';
import Carousel from '../Carousel';
import ButtonHolder from '../ButtonHolder';

class Message extends React.Component {
  render() {
    var {message, onPostback} = this.props;

        switch (message.type) {
            case 'text':
                    return <div className={'Message Message--' + message.source}>
                        <div className={'Message-bubble Message-bubble--' + message.source}>
                            {message.text}
                        </div>
                    </div> ;

            case 'textAlea':
                var indexAlea = Math.floor((Math.random()* message.data.length));

                return <div className={'Message Message--' + message.source}>
                    <div className={'Message-bubble Message-bubble--' + message.source}>
                        {message.data[indexAlea].text}
                    </div>
                </div>;

            case 'linkRedirect':
                setTimeout(()=>{
                    window.open(message.url);
                }, 2000);

            case 'carousel':
            case 'fb:generic':
                return <div>
                    <div className={'Message-bubble Message-carousel'}>
                        <Carousel onPostback={onPostback} message={message}/>
                    </div>
                </div>;



            //   return <div className={'Message Message--' + message.source}>
            //   <div className={'Message-bubble Message-bubble--wide Message-bubble--' + message.source}>
            //     <Carousel onPostback={onPostback} message={message}/>
            //   </div>
            // </div>;

            // case 'fb:buttons':
            //     return <Buttons onPostback={onPostback} message={message}/>

            case 'image':
                // return <span>[image]</span>;
                return (

                    <div className="hdvc-wrap hdvc-full-image">
                        <img src={message.url} height="" width="" alt="Tesla Informaiton"/>
                    </div>

                );

            case 'video':
                return <div className={'Message Message--' + message.source + ' Message--video' }>
                    <iframe className="Message-videoFrame Message--video-prev" src={message.video} allowFullScreen={true} width="100%" height="100%"/>
                    {/*
                     <img onClick={() => this.context.onVideoClick(message.video)} className='Message--video-prev' src={message.image} role="presentation"/>
                     */}

                </div>;

            case 'buttons':
                return <div className={'Message Message--' + message.source}>
                    <ButtonHolder  message={message}/>
                </div>;

            case 'info-pic':
                return <div className={'Message-info-pic'}>
                    <img src={message.img} width="300px" role="presentation" />
                </div>

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
