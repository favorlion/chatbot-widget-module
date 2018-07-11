function groupMessages(messages) {
    if (messages.length <= 0 ) {
        return [];
    }
    var messageGroups = [];

    var currentGroup = null
    
    // var currentGroup = {"source" : messages[0].source, "messages": [messages[0]]};
    // messageGroups.push(currentGroup);
    
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        var messageType = getTypeFromMessage(message);
        var messageSource = message.source;
        
        if (!currentGroup || messageType !== currentGroup.type || messageSource !== currentGroup.source) {
            currentGroup = {type: messageType, source: messageSource, messages: [message]}
            messageGroups.push(currentGroup);
            continue;
        }

        currentGroup.messages.push(messages[i]);

    }
    
    return messageGroups;
}

function getTypeFromMessage(message) {
    if (message.type === 'carousel' || message.type === 'fb:generic') {
        return 'interactive';
    }
    return 'bubble';
}

module.exports = groupMessages;

