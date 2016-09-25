// @flow

import React, { Component } from 'react';
import Toolbar from './Toolbar';
import StreamArea from './StreamArea';
import Streams from './Streams';
import Overlay from './Overlay';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <StreamArea />
        <Streams />
        <Overlay />
      </div>
    );
  }
}
