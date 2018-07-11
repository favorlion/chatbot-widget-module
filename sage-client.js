const request = require('request-promise');

module.exports = class SageClient {

    newMessage(userId, text, host, destinationUrl) {

        console.log(`${userId} sending to ${destinationUrl} ${text}`);

        return request({
            method: 'POST',
            uri: destinationUrl,
            headers: {
                "origin-host": host
            },
            form: {
                user_id: userId,
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

        if (data.media_type === 'image') {
            parsedData = {
                type: 'image',
                text: data.text, // present or absent
                image: data.media_url
            }
        } else if (data.link) {
            parsedData = {
                type: 'link',
                link: data.link.url,
                title: data.link.title
            }

        } else if (data.attachment && data.attachment.type === 'template' && data.attachment.payload && data.attachment.payload.template_type === 'generic') {
            // "generic template"
            const attachment = data.attachment;
            const text = JSON.stringify(data.attachment.payload, null, 2);
            parsedData = {
                type: 'fb:generic',
                payload: data.attachment.payload
            }
        } else if (data && data.attachment && data.attachment.type === 'template' && data.attachment.payload && data.attachment.payload.template_type === 'button') {
            // "buttons" template
            const atachment = data.attachment;
            parsedData = {
                type: 'fb:button',
                payload: data.attachment.payload
            }
        } else if (data && data.attachment && data.attachment.type === 'template' && data.attachment.payload && data.attachment.payload.template_type === 'quick_reply') {
            // "buttons" template
            const atachment = data.attachment;
            parsedData = {
                type: 'fb:button',
                payload: data.attachment.payload
            }


        } else if (data && data.attachment && data.attachment.type === "image") {

            parsedData = {
                type: 'image',
                quickReplies: data && data.quick_replies,
                url: data.attachment.payload.url
            }

        } else {
            parsedData = {
                type: 'text',
                quickReplies: data && data.quick_replies,
                text: data.text
            }
        }

        return parsedData;


    }
};
