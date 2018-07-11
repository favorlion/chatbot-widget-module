import React from 'react'
import App from '../containers/App'
import {Route, IndexRoute} from 'react-router'
import VideoChat from '../views/video-chat/index.js';
import Chat from '../views/chat';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={Chat}/>
        <Route path="/video" component={VideoChat}/>
    </Route>
);
