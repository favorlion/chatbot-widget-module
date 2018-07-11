# Chat Interface

This Chat Interface is build with React and uses WebSockets.

## Overview

The project consists of two parts:

- The front-end interface

  - `src` directory for source code and stylesheets
  - `public` for themes and images

- A small back-end server (node.js) that hosts WebSockets and connects to a chat bot (Reply.ai)

  - `server.js`
  - `reply-ai-client.js`

## Structure of the front-end

The top-level component is `src/App.js` and the app is initialized in `src/index.js`.

The themes and bot triggers (which start a specific Reply.ai flow) are specified in `src/index.js` and can the bot can be selected with a query parameter: `?bot=ups` or `?bot=recipe` for example.

The trigger word is configured on Reply.ai, and it's sent behind the scenes when the page is initialized. For instance,

- For the UPS bot, the app sends `start_ups`
- For the Recipe bot, the app sends `start_recipe`

## Types of rich messages

Several types of rich message types are supported

- Quick Replies avec/sans url
- Image
- Video
- Carousel cards
- Image buttons

The JSON for these custom messages can be embedded in a Reply.ai plain text message by prefixing with `DATA=`. For example, send the following plain text message from Reply.ai to show an embedded video:

```
Quick Replies : DATA={"quickReplies": [{"type": "postback","title": "string","payload": "string"},{"type": "url","title": "string","payload": "string","url":"string"}]}
Image : DATA={"type": "image", "url":"URL de l'image"}
Video : DATA={"type": "video", "video": "https://www.youtube.com/embed/cMx7JrZ5FW0"}
Image buttons : DATA={"type": "buttons","buttonContainer": {"buttonArray":[{"buttonType":"postback","buttonImage":"url_img","buttonText": "string","payload":"string"},{"buttonType":"web_url","buttonImage":"url_img","payload":"string","url":"string"}]}}
```

## Run

First install the dependencies:

```
npm install
```

`npm` scripts available:

- Run the React development server (front-end only): `npm run rs start`
- Run the back-end server (it will also serve the built front-end): `npm start`
- Build the front-end (to run the back-end server in development): `npm run rs build`
- Run tests: `npm test`

The React development server and the build process are run by the [`react-scripts`](https://github.com/facebookincubator/create-react-app) tool.

## Setup Sage Production Webhook

```
export SAGE_WEBHOOK_URL=http://104.236.40.22:5000/api/web/receive
```

## Deployment

The `npm postinstall` script will build the front-end automatically (it calls `npm run rs build`)

To deploy on Heroku, just push the master branch. When pushing to Heroku, `npm install` and `npm postinstall` will get called automatically.
