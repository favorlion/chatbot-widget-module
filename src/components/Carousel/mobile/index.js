import React from 'react';
import classNames from 'classnames';
import '../index.css';
import '../ProductCarousel.css';
import './index.css';
import TableHolder from '../../TableHolder';
import ReactSwipe from 'react-swipe';
import _ from 'lodash'

import {isObject} from 'lodash';

class CarouselMobile extends React.Component {

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

        let cardsVisible = 1;

        const cards = this.props.message.cards;

        let visibleCards = _.chunk(cards, 1);

        const cardElements = visibleCards.map((cardGroup, cardGroupIndex) => {

            cardGroup = cardGroup.map((card, cardIndex) => {

                cardIndex = (cardGroupIndex * cardsVisible) + cardIndex;

                let cls = classNames('Carousel-card-container-mobile', {
                    'active': cardGroupIndex === this.state.index,
                    'right': cardGroupIndex === this.state.index + 1,
                    'left': cardGroupIndex === this.state.index - 1
                });

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

                if (card.cssClass) {
                    cls += ' ' + card.cssClass;
                }

                return (
                    <div className={cls} key={cardIndex}>
                        <div className="Carousel-card-mobile" ref="cardWidth" key={card.key} onClick={this.openElement.bind(this, cardIndex, 0)}>
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

            });

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
            <div className="ProductCarousel ProductCarousel-Mobile">
                <div className="ProductCarousel-arrow-mobile ProductCarousel-arrowLeft" onClick={this.prev}>
                    <div className="ProductCarousel-arrow-image ProductCarousel-arrowLeft-image"  />
                </div>
                <ReactSwipe className="carousel" key={cardElements.length} swipeOptions={swipeConfig} ref="reactSwipe" style={style}>
                    {cardElements}
                </ReactSwipe>
                <div className="ProductCarousel-arrow-mobile ProductCarousel-arrowRight" onClick={this.next}>
                    <div className="ProductCarousel-arrow-image ProductCarousel-arrowRight-image"  />
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
        const button = this.props.message.cards[cardIndex].buttons[buttonIndex];
        if (button.type === "web_url") {
            this.context.trackCTA(button.url, button.title);
            window.open(button.url);
        } else {
            this.context.handleSend({title: button.title, payload: button.payload});
        }
    }
}

module.exports = CarouselMobile;
