const request = require('request-promise');
const {
    get
} = require('lodash');
const refPayloads = {
    recipes: require('./payloads/recipes.json')
};

module.exports = class ReplyAPIClient {
    newMessage(conversationId, text, channelID) {
        console.log(conversationId, 'sending to Reply.ai:', text);
        return request({
            method: 'POST',
            uri: 'https://www.reply.ai/handlers/external/received/' + channelID + '/',
            form: {
                from: conversationId,
                sender: conversationId,
                text
            }
        }).catch(response => {
            console.log('---');
            console.log(response);
            if (response.statusCode === 301) {
                return response;
            } else {
                throw response;
            }
        });
    }

    parseData(data) {

        let parsedData;

        const replyAiMessage = data;

        let metadata;
        if (replyAiMessage.metadata) {
            metadata = JSON.parse(replyAiMessage.metadata);
        }

        if (data.media_type === 'image') {
            parsedData = {
                type: 'image',
                text: data.text, // present or absent
                image: data.media_url
            }
        } else if (metadata && metadata.link) {
            if (metadata.link) {
                console.log('metadata', metadata);
                parsedData = {
                    type: 'link',
                    link: metadata.link.url,
                    title: metadata.link.title
                }
            }
        } else if (metadata && metadata.attachment && metadata.attachment.type === 'template' && metadata.attachment.payload && metadata.attachment.payload.template_type === 'generic') {
            // "generic template"
            const attachment = metadata.attachment;
            const text = JSON.stringify(metadata.attachment.payload, null, 2);
            parsedData = {
                type: 'fb:generic',
                payload: metadata.attachment.payload
            }
        } else if (metadata && metadata.attachment && metadata.attachment.type === 'template' && metadata.attachment.payload && metadata.attachment.payload.template_type === 'button') {
            // "buttons" template
            const atachment = metadata.attachment;
            parsedData = {
                type: 'fb:button',
                payload: metadata.attachment.payload
            }
        } else if (metadata && metadata.attachment && metadata.attachment.type === 'template' && metadata.attachment.payload && metadata.attachment.payload.template_type === 'quick_reply') {
            // "buttons" template
            const atachment = metadata.attachment;
            parsedData = {
                type: 'fb:button',
                payload: metadata.attachment.payload
            }
        } else if (data.text && data.text.startsWith('DATA=')) {
            var payload = data.text.slice(5);
            try {
                payload = JSON.parse(payload);
            } catch (err) {
                console.error('Problem parsing DATA payload');
                console.error(err);
                return;
            }
            parsedData = payload;
        } else if (data.text && data.text.startsWith('REF=')) {
            const ref = data.text.slice(4);

            const referencedPayload = get(refPayloads, ref);

            if (referencedPayload) {
                console.log('EMITTING REF', ref);
                parsedData = referencedPayload;
            } else {
                console.error('FAILED TO GET REF', ref);
            }

        } else {
            parsedData = {
                type: 'text',
                quickReplies: metadata && metadata.quick_replies,
                text: data.text
            }
        }

        return parsedData;
    }
};
