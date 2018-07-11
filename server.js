require('dotenv').load({
    silent: true
});

const express = require('express');

const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const SageClient = require('./sage-client');
const ReplyAIClient = require('./reply-ai-client');

let sageClient = new SageClient();
let replyAIClient = new ReplyAIClient();


const io = require('socket.io')(server, {
    origins: '*:*'
});

const config = require("./config");


app.use('/', express.static('build'));

app.use('/video', express.static('build'));

app.use('/frame1', express.static('public-v1'));
// app.use(express.static('public-v1'));

// app.get('/', (req, res, next) => {
//     res.send();
// });

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

const conversations = new Map;

io.on('connection', function(socket) {
    console.log('connection received');

    var conversationId = Date.now() + '-' + Math.random().toString().split('.')[1];
    conversations.set(conversationId, socket);

    socket.on('message', message => {
        // console.log('a message received from', conversationId);
        //console.log('Message', message);



        let backend, client;

        if (message.channelID) {
            backend = "replyai";
        } else {
            backend = "sage";
        }

        console.log('backend: ', backend);

        if (message.type === "text") {

            if (backend === "sage") {

                let destinationUrl = config["backends"]["sage"][message.bot];

                if (!destinationUrl) {
                    console.error("Unknown bot parameter.");
                } else {
                    sageClient.newMessage(conversationId, message.text, message.host, destinationUrl);
                }

            } else if (backend === "replyai") {
                replyAIClient.newMessage(conversationId, message.text, message.channelID);

            } else {
                console.error("Backend not supported");
            }
        } else {
            console.log('unrecognized ');
        }
    });
});

app.post('/response', (req, res, next) => {
    res.status(200).send();

    console.log('response :', req.body);

    let conversationId;
    let client;

    let contact_urn = req.body.contact_urn;

    let isReplyAI = contact_urn ? true : false;

    if (isReplyAI) {
        conversationId = contact_urn;
        client = replyAIClient;
    } else {
        conversationId = req.body.user;
        client = sageClient;
    }

    const conversationSocket = conversations.get(conversationId);

    if (!conversationSocket) {
        return console.error('reply.ai had a message for a nonexistent conversation', conversationId);
    }

    let data = req.body;

    data = client.parseData(data);
    console.log('data EMITTED :', data);

    conversationSocket.emit('message', data);

});

var port = process.env.PORT || 5000;

server.listen(port, function() {
    console.log("Server running on port: " + port);
});
