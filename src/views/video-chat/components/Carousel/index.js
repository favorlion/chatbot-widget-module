import React from 'react';
import classNames from 'classnames';
import './index.css';
import './ProductCarousel.css';
import TableHolder from '../../../../components/TableHolder';
import ReactSwipe from 'react-swipe';
import _ from 'lodash'
import MobileCarousel from './mobile';

import {isObject} from 'lodash';

class Carousel extends React.Component {

    static contextTypes = {
        handleSend: React.PropTypes.func
    };

    static propTypes = {
        message: React.PropTypes.object
    }

    constructor(props) {
        super(props);

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);

        this.state = {
            index: 0
        };
    }

    render() {

        if (window.innerWidth < 1048) {
            return <MobileCarousel {...this.props}/>;
        }

        const cards = this.props.message.payload.elements;

        const cardsVisible = 3;

        const visibleCards = _.chunk(cards, cardsVisible);

        const cardElements = visibleCards.map((cardGroup, cardGroupIndex) => {

            cardGroup = cardGroup.map((card, cardIndex) => {

                cardIndex = (cardGroupIndex * cardsVisible) + cardIndex;

                const cls = classNames('Carousel-card-container', {
                    'active': cardGroupIndex === this.state.index
                });

                const imageStyle = {
                    backgroundImage: `url(${card.image_url})`
                };

                const cardButtonElements = card.buttons.map((button, buttonIndex) => {
                    return <div className="Carousel-card-button" key={buttonIndex} onClick={this.openElement.bind(this, cardIndex, buttonIndex)}>{button.title}</div>;
                });

                const table = isObject(card.table)
                    ? <TableHolder table={card.table}/>
                    : null;

                return (
                    <div className={cls} key={cardIndex}>
                        <div className="Carousel-card" ref="cardWidth" key={card.key}>
                            <div className="Carousel-card-image" style={imageStyle}/>

                            <div className="Carousel-card-info-container">
                                <div className="Carousel-card-title">{card.title}</div>
                                <div className="Carousel-card-subtitle">{card.subtitle
                                        ? card.subtitle
                                        : null}</div>
                                {table}
                            </div>

                        </div>
                        <div className="Carousel-card-button-container">
                            {cardButtonElements}
                        </div>
                    </div>
                );

            })

            return (
                <div key={cardGroupIndex}>
                    {cardGroup}
                </div>

            )

        });

        var swipeConfig = {
            callback: (index, elem) => {
                this.setState({index})
            }
        };

        var style = {
            wrapper: {
                // height: "420px",
                overflow: 'hidden',
                position: 'relative'
            },
            container: {
                overflow: 'hidden',
                visibility: 'hidden',
                position: 'relative'
            },
            child: {
                float: 'left',
                width: '100%',
                position: 'relative',
                transitionProperty: 'transform'
            }
        }

        return (
            <div className="ProductCarousel">
                <div className="ProductCarousel-arrow ProductCarousel-arrowLeft" onClick={this.prev}>
                    <div className="ProductCarousel-arrow-image ProductCarousel-arrowLeft-image" />
                </div>
                <ReactSwipe className="carousel" key={cardElements.length} swipeOptions={swipeConfig} ref="reactSwipe" style={style}>
                    {cardElements}
                </ReactSwipe>
                <div className="ProductCarousel-arrow ProductCarousel-arrowRight" onClick={this.next}>
                    <div className="ProductCarousel-arrow-image ProductCarousel-arrowRight-image" />
                </div>
            </div>
        )

    }

    next() {
        this.refs.reactSwipe.next();
    }

    prev() {
        this.refs.reactSwipe.prev();
    }

    openElement(cardIndex, buttonIndex) {

        const button = this.props.message.payload.elements[cardIndex].buttons[buttonIndex];
        console.log('What got clicked is ', cardIndex, buttonIndex);
        if (button.type === "web_url") {
            window.open(button.url);
        } else {
            console.log('Card button clicked:', button);
            this.context.handleSend({title: button.title, payload: button.payload});
        }

    }
}

export default Carousel;
