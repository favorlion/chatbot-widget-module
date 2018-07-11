import React from 'react';
import './index.css';



function QuickReplyContainer({replies, onSelect}) {
    var quickReplyElements = replies.map(function(quickReply, idx) {
        let cls = "quick-reply-button";

        if (quickReply.cssClass) {
            cls += ' ' + quickReply.cssClass;
        }

        if (quickReply.type == "web_url"){
            cls += ' web-url-button';
            return (
                <div className={cls} key={idx} data-payload={quickReply.payload} data-title={quickReply.title} onClick={e => onSelect({"url": quickReply.url, "title": quickReply.title})}>
                    <a href={quickReply.url} target="_blank">{quickReply.title}</a>
                </div>
            );
        }

        return (
            <div className={cls} key={idx} data-payload={quickReply.payload} data-title={quickReply.title} onClick={e => onSelect({"payload": e.target.getAttribute('data-payload'), "title": e.target.getAttribute('data-title')})}>
                {quickReply.title}
            </div>
        );
    });

    return (
        <div className="quick-reply-container">
            {quickReplyElements}
        </div>
    );
}


export default QuickReplyContainer;
