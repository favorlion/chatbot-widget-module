import React from 'react';

function QuickReplyContainer({replies, onSelect}) {
    var quickReplyElements = replies.map(function(quickReply, idx) {

        return (
            <button className="de-btn" key={idx} data-payload={quickReply.payload} data-title={quickReply.title} onClick={e => onSelect({"payload": e.target.getAttribute('data-payload'), "title": e.target.getAttribute('data-title')})}>
                {quickReply.title}
            </button>
        );
    });

    return (
        <div className="hdvc-qa hdvc-qa-type-rolodex">
            <div className="hdvc-qa-btn-group hdvc-qa-type-list">
                {quickReplyElements}
            </div>
        </div>
    );
}

export default QuickReplyContainer;
