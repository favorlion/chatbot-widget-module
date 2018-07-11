const test = require('tape');
const groupMessages = require('../src/groupMessages');

test(t => {

    const input = [
        {type: "text", source: "service", text: "hello"},
        {type: "text", source: "service", text: "are you tehre"},
        {type: "text", source: "user", text: "ya"},
    ];

    const output = groupMessages(input);
    
    t.equals(output.length, 2);
    
    t.equals(output[0].messages.length, 2);
    t.equals(output[1].messages.length, 1);

    t.end();
});

test(t => {
    
    t.throws(() => {
        const output = groupMessages();        
    })
    
    t.end();
});
