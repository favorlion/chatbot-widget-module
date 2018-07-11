import React from 'react';
import './index.css';

class ButtonHolder extends React.Component {
    static contextTypes = {
        handleSend: React.PropTypes.func,
        trackCTA: React.PropTypes.func
    };

    static propTypes = {
        message: React.PropTypes.object
    }

  constructor(props) {
    super(props);
    this.openElement = this.openElement.bind(this);
    this.state = {
      index: 0
    };
  }
  render() {
      // return <p>nooofsdjaofj</p>
    const buttons = this.props.message.buttonContainer.buttonArray;

    console.log(buttons);

    const buttonElements = buttons.map((button, idx) => {

      const btnImg = {
        backgroundImage: 'url(' + button.buttonImage + ')'
      };

      return <div className="Button">

          <div className="Button-img" key={idx} style={btnImg} onClick={this.openElement.bind(buttonElements, idx)}></div>

        <span>{button.buttonText}</span>
      </div>;
    });

    return <div>
      {buttonElements}
    </div>;

    // return <div>
    //   <p>fsdaga</p>
    // </div>;
  }

    openElement(cardIndex, buttonIndex) {

        const button = this.props.message.buttonContainer.buttonArray[cardIndex];

        if (button.buttonType === "web_url") {
            this.context.trackCTA(button.url, button.buttonText);
            setTimeout(()=>{
                window.open(button.url);
            }, 2000);
        } else {
            this.context.handleSend({title: button.buttonText, payload: button.payload});
        }
    }
}

export default ButtonHolder;
