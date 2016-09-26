// @flow

import express from 'express';
const app = express();
import http from 'http';
const server = http.Server(app);
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';
import type EventEmitter from 'events';
import socketio from 'socket.io'
const io: EventEmitter = socketio(server);
import dispatcher from './dispatcher';
import store from './store';
import { List } from 'immutable';
import { TransformRecord, DataRecord, StreamRecord } from './Records';
import type { Payload } from './dispatcher';
import './SRL';
import fs from 'fs';

server.listen(3001);

app.use(express.static('build/static'))

app.get('/', (req, res) => {
  const build = ReactDOMServer.renderToString(<App />);
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" href="./src/favicon.ico">
      <link rel="stylesheet" type="text/css" href="css/main.1ef16628.css">
      <title>React App</title>
    </head>
    <body>
      <div id="root">${build}</div>
    </body>
    <script src="js/main.941b15d6.js"></script>
  </html>`
  res.send(html);
});

app.get('/save', (req, res) => {
  const data = store.get();
  fs.writeFile('./data.json', JSON.stringify(data.toJS()), function(err) {
    if(err) {
        return console.log(err);
    }
    res.send("SAVED!");
  });
});

app.get('/load', (req, res) => {
  const data = store.get();
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    store.set(DataRecord.fromJS(JSON.parse(data)));
    res.send("LOADED!");
  });
});

io.on('connection', function(socket: EventEmitter) {
  socket.emit('set', store.get());
  const token = dispatcher.register(payload => {
    console.log(payload);
    socket.emit('dispatch', payload);
  });
  socket.on('dispatch', (payload) => {
    switch(payload.type) {
      case 'set-transform':
        payload.transform = new TransformRecord(payload.transform);
        break;

      case 'set-stream': case 'set-and-select-stream':
        payload.stream = new StreamRecord(payload.stream);
        break;

      case 'set-race':
        payload.entrants = List(payload.entrants);
        break;
    }
    dispatcher.broadcast(payload, token);
  });
  socket.on('disconnect', () => dispatcher.unregister(token));
});
