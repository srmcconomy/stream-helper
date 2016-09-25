// @flow

import io from 'socket.io-client';

import dispatcher from './dispatcher';
import type EventEmitter from 'events';

const socket: EventEmitter = io();
dispatcher.register(payload => {
  socket.emit('dispatch', payload);
})
socket.on('dispatch', dispatcher.dispatch);
