import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import queryString from 'query-string';
import messages from '../payloads/recipe-conversation.json';
import {assign} from 'lodash';
import {Router, browserHistory} from 'react-router';
import routes from './routes';


ReactDOM.render(
      <Router history={browserHistory}>
        {routes}
      </Router>
    , document.getElementById('root'));
