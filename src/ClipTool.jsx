// @flow

import React, { Component } from 'react';
import store from './store';
import { StreamRecord } from './Records';
import dispatcher from './dispatcher';
import './ClipTool.css';

const clipUrlRegex = /https:\/\/clips\.twitch\.tv\/([a-zA-Z][a-zA-Z0-9_]*)\/([a-zA-Z]+)/;

type State = {
  url: string,
}

export default class ClipTool extends Component {

  state: State;

  constructor() {
    super();
    this.state = { url: '' };
  }

  _onChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ url: event.target.value });
    }
  }

  _onKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this._onClick();
    }
  }

  _onClick = () => {
    const [, name, clip]: [string, string] = clipUrlRegex.exec(this.state.url);
    this.setState({ url: '' });
    dispatcher.dispatch({
      type: 'set-and-select-stream',
      name,
      stream: new StreamRecord({
        name,
        clip,
        type: 'clip',
        position: 'loading'
      }),
    });
  }

  render() {
    return (
      <div className="ClipTool">
        <div className="title">
          Load a clip:
        </div>
        <input
          placeholder="clip URL"
          value={this.state.url}
          onChange={this._onChange}
          onKeyPress={this._onKeyPress}
        />
        <button onClick={this._onClick}>GO!</button>
      </div>
    )
  }
}
