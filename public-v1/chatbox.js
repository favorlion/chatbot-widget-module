/* global $, io */

(function() {
    $(document).ready(init);
    var conversationId = Date.now();

    var $container;
    var $widget;
    var $textInput;
    var $quickRepliesContainer;
    var socket;

    function init() {
        console.log('chatbox initialized');

        $widget = $('<div>').addClass('widget').appendTo('body');
        $('<div>').addClass('widget-header').html('Conversation').appendTo($widget);


        $container = $('<div>')
            .addClass('chat-container')
            .appendTo($widget);

        $quickRepliesContainer = $('<div>').addClass('quick-replies-container').appendTo($widget);

        $textInput = $('<textarea>').addClass('input-box').appendTo($widget);
        $textInput.on('keydown', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                var message = $textInput.val();
                console.log('message is', message)
                $textInput.val('');
                onSubmitMessage(message);
            }
        });

        socket = io();

        socket.on('message', function(message) {
            console.log('RECEIVED', message);

            switch (message.type) {
                case 'text':
                    onMessageReceived(message.text);

                    if (message.quickReplies) {
                        showQuickReplies(message.quickReplies);
                    }

                    break;

                case 'image':
                    onImageReceived(message.image);
                    break

                case 'link':
                    onMessageReceived('<a target="_blank" href="' + message.link + '">' + message.title + '</a>');
                    break;

                case 'fb:button':
                    if (message.payload.text) {
                        onMessageReceived(message.payload.text);
                    }
                    if (message.title) {
                        onMessageReceived(message.payload.title);
                    }
                    onButtonsReceived(message.payload.buttons);
                    break;

                case 'fb:generic':
                    onCarouselReceived(message.payload.elements);
                    break;

                default:
                    console.log(message.type, message);
                    onMessageReceived('I am not sure what to tell you');
            }
        });

        socket.emit('start', {
            conversationId: conversationId
        });

    }

    function renderChatItem(text, senderIsUser) {
        var $el = $('<div>').addClass('chat-item chat-item-plain');
        $el.addClass(senderIsUser ? 'chat-item-user' : 'chat-item-service');
        $el.html(text);
        return $('<div class="chat-line">').append($el);
    }

    function renderCarouselChatItem(cards) {
        var $carouselContainer = $('<div>').addClass('chat-line').data('index', 0);
        for (var i = 0; i < cards.length; i++) {
            var $card = renderCardChatItem(cards[i]);
            $card.css('display', 'none');

            $carouselContainer.append($card);

        }
        var $cards = $carouselContainer.find('.carousel-card');
        $cards.eq(0).show();

        var $arrowsContainer = $('<div class="carousel-buttons"><div class="circle-button" data-direction="left">&lsaquo;</div><div class="circle-button" data-direction="right">&rsaquo;</div></div>');
        $carouselContainer.append($arrowsContainer);

        $arrowsContainer.on('click', '.circle-button', function() {
            console.log('clicked');
            var $button = $(this);
            var direction = $button.data('direction');
            var index = $carouselContainer.data('index');

            if (direction === 'left') {
                index = (index + 1) % $cards.size();
            } else {
                if (index === 0) {
                    index = $cards.size() - 1;
                } else {
                    index--;
                }
            }

            $carouselContainer.data('index', index);
            $cards.hide();
            $cards.eq(index).show();
        });

        return $carouselContainer;
    }

    function renderCardChatItem(card) {
        var $el = $('<div>').addClass('carousel-card'); // chat-item-plain chat-item-buttons chat-item-service');

        $el.append('<div class="card-title">' + card.title + '</div>');
        if (card.subtitle) {
            $el.append('<div class="card-subtitle">' + card.subtitle + '</div>');
        }

        console.log('image_url', card.image_url, card);
        if (card.image_url) {
            $el.append('<div style="height: 80px; background-image: url(' + card.image_url + '); background-size: cover; background-position: center center"></div>');
        }

        if (card.buttons) {
            var $buttons = renderButtonsChatItem(card.buttons)
            $el.append($buttons);
            // }
        }

        return $el;
    }

    function renderButtonsChatItem(buttons) {
        var $el = $('<div>').addClass('chat-item chat-item-plain chat-item-buttons chat-item-service');
        var alreadySelected = false;
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var $button = $('<div>').addClass('chat-item-button')
                .text(button.title)
                .data('value', button.payload)
                .data('url', button.url)
                .data('type', button.type);

            $button.on('click', function() {
                var $this = $(this);

                console.log('button click', $this);
                if (alreadySelected) {
                    return;
                }
                var type = $this.data('type');

                if (type === 'postback') {
                    alreadySelected = true; // for URLs maybe we don't mark it selected because we can re-use
                    // Send the message back to reply.ai
                    var postbackValue = $this.data('value');
                    $this.addClass('chat-item-button-selected');
                    sendMessageText(postbackValue);
                } else if (type === 'web_url') {
                    var url = $this.data('url');
                    window.open(url, '_blank');
                } else {
                    console.log('did not understand button click', $this);
                }

            });

            $el.append($button);
        }

        return $('<div class="chat-line">').append($el);
    }

    function renderImageChatItem(url) {
        var $el = $('<div>').addClass('chat-item-image');
        var $img = $('<img>').addClass('chat-item-image-img').attr('src', url);
        $el.append($img);
        return $('<div class="chat-line">').append($el);
    }


    function showQuickReplies(quickReplies) {
        $quickRepliesContainer.empty();
        for (var i = 0; i < quickReplies.length; i++) {
            // Assume that "content_type" is "text" because that's the only one that's
            // supported right now. "location" is currently unsupported.

            var quickReplyData = quickReplies[i];
            var $quickReply = $('<div>').addClass('quick-reply');
            $quickReply.data('payload', quickReplyData.payload);
            $quickReply.text(quickReplyData.title);
            $quickRepliesContainer.append($quickReply);

            $quickReply.on('click', function() {
                var payload = $(this).data('payload');
                onSubmitMessage(payload);
                removeQuickReplies();
            });
        }
    }

    function removeQuickReplies() {
        $quickRepliesContainer.empty();
    }

    function onSubmitMessage(text) {
        onMessageSend(text);

        sendMessageText(text);
    }

    function sendMessageText(text) {
        socket.emit('message', {
            type: 'text',
            text: text
        });
    }


    function onMessageReceived(text) {
        var $el = renderChatItem(text, false);
        $el.appendTo($container);
        scrollDown();
    }

    function onImageReceived(url) {
        var $el = renderImageChatItem(url);
        $el.appendTo($container);
        scrollDown();
    }

    function onCarouselReceived(cards) {
        var $el = renderCarouselChatItem(cards);
        $el.appendTo($container);
        scrollDown();
    }

    function onButtonsReceived(buttons) {
        var $el = renderButtonsChatItem(buttons);
        $el.appendTo($container);
        scrollDown();
    }

    function scrollDown() {
        $container.scrollTop(10000);
    }

    function onMessageSend(text) {
        renderChatItem(text, true).appendTo($container);
        scrollDown();
    }

}());
