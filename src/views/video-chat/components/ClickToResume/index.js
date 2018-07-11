/*global $*/

import React from 'react';

import './index.css';

class ClickToResume extends React.Component {
    constructor(props) {

        super(props)

        let randomIdx = Math.floor(Math.random() * 3) + 1;

        this.state = {
            imageSrc: `/images/tesla-screenshots/tesla-screen-${randomIdx}.png`
        }

    }
    
    render() {
        return (
            <div className="click-to-resume fadeInAnimation" onClick={this.props.closeChatbox}>
                <img ref="ResumeVideoImage" src={this.state.imageSrc}/>
                <div><h4>Click to <br /> Resume Video</h4></div>
            </div>
        );
    }
}

export default ClickToResume;
