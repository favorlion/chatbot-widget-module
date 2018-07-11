import React from 'react';
import classNames from 'classnames';
import './index.css';
import './ProductCarousel.css';
import TableHolder from '../TableHolder';
import ReactSwipe from 'react-swipe';
import _ from 'lodash'
import MobileCarousel from './mobile';

import {isObject} from 'lodash';

class Carousel extends React.Component {

    static contextTypes = {
        handleSend: React.PropTypes.func,
        trackCTA: React.PropTypes.func
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

        const message = this.props.message;

        if (!message.forceGridView && window.innerWidth < 750) {
            return <MobileCarousel {...this.props}/>;
        }

        const cards = message.cards;
        const groupSize = message.groupSize || 4;
        const visibleCards = _.chunk(cards, groupSize);

        const cardElements = visibleCards.map((cardGroup, cardGroupIndex) => {

            cardGroup = cardGroup.map((card, cardIndex) => {

                cardIndex = (cardGroupIndex * groupSize) + cardIndex;

                const imageStyle = {
                    backgroundImage: `url(${card.image})`
                };

                const cardButtonElements = card.buttons.map((button, buttonIndex) => {
                    let cls = 'Carousel-card-button';
                    if (button.cssClass) {
                        cls += ' ' + button.cssClass;
                    }
                    return <div className={cls} key={buttonIndex}>{button.title}</div>;
                });

                const table = isObject(card.table)
                    ? <TableHolder table={card.table}/>
                    : null;

                var cssTitleCard = card.title  ? "Carousel-card-title":"";
                var cssSubtitleCard = card.subtitle  ? "Carousel-card-subtitle":"";

                let cls = 'Carousel-card-container';
                if (card.cssClass) {
                    cls += ' ' + card.cssClass;
                }

                return (
                    <div className={cls} key={cardIndex}>
                        <div className="Carousel-card" ref="cardWidth" key={card.key} onClick={this.openElement.bind(this, cardIndex, 0)}>
                            <div className="Carousel-card-image" style={imageStyle}/>

                            <div className="Carousel-card-info-container">

                                <div className={cssTitleCard}>{card.title}</div>
                                <div className={cssSubtitleCard}>{card.subtitle
                                        ? card.subtitle
                                        : null}</div>
                                {table}
                                <div className="Carousel-card-button-container">
                                    {cardButtonElements}
                                </div>
                            </div>
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

        return (
            <div className="ProductCarousel ProductCarousel-Grid">
                {cardElements}
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
        const button = this.props.message.cards[cardIndex].buttons[buttonIndex];
        if (button.type === "web_url") {
            this.context.trackCTA(button.url, button.title);
            window.open(button.url);
        } else {
            this.context.handleSend({title: button.title, payload: button.payload});
        }
    }
}

export default Carousel;
